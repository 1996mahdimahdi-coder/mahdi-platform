import { NextResponse } from "next/server";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { courseLessons, courses } from "@/db/schema";
import { isMissingTableError, serializeRow } from "@/lib/noCapital/fallback";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const [course] = await db
      .select()
      .from(courses)
      .where(and(eq(courses.slug, slug), eq(courses.published, true)))
      .limit(1);

    if (!course) {
      return NextResponse.json({ success: false, error: "الدورة غير متاحة حالياً." }, { status: 404 });
    }

    const lessons = await db
      .select()
      .from(courseLessons)
      .where(and(eq(courseLessons.courseId, course.id), eq(courseLessons.published, true)))
      .orderBy(asc(courseLessons.order));

    return NextResponse.json({
      success: true,
      source: "database",
      course: serializeRow(course),
      lessons: lessons.map(serializeRow),
    });
  } catch (error) {
    if (isMissingTableError(error)) {
      return NextResponse.json({ success: false, error: "الدورة غير متاحة حالياً." }, { status: 404 });
    }
    console.error("learn course GET error:", error);
    return NextResponse.json({ success: false, error: "حدث خطأ داخلي. حاول مرة أخرى لاحقًا." }, { status: 500 });
  }
}
