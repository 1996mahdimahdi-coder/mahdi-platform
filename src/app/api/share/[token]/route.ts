import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { analysisResults } from "@/db/schema";
import {
  checkRateLimit,
  clientIpKey,
  RATE_LIMITS,
  rateLimitExceededResponse,
} from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  if (
    !token ||
    typeof token !== "string" ||
    token.length < 20 ||
    token.length > 80 ||
    !/^[a-f0-9]+$/.test(token)
  ) {
    return NextResponse.json(
      { success: false, error: "رابط المشاركة غير صالح." },
      { status: 400 }
    );
  }

  const ipCheck = await checkRateLimit({
    key: clientIpKey(request, "share"),
    limit: 30,
    windowSeconds: 60,
  });

  if (!ipCheck.allowed) {
    return rateLimitExceededResponse(ipCheck);
  }

  try {
    const [row] = await db
      .select({
        id: analysisResults.id,
        userCapital: analysisResults.userCapital,
        testAnswers: analysisResults.testAnswers,
        topProjects: analysisResults.topProjects,
        createdAt: analysisResults.createdAt,
      })
      .from(analysisResults)
      .where(eq(analysisResults.shareToken, token))
      .limit(1);

    if (!row) {
      return NextResponse.json(
        { success: false, error: "النتيجة غير موجودة أو انتهت صلاحيتها." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      result: {
        userCapital: row.userCapital,
        testAnswers: row.testAnswers,
        topProjects: row.topProjects,
        createdAt: row.createdAt,
      },
    });
  } catch (error) {
    console.error("Share fetch error:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ داخلي." },
      { status: 500 }
    );
  }
}
