import { NextResponse } from "next/server";
import { db } from "@/db";
import { analysisResults } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import {
  getSession,
  PRIVATE_NO_STORE_HEADERS,
  unauthorizedResponse,
} from "@/lib/auth";
import {
  checkRateLimit,
  RATE_LIMITS,
  rateLimitExceededResponse,
} from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return unauthorizedResponse();
  }

  const dashLimit = RATE_LIMITS.dashboard.user;

  const dashCheck = await checkRateLimit({
    key: `dashboard:user:${session.userId}`,
    limit: dashLimit.limit,
    windowSeconds: dashLimit.windowSeconds,
  });

  if (!dashCheck.allowed) {
    return rateLimitExceededResponse(dashCheck);
  }

  try {
    const [latestAnalysis] = await db
      .select()
      .from(analysisResults)
      .where(
        eq(
          analysisResults.userId,
          session.userId
        )
      )
      .orderBy(desc(analysisResults.id))
      .limit(1);

    return NextResponse.json(
      {
        success: true,
        analysis: latestAnalysis || null,
      },
      {
        headers: PRIVATE_NO_STORE_HEADERS,
      }
    );
  } catch (error) {
    console.error(
      "Dashboard analysis error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "\u062d\u062f\u062b \u062e\u0637\u0623 \u062f\u0627\u062e\u0644\u064a. \u062d\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649 \u0644\u0627\u062d\u0642\u064b\u0627.",
      },
      {
        status: 500,
        headers: PRIVATE_NO_STORE_HEADERS,
      }
    );
  }
}
