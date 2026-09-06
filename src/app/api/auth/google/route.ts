import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { getSafeRedirectPath } from "@/lib/authRedirect";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const OAUTH_STATE_COOKIE = "nabda_oauth_state";
const OAUTH_STATE_MAX_AGE = 10 * 60; // 10 minutes
const REDIRECT_COOKIE = "nabda_redirect";
const REDIRECT_MAX_AGE = 10 * 60; // 10 minutes

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { success: false, error: "Google login is not configured." },
      { status: 503 }
    );
  }

  // Carry the intended destination through the OAuth round-trip (e.g.
  // /login?redirect=/admin) so the callback can return the user to the exact
  // protected path they tried to open. Only safe internal paths are accepted.
  const url = new URL(request.url);
  const redirectValue = getSafeRedirectPath(url.searchParams.get("redirect"));

  const state = randomBytes(32).toString("hex");

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "online",
    prompt: "select_account",
    state,
  });

  const response = NextResponse.redirect(GOOGLE_AUTH_URL + "?" + params.toString());

  response.cookies.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: OAUTH_STATE_MAX_AGE,
  });

  if (redirectValue) {
    response.cookies.set(REDIRECT_COOKIE, redirectValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: REDIRECT_MAX_AGE,
    });
  }

  return response;
}
