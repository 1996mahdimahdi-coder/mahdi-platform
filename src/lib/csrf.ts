import {
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import { NextResponse } from "next/server";

const CSRF_COOKIE = "nabda_csrf";
const CSRF_HEADER = "x-csrf-token";

function getCsrfSecret(): string {
  const secret = process.env.AUTH_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "AUTH_SECRET must contain at least 32 characters"
    );
  }

  return secret;
}

function hmac(value: string): string {
  return createHmac("sha256", getCsrfSecret())
    .update(value)
    .digest("hex");
}

export function generateCsrfToken(): string {
  const nonce = randomBytes(16).toString("hex");
  const ts = Date.now();
  const payload = `${nonce}.${ts}`;
  const sig = hmac(payload);
  return `${payload}.${sig}`;
}

export function verifyCsrfToken(
  token: string | null,
  maxAgeMs = 60 * 60 * 1000
): boolean {
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [nonce, tsStr, sig] = parts;
  if (!nonce || !tsStr || !sig) return false;

  const payload = `${nonce}.${tsStr}`;
  const expected = hmac(payload);

  if (
    sig.length !== expected.length ||
    !/^[0-9a-f]+$/i.test(sig) ||
    !/^[0-9a-f]+$/i.test(expected)
  ) {
    return false;
  }

  const sigBuf = Buffer.from(sig, "hex");
  const expectedBuf = Buffer.from(expected, "hex");

  if (
    sigBuf.length !== expectedBuf.length ||
    !timingSafeEqual(sigBuf, expectedBuf)
  ) {
    return false;
  }

  const ts = Number(tsStr);
  if (!Number.isFinite(ts)) return false;

  return Date.now() - ts < maxAgeMs;
}

export function setCsrfCookie(token: string) {
  return {
    name: CSRF_COOKIE,
    value: token,
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: 3600,
  };
}

export async function getCsrfTokenFromRequest(
  request: Request
): Promise<string | null> {
  const headerToken = request.headers.get(CSRF_HEADER);

  if (headerToken) return headerToken;

  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(
    new RegExp(`(?:^|;\\s*)${CSRF_COOKIE}=([^;]*)`)
  );

  return match ? decodeURIComponent(match[1]) : null;
}

export function csrfErrorResponse() {
  return NextResponse.json(
    {
      success: false,
      error: "CSRF token mismatch.",
    },
    { status: 403 }
  );
}
