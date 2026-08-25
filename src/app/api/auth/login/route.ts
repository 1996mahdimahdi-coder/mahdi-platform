import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import {
  createSessionToken,
  getSessionCookieOptions,
  SESSION_COOKIE_NAME,
} from "@/lib/auth";
import {
  checkRateLimit,
  clientIpKey,
  normalizeEmail,
  RATE_LIMITS,
  rateLimitExceededResponse,
} from "@/lib/rateLimit";
import { csrfGuard } from "@/lib/csrf";

export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = {
  "Cache-Control": "private, no-store",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function jsonError(error: string, status: number) {
  return NextResponse.json(
    { success: false, error },
    {
      status,
      headers: NO_STORE_HEADERS,
    }
  );
}

export async function POST(request: Request) {
  const loginDiagStartedAt = Date.now();
  const loginDiag = (stage: string) =>
    console.log(
      `[LOGIN_DIAG] +${Date.now() - loginDiagStartedAt}ms ${stage}`
    );

  loginDiag("POST:start");
  loginDiag("csrfGuard:start");
  const csrfErr = await csrfGuard(request);
  loginDiag("csrfGuard:done");
  if (csrfErr) {
    loginDiag("csrfGuard:rejected");
    return csrfErr;
  }

  // H1 rate limiting: per-IP first so even malformed floods are bounded.
  const ipLimit = RATE_LIMITS.login.ip;

  loginDiag("rateLimit:ip:start");
  const ipCheck = await checkRateLimit({
    key: clientIpKey(request, "login"),
    limit: ipLimit.limit,
    windowSeconds: ipLimit.windowSeconds,
  });
  loginDiag("rateLimit:ip:done");

  if (!ipCheck.allowed) {
    loginDiag("rateLimit:ip:rejected");
    return rateLimitExceededResponse(ipCheck);
  }

  let body: unknown;

  try {
    loginDiag("request.json:start");
    body = await request.json();
    loginDiag("request.json:done");
  } catch {
    loginDiag("request.json:error");
    return jsonError(
      "\u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u0637\u0644\u0628 \u063a\u064a\u0631 \u0635\u0627\u0644\u062d\u0629.",
      400
    );
  }

  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body)
  ) {
    return jsonError(
      "\u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u0637\u0644\u0628 \u063a\u064a\u0631 \u0635\u0627\u0644\u062d\u0629.",
      400
    );
  }

  const input = body as Record<string, unknown>;

  const email =
    typeof input.email === "string"
      ? input.email.trim().toLowerCase()
      : "";

  const password =
    typeof input.password === "string"
      ? input.password
      : "";

  if (!email || !password) {
    return jsonError(
      "\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a \u0648\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0645\u0637\u0644\u0648\u0628\u0627\u0646.",
      400
    );
  }

  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return jsonError(
      "\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a \u063a\u064a\u0631 \u0635\u0627\u0644\u062d.",
      400
    );
  }

  if (password.length > 128) {
    return jsonError(
      "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u063a\u064a\u0631 \u0635\u0627\u0644\u062d\u0629.",
      400
    );
  }

  // H1 rate limiting: per-account (email) limit protects the account
  // even when many hosts share one IP (NAT) without blocking the whole
  // network. The email is normalized (trim + lowercase) before use.
  const emailLimit = RATE_LIMITS.login.email;

  loginDiag("rateLimit:email:start");
  const emailCheck = await checkRateLimit({
    key: `login:email:${normalizeEmail(email)}`,
    limit: emailLimit.limit,
    windowSeconds: emailLimit.windowSeconds,
  });
  loginDiag("rateLimit:email:done");

  if (!emailCheck.allowed) {
    loginDiag("rateLimit:email:rejected");
    return rateLimitExceededResponse(emailCheck);
  }

  try {
    loginDiag("db.users:start");
    const userRows = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    loginDiag("db.users:done");

    const user = userRows[0];

    let passwordMatches = false;
    if (user) {
      loginDiag("bcrypt.compare:start");
      passwordMatches = await bcrypt.compare(
        password,
        user.passwordHash
      );
      loginDiag("bcrypt.compare:done");
    } else {
      loginDiag("bcrypt.compare:skipped-no-user");
    }

    if (
      !user ||
      !passwordMatches ||
      user.role === "disabled"
    ) {
      return jsonError(
        "\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a \u0623\u0648 \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u063a\u064a\u0631 \u0635\u062d\u064a\u062d\u0629.",
        401
      );
    }

    loginDiag("createSessionToken:start");
    const token = createSessionToken({
      id: user.id,
      role: user.role,
      tokenVersion: user.tokenVersion,
    });
    loginDiag("createSessionToken:done");

    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
        },
      },
      {
        headers: NO_STORE_HEADERS,
      }
    );

    response.cookies.set(
      SESSION_COOKIE_NAME,
      token,
      getSessionCookieOptions()
    );

    loginDiag("POST:success");
    return response;
  } catch {
    loginDiag("login:error");

    return jsonError(
      "\u062d\u062f\u062b \u062e\u0637\u0623 \u062f\u0627\u062e\u0644\u064a. \u062d\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649 \u0644\u0627\u062d\u0642\u064b\u0627.",
      500
    );
  }
}

