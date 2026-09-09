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
import {
  NO_CAPITAL_ASSESS_GLOBAL_KEY,
  checkRateLimit,
  clientIpKey,
  RATE_LIMITS,
  rateLimitExceededResponse,
} from "@/lib/rateLimit";
import { csrfGuard } from "@/lib/csrf";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const csrfErr = await csrfGuard(request);
  if (csrfErr) return csrfErr;

  // F10-09 — anonymous budget dedicated to /api/no-capital/assess. Per-IP
  // window mirrors /api/assess; the fixed-key GLOBAL bucket closes the
  // IP-rotation loophole for this CPU/DB-heavy recommendation surface.
  const assessLimit = RATE_LIMITS.noCapitalAssess.anonymous;
  const assessCheck = await checkRateLimit({
    key: clientIpKey(request, "no-capital-assess"),
    limit: assessLimit.limit,
    windowSeconds: assessLimit.windowSeconds,
  });
  if (!assessCheck.allowed) {
    return rateLimitExceededResponse(assessCheck);
  }

  const assessGlobalLimit = RATE_LIMITS.noCapitalAssess.anonymousGlobal;
  const assessGlobalCheck = await checkRateLimit({
    key: NO_CAPITAL_ASSESS_GLOBAL_KEY,
    limit: assessGlobalLimit.limit,
    windowSeconds: assessGlobalLimit.windowSeconds,
  });
  if (!assessGlobalCheck.allowed) {
    return rateLimitExceededResponse(assessGlobalCheck);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "إجابات الاختبار غير صالحة." }, { status: 400 });
  }

  const record = (body ?? {}) as Record<string, unknown>;
  const answers = (record.answers ?? {}) as NoCapitalAnswers;
  // F10-12 — the sessionId is an opaque token persisted to the DB and later
  // echoed back to clients only via keys we control (consent route). Bound
  // it to a printable token charset so an attacker cannot smuggle a much
  // larger blend (path traversal, control chars) into noCapitalTestResults.
  const rawSessionId = typeof record.sessionId === "string" && record.sessionId ? record.sessionId : null;
  const sessionId = rawSessionId && /^[a-zA-Z0-9_-]{1,64}$/.test(rawSessionId) ? rawSessionId : null;
  if (rawSessionId && !sessionId) {
    return NextResponse.json({ success: false, error: "معرّف الجلسة غير صالح." }, { status: 400 });
  }
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
