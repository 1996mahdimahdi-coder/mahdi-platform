import {
  createHmac,
  timingSafeEqual,
} from "node:crypto";

export const SESSION_COOKIE_NAME =
  "nabda_session";

export const SESSION_MAX_AGE_SECONDS =
  60 * 60 * 24;

export type SessionPayload = {
  version: 1;
  userId: number;
  role: string;
  tokenVersion: number;
  issuedAt: number;
  expiresAt: number;
};

// Verified session structure exposed to the Proxy (edge/Node) middleware.
// Deliberately minimal: this module must never import server-only modules
// (drizzle, db) — those are only safe inside route handlers.
export type VerifiedSession = {
  userId: number;
  role: string;
  tokenVersion: number;
  expiresAt: number;
};

function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "AUTH_SECRET must contain at least 32 characters"
    );
  }

  return secret;
}

function signValue(value: string): string {
  return createHmac(
    "sha256",
    getAuthSecret()
  )
    .update(value)
    .digest("base64url");
}

export function createSessionToken(user: {
  id: number;
  role: string;
  tokenVersion: number;
}): string {
  const now = Math.floor(Date.now() / 1000);

  const payload: SessionPayload = {
    version: 1,
    userId: user.id,
    role: user.role,
    tokenVersion: user.tokenVersion,
    issuedAt: now,
    expiresAt:
      now + SESSION_MAX_AGE_SECONDS,
  };

  const encodedPayload = Buffer.from(
    JSON.stringify(payload),
    "utf8"
  ).toString("base64url");

  const signature = signValue(encodedPayload);

  return encodedPayload + "." + signature;
}

export function verifySessionToken(
  token: string | undefined
): SessionPayload | null {
  if (!token) return null;

  try {
    const parts = token.split(".");

    if (parts.length !== 2) return null;

    const [encodedPayload, signature] = parts;

    if (!encodedPayload || !signature) {
      return null;
    }

    const expectedSignature =
      signValue(encodedPayload);

    const actualBuffer = Buffer.from(
      signature,
      "base64url"
    );

    const expectedBuffer = Buffer.from(
      expectedSignature,
      "base64url"
    );

    if (
      actualBuffer.length !==
      expectedBuffer.length
    ) {
      return null;
    }

    if (
      !timingSafeEqual(
        actualBuffer,
        expectedBuffer
      )
    ) {
      return null;
    }

    const payload = JSON.parse(
      Buffer.from(
        encodedPayload,
        "base64url"
      ).toString("utf8")
    ) as Partial<SessionPayload>;

    const now = Math.floor(Date.now() / 1000);

    if (
      payload.version !== 1 ||
      !Number.isInteger(payload.userId) ||
      Number(payload.userId) <= 0 ||
      typeof payload.role !== "string" ||
      !Number.isInteger(payload.issuedAt) ||
      !Number.isInteger(payload.expiresAt) ||
      Number(payload.expiresAt) <= now
    ) {
      return null;
    }

    return payload as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Cryptographically verifies the session token WITHOUT consulting the
 * database. Used by the Proxy (edge/Node) so that protected pages can be
 * gated at the edge safely (the Proxy runtime must not import db / drizzle).
 *
 * Security note: this only proves the token was issued by us and has not
 * expired. It does NOT re-read the user's current role / tokenVersion from
 * the database. Route handlers MUST continue to call the full getSession()
 * for any privileged decision — a token that verifies here may still be
 * revoked/disabled/role-changed, and getSession() re-checks that against
 * the DB on every request.
 */
export function verifySessionTokenMinimal(
  token: string | undefined
): VerifiedSession | null {
  const payload = verifySessionToken(token);
  if (!payload) return null;

  return {
    userId: payload.userId,
    role: payload.role,
    tokenVersion: payload.tokenVersion,
    expiresAt: payload.expiresAt,
  };
}