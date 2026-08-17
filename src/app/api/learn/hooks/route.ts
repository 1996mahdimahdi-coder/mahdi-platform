import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { hookLibrary } from "@/db/schema";
import { isMissingTableError, serializeRows } from "@/lib/noCapital/fallback";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(hookLibrary)
      .where(eq(hookLibrary.published, true))
      .orderBy(desc(hookLibrary.updatedAt));
    return NextResponse.json({ success: true, count: rows.length, source: "database", hooks: serializeRows(rows) });
  } catch (error) {
    if (isMissingTableError(error)) {
      return NextResponse.json({ success: true, count: 0, source: "defaults", hooks: [] });
    }
    console.error("learn hooks GET error:", error);
    return NextResponse.json({ success: false, error: "حدث خطأ داخلي. حاول مرة أخرى لاحقًا." }, { status: 500 });
  }
}
