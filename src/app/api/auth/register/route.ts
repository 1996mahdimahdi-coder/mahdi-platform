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
  RATE_LIMITS,
  rateLimitExceededResponse,
} from "@/lib/rateLimit";
import { csrfGuard } from "@/lib/csrf";

export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = {
  "Cache-Control": "private, no-store",
};

const EMAIL_PATTERN =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ALGERIAN_PHONE_PATTERN =
  /^0[567][0-9]{8}$/;

function jsonError(
  error: string,
  status: number
) {
  return NextResponse.json(
    { success: false, error },
    {
      status,
      headers: NO_STORE_HEADERS,
    }
  );
}

export async function POST(request: Request) {
  const csrfErr = await csrfGuard(request);
  if (csrfErr) return csrfErr;

  // H1 rate limiting: 3 registrations / hour / IP (prevents account spam).
  const ipLimit = RATE_LIMITS.register.ip;

  const ipCheck = await checkRateLimit({
    key: clientIpKey(request, "register"),
    limit: ipLimit.limit,
    windowSeconds: ipLimit.windowSeconds,
  });

  if (!ipCheck.allowed) {
    return rateLimitExceededResponse(ipCheck);
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
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

  const name =
    typeof input.name === "string"
      ? input.name
          .replace(/\s+/g, " ")
          .trim()
      : "";

  const email =
    typeof input.email === "string"
      ? input.email.trim().toLowerCase()
      : "";

  const password =
    typeof input.password === "string"
      ? input.password
      : "";

  const phone =
    typeof input.phone === "string"
      ? input.phone.trim()
      : input.phone === undefined ||
          input.phone === null
        ? ""
        : null;

  if (name.length < 2) {
    return jsonError(
      "\u0627\u0644\u0627\u0633\u0645 \u064a\u062c\u0628 \u0623\u0646 \u064a\u062d\u062a\u0648\u064a \u0639\u0644\u0649 \u062d\u0631\u0641\u064a\u0646 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644.",
      400
    );
  }

  if (name.length > 80) {
    return jsonError(
      "\u0627\u0644\u0627\u0633\u0645 \u0637\u0648\u064a\u0644 \u062c\u062f\u064b\u0627.",
      400
    );
  }

  if (
    !email ||
    email.length > 254 ||
    !EMAIL_PATTERN.test(email)
  ) {
    return jsonError(
      "\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a \u063a\u064a\u0631 \u0635\u0627\u0644\u062d.",
      400
    );
  }

  if (password.length < 12) {
    return jsonError(
      "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u064a\u062c\u0628 \u0623\u0646 \u062a\u062d\u062a\u0648\u064a \u0639\u0644\u0649 12 \u062d\u0631\u0641\u064b\u0627 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644.",
      400
    );
  }

  if (password.length > 128) {
    return jsonError(
      "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631 \u0637\u0648\u064a\u0644\u0629 \u062c\u062f\u064b\u0627.",
      400
    );
  }

  if (
    phone === null ||
    (
      phone.length > 0 &&
      !ALGERIAN_PHONE_PATTERN.test(phone)
    )
  ) {
    return jsonError(
      "\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062a\u0641 \u0627\u0644\u062c\u0632\u0627\u0626\u0631\u064a \u063a\u064a\u0631 \u0635\u0627\u0644\u062d.",
      400
    );
  }

  try {
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing.length > 0) {
      return jsonError(
        "\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a \u0645\u0633\u062c\u0644 \u0628\u0627\u0644\u0641\u0639\u0644.",
        409
      );
    }

    const passwordHash =
      await bcrypt.hash(password, 12);

    const [created] = await db
      .insert(users)
      .values({
        name,
        email,
        passwordHash,
        role: "user",
        phone: phone || null,
      })
      .returning();

    const token = createSessionToken({
      id: created.id,
      role: created.role,
    });

    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: created.id,
          name: created.name,
          email: created.email,
          role: created.role,
          phone: created.phone,
        },
      },
      {
        status: 201,
        headers: NO_STORE_HEADERS,
      }
    );

    response.cookies.set(
      SESSION_COOKIE_NAME,
      token,
      getSessionCookieOptions()
    );

    return response;
  } catch (error) {
    console.error("Registration error:", error);

    return jsonError(
      "\u062d\u062f\u062b \u062e\u0637\u0623 \u062f\u0627\u062e\u0644\u064a. \u062d\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649 \u0644\u0627\u062d\u0642\u064b\u0627.",
      500
    );
  }
}
