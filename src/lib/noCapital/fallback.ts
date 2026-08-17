// Helpers to detect missing database tables (PostgreSQL error 42P01) so the
// public API routes can fail-open with code defaults while the migration has
// not been applied to the database yet.

export function isMissingTableError(error: unknown): boolean {
  if (!error) return false;
  const code = (error as { code?: unknown })?.code;
  const message = error instanceof Error ? error.message : String(error);
  return code === "42P01" || /does not exist|relation .* does not exist/i.test(message);
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

// Serialize a database row for JSON responses (Date -> ISO string).
export function serializeRow<T extends Record<string, unknown>>(row: T): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    if (value instanceof Date) {
      out[key] = value.toISOString();
    } else if (Array.isArray(value) || typeof value === "object") {
      out[key] = value;
    } else {
      out[key] = value;
    }
  }
  return out;
}

export function serializeRows<T extends Record<string, unknown>>(rows: T[]): Record<string, unknown>[] {
  return rows.map(serializeRow);
}
