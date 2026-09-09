import { NextResponse } from "next/server";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { communes, wilayas, communeStats, dataSources } from "@/db/schema";
import {
  buildDensity,
  buildStatDetail,
  toSourceRef,
} from "@/lib/sourceStats";

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
    const stats = row.stats;

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
      commune: row.commune,
      wilaya: row.wilaya,
      // F10-13 — explicit public projection of the stats row. Everything the
      // commune page actually renders is kept; internal registry artifacts
      // (populationSourceId/areaSourceId provider FKs, createdAt, updatedAt)
      // are never serialized to the client.
      stats: row.stats
        ? {
            id: row.stats.id,
            communeId: row.stats.communeId,
            population: row.stats.population,
            populationSource: row.stats.populationSource,
            populationYear: row.stats.populationYear,
            populationConfidence: row.stats.populationConfidence,
            areaKm2: row.stats.areaKm2,
            areaSource: row.stats.areaSource,
            areaYear: row.stats.areaYear,
            areaConfidence: row.stats.areaConfidence,
            density: row.stats.density,
            densityType: row.stats.densityType,
            dairaNameAr: row.stats.dairaNameAr,
            dairaNameFr: row.stats.dairaNameFr,
            dairaSource: row.stats.dairaSource,
            wilayaId: row.stats.wilayaId,
            wilayaSource: row.stats.wilayaSource,
            merchantCount: row.stats.merchantCount,
            merchantCountSource: row.stats.merchantCountSource,
            merchantCountYear: row.stats.merchantCountYear,
            commercialActivities: row.stats.commercialActivities,
            commercialActivitiesSource: row.stats.commercialActivitiesSource,
            marketScore: row.stats.marketScore,
            marketScoreMethod: row.stats.marketScoreMethod,
            purchasingPowerScore: row.stats.purchasingPowerScore,
            purchasingPowerMethod: row.stats.purchasingPowerMethod,
            competitionScore: row.stats.competitionScore,
            competitionMethod: row.stats.competitionMethod,
            commercialActivityScore: row.stats.commercialActivityScore,
            commercialActivityMethod: row.stats.commercialActivityMethod,
            overallScore: row.stats.overallScore,
            overallScoreMethod: row.stats.overallScoreMethod,
            notes: row.stats.notes,
            lastVerifiedAt: row.stats.lastVerifiedAt,
          }
        : null,
      population,
      area,
      density,
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
