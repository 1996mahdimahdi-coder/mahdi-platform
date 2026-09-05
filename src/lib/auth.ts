import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  verifySessionToken,
} from "@/lib/sessionToken";

export {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
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

    if (!user || user.role === "disabled") {
      return null;
    }

    // Token revocation: if the tokenVersion in the token does not match
    // the current tokenVersion in the database, the session was revoked
    // (e.g. user logged out). All tokens issued before the logout are
    // now invalid.
    if (user.tokenVersion !== verified.tokenVersion) {
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