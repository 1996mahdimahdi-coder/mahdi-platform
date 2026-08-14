import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { visitorProfiles, wilayas } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  checkRateLimit,
  clientIpKey,
  RATE_LIMITS,
  rateLimitExceededResponse,
} from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export const VISITOR_SESSION_COOKIE_NAME =
  "nabda_visitor_session";

export const VISITOR_SESSION_MAX_AGE_SECONDS =
  60 * 60 * 24 * 30;

const NO_STORE_HEADERS = {
  "Cache-Control": "private, no-store",
};

const MAX_FIRST_NAME = 80;
const MAX_LAST_NAME = 80;
const MAX_EMAIL = 254;
const MAX_PHONE = 30;

export async function POST(request: Request) {
  // H1 rate limiting: this endpoint stores PII, so submissions are
  // bounded per IP (5 / hour).
  const ipLimit = RATE_LIMITS.visitor.ip;

  const ipCheck = await checkRateLimit({
    key: clientIpKey(request, "visitor"),
    limit: ipLimit.limit,
    windowSeconds: ipLimit.windowSeconds,
  });

  if (!ipCheck.allowed) {
    return rateLimitExceededResponse(ipCheck);
  }

  try {
    const body = await request.json();
    const { firstName, lastName, age, wilayaId, phone, email } = body;

    const firstNameValue =
      typeof firstName === "string" ? firstName.trim() : "";

    if (firstNameValue.length < 2) {
      return NextResponse.json(
        { success: false, error: "الاسم الأول مطلوب (حرفين على الأقل)" },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    if (firstNameValue.length > MAX_FIRST_NAME) {
      return NextResponse.json(
        { success: false, error: "الاسم الأول يجب ألا يتجاوز 80 حرفًا" },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    const lastNameValue =
      typeof lastName === "string" ? lastName.trim() : "";

    if (lastNameValue.length < 2) {
      return NextResponse.json(
        { success: false, error: "اللقب مطلوب (حرفين على الأقل)" },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    if (lastNameValue.length > MAX_LAST_NAME) {
      return NextResponse.json(
        { success: false, error: "اللقب يجب ألا يتجاوز 80 حرفًا" },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    const ageNum = Number(age);

    if (
      !Number.isInteger(ageNum) ||
      ageNum < 14 ||
      ageNum > 90
    ) {
      return NextResponse.json(
        { success: false, error: "العمر يجب أن يكون بين 14 و 90 سنة" },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    if (!wilayaId) {
      return NextResponse.json(
        { success: false, error: "الولاية مطلوبة" },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    const phoneValue =
      typeof phone === "string" ? phone.trim() : "";

    if (phoneValue.length > MAX_PHONE) {
      return NextResponse.json(
        { success: false, error: "رقم الهاتف يجب ألا يتجاوز 30 حرفًا" },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    const emailValue =
      typeof email === "string" ? email.trim().toLowerCase() : "";

    if (emailValue.length > MAX_EMAIL) {
      return NextResponse.json(
        { success: false, error: "البريد الإلكتروني يجب ألا يتجاوز 254 حرفًا" },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    if (
      emailValue &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)
    ) {
      return NextResponse.json(
        { success: false, error: "البريد الإلكتروني غير صالح" },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    // Ensure database is seeded
    const existingWilayas = await db.select().from(wilayas).limit(1);
    if (existingWilayas.length === 0) {
      // Automatic database seeding is disabled in request handlers.
    }

    // Get wilaya details
    const wilayaIdNum = Number(wilayaId);
    const wilayaInfo = await db
      .select()
      .from(wilayas)
      .where(eq(wilayas.id, wilayaIdNum))
      .limit(1);

    if (wilayaInfo.length === 0) {
      return NextResponse.json(
        { success: false, error: "الولاية المختارة غير موجودة في قاعدة البيانات" },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    // Generate a cryptographically random session token for this visitor
    const sessionToken = randomBytes(32).toString("hex");

    // Insert visitor profile
    const [inserted] = await db
      .insert(visitorProfiles)
      .values({
        firstName: firstNameValue,
        lastName: lastNameValue,
        age: ageNum,
        wilayaId: wilayaIdNum,
        wilayaName: wilayaInfo[0].nameAr,
        phone: phoneValue || null,
        email: emailValue || null,
        sessionToken,
      })
      .returning();

    // Store the session token in a dedicated HttpOnly cookie so it never
    // reaches the client bundle, URL, or localStorage.
    const cookieStore = await cookies();
    cookieStore.set(VISITOR_SESSION_COOKIE_NAME, inserted.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: VISITOR_SESSION_MAX_AGE_SECONDS,
    });

    return NextResponse.json(
      {
        success: true,
        visitor: {
          firstName: inserted.firstName,
          wilayaName: inserted.wilayaName,
        },
      },
      { headers: NO_STORE_HEADERS }
    );
  } catch (error: any) {
    console.error("Visitor registration error:", error);
    return NextResponse.json(
      { success: false, error: "\u062d\u062f\u062b \u062e\u0637\u0623 \u062f\u0627\u062e\u0644\u064a. \u062d\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649 \u0644\u0627\u062d\u0642\u064b\u0627." },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}
