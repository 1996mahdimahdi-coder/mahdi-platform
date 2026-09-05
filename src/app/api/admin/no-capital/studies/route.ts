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
import { isMissingTableError, serializeRow } from "@/lib/noCapital/fallback";
import { csrfGuard } from "@/lib/csrf";
import { validateStudy, emptyPaidStudyDraft } from "@/lib/noCapital/studyValidation";
import type { PaidStudy } from "@/lib/noCapital/types";

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
  console.error(`PaidStudy ${context} error:`, error);
  return NextResponse.json(
    { success: false, error: "حدث خطأ داخلي. حاول مرة أخرى لاحقًا." },
    { status: 500, headers: PRIVATE_NO_STORE_HEADERS }
  );
}

function parseId(raw: string): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function toStudy(raw: unknown): PaidStudy {
  // Merge incoming object over the empty draft so partial saves stay valid.
  // Structural validation runs before this merge is persisted.
  const draft = emptyPaidStudyDraft();
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return draft;
  return { ...draft, ...(raw as Record<string, unknown>) } as PaidStudy;
}

// GET /api/admin/no-capital/studies
// Lists projects that can carry a study (active projects, with their study status).
export async function GET() {
  const auth = await requireStudyAdmin();
  if (auth.response) return auth.response;

  try {
    const rows = await db
      .select({
        id: noCapitalProjects.id,
        slug: noCapitalProjects.slug,
        nameAr: noCapitalProjects.nameAr,
        nameFr: noCapitalProjects.nameFr,
        active: noCapitalProjects.active,
        study: noCapitalProjects.study,
      })
      .from(noCapitalProjects)
      .orderBy(noCapitalProjects.id);

    const items = rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      nameAr: row.nameAr,
      nameFr: row.nameFr,
      active: row.active,
      hasStudy: row.study != null,
      studyStatus: row.study?.status ?? null,
    }));

    return NextResponse.json({ success: true, count: items.length, items }, { headers: PRIVATE_NO_STORE_HEADERS });
  } catch (error) {
    if (isMissingTableError(error)) return missingTable();
    return internalError("list", error);
  }
}