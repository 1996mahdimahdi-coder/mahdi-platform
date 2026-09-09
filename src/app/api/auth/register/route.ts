import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { emailRateLimitKey } from "@/lib/emailRateLimitKey";
import {
  checkRateLimit,
  clientIpKey,
  RATE_LIMITS,
  rateLimitExceededResponse,
} from "@/lib/rateLimit";
import { csrfGuard } from "@/lib/csrf";
import { hashForLog, logSecurity, safeErrorMessage } from "@/lib/securityLog";

export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = {
  "Cache-Control": "private, no-store",
};

// F10-04 — timing equalization. A cost-12 bcrypt hash used ONLY as a dummy
// comparison target so the duplicate-email branch burns the same ~bcrypt
// budget as a real registration (bcrypt.compare internally recomputes the
// cost-12 hash). Pattern mirrors the existing login route DUMMY_BCRYPT_HASH.
const DUMMY_BCRYPT_HASH =
  "$2b$12$Y.PdX6Az5.V57S3BJ20aK.F2mYnIByD3DWbbHeIGU5r5XDKGTPS3a";

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

  // F10-04 — per-email registration bucket on top of the per-IP cap. It uses
  // the same HMAC-pseudonymized key as login, so the raw address never lands
  // in `rate_limits.key`, and the 429/201 shapes stay identical for both new
  // and duplicate addresses — no account-existence oracle is created.
  const emailLimit = RATE_LIMITS.register.email;

  const emailCheck = await checkRateLimit({
    key: emailRateLimitKey("register", email),
    limit: emailLimit.limit,
    windowSeconds: emailLimit.windowSeconds,
  });

  if (!emailCheck.allowed) {
    return rateLimitExceededResponse(emailCheck);
  }

  try {
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing.length > 0) {
      await logSecurity("auth.register_duplicate", "info", {
        emailHash: hashForLog(email),
      });

      // F10-04 — dummy cost-12 bcrypt comparison to erase the registration
      // timing oracle: an existing address must not be recognizable by a
      // faster response than a brand-new registration.
      await bcrypt.compare(password, DUMMY_BCRYPT_HASH);

      return NextResponse.json(
        { success: true },
        {
          status: 201,
          headers: NO_STORE_HEADERS,
        }
      );
    }

    const passwordHash =
      await bcrypt.hash(password, 12);

    await db
      .insert(users)
      .values({
        name,
        email,
        passwordHash,
        role: "user",
        phone: phone || null,
      })
      .returning();

    // F10-04 — registration is deliberately NOT a login: no session cookie,
    // no user object leaking out. Both the duplicate branch and this success
    // branch return the exact same `201 {success:true}` so third parties
    // cannot enumerate existing accounts by response shape.
    return NextResponse.json(
      { success: true },
      {
        status: 201,
        headers: NO_STORE_HEADERS,
      }
    );
  } catch (error) {
    await logSecurity("auth.register_error", "warn", {
      message: safeErrorMessage(error),
    });

    return jsonError(
      "\u062d\u062f\u062b \u062e\u0637\u0623 \u062f\u0627\u062e\u0644\u064a. \u062d\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649 \u0644\u0627\u062d\u0642\u064b\u0627.",
      500
    );
  }
}
