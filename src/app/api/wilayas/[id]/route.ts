import { NextResponse } from "next/server";
import { and, eq, inArray } from "drizzle-orm";
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
        // F10-13 — only PUBLISHED sources can back a publicly shown claim,
        // and only the SourceRef projection is read (never internal registry
        // metadata such as `notes`/`accessedAt`).
        const sources = await db
          .select({
            id: dataSources.id,
            name: dataSources.name,
            institution: dataSources.institution,
            sourceType: dataSources.sourceType,
            category: dataSources.category,
            confidenceGrade: dataSources.confidenceGrade,
            documentTitle: dataSources.documentTitle,
            documentYear: dataSources.documentYear,
            documentType: dataSources.documentType,
            url: dataSources.url,
            lastVerifiedAt: dataSources.lastVerifiedAt,
          })
          .from(dataSources)
          .where(
            and(
              inArray(dataSources.id, sourceIds),
              eq(dataSources.published, true)
            )
          );

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
      // F10-13 — explicit public projection of the wilaya stats row; internal
      // registry artifacts (populationSourceId/areaSourceId provider FKs,
      // createdAt, updatedAt) are never serialized to the client.
      stats: stats
        ? {
            id: stats.id,
            wilayaId: stats.wilayaId,
            population: stats.population,
            populationYear: stats.populationYear,
            populationConfidence: stats.populationConfidence,
            areaKm2: stats.areaKm2,
            areaYear: stats.areaYear,
            areaConfidence: stats.areaConfidence,
            density: stats.density,
            densityType: stats.densityType,
            lastVerifiedAt: stats.lastVerifiedAt,
          }
        : null,
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
