// ============================================================================
// Admin API — single capital-project paid study (detail / save / delete).
//
// Mirrors the no-capital studies admin contract:
//   * GET  → study row; if none exists yet, a fresh draft is pre-built from the
//            project's legacy advisory columns (via buildCapitalPaidStudyDraft)
//            so the admin starts from known data instead of an empty sheet.
//   * POST/PUT → validate against validateStudy and persist (draft/review/
//            approved flow). A study is never auto-approved.
//   * DELETE → study is set back to NULL (legacy columns are untouched).
// ============================================================================

import { NextResponse } from "next/server";
import { eq, or } from "drizzle-orm";
import { db } from "@/db";
import { projects } from "@/db/schema";
import {
  forbiddenResponse,
  getSession,
  PRIVATE_NO_STORE_HEADERS,
  unauthorizedResponse,
} from "@/lib/auth";
import {
  checkRateLimit,
  RATE_LIMITS,
  rateLimitExceededResponse,
} from "@/lib/rateLimit";
import { csrfGuard } from "@/lib/csrf";
import { validateStudy, emptyPaidStudyDraft } from "@/lib/noCapital/studyValidation";
import type { PaidStudy } from "@/lib/noCapital/types";
import { buildCapitalPaidStudyDraft, type LegacyProjectStudySource } from "@/lib/noCapital/capitalStudyBackfill";

export const dynamic = "force-dynamic";

export async function requireStudyAdmin() {
  const session = await getSession();

  if (!session) {
    return { session: null, response: unauthorizedResponse() };
  }

  if (session.role !== "admin") {
    return { session: null, response: forbiddenResponse() };
  }

  return { session, response: null };
}

function badRequest(message: string) {
  return NextResponse.json({ success: false, error: message }, { status: 400, headers: PRIVATE_NO_STORE_HEADERS });
}

function notFound(message: string) {
  return NextResponse.json({ success: false, error: message }, { status: 404, headers: PRIVATE_NO_STORE_HEADERS });
}

function internalError(context: string, error: unknown) {
  console.error(`CapitalStudy [projectId] ${context} error:`, error);
  return NextResponse.json(
    { success: false, error: "حدث خطأ داخلي. حاول مرة أخرى لاحقاً." },
    { status: 500, headers: PRIVATE_NO_STORE_HEADERS }
  );
}

function toStudy(raw: unknown): PaidStudy {
  const draft = emptyPaidStudyDraft();
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return draft;
  return { ...draft, ...(raw as Record<string, unknown>) } as PaidStudy;
}

function legacySource(row: Record<string, unknown>): LegacyProjectStudySource {
  return {
    projectId: String(row.projectId ?? ""),
    projectName: String(row.projectName ?? ""),
    description: String(row.description ?? ""),
    minCapital: Number(row.minCapital) || 0,
    recommendedCapital: Number(row.recommendedCapital) || 0,
    maxCapital: Number(row.maxCapital) || 0,
    skillsRequired: Array.isArray(row.skillsRequired) ? (row.skillsRequired as string[]) : [],
    equipment: Array.isArray(row.equipment)
      ? (row.equipment as { item: string; cost: number }[]).filter((e) => e && typeof e === "object")
      : [],
    pricingMethod: row.pricingMethod ? String(row.pricingMethod) : null,
    profitFormula: row.profitFormula ? String(row.profitFormula) : null,
    breakEvenFormula: row.breakEvenFormula ? String(row.breakEvenFormula) : null,
    risks: Array.isArray(row.risks) ? (row.risks as string[]) : [],
    advantages: Array.isArray(row.advantages) ? (row.advantages as string[]) : [],
    disadvantages: Array.isArray(row.disadvantages) ? (row.disadvantages as string[]) : [],
    launchPlan: Array.isArray(row.launchPlan)
      ? (row.launchPlan as { week: string; title: string; tasks: string[] }[])
      : [],
    legalNotes: row.legalNotes ? String(row.legalNotes) : null,
    competitionLevel: row.competitionLevel ? String(row.competitionLevel) : null,
    targetArea: row.targetArea ? String(row.targetArea) : null,
    source: row.source ? String(row.source) : null,
  };
}

async function loadProject(param: string) {
  const numeric = Number(param);
  const isNumeric = Number.isInteger(numeric) && numeric > 0;

  const cond = isNumeric
    ? or(eq(projects.id, numeric), eq(projects.projectId, param))
    : eq(projects.projectId, param);

  return db.select().from(projects).where(cond).limit(1);
}

// GET /api/admin/projects/studies/[projectId]
export async function GET(request: Request, context: { params: Promise<{ projectId: string }> }) {
  const auth = await requireStudyAdmin();
  if (auth.response) return auth.response;

  try {
    const { projectId } = await context.params;
    if (!projectId) return badRequest("معرف المشروع غير صحيح.");

    const rows = await loadProject(projectId);
    const project = rows[0];
    if (!project) return notFound("المشروع غير موجود.");

    const study = project.study ?? buildCapitalPaidStudyDraft(legacySource(project));

    return NextResponse.json(
      {
        success: true,
        projectId: project.projectId,
        projectName: project.projectName,
        category: project.category,
        study,
      },
      { headers: PRIVATE_NO_STORE_HEADERS }
    );
  } catch (error) {
    return internalError("get", error);
  }
}

// POST /api/admin/projects/studies/[projectId] — create/refresh the draft.
export async function POST(request: Request, context: { params: Promise<{ projectId: string }> }) {
  const auth = await requireStudyAdmin();
  if (auth.response) return auth.response;

  const csrfErr = await csrfGuard(request);
  if (csrfErr) return csrfErr;

  const writeLimit = RATE_LIMITS.adminWrite.user;
  const writeCheck = await checkRateLimit({
    key: `admin:write:user:${auth.session.userId}`,
    limit: writeLimit.limit,
    windowSeconds: writeLimit.windowSeconds,
  });
  if (!writeCheck.allowed) return rateLimitExceededResponse(writeCheck);

  const { projectId } = await context.params;
  if (!projectId) return badRequest("معرف المشروع غير صحيح.");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("بيانات الدراسة غير صالحة.");
  }

  const study = toStudy(body);
  const errors = validateStudy(study);
  if (errors.length > 0) {
    return badRequest(errors.join(" | "));
  }

  try {
    const rows = await loadProject(projectId);
    if (!rows[0]) return notFound("المشروع غير موجود.");

    const [updated] = (await db
      .update(projects)
      .set({ study, lastUpdated: new Date() })
      .where(eq(projects.projectId, rows[0].projectId))
      .returning()) as any[];

    return NextResponse.json(
      { success: true, projectId: rows[0].projectId, study: updated ? updated.study : study },
      { headers: PRIVATE_NO_STORE_HEADERS }
    );
  } catch (error) {
    return internalError("post", error);
  }
}

// PUT /api/admin/projects/studies/[projectId] — save the study as-is.
export async function PUT(request: Request, context: { params: Promise<{ projectId: string }> }) {
  const auth = await requireStudyAdmin();
  if (auth.response) return auth.response;

  const csrfErr = await csrfGuard(request);
  if (csrfErr) return csrfErr;

  const writeLimit = RATE_LIMITS.adminWrite.user;
  const writeCheck = await checkRateLimit({
    key: `admin:write:user:${auth.session.userId}`,
    limit: writeLimit.limit,
    windowSeconds: writeLimit.windowSeconds,
  });
  if (!writeCheck.allowed) return rateLimitExceededResponse(writeCheck);

  const { projectId } = await context.params;
  if (!projectId) return badRequest("معرف المشروع غير صحيح.");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("بيانات الدراسة غير صالحة.");
  }

  const study = toStudy(body);
  const errors = validateStudy(study);
  if (errors.length > 0) {
    return badRequest(errors.join(" | "));
  }

  try {
    const rows = await loadProject(projectId);
    if (!rows[0]) return notFound("المشروع غير موجود.");

    const [updated] = (await db
      .update(projects)
      .set({ study, lastUpdated: new Date() })
      .where(eq(projects.projectId, rows[0].projectId))
      .returning()) as any[];

    return NextResponse.json(
      { success: true, projectId: rows[0].projectId, study: updated ? updated.study : study },
      { headers: PRIVATE_NO_STORE_HEADERS }
    );
  } catch (error) {
    return internalError("put", error);
  }
}

// DELETE /api/admin/projects/studies/[projectId] — clear the study (legacy stays).
export async function DELETE(request: Request, context: { params: Promise<{ projectId: string }> }) {
  const auth = await requireStudyAdmin();
  if (auth.response) return auth.response;

  const csrfErr = await csrfGuard(request);
  if (csrfErr) return csrfErr;

  const writeLimit = RATE_LIMITS.adminWrite.user;
  const writeCheck = await checkRateLimit({
    key: `admin:write:user:${auth.session.userId}`,
    limit: writeLimit.limit,
    windowSeconds: writeLimit.windowSeconds,
  });
  if (!writeCheck.allowed) return rateLimitExceededResponse(writeCheck);

  const { projectId } = await context.params;
  if (!projectId) return badRequest("معرف المشروع غير صحيح.");

  try {
    const rows = await loadProject(projectId);
    if (!rows[0]) return notFound("المشروع غير موجود.");

    await db
      .update(projects)
      .set({ study: null, lastUpdated: new Date() })
      .where(eq(projects.projectId, rows[0].projectId));

    return NextResponse.json(
      { success: true, message: "تم حذف الدراسة." },
      { headers: PRIVATE_NO_STORE_HEADERS }
    );
  } catch (error) {
    return internalError("delete", error);
  }
}