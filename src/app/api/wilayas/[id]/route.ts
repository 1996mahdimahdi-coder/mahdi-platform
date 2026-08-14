import { NextResponse } from "next/server";
import { eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { wilayas, communes, wilayaStats, dataSources } from "@/db/schema";
import {
  buildDensity,
  buildStatDetail,
  toSourceRef,
} from "@/lib/sourceStats";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const wilayaId = Number(id);

    if (!Number.isInteger(wilayaId) || wilayaId <= 0) {
      return NextResponse.json(
        { success: false, error: "معرف الولاية غير صحيح" },
        { status: 400 }
      );
    }

    const [wilaya] = await db
      .select()
      .from(wilayas)
      .where(eq(wilayas.id, wilayaId))
      .limit(1);

    if (!wilaya) {
      return NextResponse.json(
        { success: false, error: "الولاية غير موجودة" },
        { status: 404 }
      );
    }

    const communeList = await db
      .select()
      .from(communes)
      .where(eq(communes.wilayaId, wilayaId))
      .orderBy(communes.nameAr);

    const [stats] = await db
      .select()
      .from(wilayaStats)
      .where(eq(wilayaStats.wilayaId, wilayaId))
      .limit(1);

    let populationSource = null;
    let areaSource = null;

    if (stats) {
      const sourceIds = [stats.populationSourceId, stats.areaSourceId].filter(
        (value): value is number => value != null
      );

      if (sourceIds.length > 0) {
        const sources = await db
          .select()
          .from(dataSources)
          .where(inArray(dataSources.id, sourceIds));

        populationSource =
          stats.populationSourceId != null
            ? sources.find((s) => s.id === stats.populationSourceId) ?? null
            : null;

        areaSource =
          stats.areaSourceId != null
            ? sources.find((s) => s.id === stats.areaSourceId) ?? null
            : null;
      }
    }

    const population = buildStatDetail({
      value: stats?.population ?? null,
      year: stats?.populationYear ?? null,
      confidence: stats?.populationConfidence ?? null,
      source: toSourceRef(populationSource),
      lastVerifiedAt: stats?.lastVerifiedAt ?? null,
    });

    const area = buildStatDetail({
      value: stats?.areaKm2 ?? null,
      year: stats?.areaYear ?? null,
      confidence: stats?.areaConfidence ?? null,
      source: toSourceRef(areaSource),
      lastVerifiedAt: stats?.lastVerifiedAt ?? null,
    });

    const density = buildDensity({
      population: population.hasData ? population.value : null,
      area: area.hasData ? area.value : null,
    });

    return NextResponse.json({
      success: true,
      wilaya,
      communes: communeList,
      stats: stats ?? null,
      population,
      area,
      density,
    });
  } catch (error) {
    console.error("GET /api/wilayas/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "حدث خطأ أثناء تحميل بيانات الولاية",
      },
      { status: 500 }
    );
  }
}
