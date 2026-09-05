import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  SESSION_COOKIE_NAME,
  verifySessionTokenMinimal,
} from "./lib/sessionToken";

/**
 * Edge/proxy protection for the admin and dashboard areas.
 *
 * This is a DEFENSE-IN-DEPTH layer. It only cryptographically validates the
 * session token (which proves the token was issued by us and has not
 * expired). The authoritative authorization check (fresh DB read of the
 * user's current role + tokenVersion) still happens in the individual route
 * handlers and admin API routes via getSession(), which MUST NOT be removed.
 *
 * Because this layer does not hit the database, a token that verifies here
 * may still be revoked, disabled, or have had its role changed client-side —
 * in every such case the route handler's getSession() returns null and the
 * protected data is never served.
 *
 * Note on the DB-free design: only the session cookie is inspected here. No
 * drizzle, no db, no node:dns/pg. The library path imports only auth.ts,
 * which transitively imports crypto (safe in the Node proxy runtime) and
 * does NOT import db at module scope.
 */

function getSessionFromCookie(request: NextRequest) {
  return verifySessionTokenMinimal(request.cookies.get(SESSION_COOKIE_NAME)?.value);
}

function hasValidSession(
  request: NextRequest,
  requireAdmin: boolean
): boolean {
  const session = getSessionFromCookie(request);
  if (!session) return false;

  if (Date.now() > session.expiresAt * 1000) return false;

  if (requireAdmin && session.role !== "admin") return false;

  return true;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isDashboardRoute =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  if (!isAdminRoute && !isDashboardRoute) return NextResponse.next();

  const requireAdmin = isAdminRoute;
  const ok = hasValidSession(request, requireAdmin);

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirect", pathname);

  if (!ok) return NextResponse.redirect(loginUrl);

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
