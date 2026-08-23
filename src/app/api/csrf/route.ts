import { NextResponse } from "next/server";
import { generateCsrfToken, setCsrfCookie } from "@/lib/csrf";

export const dynamic = "force-dynamic";

export async function GET() {
  const token = generateCsrfToken();
  const cookie = setCsrfCookie(token);

  const response = NextResponse.json({
    success: true,
    token,
  });

  response.cookies.set(cookie);

  return response;
}
