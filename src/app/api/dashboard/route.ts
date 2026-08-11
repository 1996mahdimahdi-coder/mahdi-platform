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
        error: error?.message || "Failed to load analysis",
      },
      { status: 500 }
    );
  }
}