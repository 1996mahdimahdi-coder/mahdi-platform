import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { libraryBooks } from "@/db/schema";
import { isMissingTableError, serializeRow } from "@/lib/noCapital/fallback";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const [book] = await db
      .select()
      .from(libraryBooks)
      .where(and(eq(libraryBooks.slug, slug), eq(libraryBooks.published, true)))
      .limit(1);

    if (!book) {
      return NextResponse.json({ success: false, error: "الكتاب غير متاح حالياً." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      source: "database",
      book: serializeRow(book),
    });
  } catch (error) {
    if (isMissingTableError(error)) {
      return NextResponse.json({ success: false, error: "الكتاب غير متاح حالياً." }, { status: 404 });
    }
    console.error("library book GET error:", error);
    return NextResponse.json({ success: false, error: "حدث خطأ داخلي. حاول مرة أخرى لاحقًا." }, { status: 500 });
  }
}