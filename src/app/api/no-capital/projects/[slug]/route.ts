import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, noCapitalProjects } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  if (!slug || typeof slug !== "string" || slug.length > 100) {
    return NextResponse.json({ success: false, error: "Identifier not valid." }, { status: 400 });
  }

  try {
    const rows = await db
      .select()
      .from(noCapitalProjects)
      .where(eq(noCapitalProjects.slug, slug))
      .limit(1);

    const row = rows[0];
    if (!row || !row.active) {
      return NextResponse.json({ success: false, error: "Project not found." }, { status: 404 });
    }

    let categorySlug: string | null = null;
    let categoryNameAr: string | null = null;
    if (row.categoryId != null) {
      const catRows = await db
        .select({ slug: categories.slug, nameAr: categories.nameAr })
        .from(categories)
        .where(eq(categories.id, row.categoryId))
        .limit(1);
      if (catRows[0]) {
        categorySlug = catRows[0].slug;
        categoryNameAr = catRows[0].nameAr;
      }
    }

    return NextResponse.json({
      success: true,
      project: {
        slug: row.slug,
        nameAr: row.nameAr,
        nameFr: row.nameFr,
        description: row.description,
        categorySlug,
        categoryNameAr,
        effortLevel: row.effortLevel,
        timeRequired: row.timeRequired,
        skillsRequired: row.skillsRequired,
        toolsNeeded: row.toolsNeeded,
        startCostEstimate: row.startCostEstimate,
        startCostType: row.startCostType,
        tags: row.tags,
        risks: row.risks,
        advantages: row.advantages,
        disadvantages: row.disadvantages,
        steps: row.steps,
        legalNotes: row.legalNotes,
        source: row.source,
      },
    });
  } catch (error) {
    console.error("no-capital project GET error:", error);
    return NextResponse.json({ success: false, error: "Internal error." }, { status: 500 });
  }
}
