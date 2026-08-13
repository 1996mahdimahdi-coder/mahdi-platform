import { NextResponse } from "next/server";
import { db } from "@/db";
import { analysisResults } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = Number(searchParams.get("userId"));

    if (!userId || Number.isNaN(userId)) {
      return NextResponse.json(
        { success: false, error: "Invalid userId" },
        { status: 400 }
      );
    }

    const [latestAnalysis] = await db
      .select()
      .from(analysisResults)
      .where(eq(analysisResults.userId, userId))
      .orderBy(desc(analysisResults.id))
      .limit(1);

    return NextResponse.json({
      success: true,
      analysis: latestAnalysis || null,
    });
  } catch (error: any) {
    console.error("Dashboard analysis error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "\u062d\u062f\u062b \u062e\u0637\u0623 \u062f\u0627\u062e\u0644\u064a. \u062d\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649 \u0644\u0627\u062d\u0642\u064b\u0627.",
      },
      { status: 500 }
    );
  }
}