import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  createSessionToken,
  getSessionCookieOptions,
  SESSION_COOKIE_NAME,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

type GoogleTokenResponse = {
  access_token?: string;
  id_token?: string;
  error?: string;
};

type GoogleIdToken = {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
};

function decodeIdToken(idToken: string): GoogleIdToken | null {
  try {
    const parts = idToken.split(".");
    if (parts.length !== 3) return null;
    const payload = Buffer.from(parts[1], "base64url").toString("utf8");
    return JSON.parse(payload) as GoogleIdToken;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(new URL("/login?error=google", url.origin));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.redirect(new URL("/login?error=google", url.origin));
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

    if (!tokenRes.ok || !tokenData.id_token) {
      return NextResponse.redirect(new URL("/login?error=google", url.origin));
    }

    const payload = decodeIdToken(tokenData.id_token);
    if (!payload || !payload.email || payload.email_verified === false) {
      return NextResponse.redirect(new URL("/login?error=google", url.origin));
    }

    const email = payload.email.toLowerCase();
    const name = (payload.name || email.split("@")[0]).slice(0, 80);

    const existing = await db
      .select({ id: users.id, role: users.role })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    let userId: number;
    let role: string;

    if (existing.length > 0) {
      userId = existing[0].id;
      role = existing[0].role;
    } else {
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
    }

    const token = createSessionToken({ id: userId, role });

    const response = NextResponse.redirect(
      new URL(role === "admin" ? "/admin" : "/dashboard", url.origin)
    );
    response.cookies.set(SESSION_COOKIE_NAME, token, getSessionCookieOptions());
    return response;
  } catch (err) {
    console.error("Google callback error:", err);
    return NextResponse.redirect(new URL("/login?error=google", url.origin));
  }
}