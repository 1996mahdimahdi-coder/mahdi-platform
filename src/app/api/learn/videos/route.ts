import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { isMissingTableError, serializeRows } from "@/lib/noCapital/fallback";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(videos)
      .where(eq(videos.published, true))
      .orderBy(desc(videos.createdAt));
    return NextResponse.json({ success: true, count: rows.length, source: "database", videos: serializeRows(rows) });
  } catch (error) {
    if (isMissingTableError(error)) {
      return NextResponse.json({ success: true, count: 0, source: "defaults", videos: [] });
    }
    console.error("learn videos GET error:", error);
    return NextResponse.json({ success: false, error: "حدث خطأ داخلي. حاول مرة أخرى لاحقًا." }, { status: 500 });
  }
}
