import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { communes, wilayas, communeStats } from "@/db/schema";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const communeId = Number(id);

    if (!Number.isInteger(communeId) || communeId <= 0) {
      return NextResponse.json(
        { success: false, error: "معرف البلدية غير صحيح" },
        { status: 400 }
      );
    }

    const result = await db
      .select({
        commune: communes,
        wilaya: wilayas,
        stats: communeStats,
      })
      .from(communes)
      .leftJoin(wilayas, eq(communes.wilayaId, wilayas.id))
      .leftJoin(communeStats, eq(communes.id, communeStats.communeId))
      .where(eq(communes.id, communeId))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: "البلدية غير موجودة" },
        { status: 404 }
      );
    }

    const row = result[0];

    return NextResponse.json({
      success: true,
      commune: row.commune,
      wilaya: row.wilaya,
      stats: row.stats,
    });
  } catch (error) {
    console.error("GET /api/communes/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "حدث خطأ أثناء تحميل بيانات البلدية",
      },
      { status: 500 }
    );
  }
}