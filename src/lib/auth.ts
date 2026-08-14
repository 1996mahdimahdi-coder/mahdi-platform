import {
  createHmac,
  timingSafeEqual,
} from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";

export const SESSION_COOKIE_NAME =
  "nabda_session";

export const SESSION_MAX_AGE_SECONDS =
  60 * 60 * 24 * 7;

export type SessionPayload = {
  version: 1;
  userId: number;
  role: string;
  issuedAt: number;
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
}): string {
  const now = Math.floor(Date.now() / 1000);

  const payload: SessionPayload = {
    version: 1,
    userId: user.id,
    role: user.role,
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

export async function getSession():
  Promise<SessionPayload | null> {
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
      })
      .from(users)
      .where(eq(users.id, verified.userId))
      .limit(1);

    if (!user || user.role === "disabled") {
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
    console.error("Session verification DB error:", error);
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
