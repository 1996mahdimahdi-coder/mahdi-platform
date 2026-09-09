import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  createSession,
  getSessionCookieOptions,
  SESSION_COOKIE_NAME,
} from "@/lib/auth";
import { verifyGoogleIdToken } from "@/lib/google-verify";
import {
  checkRateLimit,
  clientIpKey,
  RATE_LIMITS,
  rateLimitExceededResponse,
} from "@/lib/rateLimit";
import { logSecurity, hashForLog } from "@/lib/securityLog";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const ipLimit = RATE_LIMITS.google.ip;

  const ipCheck = await checkRateLimit({
    key: clientIpKey(request, "google-capacitor"),
    limit: ipLimit.limit,
    windowSeconds: ipLimit.windowSeconds,
  });

  if (!ipCheck.allowed) {
    return rateLimitExceededResponse(ipCheck);
  }

  let body: { idToken?: string } = {};

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const { idToken } = body;

  if (!idToken || typeof idToken !== "string") {
    return NextResponse.json(
      { success: false, error: "Missing idToken." },
      { status: 400 }
    );
  }

  const audience = process.env.GOOGLE_ANDROID_CLIENT_ID;

  if (!audience) {
    return NextResponse.json(
      { success: false, error: "Google Android login is not configured. Add GOOGLE_ANDROID_CLIENT_ID to Vercel env." },
      { status: 503 }
    );
  }

  const { payload } = await verifyGoogleIdToken(idToken, audience);

  if (!payload || !payload.email || payload.email_verified === false) {
    await logSecurity(
      "oauth.failure",
      "warn",
      { provider: "google", code: "token_invalid" },
      { suppress: { key: "oauth-capacitor" } }
    );

    return NextResponse.json(
      { success: false, error: "Invalid Google token." },
      { status: 401 }
    );
  }

  const email = payload.email.toLowerCase();
  const name = (payload.name || email.split("@")[0]).slice(0, 80);

  try {
    const existing = await db
      .select({
        id: users.id,
        role: users.role,
        tokenVersion: users.tokenVersion,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    let userId: number;
    let role: string;
    let tokenVersion: number;

    if (existing.length > 0) {
      userId = existing[0].id;
      role = existing[0].role;
      tokenVersion = existing[0].tokenVersion;
    } else {
      // F12-2 — bound NEW account creation exactly like the web callback
      // (RATE_LIMITS.google.signup, SAME shared bucket so web + Android
      // combined stay ≤ 5/15min per IP). Existing-account logins above never
      // reach this branch and are NOT throttled.
      const signupLimit = RATE_LIMITS.google.signup;
      const signupCheck = await checkRateLimit({
        key: clientIpKey(request, "google:signup"),
        limit: signupLimit.limit,
        windowSeconds: signupLimit.windowSeconds,
      });

      if (!signupCheck.allowed) {
        await logSecurity(
          "oauth.signup_rate_limited",
          "warn",
          {
            provider: "google",
            emailHash: hashForLog(email),
          },
          { suppress: { key: "oauth-signup" } }
        );
        return NextResponse.json(
          {
            success: false,
            error:
              "تم تجاوز عدد حسابات Google المسموح إنشاؤها. أعد المحاولة لاحقًا.",
          },
          { status: 429 }
        );
      }

      const adminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase();
      role = adminEmail && email === adminEmail ? "admin" : "user";

      const placeholderHash = "google-oauth:" + crypto.randomUUID();

      const [created] = await db
        .insert(users)
        .values({
          name,
          email,
          passwordHash: placeholderHash,
          role,
          phone: null,
        })
        .returning();

      userId = created.id;
      tokenVersion = created.tokenVersion;
    }

    const token = await createSession({ id: userId, role, tokenVersion });

    await logSecurity("oauth.success", "info", {
      provider: "google",
      userId,
      role,
      userIsNew: existing.length === 0,
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set(
      SESSION_COOKIE_NAME,
      token,
      getSessionCookieOptions()
    );
    return response;
  } catch {
    await logSecurity(
      "oauth.failure",
      "warn",
      { provider: "google", code: "server_error" },
      { suppress: { key: "oauth-capacitor" } }
    );
    return NextResponse.json(
      { success: false, error: "Server error during login." },
      { status: 500 }
    );
  }
}
