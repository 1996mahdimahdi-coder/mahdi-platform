import {
  createHmac,
  randomBytes,
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
  // F8 — per-session identifier. Bound to ONE sessions row; logout (and any
  // future per-device revoke) targets this exact session, never siblings.
  jti: string;
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

// Cryptographically random per-session identifier (32 bytes, hex). It is the
// lookup key of the F8 `sessions` row and carries no user data, timestamp or
// guessable sequence. Purely cryptographic — safe for the Proxy edge module.
export function generateSessionJti(): string {
  return randomBytes(32).toString("hex");
}

export function createSessionToken(user: {
  id: number;
  role: string;
  tokenVersion: number;
  jti: string;
}): string {
  const now = Math.floor(Date.now() / 1000);

  const payload: SessionPayload = {
    version: 1,
    userId: user.id,
    role: user.role,
    tokenVersion: user.tokenVersion,
    jti: user.jti,
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
      // F8 — a session token is only meaningful when it names a real session.
      // Reject absent / malformed / absurdly-long jti values outright.
      typeof payload.jti !== "string" ||
      payload.jti.length < 16 ||
      payload.jti.length > 128 ||
      !/^[a-f0-9]+$/i.test(payload.jti) ||
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