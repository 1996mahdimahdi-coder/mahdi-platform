import { NextResponse } from "next/server";
import { desc, eq, type SQL } from "drizzle-orm";
import { db } from "@/db";
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
import { isMissingTableError, serializeRows, serializeRow } from "@/lib/noCapital/fallback";

// ============================================================================
// Generic admin CRUD factory for the NABDA growth resources (categories,
// no-capital questions/projects, consent, courses, hooks, videos, content).
//
// Every route produced here follows the same security contract as
// src/app/api/admin/sources: admin session guard, admin-write rate limit,
// private no-store headers, validation, and a clear "table not provisioned"
// response (409) when the migration has not been applied yet.
// ============================================================================

const MISSING_TABLE_MESSAGE =
  "جدول قاعدة البيانات لهذه الوحدة لم يُفعَّل بعد. يتم عرض بيانات افتراضية في الواجهة العمومية حالياً.";

export async function requireAdmin() {
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
  return Number.isInteger(id) && id > 0 ? id : null;
}

type AdminConfig = {
  table: any;
  tableName: string; // Arabic name used in error messages
  itemName: string; // singular Arabic item name, e.g. "المقال"
  orderBy?: (table: any) => SQL;
  validate?: (body: Record<string, unknown>) => string | null;
  create?: (body: Record<string, unknown>) => Record<string, unknown>;
  update?: (body: Record<string, unknown>) => Record<string, unknown>;
};

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
  console.error(`Admin ${context} error:`, error);
  return NextResponse.json(
    { success: false, error: "حدث خطأ داخلي. حاول مرة أخرى لاحقًا." },
    { status: 500, headers: PRIVATE_NO_STORE_HEADERS }
  );
}

function isUniqueViolation(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && (error as { code: string }).code === "23505";
}

export function createAdminRoutes(config: AdminConfig) {
  const { table, tableName, itemName } = config;
  const orderBy = config.orderBy ?? ((t: any) => desc(t.id));

  async function list() {
    const auth = await requireAdmin();
    if (auth.response) return auth.response;

    try {
      const rows = await db.select().from(table).orderBy(orderBy(table));
      const items = serializeRows(rows);
      return NextResponse.json({ success: true, count: items.length, items }, { headers: PRIVATE_NO_STORE_HEADERS });
    } catch (error) {
      if (isMissingTableError(error)) return missingTable();
      return internalError(`${tableName} list`, error);
    }
  }

  async function create(request: Request) {
    const auth = await requireAdmin();
    if (auth.response) return auth.response;

    const writeLimit = RATE_LIMITS.adminWrite.user;
    const writeCheck = await checkRateLimit({
      key: `admin:write:user:${auth.session.userId}`,
      limit: writeLimit.limit,
      windowSeconds: writeLimit.windowSeconds,
    });
    if (!writeCheck.allowed) return rateLimitExceededResponse(writeCheck);

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return badRequest(`بيانات ${itemName} غير صالحة.`);
    }

    const record = (body ?? {}) as Record<string, unknown>;
    if (config.validate) {
      const error = config.validate(record);
      if (error) return badRequest(error);
    }
    if (!config.create) {
      return badRequest(`إنشاء ${itemName} غير مدعوم.`);
    }

    try {
      const values = config.create(record);
      const [created] = (await db.insert(table).values(values).returning()) as any[];
      if (!created) return internalError(`${tableName} create`, new Error("no row returned"));
      return NextResponse.json(
        { success: true, item: serializeRow(created) },
        { headers: PRIVATE_NO_STORE_HEADERS }
      );
    } catch (error) {
      if (isMissingTableError(error)) return missingTable();
      if (isUniqueViolation(error)) {
        return NextResponse.json(
          { success: false, error: `يوجد ${itemName} بنفس القيمة مسبقاً. اختر قيمة مختلفة.` },
          { status: 409, headers: PRIVATE_NO_STORE_HEADERS }
        );
      }
      return internalError(`${tableName} create`, error);
    }
  }

  async function getById(request: Request, context: { params: Promise<{ id: string }> }) {
    const auth = await requireAdmin();
    if (auth.response) return auth.response;

    try {
      const { id: rawId } = await context.params;
      const id = parseId(rawId);
      if (id == null) return badRequest(`معرف ${itemName} غير صحيح`);

      const [row] = await db.select().from(table).where(eq(table.id, id)).limit(1);
      if (!row) return notFound(`${itemName} غير موجود`);

      return NextResponse.json({ success: true, item: serializeRow(row) }, { headers: PRIVATE_NO_STORE_HEADERS });
    } catch (error) {
      if (isMissingTableError(error)) return missingTable();
      return internalError(`${tableName} get`, error);
    }
  }

  async function update(request: Request, context: { params: Promise<{ id: string }> }) {
    const auth = await requireAdmin();
    if (auth.response) return auth.response;

    const writeLimit = RATE_LIMITS.adminWrite.user;
    const writeCheck = await checkRateLimit({
      key: `admin:write:user:${auth.session.userId}`,
      limit: writeLimit.limit,
      windowSeconds: writeLimit.windowSeconds,
    });
    if (!writeCheck.allowed) return rateLimitExceededResponse(writeCheck);

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return badRequest(`بيانات ${itemName} غير صالحة.`);
    }

    const record = (body ?? {}) as Record<string, unknown>;
    if (config.validate) {
      const error = config.validate(record);
      if (error) return badRequest(error);
    }
    if (!config.update) {
      return badRequest(`تعديل ${itemName} غير مدعوم.`);
    }

    try {
      const { id: rawId } = await context.params;
      const id = parseId(rawId);
      if (id == null) return badRequest(`معرف ${itemName} غير صحيح`);

      const setValues = config.update(record);
      const [updated] = await db
        .update(table)
        .set(setValues)
        .where(eq(table.id, id))
        .returning();

      if (!updated) return notFound(`${itemName} غير موجود`);

      return NextResponse.json({ success: true, item: serializeRow(updated) }, { headers: PRIVATE_NO_STORE_HEADERS });
    } catch (error) {
      if (isMissingTableError(error)) return missingTable();
      if (isUniqueViolation(error)) {
        return NextResponse.json(
          { success: false, error: `يوجد ${itemName} بنفس القيمة مسبقاً. اختر قيمة مختلفة.` },
          { status: 409, headers: PRIVATE_NO_STORE_HEADERS }
        );
      }
      return internalError(`${tableName} update`, error);
    }
  }

  async function remove(request: Request, context: { params: Promise<{ id: string }> }) {
    const auth = await requireAdmin();
    if (auth.response) return auth.response;

    const writeLimit = RATE_LIMITS.adminWrite.user;
    const writeCheck = await checkRateLimit({
      key: `admin:write:user:${auth.session.userId}`,
      limit: writeLimit.limit,
      windowSeconds: writeLimit.windowSeconds,
    });
    if (!writeCheck.allowed) return rateLimitExceededResponse(writeCheck);

    try {
      const { id: rawId } = await context.params;
      const id = parseId(rawId);
      if (id == null) return badRequest(`معرف ${itemName} غير صحيح`);

      const [existing] = await db.select({ id: table.id }).from(table).where(eq(table.id, id)).limit(1);
      if (!existing) return notFound(`${itemName} غير موجود`);

      await db.delete(table).where(eq(table.id, id));

      return NextResponse.json(
        { success: true, message: `تم حذف ${itemName} بنجاح.` },
        { headers: PRIVATE_NO_STORE_HEADERS }
      );
    } catch (error) {
      if (isMissingTableError(error)) return missingTable();
      if (isUniqueViolation(error)) {
        return NextResponse.json(
          { success: false, error: `لا يمكن حذف هذا ${itemName} لأنه مرتبط ببيانات أخرى.` },
          { status: 409, headers: PRIVATE_NO_STORE_HEADERS }
        );
      }
      return internalError(`${tableName} delete`, error);
    }
  }

  return { list, create, getById, update, remove };
}
