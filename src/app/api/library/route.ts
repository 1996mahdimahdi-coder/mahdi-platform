import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { libraryBooks } from "@/db/schema";
import { isMissingTableError, serializeRows } from "@/lib/noCapital/fallback";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const rows = await db
      .select()
      .from(libraryBooks)
      .where(eq(libraryBooks.published, true))
      .orderBy(desc(libraryBooks.updatedAt));

    const filtered = category
      ? rows.filter((b) => b.category === category)
      : rows;

    return NextResponse.json({
      success: true,
      count: filtered.length,
      source: "database",
      books: serializeRows(filtered),
    });
  } catch (error) {
    if (isMissingTableError(error)) {
      return NextResponse.json({ success: true, count: 0, source: "defaults", books: [] });
    }
    console.error("library GET error:", error);
    return NextResponse.json({ success: false, error: "حدث خطأ داخلي. حاول مرة أخرى لاحقًا." }, { status: 500 });
  }
}