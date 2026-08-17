import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { contentPublishingPlans, contentTypes } from "@/db/schema";
import { isMissingTableError, serializeRows } from "@/lib/noCapital/fallback";
import {
  DEFAULT_CONTENT_TYPES,
  DEFAULT_PUBLISHING_PLANS,
} from "@/lib/noCapital/defaults";

export const dynamic = "force-dynamic";

export async function GET() {
  let contentTypesList = DEFAULT_CONTENT_TYPES;
  let publishingPlans = DEFAULT_PUBLISHING_PLANS;
  let source: "database" | "defaults" = "defaults";

  try {
    const [typesRows, plansRows] = await Promise.all([
      db.select().from(contentTypes).orderBy(asc(contentTypes.id)),
      db.select().from(contentPublishingPlans).where(eq(contentPublishingPlans.active, true)).orderBy(asc(contentPublishingPlans.platform)),
    ]);

    if (typesRows.length > 0) {
      contentTypesList = serializeRows(typesRows) as unknown as typeof DEFAULT_CONTENT_TYPES;
      source = "database";
    }
    if (plansRows.length > 0) {
      publishingPlans = serializeRows(plansRows) as unknown as typeof DEFAULT_PUBLISHING_PLANS;
      source = "database";
    }
  } catch (error) {
    if (!isMissingTableError(error)) {
      console.error("learn content GET error:", error);
      return NextResponse.json({ success: false, error: "حدث خطأ داخلي. حاول مرة أخرى لاحقًا." }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true, source, contentTypes: contentTypesList, publishingPlans });
}
