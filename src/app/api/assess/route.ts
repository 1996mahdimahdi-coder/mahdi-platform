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

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // ============================================================
    // 0. قراءة بيانات الطلب
    // ============================================================

    const body = await request.json();

    const userId =
      body.userId !== undefined &&
      body.userId !== null &&
      body.userId !== ""
        ? Number(body.userId)
        : null;

    // ============================================================
    // 1. تجهيز بيانات المستخدم
    // ============================================================

    const userInput: UserAssessmentInput = {
      capital: Number(body.capital) || 50000,

      workspace:
        body.workspace || "من المنزل",

      wilayaId:
        body.wilayaId !== undefined &&
        body.wilayaId !== null &&
        body.wilayaId !== ""
          ? Number(body.wilayaId)
          : undefined,

      communeId:
        body.communeId !== undefined &&
        body.communeId !== null &&
        body.communeId !== ""
          ? Number(body.communeId)
          : undefined,

      wilayaName:
        body.wilayaName || undefined,

      communeName:
        body.communeName || undefined,

      availableHours:
        body.availableHours || "2–4 ساعات",

      skills:
        Array.isArray(body.skills)
          ? body.skills
          : [],

      preferredMode:
        body.preferredMode || "لا أعرف",

      riskLevel:
        body.riskLevel || "متوسط",

      transport:
        body.transport || "لا أملك وسيلة نقل",

      existingIncome:
        body.existingIncome || "لا",

      objective:
        body.objective || "لا أعرف",
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
        ? error.message
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
