import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { communes } from "@/db/schema";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const wilayaIdParam = searchParams.get("wilayaId");

    if (!wilayaIdParam) {
      return NextResponse.json(
        {
          success: false,
          error: "wilayaId is required",
        },
        { status: 400 }
      );
    }

    const wilayaId = Number(wilayaIdParam);

    if (!Number.isInteger(wilayaId) || wilayaId <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid wilayaId",
        },
        { status: 400 }
      );
    }

    const result = await db
      .select({
        id: communes.id,
        wilayaId: communes.wilayaId,
        nameAr: communes.nameAr,
        nameFr: communes.nameFr,
        populationDensity: communes.populationDensity,
      })
      .from(communes)
      .where(eq(communes.wilayaId, wilayaId))
      .orderBy(communes.nameAr);

    return NextResponse.json({
      success: true,
      communes: result,
      count: result.length,
    });
  } catch (error) {
    console.error("GET /api/communes error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load communes",
      },
      { status: 500 }
    );
  }
}