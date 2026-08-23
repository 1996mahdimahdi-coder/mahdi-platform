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
import { csrfGuard } from "@/lib/csrf";

export const dynamic = "force-dynamic";

async function requireAdmin(): Promise<
  | { session: NonNullable<Awaited<ReturnType<typeof getSession>>>; error: null }
  | { session: null; error: Response }
> {
  const session = await getSession();

  if (!session) {
    return { session: null, error: unauthorizedResponse() };
  }

  if (session.role !== "admin") {
    return { session: null, error: forbiddenResponse() };
  }

  return { session, error: null };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const isNumeric = !isNaN(Number(id));

    let project = null;
    if (isNumeric) {
      const res = await db.select().from(projects).where(eq(projects.id, Number(id))).limit(1);
      project = res[0];
    }

    if (!project) {
      const res = await db.select().from(projects).where(eq(projects.projectId, id)).limit(1);
      project = res[0];
    }

    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "\u062d\u062f\u062b \u062e\u0637\u0623 \u062f\u0627\u062e\u0644\u064a. \u062d\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649 \u0644\u0627\u062d\u0642\u064b\u0627." }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();

  if (auth.error) {
    return auth.error;
  }

  const csrfErr = await csrfGuard(request);
  if (csrfErr) return csrfErr;

  const writeLimit = RATE_LIMITS.adminWrite.user;

  const writeCheck = await checkRateLimit({
    key: `admin:write:user:${auth.session.userId}`,
    limit: writeLimit.limit,
    windowSeconds: writeLimit.windowSeconds,
  });

  if (!writeCheck.allowed) {
    return rateLimitExceededResponse(writeCheck);
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const isNumeric = !isNaN(Number(id));

    const updates: Record<string, unknown> = { lastUpdated: new Date() };

    if ("projectId" in body) updates.projectId = String(body.projectId);
    if ("projectName" in body) updates.projectName = String(body.projectName);
    if ("category" in body) updates.category = String(body.category);
    if ("description" in body) updates.description = String(body.description);
    if ("minCapital" in body) updates.minCapital = Number(body.minCapital) || 0;
    if ("recommendedCapital" in body) updates.recommendedCapital = Number(body.recommendedCapital) || 0;
    if ("maxCapital" in body) updates.maxCapital = Number(body.maxCapital) || 0;
    if ("riskLevel" in body) updates.riskLevel = String(body.riskLevel);
    if ("requiresShop" in body) updates.requiresShop = body.requiresShop === true;
    if ("homeBased" in body) updates.homeBased = body.homeBased === true;
    if ("onlinePossible" in body) updates.onlinePossible = body.onlinePossible === true;
    if ("transportRequired" in body) updates.transportRequired = body.transportRequired === true;
    if ("skillsRequired" in body) updates.skillsRequired = Array.isArray(body.skillsRequired) ? body.skillsRequired : [];
    if ("timeRequired" in body) updates.timeRequired = String(body.timeRequired);
    if ("difficulty" in body) updates.difficulty = String(body.difficulty);
    if ("scalability" in body) updates.scalability = String(body.scalability);
    if ("seasonality" in body) updates.seasonality = String(body.seasonality);
    if ("competitionLevel" in body) updates.competitionLevel = String(body.competitionLevel);
    if ("targetArea" in body) updates.targetArea = String(body.targetArea);
    if ("workLocation" in body) updates.workLocation = String(body.workLocation);
    if ("skillLevel" in body) updates.skillLevel = String(body.skillLevel);
    if ("legalStatus" in body) updates.legalStatus = String(body.legalStatus);
    if ("equipment" in body) updates.equipment = Array.isArray(body.equipment) ? body.equipment : [];
    if ("initialStock" in body) updates.initialStock = Number(body.initialStock) || 0;
    if ("fixedCosts" in body) updates.fixedCosts = Number(body.fixedCosts) || 0;
    if ("variableCostsPercent" in body) updates.variableCostsPercent = Number(body.variableCostsPercent) || 10;
    if ("pricingMethod" in body) updates.pricingMethod = String(body.pricingMethod);
    if ("profitFormula" in body) updates.profitFormula = String(body.profitFormula);
    if ("breakEvenFormula" in body) updates.breakEvenFormula = String(body.breakEvenFormula);
    if ("risks" in body) updates.risks = Array.isArray(body.risks) ? body.risks : [];
    if ("advantages" in body) updates.advantages = Array.isArray(body.advantages) ? body.advantages : [];
    if ("disadvantages" in body) updates.disadvantages = Array.isArray(body.disadvantages) ? body.disadvantages : [];
    if ("launchPlan" in body) updates.launchPlan = Array.isArray(body.launchPlan) ? body.launchPlan : [];
    if ("legalNotes" in body) updates.legalNotes = typeof body.legalNotes === "string" ? body.legalNotes : null;
    if ("source" in body) updates.source = typeof body.source === "string" ? body.source : null;

    let updated = null;
    if (isNumeric) {
      const [res] = await db
        .update(projects)
        .set(updates)
        .where(eq(projects.id, Number(id)))
        .returning();
      updated = res;
    } else {
      const [res] = await db
        .update(projects)
        .set(updates)
        .where(eq(projects.projectId, id))
        .returning();
      updated = res;
    }

    return NextResponse.json({ success: true, project: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "\u062d\u062f\u062b \u062e\u0637\u0623 \u062f\u0627\u062e\u0644\u064a. \u062d\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649 \u0644\u0627\u062d\u0642\u064b\u0627." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();

  if (auth.error) {
    return auth.error;
  }

  const csrfErr = await csrfGuard(request);
  if (csrfErr) return csrfErr;

  const writeLimit = RATE_LIMITS.adminWrite.user;

  const writeCheck = await checkRateLimit({
    key: `admin:write:user:${auth.session.userId}`,
    limit: writeLimit.limit,
    windowSeconds: writeLimit.windowSeconds,
  });

  if (!writeCheck.allowed) {
    return rateLimitExceededResponse(writeCheck);
  }

  try {
    const { id } = await params;
    const isNumeric = !isNaN(Number(id));

    if (isNumeric) {
      await db.delete(projects).where(eq(projects.id, Number(id)));
    } else {
      await db.delete(projects).where(eq(projects.projectId, id));
    }

    return NextResponse.json({ success: true, message: "Project deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "\u062d\u062f\u062b \u062e\u0637\u0623 \u062f\u0627\u062e\u0644\u064a. \u062d\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649 \u0644\u0627\u062d\u0642\u064b\u0627." }, { status: 500 });
  }
}
