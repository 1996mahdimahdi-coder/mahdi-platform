import { NextResponse } from "next/server";
import { eq, or } from "drizzle-orm";
import { db } from "@/db";
import { dataSources, communeStats, wilayaStats } from "@/db/schema";
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
import { validateSource } from "@/lib/sourceValidation";
import { csrfGuard } from "@/lib/csrf";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const session = await getSession();

  if (!session) {
    return { session: null, response: unauthorizedResponse() };
  }

  if (session.role !== "admin") {
    return { session: null, response: forbiddenResponse() };
  }

  return { session, response: null };
}

function parseId(raw: string): number | null {
  const id = Number(raw);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();

  if (auth.response) {
    return auth.response;
  }

  try {
    const { id: rawId } = await context.params;
    const id = parseId(rawId);

    if (id == null) {
      return NextResponse.json(
        { success: false, error: "معرف المصدر غير صحيح" },
        { status: 400, headers: PRIVATE_NO_STORE_HEADERS }
      );
    }

    const [source] = await db
      .select()
      .from(dataSources)
      .where(eq(dataSources.id, id))
      .limit(1);

    if (!source) {
      return NextResponse.json(
        { success: false, error: "المصدر غير موجود" },
        { status: 404, headers: PRIVATE_NO_STORE_HEADERS }
      );
    }

    return NextResponse.json(
      {
        success: true,
        source: {
          ...source,
          accessedAt: source.accessedAt ? source.accessedAt.toISOString() : null,
          lastVerifiedAt: source.lastVerifiedAt
            ? source.lastVerifiedAt.toISOString()
            : null,
          createdAt: source.createdAt.toISOString(),
          updatedAt: source.updatedAt.toISOString(),
        },
      },
      { headers: PRIVATE_NO_STORE_HEADERS }
    );
  } catch (error) {
    console.error("Admin source GET error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          "حدث خطأ داخلي. حاول مرة أخرى لاحقًا.",
      },
      { status: 500, headers: PRIVATE_NO_STORE_HEADERS }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();

  if (auth.response) {
    return auth.response;
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

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "بيانات المصدر غير صالحة.",
      },
      { status: 400, headers: PRIVATE_NO_STORE_HEADERS }
    );
  }

  const validation = validateSource(
    body as Record<string, unknown> | null | undefined
  );

  if (!validation.ok) {
    return NextResponse.json(
      {
        success: false,
        error: "تعذر حفظ المصدر بسبب أخطاء في البيانات.",
        validation: validation.errors,
      },
      { status: 400, headers: PRIVATE_NO_STORE_HEADERS }
    );
  }

  try {
    const { id: rawId } = await context.params;
    const id = parseId(rawId);

    if (id == null) {
      return NextResponse.json(
        { success: false, error: "معرف المصدر غير صحيح" },
        { status: 400, headers: PRIVATE_NO_STORE_HEADERS }
      );
    }

    const value = validation.value;

    const [updated] = await db
      .update(dataSources)
      .set({
        name: value.name as string,
        institution: value.institution as string,
        sourceType: value.sourceType as string,
        url: value.url as string,
        category: value.category as string,
        confidenceGrade: value.confidenceGrade as string,
        documentTitle: value.documentTitle as string,
        documentYear: value.documentYear as number,
        documentType: value.documentType as string,
        accessedAt: value.accessedAt
          ? new Date(value.accessedAt as string)
          : null,
        published: (value.published as boolean | undefined) ?? false,
        notes: (value.notes as string | undefined) ?? null,
        lastVerifiedAt: value.lastVerifiedAt
          ? new Date(value.lastVerifiedAt as string)
          : null,
        updatedAt: new Date(),
      })
      .where(eq(dataSources.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "المصدر غير موجود" },
        { status: 404, headers: PRIVATE_NO_STORE_HEADERS }
      );
    }

    return NextResponse.json(
      {
        success: true,
        source: {
          ...updated,
          accessedAt: updated.accessedAt ? updated.accessedAt.toISOString() : null,
          lastVerifiedAt: updated.lastVerifiedAt
            ? updated.lastVerifiedAt.toISOString()
            : null,
          createdAt: updated.createdAt.toISOString(),
          updatedAt: updated.updatedAt.toISOString(),
        },
      },
      { headers: PRIVATE_NO_STORE_HEADERS }
    );
  } catch (error) {
    console.error("Admin source PUT error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          "حدث خطأ داخلي. حاول مرة أخرى لاحقًا.",
      },
      { status: 500, headers: PRIVATE_NO_STORE_HEADERS }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();

  if (auth.response) {
    return auth.response;
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
    const { id: rawId } = await context.params;
    const id = parseId(rawId);

    if (id == null) {
      return NextResponse.json(
        { success: false, error: "معرف المصدر غير صحيح" },
        { status: 400, headers: PRIVATE_NO_STORE_HEADERS }
      );
    }

    const [existing] = await db
      .select({ id: dataSources.id })
      .from(dataSources)
      .where(eq(dataSources.id, id))
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "المصدر غير موجود" },
        { status: 404, headers: PRIVATE_NO_STORE_HEADERS }
      );
    }

    const links = await Promise.all([
      db
        .select({ id: communeStats.id })
        .from(communeStats)
        .where(
          or(
            eq(communeStats.populationSourceId, id),
            eq(communeStats.areaSourceId, id)
          )
        )
        .limit(1),
      db
        .select({ id: wilayaStats.id })
        .from(wilayaStats)
        .where(
          or(
            eq(wilayaStats.populationSourceId, id),
            eq(wilayaStats.areaSourceId, id)
          )
        )
        .limit(1),
    ]);

    const isLinked = links.some((rows) => rows.length > 0);

    if (isLinked) {
      return NextResponse.json(
        {
          success: false,
          error:
            "لا يمكن حذف هذا المصدر لأنه مرتبط ببيانات إحصائية (سكان أو مساحة) في قاعدة البيانات. قم بإلغاء الربط أولًا.",
        },
        { status: 409, headers: PRIVATE_NO_STORE_HEADERS }
      );
    }

    await db.delete(dataSources).where(eq(dataSources.id, id));

    return NextResponse.json(
      {
        success: true,
        message: "تم حذف المصدر بنجاح.",
      },
      { headers: PRIVATE_NO_STORE_HEADERS }
    );
  } catch (error) {
    console.error("Admin source DELETE error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          "حدث خطأ داخلي. حاول مرة أخرى لاحقًا.",
      },
      { status: 500, headers: PRIVATE_NO_STORE_HEADERS }
    );
  }
}
