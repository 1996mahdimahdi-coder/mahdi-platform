import { NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  forbiddenResponse,
  getSession,
  unauthorizedResponse,
} from "@/lib/auth";
import {
  checkRateLimit,
  RATE_LIMITS,
  rateLimitExceededResponse,
} from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const riskLevel = searchParams.get("risk");
    const maxCapital = searchParams.get("maxCapital");
    const homeBasedOnly = searchParams.get("homeBased") === "true";
    const onlineOnly = searchParams.get("online") === "true";

    // Auto-seed if empty
    const check = await db.select().from(projects).limit(1);
    if (check.length === 0) {
      // Automatic database seeding is disabled in request handlers.
    }

    let allProjects = await db.select().from(projects);

    if (category && category !== "الكل") {
      allProjects = allProjects.filter((p) => p.category === category);
    }
    if (riskLevel && riskLevel !== "الكل") {
      allProjects = allProjects.filter((p) => p.riskLevel === riskLevel);
    }
    if (maxCapital) {
      const capNum = parseInt(maxCapital, 10);
      if (!isNaN(capNum)) {
        allProjects = allProjects.filter((p) => p.minCapital <= capNum);
      }
    }
    if (homeBasedOnly) {
      allProjects = allProjects.filter((p) => p.homeBased);
    }
    if (onlineOnly) {
      allProjects = allProjects.filter((p) => p.onlinePossible);
    }

    return NextResponse.json({ success: true, projects: allProjects });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "\u062d\u062f\u062b \u062e\u0637\u0623 \u062f\u0627\u062e\u0644\u064a. \u062d\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649 \u0644\u0627\u062d\u0642\u064b\u0627." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();

  if (!session) {
    return unauthorizedResponse();
  }

  if (session.role !== "admin") {
    return forbiddenResponse();
  }

  // H1 rate limiting: admin write operations are keyed by admin userId.
  const writeLimit = RATE_LIMITS.adminWrite.user;

  const writeCheck = await checkRateLimit({
    key: `admin:write:user:${session.userId}`,
    limit: writeLimit.limit,
    windowSeconds: writeLimit.windowSeconds,
  });

  if (!writeCheck.allowed) {
    return rateLimitExceededResponse(writeCheck);
  }

  try {
    const body = await request.json();
    if (!body.projectName || !body.projectId || !body.minCapital) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const values = {
      projectId: String(body.projectId),
      projectName: String(body.projectName),
      category: String(body.category ?? ""),
      description: String(body.description ?? ""),
      minCapital: Number(body.minCapital) || 0,
      recommendedCapital: Number(body.recommendedCapital) || 0,
      maxCapital: Number(body.maxCapital) || 0,
      riskLevel: String(body.riskLevel ?? "متوسط"),
      requiresShop: body.requiresShop === true,
      homeBased: body.homeBased !== false,
      onlinePossible: body.onlinePossible !== false,
      transportRequired: body.transportRequired === true,
      skillsRequired: Array.isArray(body.skillsRequired) ? body.skillsRequired : [],
      timeRequired: String(body.timeRequired ?? "2-4 ساعات"),
      difficulty: String(body.difficulty ?? "سهل"),
      scalability: String(body.scalability ?? "متوسطة"),
      seasonality: String(body.seasonality ?? "طوال السنة"),
      competitionLevel: String(body.competitionLevel ?? "متوسطة"),
      targetArea: String(body.targetArea ?? "جميع المناطق"),
      workLocation: String(body.workLocation ?? "محل"),
      skillLevel: String(body.skillLevel ?? "بسيطة"),
      legalStatus: String(body.legalStatus ?? "غير مقنن"),
      equipment: Array.isArray(body.equipment) ? body.equipment : [],
      initialStock: Number(body.initialStock) || 0,
      fixedCosts: Number(body.fixedCosts) || 0,
      variableCostsPercent: Number(body.variableCostsPercent) || 10,
      pricingMethod: String(body.pricingMethod ?? "هامش ربح ثابت"),
      profitFormula: String(body.profitFormula ?? "الإيرادات - التكاليف"),
      breakEvenFormula: String(body.breakEvenFormula ?? "التكاليف الثابتة / هامش الربح للوحده"),
      risks: Array.isArray(body.risks) ? body.risks : [],
      advantages: Array.isArray(body.advantages) ? body.advantages : [],
      disadvantages: Array.isArray(body.disadvantages) ? body.disadvantages : [],
      launchPlan: Array.isArray(body.launchPlan) ? body.launchPlan : [],
      legalNotes: typeof body.legalNotes === "string" ? body.legalNotes : null,
      source: typeof body.source === "string" ? body.source : null,
    };

    const [created] = await db.insert(projects).values(values).returning();
    return NextResponse.json({ success: true, project: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "\u062d\u062f\u062b \u062e\u0637\u0623 \u062f\u0627\u062e\u0644\u064a. \u062d\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649 \u0644\u0627\u062d\u0642\u064b\u0627." }, { status: 500 });
  }
}
