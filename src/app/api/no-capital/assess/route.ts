import { NextResponse } from "next/server";
import { db } from "@/db";
import { noCapitalTestResults } from "@/db/schema";
import { isMissingTableError } from "@/lib/noCapital/fallback";
import {
  loadActiveConsent,
  loadCategories,
  loadNoCapitalProfiles,
  loadQuestions,
  loadRecommendationRules,
} from "@/lib/noCapital/publicData";
import {
  scoreNoCapitalProfiles,
  summarizeRecommendations,
} from "@/lib/noCapitalRecommendationEngine";
import type { NoCapitalAnswers } from "@/lib/noCapital/types";
import { checkRateLimit, clientIpKey, RATE_LIMITS, rateLimitExceededResponse } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const assessLimit = RATE_LIMITS.assess.anonymous;
  const assessCheck = await checkRateLimit({
    key: clientIpKey(request, "no-capital-assess"),
    limit: assessLimit.limit,
    windowSeconds: assessLimit.windowSeconds,
  });
  if (!assessCheck.allowed) {
    return rateLimitExceededResponse(assessCheck);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "إجابات الاختبار غير صالحة." }, { status: 400 });
  }

  const record = (body ?? {}) as Record<string, unknown>;
  const answers = (record.answers ?? {}) as NoCapitalAnswers;
  const sessionId = typeof record.sessionId === "string" && record.sessionId ? record.sessionId : null;
  const consentVersion = typeof record.consentVersion === "string" ? record.consentVersion : null;

  try {
    const [{ questions, source: questionSource }, { profiles, source: profileSource }, { consent }, { categories }, { rules }] =
      await Promise.all([
        loadQuestions(),
        loadNoCapitalProfiles(),
        loadActiveConsent(),
        loadCategories(),
        loadRecommendationRules(),
      ]);

    if (!consentVersion || consentVersion !== consent.version) {
      return NextResponse.json(
        { success: false, error: "يجب الموافقة على شروط عرض النتائج أولاً." },
        { status: 403 }
      );
    }

    const recommendations = scoreNoCapitalProfiles({ answers, questions, profiles, rules });

    if (sessionId) {
      try {
        await db
          .insert(noCapitalTestResults)
          .values({
            sessionId,
            answers,
            recommendations: summarizeRecommendations(recommendations),
          });
      } catch (error) {
        if (!isMissingTableError(error)) {
          console.error("no-capital test result save error:", error);
        }
      }
    }

    return NextResponse.json({
      success: true,
      recommendations,
      consentVersion: consent.version,
      source: profileSource,
      questionSource,
      categories,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("no-capital assess POST error:", error);
    return NextResponse.json({ success: false, error: "حدث خطأ داخلي. حاول مرة أخرى لاحقًا." }, { status: 500 });
  }
}
