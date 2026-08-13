import { NextResponse } from "next/server";
import { db } from "@/db";
import { scoringWeights } from "@/db/schema";
import { DEFAULT_WEIGHTS } from "@/lib/scoringEngine";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await db.select().from(scoringWeights).limit(1);
    if (rows.length === 0) {
      const [inserted] = await db.insert(scoringWeights).values(DEFAULT_WEIGHTS).returning();
      return NextResponse.json({ success: true, weights: inserted });
    }
    return NextResponse.json({ success: true, weights: rows[0] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "\u062d\u062f\u062b \u062e\u0637\u0623 \u062f\u0627\u062e\u0644\u064a. \u062d\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649 \u0644\u0627\u062d\u0642\u064b\u0627." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const rows = await db.select().from(scoringWeights).limit(1);

    if (rows.length === 0) {
      const [inserted] = await db.insert(scoringWeights).values(body).returning();
      return NextResponse.json({ success: true, weights: inserted });
    } else {
      const [updated] = await db
        .update(scoringWeights)
        .set({ ...body, updatedAt: new Date() })
        .where(eq(scoringWeights.id, rows[0].id))
        .returning();
      return NextResponse.json({ success: true, weights: updated });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "\u062d\u062f\u062b \u062e\u0637\u0623 \u062f\u0627\u062e\u0644\u064a. \u062d\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649 \u0644\u0627\u062d\u0642\u064b\u0627." }, { status: 500 });
  }
}
