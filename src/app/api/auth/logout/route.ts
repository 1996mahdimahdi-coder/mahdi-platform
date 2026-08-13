import { NextResponse } from "next/server";
import {
  getSessionCookieOptions,
  PRIVATE_NO_STORE_HEADERS,
  SESSION_COOKIE_NAME,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
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
