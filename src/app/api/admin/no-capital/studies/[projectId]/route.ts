import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { noCapitalProjects } from "@/db/schema";
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
import { isMissingTableError } from "@/lib/noCapital/fallback";
import { csrfGuard } from "@/lib/csrf";
import { validateStudy, emptyPaidStudyDraft } from "@/lib/noCapital/studyValidation";

export const dynamic = "force-dynamic";

const MISSING_TABLE_MESSAGE =
  "جدول قاعدة البيانات لهذه الوحدة لم يُفعَّل بعد. يتم عرض بيانات افتراضية في الواجهة العمومية حالياً.";

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

function missingTable() {
  return NextResponse.json({ success: false, error: MISSING_TABLE_MESSAGE }, { status: 409, headers: PRIVATE_NO_STORE_HEADERS });
}

function internalError(context: string, error: unknown) {
  console.error(`PaidStudy [projectId] ${context} error:`, error);
  return NextResponse.json(
    { success: false, error: "حدث خطأ داخلي. حاول مرة أخرى لاحقًا." },
    { status: 500, headers: PRIVATE_NO_STORE_HEADERS }
  );
}

function parseId(raw: string): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function toStudy(raw: unknown) {
  const draft = emptyPaidStudyDraft();
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return draft;
  return { ...draft, ...(raw as Record<string, unknown>) };
}

async function loadProject(id: number) {
  return db
    .select({ id: noCapitalProjects.id, slug: noCapitalProjects.slug, nameAr: noCapitalProjects.nameAr })
    .from(noCapitalProjects)
    .where(eq(noCapitalProjects.id, id))
    .limit(1);
}

// GET /api/admin/no-capital/studies/[projectId]
export async function GET(request: Request, context: { params: Promise<{ projectId: string }> }) {
  const auth = await requireStudyAdmin();
  if (auth.response) return auth.response;

  try {
    const id = parseId((await context.params).projectId);
    if (id == null) return badRequest("معرف المشروع غير صحيح.");

    const rows = await loadProject(id);
    const project = rows[0];
    if (!project) return notFound("المشروع غير موجود.");

    const studyRow = await db
      .select({ study: noCapitalProjects.study })
      .from(noCapitalProjects)
      .where(eq(noCapitalProjects.id, id))
      .limit(1);

    const study = studyRow[0]?.study ?? emptyPaidStudyDraft();

    return NextResponse.json(
      { success: true, projectId: id, slug: project.slug, nameAr: project.nameAr, study },
      { headers: PRIVATE_NO_STORE_HEADERS }
    );
  } catch (error) {
    if (isMissingTableError(error)) return missingTable();
    return internalError("get", error);
  }
}

// POST /api/admin/no-capital/studies/[projectId]
// Creates a fresh draft study for a project (idempotent: merges over empty draft).
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

  const id = parseId((await context.params).projectId);
  if (id == null) return badRequest("معرف المشروع غير صحيح.");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("بيانات الدراسة غير صالحة.");
  }

  const errors = validateStudy(toStudy(body));
  if (errors.length > 0) {
    return badRequest(errors.join(" | "));
  }

  try {
    const rows = await loadProject(id);
    if (!rows[0]) return notFound("المشروع غير موجود.");

    const [updated] = (await db
      .update(noCapitalProjects)
      .set({ study: toStudy(body), lastUpdated: new Date() })
      .where(eq(noCapitalProjects.id, id))
      .returning()) as any[];

    return NextResponse.json(
      { success: true, projectId: id, study: updated ? updated.study : toStudy(body) },
      { headers: PRIVATE_NO_STORE_HEADERS }
    );
  } catch (error) {
    if (isMissingTableError(error)) return missingTable();
    return internalError("post", error);
  }
}

// PUT /api/admin/no-capital/studies/[projectId]
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

  const id = parseId((await context.params).projectId);
  if (id == null) return badRequest("معرف المشروع غير صحيح.");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("بيانات الدراسة غير صالحة.");
  }

  const errors = validateStudy(toStudy(body));
  if (errors.length > 0) {
    return badRequest(errors.join(" | "));
  }

  try {
    const rows = await loadProject(id);
    if (!rows[0]) return notFound("المشروع غير موجود.");

    const [updated] = (await db
      .update(noCapitalProjects)
      .set({ study: toStudy(body), lastUpdated: new Date() })
      .where(eq(noCapitalProjects.id, id))
      .returning()) as any[];

    return NextResponse.json(
      { success: true, projectId: id, study: updated ? updated.study : toStudy(body) },
      { headers: PRIVATE_NO_STORE_HEADERS }
    );
  } catch (error) {
    if (isMissingTableError(error)) return missingTable();
    return internalError("put", error);
  }
}

// DELETE /api/admin/no-capital/studies/[projectId]
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

  const id = parseId((await context.params).projectId);
  if (id == null) return badRequest("معرف المشروع غير صحيح.");

  try {
    const rows = await loadProject(id);
    if (!rows[0]) return notFound("المشروع غير موجود.");

    await db
      .update(noCapitalProjects)
      .set({ study: null, lastUpdated: new Date() })
      .where(eq(noCapitalProjects.id, id));

    return NextResponse.json(
      { success: true, message: "تم حذف الدراسة." },
      { headers: PRIVATE_NO_STORE_HEADERS }
    );
  } catch (error) {
    if (isMissingTableError(error)) return missingTable();
    return internalError("delete", error);
  }
}