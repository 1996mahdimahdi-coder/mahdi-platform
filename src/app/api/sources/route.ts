import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { dataSources } from "@/db/schema";
import {
  ALLOWED_CATEGORIES,
  ALLOWED_CONFIDENCE_GRADES,
  ALLOWED_SOURCE_TYPES,
} from "@/lib/sourceValidation";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const confidenceGrade = searchParams.get("confidence_grade");
    const sourceType = searchParams.get("source_type");

    if (category && !(ALLOWED_CATEGORIES as readonly string[]).includes(category)) {
      return NextResponse.json(
        { success: false, error: "قيمة الفئة (category) غير صالحة." },
        { status: 400 }
      );
    }

    if (
      confidenceGrade &&
      !(ALLOWED_CONFIDENCE_GRADES as readonly string[]).includes(confidenceGrade)
    ) {
      return NextResponse.json(
        { success: false, error: "قيمة درجة الثقة (confidence_grade) غير صالحة." },
        { status: 400 }
      );
    }

    if (sourceType && !(ALLOWED_SOURCE_TYPES as readonly string[]).includes(sourceType)) {
      return NextResponse.json(
        { success: false, error: "قيمة نوع المصدر (source_type) غير صالحة." },
        { status: 400 }
      );
    }

    const filters = [];

    filters.push(eq(dataSources.published, true));

    if (category) {
      filters.push(eq(dataSources.category, category));
    }

    if (confidenceGrade) {
      filters.push(eq(dataSources.confidenceGrade, confidenceGrade));
    }

    if (sourceType) {
      filters.push(eq(dataSources.sourceType, sourceType));
    }

    const rows = await db
      .select({
        id: dataSources.id,
        name: dataSources.name,
        institution: dataSources.institution,
        sourceType: dataSources.sourceType,
        url: dataSources.url,
        category: dataSources.category,
        confidenceGrade: dataSources.confidenceGrade,
        documentTitle: dataSources.documentTitle,
        documentYear: dataSources.documentYear,
        documentType: dataSources.documentType,
        accessedAt: dataSources.accessedAt,
        notes: dataSources.notes,
        lastVerifiedAt: dataSources.lastVerifiedAt,
      })
      .from(dataSources)
      .where(and(...filters))
      .orderBy(dataSources.category, dataSources.institution, dataSources.name);

    const sources = rows.map((row) => ({
      ...row,
      accessedAt: row.accessedAt ? row.accessedAt.toISOString() : null,
      lastVerifiedAt: row.lastVerifiedAt
        ? row.lastVerifiedAt.toISOString()
        : null,
    }));

    const response = NextResponse.json({
      success: true,
      count: sources.length,
      sources,
    });

    response.headers.set("Cache-Control", "public, s-maxage=300, max-age=60");

    return response;
  } catch (error) {
    console.error("GET /api/sources error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          "حدث خطأ داخلي. حاول مرة أخرى لاحقًا.",
      },
      { status: 500 }
    );
  }
}
