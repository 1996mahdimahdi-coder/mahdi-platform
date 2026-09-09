import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  createSession,
  getSessionCookieOptions,
  SESSION_COOKIE_NAME,
} from "@/lib/auth";
import { verifyGoogleIdToken, type GoogleIdTokenPayload } from "@/lib/google-verify";
import { getSafeRedirectPath } from "@/lib/authRedirect";
import { checkRateLimit, clientIpKey, RATE_LIMITS } from "@/lib/rateLimit";
import { hashForLog, logSecurity, safeErrorMessage } from "@/lib/securityLog";

export const dynamic = "force-dynamic";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const OAUTH_STATE_COOKIE = "nabda_oauth_state";
const REDIRECT_COOKIE = "nabda_redirect";

function readCookie(header: string, name: string): string | null {
  const match = header.match(new RegExp("(?:^|;\\s*)" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : null;
}

type GoogleTokenResponse = {
  access_token?: string;
  id_token?: string;
  error?: string;
  error_description?: string;
};

function timingSafeStringCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  return timingSafeEqual(bufA, bufB);
}

function invalidateStateCookie(response: NextResponse) {
  response.cookies.set(OAUTH_STATE_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  const state = url.searchParams.get("state");

  const loginErrorUrl = new URL("/login?error=google", url.origin);

  // ── DIAG: Path 1 — Google returned error or no code ──
  if (error || !code) {
    await logSecurity(
      "oauth.failure",
      "warn",
      {
        provider: "google",
        step: "callback_missing_code_or_error",
        errorCode: error ?? null,
        codePresent: Boolean(code),
      },
      { suppress: { key: "oauth-callback" } }
    );
    return NextResponse.redirect(loginErrorUrl);
  }

  // ── M-1: OAuth state verification ──
  const cookieHeader = request.headers.get("cookie") || "";
  const stateCookieMatch = cookieHeader.match(
    /(?:^|;\s*)nabda_oauth_state=([^;]*)/
  );
  const expectedState = stateCookieMatch
    ? decodeURIComponent(stateCookieMatch[1])
    : null;

  // ── DIAG: Path 2 — state param or cookie missing ──
  if (!state || !expectedState) {
    await logSecurity(
      "oauth.failure",
      "warn",
      { provider: "google", step: "state_missing" },
      { suppress: { key: "oauth-callback" } }
    );
    return NextResponse.redirect(loginErrorUrl);
  }

  // ── DIAG: Path 3 — state mismatch ──
  if (!timingSafeStringCompare(state, expectedState)) {
    await logSecurity(
      "oauth.failure",
      "warn",
      { provider: "google", step: "state_mismatch" },
      { suppress: { key: "oauth-callback" } }
    );
    return NextResponse.redirect(loginErrorUrl);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  // ── DIAG: Path 4 — missing env vars ──
  if (!clientId || !clientSecret || !redirectUri) {
    await logSecurity(
      "oauth.failure",
      "warn",
      {
        provider: "google",
        step: "missing_environment_variable",
        clientIdPresent: Boolean(clientId),
        clientSecretPresent: Boolean(clientSecret),
        redirectUriPresent: Boolean(redirectUri),
      },
      { suppress: { key: "oauth-callback" } }
    );
    return NextResponse.redirect(loginErrorUrl);
  }

  try {
    const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = (await tokenRes.json()) as GoogleTokenResponse;

    // ── DIAG: Path 5 — token exchange failed or missing id_token ──
    if (!tokenRes.ok || !tokenData.id_token) {
      await logSecurity(
        "oauth.failure",
        "warn",
        {
          provider: "google",
          step: tokenRes.ok ? "token_missing_id_token" : "token_exchange_failed",
          httpStatus: tokenRes.status,
          errorCode: tokenData.error ?? null,
          errorDescription: tokenData.error_description ?? null,
          idTokenPresent: Boolean(tokenData.id_token),
        },
        { suppress: { key: "oauth-callback" } }
      );
      return NextResponse.redirect(loginErrorUrl);
    }

    // ── M-2: Verify ID token signature (RS256), aud, iss, exp via Google JWKS ──
    const { payload } = await verifyGoogleIdToken(tokenData.id_token, clientId);

    // ── DIAG: Path 6 — id_token verification / email validation failed ──
    if (!payload || !payload.email || payload.email_verified === false) {
      await logSecurity(
        "oauth.failure",
        "warn",
        {
          provider: "google",
          step: "id_token_verification_failed",
          payloadPresent: Boolean(payload),
          emailPresent: Boolean(payload?.email),
          emailVerified: payload?.email_verified ?? null,
        },
        { suppress: { key: "oauth-callback" } }
      );
      return NextResponse.redirect(loginErrorUrl);
    }
    const email = payload.email.toLowerCase();
    const name = (payload.name || email.split("@")[0]).slice(0, 80);

    const existing = await db
      .select({ id: users.id, role: users.role, tokenVersion: users.tokenVersion })
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
      // F10-08 — bound NEW account creation per IP. Normal logins hit the
      // `existing` branch and are never throttled; only the account-creation
      // step is capped (5/15m), so an IP-rotating attacker cannot mass-create
      // users (each correlated to a real Google email) via OAuth.
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
        return NextResponse.redirect(loginErrorUrl);
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

    // ── DIAG: success ──
    await logSecurity("oauth.success", "info", {
      provider: "google",
      userId,
      role,
      userIsNew: existing.length === 0,
    });

    // Return the user to their intended protected path (e.g. /login?redirect=/admin
    // -> /admin) when present and safe, otherwise default to "/". Authorization is
    // re-checked on the destination by the proxy and admin/dashboard layouts, so a
    // redirect never bypasses protection.
    const cookieHeader = request.headers.get("cookie") || "";
    const redirectPath = getSafeRedirectPath(readCookie(cookieHeader, REDIRECT_COOKIE));

    const destination = redirectPath ? new URL(redirectPath, url.origin) : new URL("/", url.origin);

    const response = NextResponse.redirect(destination);
    response.cookies.set(SESSION_COOKIE_NAME, token, getSessionCookieOptions());
    response.cookies.set(REDIRECT_COOKIE, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    invalidateStateCookie(response);
    return response;
  } catch (err) {
    // ── DIAG: Path 7 — unexpected exception ──
    await logSecurity(
      "oauth.failure",
      "warn",
      {
        provider: "google",
        step: "unexpected_exception",
        message: safeErrorMessage(err),
      },
      { suppress: { key: "oauth-callback" } }
    );
    return NextResponse.redirect(loginErrorUrl);
  }
}
