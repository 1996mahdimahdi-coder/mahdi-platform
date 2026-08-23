import { timingSafeEqual } from "node:crypto";
import { jwtVerify, createRemoteJWKSet, type JWTPayload } from "jose";
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
const GOOGLE_JWKS_URL = new URL("https://www.googleapis.com/oauth2/v3/certs");
const GOOGLE_ISSUERS = ["https://accounts.google.com", "accounts.google.com"];
const OAUTH_STATE_COOKIE = "nabda_oauth_state";

const googleJwks = createRemoteJWKSet(GOOGLE_JWKS_URL);

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
} & JWTPayload;

async function verifyGoogleIdToken(
  idToken: string,
  clientId: string
): Promise<GoogleIdToken | null> {
  try {
    const { payload } = await jwtVerify(idToken, googleJwks, {
      issuer: GOOGLE_ISSUERS,
      audience: clientId,
    });
    return payload as GoogleIdToken;
  } catch {
    return null;
  }
}

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

  if (error || !code) {
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

  // Both state values must be present
  if (!state || !expectedState) {
    return NextResponse.redirect(loginErrorUrl);
  }

  // Timing-safe comparison
  if (!timingSafeStringCompare(state, expectedState)) {
    return NextResponse.redirect(loginErrorUrl);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
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

    if (!tokenRes.ok || !tokenData.id_token) {
      return NextResponse.redirect(loginErrorUrl);
    }

    // ── M-2: Verify ID token signature (RS256), aud, iss, exp via Google JWKS ──
    const payload = await verifyGoogleIdToken(tokenData.id_token, clientId);
    if (!payload || !payload.email || payload.email_verified === false) {
      return NextResponse.redirect(loginErrorUrl);
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
    invalidateStateCookie(response);
    return response;
  } catch (err) {
    console.error("Google callback error:", err);
    return NextResponse.redirect(loginErrorUrl);
  }
}
