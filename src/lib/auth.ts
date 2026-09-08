import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { sessions, users } from "@/db/schema";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  generateSessionJti,
  verifySessionToken,
} from "@/lib/sessionToken";
import { logSecurity, safeErrorMessage } from "@/lib/securityLog";

export {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  generateSessionJti,
  verifySessionToken,
  verifySessionTokenMinimal,
} from "@/lib/sessionToken";
export type {
  SessionPayload,
  VerifiedSession,
} from "@/lib/sessionToken";

export async function getSession(): Promise<import("@/lib/sessionToken").SessionPayload | null> {
  const cookieStore = await cookies();

  const token = cookieStore.get(
    SESSION_COOKIE_NAME
  )?.value;

  const verified = verifySessionToken(token);

  if (!verified) return null;

  try {
    const [user] = await db
      .select({
        id: users.id,
        role: users.role,
        tokenVersion: users.tokenVersion,
      })
      .from(users)
      .where(eq(users.id, verified.userId))
      .limit(1);

    // Token revocation: the user row must still exist and be enabled, and its
    // current tokenVersion must match the one embedded in the token —
    // otherwise the session was revoked for this user or the account disabled.
    if (!user) {
      return null;
    }

    if (!authorizeUserToken(user, verified)) {
      return null;
    }

    // F8 — per-session revocation: the exact `sessions` row named by the
    // token's jti must still exist, be un-revoked and un-expired. Logout now
    // only retires the current session, so a concurrent one stays alive.
    if (!(await isSessionActive(verified.jti))) {
      return null;
    }

    // Permissions always come from the current database role,
    // never from the role embedded in the cookie token. A token
    // that is still cryptographically valid is not enough: the
    // account must still exist and be enabled in the database.
    return {
      ...verified,
      role: user.role,
    };
  } catch (error) {
    // F7 — session verification is auth core: log safely (bounded message,
    // never the DB error object) with a global flood window so a database
    // outage cannot generate unbounded log volume.
    await logSecurity(
      "auth.session_error",
      "warn",
      { message: safeErrorMessage(error) },
      { suppress: { key: "session" } }
    );
    return null;
  }
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure:
      process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
    priority: "high" as const,
  };
}

// ============================================================================
// F8 — per-session records. Every issued token is backed by exactly one
// `sessions` row keyed by its jti. Session creation is FAIL-CLOSED: if the
// row cannot be persisted no token is minted (no orphan/unsigned session),
// and the caller must surface the error (login flows never hand out a token
// whose session cannot be looked up later).
// ============================================================================

export async function createSession(user: {
  id: number;
  role: string;
  tokenVersion: number;
}): Promise<string> {
  const jti = generateSessionJti();
  const now = new Date();
  const expiresAt = new Date(
    now.getTime() + SESSION_MAX_AGE_SECONDS * 1000
  );

  const [row] = await db
    .insert(sessions)
    .values({
      userId: user.id,
      jti,
      createdAt: now,
      expiresAt,
    })
    .returning({ jti: sessions.jti });

  if (!row) {
    throw new Error("session record could not be created");
  }

  return createSessionToken({ ...user, jti });
}

// True when the sessions row named by `jti` exists, was not revoked and has
// not expired. This is the authoritative per-session gate used by getSession.
//
// The expiry compare uses timestamptz on both sides (see sessions.expiresAt):
// a naive `timestamp` column would round-trip through the Postgres server's
// local timezone and skew every JS-vs-DB time comparison by its UTC offset.
// With absolute instants the comparison is exact regardless of server TZ.
export async function isSessionActive(
  jti: string
): Promise<boolean> {
  const [row] = await db
    .select({
      revokedAt: sessions.revokedAt,
    })
    .from(sessions)
    .where(
      and(
        eq(sessions.jti, jti),
        gt(sessions.expiresAt, new Date())
      )
    )
    .limit(1);

  return Boolean(row && !row.revokedAt);
}

// Revokes ONLY the given session. Idempotent: revoking again (or a session
// that is already gone) is a no-op.
export async function revokeSession(
  jti: string,
  userId: number
): Promise<void> {
  await db
    .update(sessions)
    .set({ revokedAt: new Date() })
    .where(
      and(
        eq(sessions.jti, jti),
        eq(sessions.userId, userId)
      )
    );
}

// Pure gate shared by getSession: the user row must be enabled and its
// tokenVersion must match the one embedded in the token. token_version remains
// the user-wide invalidation mechanism (reserved for a future "logout
// everywhere"); normal logout retires only the current session via jti.
export function authorizeUserToken(
  user: { role: string; tokenVersion: number },
  verified: { role: string; tokenVersion: number }
): boolean {
  return (
    user.role !== "disabled" &&
    user.tokenVersion === verified.tokenVersion
  );
}

export const PRIVATE_NO_STORE_HEADERS = {
  "Cache-Control": "private, no-store",
};

export function unauthorizedResponse() {
  return NextResponse.json(
    {
      success: false,
      error:
        "\u064a\u062c\u0628 \u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644 \u0623\u0648\u0644\u064b\u0627.",
    },
    {
      status: 401,
      headers: PRIVATE_NO_STORE_HEADERS,
    }
  );
}

export function forbiddenResponse() {
  return NextResponse.json(
    {
      success: false,
      error:
        "\u0644\u064a\u0633 \u0644\u062f\u064a\u0643 \u0635\u0644\u0627\u062d\u064a\u0629 \u0644\u062a\u0646\u0641\u064a\u0630 \u0647\u0630\u0627 \u0627\u0644\u0637\u0644\u0628.",
    },
    {
      status: 403,
      headers: PRIVATE_NO_STORE_HEADERS,
    }
  );
}