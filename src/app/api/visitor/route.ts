import { NextResponse } from "next/server";
import { db } from "@/db";
import { visitorProfiles, wilayas } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, age, wilayaId, phone, email } = body;

    // Validation
    if (!firstName || firstName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "الاسم الأول مطلوب (حرفين على الأقل)" },
        { status: 400 }
      );
    }

    if (!lastName || lastName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "اللقب مطلوب (حرفين على الأقل)" },
        { status: 400 }
      );
    }

    const ageNum = Number(age);
    if (!ageNum || ageNum < 14 || ageNum > 90) {
      return NextResponse.json(
        { success: false, error: "العمر يجب أن يكون بين 14 و 90 سنة" },
        { status: 400 }
      );
    }

    if (!wilayaId) {
      return NextResponse.json(
        { success: false, error: "الولاية مطلوبة" },
        { status: 400 }
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
        { status: 400 }
      );
    }

    // Generate a unique session token for this visitor
    const sessionToken = `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

    // Insert visitor profile
    const [inserted] = await db
      .insert(visitorProfiles)
      .values({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        age: ageNum,
        wilayaId: wilayaIdNum,
        wilayaName: wilayaInfo[0].nameAr,
        phone: phone ? phone.trim() : null,
        email: email ? email.trim().toLowerCase() : null,
        sessionToken,
      })
      .returning();

    return NextResponse.json({
      success: true,
      visitor: {
        id: inserted.id,
        firstName: inserted.firstName,
        lastName: inserted.lastName,
        age: inserted.age,
        wilayaId: inserted.wilayaId,
        wilayaName: inserted.wilayaName,
        sessionToken: inserted.sessionToken,
      },
    });
  } catch (error: any) {
    console.error("Visitor registration error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "حدث خطأ أثناء تسجيل البيانات" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionToken = searchParams.get("sessionToken");

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, error: "Session token required" },
        { status: 400 }
      );
    }

    const visitor = await db
      .select()
      .from(visitorProfiles)
      .where(eq(visitorProfiles.sessionToken, sessionToken))
      .limit(1);

    if (visitor.length === 0) {
      return NextResponse.json({ success: false, error: "Visitor not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, visitor: visitor[0] });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message },
      { status: 500 }
    );
  }
}
