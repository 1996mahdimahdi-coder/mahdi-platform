import { NextResponse } from "next/server";
import {
  getSessionCookieOptions,
  PRIVATE_NO_STORE_HEADERS,
  SESSION_COOKIE_NAME,
} from "@/lib/auth";
import { csrfGuard } from "@/lib/csrf";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const csrfErr = await csrfGuard(request);
  if (csrfErr) return csrfErr;

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
