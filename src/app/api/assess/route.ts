import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import {
  projects,
  scoringWeights,
  analysisResults,
  userProfiles,
} from "@/db/schema";

import {
  rankProjects,
  UserAssessmentInput,
  DEFAULT_WEIGHTS,
  ProjectData,
} from "@/lib/scoringEngine";

import { generateAnalysisExplanation } from "@/lib/aiExplanation";
import { getSession } from "@/lib/auth";
import {
  checkRateLimit,
  clientIpKey,
  RATE_LIMITS,
  rateLimitExceededResponse,
} from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // ============================================================
    // 0. قراءة بيانات الطلب
    // ============================================================

    let body: Record<string, unknown>;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error:
            "البيانات المرسلة غير صحيحة.",
        },
        {
          status: 400,
        }
      );
    }

    // userId must come exclusively from the authenticated session.
    // The client-supplied body.userId is ignored entirely so an
    // attacker can never target another user's profile or analysis
    // results (IDOR / mass assignment via /api/assess).
    const session = await getSession();

    const userId = session ? session.userId : null;

    // ============================================================
    // 0.1. H1 rate limiting — before any DB write or AI call.
    //      Authenticated users are keyed by userId; anonymous requests
    //      are keyed by IP (falling back to a shared "unknown" bucket
    //      when no IP is available).
    // ============================================================

    if (session) {
      const userLimit = RATE_LIMITS.assess.user;

      const userCheck = await checkRateLimit({
        key: `assess:user:${session.userId}`,
        limit: userLimit.limit,
        windowSeconds: userLimit.windowSeconds,
      });

      if (!userCheck.allowed) {
        return rateLimitExceededResponse(userCheck);
      }
    } else {
      const anonLimit = RATE_LIMITS.assess.anonymous;

      const anonCheck = await checkRateLimit({
        key: clientIpKey(request, "assess"),
        limit: anonLimit.limit,
        windowSeconds: anonLimit.windowSeconds,
      });

      if (!anonCheck.allowed) {
        return rateLimitExceededResponse(anonCheck);
      }
    }

    // ============================================================
    // 1. تجهيز بيانات المستخدم
    // ============================================================

    const validIntegerId = (
      v: unknown
    ): number | undefined | null => {
      if (
        v === undefined ||
        v === null ||
        v === ""
      ) {
        return undefined;
      }

      const n = Number(v);

      if (
        !Number.isInteger(n) ||
        n <= 0
      ) {
        return null;
      }

      return n;
    };

    const cleanString = (
      v: unknown,
      max: number
    ): string | undefined =>
      typeof v === "string" &&
      v.trim().length > 0 &&
      v.trim().length <= max
        ? v.trim()
        : undefined;

    const ALLOWED = {
      workspace: new Set([
        "من المنزل",
        "محل أملكه",
        "محل بالإيجار",
        "أونلاين",
        "متنقل",
        "لا أعرف",
      ]),
      availableHours: new Set([
        "أقل من ساعتين يوميًا",
        "2–4 ساعات",
        "4–6 ساعات",
        "أكثر من 6 ساعات",
        "دوام كامل",
      ]),
      riskLevel: new Set([
        "منخفض",
        "متوسط",
        "مرتفع",
      ]),
      transport: new Set([
        "سيارة",
        "دراجة نارية",
        "نقل عمومي",
        "لا أملك وسيلة نقل",
      ]),
      existingIncome: new Set([
        "نعم",
        "لا",
      ]),
      objective: new Set([
        "دخل إضافي",
        "مشروع رئيسي",
        "ترك الوظيفة مستقبلًا",
        "مشروع صغير قابل للتوسع",
        "لا أعرف",
      ]),
      preferredMode: new Set([
        "بيع منتجات",
        "تقديم خدمات",
        "مشروع أونلاين",
        "مشروع محلي",
        "مشروع من المنزل",
        "مشروع يحتاج محل",
        "لا أعرف",
      ]),
    } as const;

    const pickEnum = (
      v: unknown,
      set: ReadonlySet<string>,
      fallback: string
    ): string => {
      const s = cleanString(v, 50);

      return s !== undefined && set.has(s)
        ? s
        : fallback;
    };

    const invalidRequest = (
      message: string
    ) =>
      NextResponse.json(
        {
          success: false,
          error: message,
        },
        {
          status: 400,
        }
      );

    const capital = Number(body.capital);

    if (
      !Number.isFinite(capital) ||
      capital <= 0 ||
      capital > 100_000_000
    ) {
      return invalidRequest(
        "الرجاء إدخال رأس مال صحيح (بين 0 و 100 مليون دج)."
      );
    }

    const wilayaId = validIntegerId(
      body.wilayaId
    );

    if (wilayaId === null) {
      return invalidRequest(
        "معرف الولاية غير صحيح."
      );
    }

    const communeId = validIntegerId(
      body.communeId
    );

    if (communeId === null) {
      return invalidRequest(
        "معرف البلدية غير صحيح."
      );
    }

    const skills = Array.isArray(body.skills)
      ? (body.skills as unknown[])
          .filter(
            (s): s is string =>
              typeof s === "string" &&
              s.trim().length > 0 &&
              s.trim().length <= 40
          )
          .map((s) => s.trim())
          .slice(0, 20)
      : [];

    const userInput: UserAssessmentInput = {
      capital,

      workspace: pickEnum(
        body.workspace,
        ALLOWED.workspace,
        "من المنزل"
      ),

      wilayaId,
      communeId,

      wilayaName: cleanString(
        body.wilayaName,
        100
      ),

      communeName: cleanString(
        body.communeName,
        100
      ),

      availableHours: pickEnum(
        body.availableHours,
        ALLOWED.availableHours,
        "2–4 ساعات"
      ),

      skills,

      preferredMode: pickEnum(
        body.preferredMode,
        ALLOWED.preferredMode,
        "لا أعرف"
      ),

      riskLevel: pickEnum(
        body.riskLevel,
        ALLOWED.riskLevel,
        "متوسط"
      ),

      transport: pickEnum(
        body.transport,
        ALLOWED.transport,
        "لا أملك وسيلة نقل"
      ),

      existingIncome: pickEnum(
        body.existingIncome,
        ALLOWED.existingIncome,
        "لا"
      ),

      objective: pickEnum(
        body.objective,
        ALLOWED.objective,
        "لا أعرف"
      ),
    };

    // ============================================================
    // 2. حفظ / تحديث ملف المستخدم
    // ============================================================

    if (userId && Number.isFinite(userId)) {
      const existingProfile = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.userId, userId))
        .limit(1);

      const profileData = {
        userId,
        capital: userInput.capital,

        wilayaId:
          userInput.wilayaId ?? null,

        communeId:
          userInput.communeId ?? null,

        workspace:
          userInput.workspace,

        availableHours:
          userInput.availableHours,

        skills:
          userInput.skills,

        riskLevel:
          userInput.riskLevel,

        transport:
          userInput.transport,

        existingIncome:
          userInput.existingIncome,

        objective:
          userInput.objective,

        updatedAt:
          new Date(),
      };

      if (existingProfile.length > 0) {
        await db
          .update(userProfiles)
          .set(profileData)
          .where(
            eq(
              userProfiles.userId,
              userId
            )
          );
      } else {
        await db
          .insert(userProfiles)
          .values(profileData);
      }
    }

    // ============================================================
    // 3. التأكد من وجود المشاريع
    // ============================================================

    let dbProjects = await db
      .select()
      .from(projects);

    if (dbProjects.length === 0) {
      console.log(
        "No projects found. Starting database seed..."
      );

      // Automatic database seeding is disabled in request handlers.

      dbProjects = await db
        .select()
        .from(projects);
    }

    if (dbProjects.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "لا توجد مشاريع في قاعدة البيانات.",
        },
        {
          status: 500,
        }
      );
    }

    // ============================================================
    // 4. الحصول على أوزان التقييم
    // ============================================================

    const weightRows = await db
      .select()
      .from(scoringWeights)
      .limit(1);

    const weightsConfig =
      weightRows.length > 0
        ? weightRows[0]
        : DEFAULT_WEIGHTS;

    // ============================================================
    // 5. تحويل مشاريع قاعدة البيانات إلى ProjectData
    // ============================================================

    const typedProjects: ProjectData[] =
      dbProjects.map((p) => ({
        id: p.id,

        projectId:
          p.projectId,

        projectName:
          p.projectName,

        category:
          p.category,

        description:
          p.description,

        minCapital:
          p.minCapital,

        recommendedCapital:
          p.recommendedCapital,

        maxCapital:
          p.maxCapital,

        riskLevel:
          p.riskLevel,

        requiresShop:
          p.requiresShop,

        homeBased:
          p.homeBased,

        onlinePossible:
          p.onlinePossible,

        transportRequired:
          p.transportRequired,

        skillsRequired:
          (p.skillsRequired as string[]) || [],

        timeRequired:
          p.timeRequired,

        difficulty:
          p.difficulty,

        scalability:
          p.scalability,

        seasonality:
          p.seasonality,

        competitionLevel:
          p.competitionLevel,

        targetArea:
          p.targetArea,

        equipment:
          (p.equipment as {
            item: string;
            cost: number;
          }[]) || [],

        initialStock:
          p.initialStock,

        fixedCosts:
          p.fixedCosts,

        variableCostsPercent:
          p.variableCostsPercent,

        pricingMethod:
          p.pricingMethod,

        profitFormula:
          p.profitFormula,

        breakEvenFormula:
          p.breakEvenFormula,

        risks:
          (p.risks as string[]) || [],

        advantages:
          (p.advantages as string[]) || [],

        disadvantages:
          (p.disadvantages as string[]) || [],

        launchPlan:
          (p.launchPlan as {
            week: string;
            title: string;
            tasks: string[];
          }[]) || [],

        legalNotes:
          p.legalNotes,

        source:
          p.source,
      }));

    // ============================================================
    // 6. تشغيل محرك التقييم
    // ============================================================

    const ranked = rankProjects(
      userInput,
      typedProjects,
      weightsConfig
    );

    const top5 =
      ranked.slice(0, 5);

    // ============================================================
    // 7. إنشاء شرح النتيجة
    // ============================================================

    let explanationText = "";

    try {
      explanationText =
        await generateAnalysisExplanation(
          userInput,
          top5
        );
    } catch (error) {
      console.error(
        "AI explanation error:",
        error
      );

      explanationText =
        "تم إنشاء نتيجة التقييم بنجاح، ويمكنك مراجعة المشاريع المقترحة بناءً على درجة التوافق.";
    }

    // ============================================================
    // 8. تجهيز أفضل 5 مشاريع للحفظ
    // ============================================================

    const topProjectSummaries =
      top5.map((r) => ({
        projectId:
          r.project.projectId,

        projectName:
          r.project.projectName,

        totalScore:
          r.totalScore,

        financialScore:
          r.financialScore,

        personalScore:
          r.personalScore,

        workspaceScore:
          r.workspaceScore,

        locationScore:
          r.locationScore,

        riskScore:
          r.riskScore,

        timeScore:
          r.timeScore,

        recommendation:
          r.recommendation,

        reasons:
          r.reasons,
      }));

    // ============================================================
    // 9. إنشاء Session ID
    // ============================================================

    const sessionId =
      typeof body.sessionId === "string" &&
      body.sessionId.trim().length > 0
        ? body.sessionId.trim()
        : `sess_${Date.now()}_${Math.random()
            .toString(36)
            .substring(2, 7)}`;

    // ============================================================
    // 10. حفظ نتيجة التحليل
    // ============================================================

    const [savedRecord] =
      await db
        .insert(analysisResults)
        .values({
          userId,

          sessionId,

          userCapital:
            userInput.capital,

          testAnswers:
            userInput as any,

          topProjects:
            topProjectSummaries as any,
        })
        .returning();

    // ============================================================
    // 11. إرسال النتيجة للواجهة
    // ============================================================

    return NextResponse.json({
      success: true,

      analysisId:
        savedRecord?.id ?? null,

      userId,

      userInput,

      top5Results:
    top5.map((r) => ({
      projectId: r.project.projectId,
      projectName: r.project.projectName,
      category: r.project.category,
      description: r.project.description,
      minCapital: r.project.minCapital,
      recommendedCapital: r.project.recommendedCapital,
      maxCapital: r.project.maxCapital,
      difficulty: r.project.difficulty,
      scalability: r.project.scalability,
      riskLevel: r.project.riskLevel,
      homeBased: r.project.homeBased,
      initialStock: r.project.initialStock,
      totalScore: r.totalScore,
      recommendation: r.recommendation,
      reasons: r.reasons,
    })),

      explanationText,
    });
  } catch (error: unknown) {
    console.error(
      "Assessment error:",
      error
    );

    const errorMessage =
      error instanceof Error
        ? "\u062d\u062f\u062b \u062e\u0637\u0623 \u062f\u0627\u062e\u0644\u064a. \u062d\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649 \u0644\u0627\u062d\u0642\u064b\u0627."
        : "Assessment error";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      {
        status: 500,
      }
    );
  }
}
