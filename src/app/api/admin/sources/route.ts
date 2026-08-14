import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { dataSources } from "@/db/schema";
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

export async function GET() {
  const auth = await requireAdmin();

  if (auth.response) {
    return auth.response;
  }

  try {
    const rows = await db
      .select()
      .from(dataSources)
      .orderBy(desc(dataSources.createdAt));

    const sources = rows.map((row) => ({
      ...row,
      accessedAt: row.accessedAt ? row.accessedAt.toISOString() : null,
      lastVerifiedAt: row.lastVerifiedAt
        ? row.lastVerifiedAt.toISOString()
        : null,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    }));

    return NextResponse.json(
      {
        success: true,
        count: sources.length,
        sources,
      },
      { headers: PRIVATE_NO_STORE_HEADERS }
    );
  } catch (error) {
    console.error("Admin sources GET error:", error);

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

export async function POST(request: Request) {
  const auth = await requireAdmin();

  if (auth.response) {
    return auth.response;
  }

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
    const value = validation.value;

    const [created] = await db
      .insert(dataSources)
      .values({
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
      })
      .returning();

    const source = {
      ...created,
      accessedAt: created.accessedAt ? created.accessedAt.toISOString() : null,
      lastVerifiedAt: created.lastVerifiedAt
        ? created.lastVerifiedAt.toISOString()
        : null,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    };

    return NextResponse.json(
      { success: true, source },
      { headers: PRIVATE_NO_STORE_HEADERS }
    );
  } catch (error) {
    console.error("Admin sources POST error:", error);

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
