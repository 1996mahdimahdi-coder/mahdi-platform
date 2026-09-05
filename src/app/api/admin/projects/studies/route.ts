// ============================================================================
// Admin API — paid studies for classic capital projects.
//
// These studies live in `projects.study` (jsonb) and are ADMIN-ONLY:
//   * never served by the public APIs (they are stripped by
//     src/lib/projectPublicSanitizer),
//   * only a "draft"/"review"/"approved" status badge is public, and only the
//     approved study is sellable (see src/lib/noCapital/studySales.ts).
// ============================================================================

import { NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import {
  forbiddenResponse,
  getSession,
  PRIVATE_NO_STORE_HEADERS,
  unauthorizedResponse,
} from "@/lib/auth";

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

function internalError(context: string, error: unknown) {
  console.error(`CapitalStudies ${context} error:`, error);
  return NextResponse.json(
    { success: false, error: "حدث خطأ داخلي. حاول مرة أخرى لاحقاً." },
    { status: 500, headers: PRIVATE_NO_STORE_HEADERS }
  );
}

// GET /api/admin/projects/studies — list of capital projects + study status.
export async function GET() {
  const auth = await requireStudyAdmin();
  if (auth.response) return auth.response;

  try {
    const rows = await db
      .select({
        id: projects.id,
        projectId: projects.projectId,
        projectName: projects.projectName,
        category: projects.category,
        study: projects.study,
      })
      .from(projects)
      .orderBy(projects.id);

    const items = rows.map((row) => ({
      id: row.id,
      projectId: row.projectId,
      projectName: row.projectName,
      category: row.category,
      hasStudy: row.study != null,
      studyStatus: row.study?.status ?? null,
    }));

    return NextResponse.json({ success: true, count: items.length, items }, { headers: PRIVATE_NO_STORE_HEADERS });
  } catch (error) {
    return internalError("list", error);
  }
}