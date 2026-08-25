import { NextResponse } from "next/server";
import {
  getSession,
  getSessionCookieOptions,
  PRIVATE_NO_STORE_HEADERS,
  SESSION_COOKIE_NAME,
} from "@/lib/auth";
import { csrfGuard } from "@/lib/csrf";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const csrfErr = await csrfGuard(request);
  if (csrfErr) return csrfErr;

  // Increment tokenVersion to invalidate ALL existing session tokens
  // for this user. Any token issued before this point will fail the
  // tokenVersion check in getSession() and return 401.
  const session = await getSession();
  if (session) {
    await db
      .update(users)
      .set({
        tokenVersion: sql`${users.tokenVersion} + 1`,
      })
      .where(eq(users.id, session.userId));
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
