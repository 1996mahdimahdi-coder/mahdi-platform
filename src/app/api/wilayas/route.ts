import { NextResponse } from "next/server";
import { db } from "@/db";
import { wilayas, communes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { seedDatabase } from "@/db/seed";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const wilayaId = searchParams.get("wilayaId");

    const wilayaCount = await db
      .select()
      .from(wilayas)
      .limit(1);

    if (wilayaCount.length === 0) {
      await seedDatabase();
    }

    if (wilayaId) {
      const idNum = parseInt(wilayaId, 10);

      if (Number.isNaN(idNum)) {
        return NextResponse.json(
          {
            success: false,
            error: "رقم الولاية غير صالح",
          },
          { status: 400 }
        );
      }

      const communeList = await db
        .select()
        .from(communes)
        .where(eq(communes.wilayaId, idNum));

      return NextResponse.json({
        success: true,
        communes: communeList,
      });
    }

    const allWilayas = await db.select().from(wilayas);

    allWilayas.sort(
      (a, b) => parseInt(a.code, 10) - parseInt(b.code, 10)
    );

    return NextResponse.json({
      success: true,
      wilayas: allWilayas,
    });
  } catch (error: unknown) {
    console.error("Wilayas API error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "حدث خطأ أثناء تحميل الولايات والبلديات",
      },
      { status: 500 }
    );
  }
}
