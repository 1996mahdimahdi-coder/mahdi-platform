import { NextResponse } from "next/server";
import {
  getSession,
  getSessionCookieOptions,
  PRIVATE_NO_STORE_HEADERS,
  revokeSession,
  SESSION_COOKIE_NAME,
} from "@/lib/auth";
import { csrfGuard } from "@/lib/csrf";
import { logSecurity } from "@/lib/securityLog";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const csrfErr = await csrfGuard(request);
  if (csrfErr) return csrfErr;

  // F8 — logout retires ONLY the current session row (its jti), so the other
  // browsers/devices of the same user keep working. getSession() re-checks the
  // row on every request, so an old cookie replaying after this revoke is 401.
  const session = await getSession();
  if (session) {
    await revokeSession(session.jti, session.userId);

    // F7 — audit the logout itself; only the userId (never the session token
    // or its jti, which would be redacted by logSecurity anyway).
    await logSecurity("auth.logout", "info", {
      userId: session.userId,
    });
  }

  const response = NextResponse.json(
    { success: true },
    { headers: PRIVATE_NO_STORE_HEADERS }
  );

  response.cookies.set(
    SESSION_COOKIE_NAME,
    "",
    {
      ...getSessionCookieOptions(),
      maxAge: 0,
    }
  );

  return response;
}
