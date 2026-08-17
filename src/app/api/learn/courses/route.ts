import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { courses } from "@/db/schema";
import { isMissingTableError, serializeRows } from "@/lib/noCapital/fallback";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(courses)
      .where(eq(courses.published, true))
      .orderBy(desc(courses.updatedAt));
    return NextResponse.json({ success: true, count: rows.length, source: "database", courses: serializeRows(rows) });
  } catch (error) {
    if (isMissingTableError(error)) {
      return NextResponse.json({ success: true, count: 0, source: "defaults", courses: [] });
    }
    console.error("learn courses GET error:", error);
    return NextResponse.json({ success: false, error: "حدث خطأ داخلي. حاول مرة أخرى لاحقًا." }, { status: 500 });
  }
}
