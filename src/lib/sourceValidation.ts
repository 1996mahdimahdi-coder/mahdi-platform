// Validation layer for data_sources (Phase 2 - Transparency & Credibility).
// Enforced on every admin create/update so an incomplete source can never
// enter the registry.

export const ALLOWED_CONFIDENCE_GRADES = ["A", "B", "C", "D", "U"] as const;
export type ConfidenceGrade = (typeof ALLOWED_CONFIDENCE_GRADES)[number];

export const ALLOWED_DOCUMENT_TYPES = [
  "census",
  "report",
  "law",
  "decree",
  "dataset",
  "portal",
  "other",
] as const;
export type DocumentType = (typeof ALLOWED_DOCUMENT_TYPES)[number];

export const ALLOWED_SOURCE_TYPES = [
  "official",
  "institutional",
  "secondary",
  "estimated",
] as const;
export type SourceType = (typeof ALLOWED_SOURCE_TYPES)[number];

export const ALLOWED_CATEGORIES = [
  "population",
  "area",
  "economy",
  "market",
  "transport",
  "projects",
  "legal",
  "other",
] as const;
export type SourceCategory = (typeof ALLOWED_CATEGORIES)[number];

export const MIN_DOCUMENT_YEAR = 1950;

export type SourceInput = {
  name?: unknown;
  institution?: unknown;
  sourceType?: unknown;
  url?: unknown;
  category?: unknown;
  confidenceGrade?: unknown;
  documentTitle?: unknown;
  documentYear?: unknown;
  documentType?: unknown;
  accessedAt?: unknown;
  published?: unknown;
  notes?: unknown;
  lastVerifiedAt?: unknown;
};

export type SourceValidationResult =
  | { ok: true; value: SourceInput }
  | { ok: false; errors: string[] };

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidUrl(value: unknown): boolean {
  if (typeof value !== "string" || !value.trim()) return false;

  try {
    const parsed = new URL(value.trim());

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }

    return parsed.hostname.includes(".");
  } catch {
    return false;
  }
}

export function validateSource(
  input: Record<string, unknown> | null | undefined
): SourceValidationResult {
  const errors: string[] = [];

  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, errors: ["بيانات المصدر غير صالحة."] };
  }

  if (!isNonEmptyString(input.name)) {
    errors.push("اسم المصدر (name) مطلوب.");
  }

  if (!isNonEmptyString(input.institution)) {
    errors.push("المؤسسة (institution) مطلوبة.");
  }

  if (!isValidUrl(input.url)) {
    errors.push("رابط المصدر (url) غير صالح — يجب أن يكون http(s) صالحًا.");
  }

  if (
    typeof input.sourceType !== "string" ||
    !(ALLOWED_SOURCE_TYPES as readonly string[]).includes(input.sourceType)
  ) {
    errors.push(
      `نوع المصدر (source_type) يجب أن يكون أحد: ${ALLOWED_SOURCE_TYPES.join(", ")}.`
    );
  }

  if (
    typeof input.category !== "string" ||
    !(ALLOWED_CATEGORIES as readonly string[]).includes(input.category)
  ) {
    errors.push(
      `الفئة (category) يجب أن تكون أحد: ${ALLOWED_CATEGORIES.join(", ")}.`
    );
  }

  if (
    typeof input.confidenceGrade !== "string" ||
    !(ALLOWED_CONFIDENCE_GRADES as readonly string[]).includes(
      input.confidenceGrade
    )
  ) {
    errors.push(
      `درجة الثقة (confidence_grade) يجب أن تكون أحد: ${ALLOWED_CONFIDENCE_GRADES.join(", ")}.`
    );
  }

  if (!isNonEmptyString(input.documentTitle)) {
    errors.push("عنوان الوثيقة (document_title) مطلوب.");
  }

  const currentYear = new Date().getFullYear();

  if (
    !Number.isInteger(input.documentYear) ||
    (input.documentYear as number) < MIN_DOCUMENT_YEAR ||
    (input.documentYear as number) > currentYear
  ) {
    errors.push(
      `سنة الوثيقة (document_year) يجب أن تكون عددًا صحيحًا بين ${MIN_DOCUMENT_YEAR} و ${currentYear}.`
    );
  }

  if (
    typeof input.documentType !== "string" ||
    !(ALLOWED_DOCUMENT_TYPES as readonly string[]).includes(input.documentType)
  ) {
    errors.push(
      `نوع الوثيقة (document_type) يجب أن يكون أحد: ${ALLOWED_DOCUMENT_TYPES.join(", ")}.`
    );
  }

  if (
    input.published !== undefined &&
    typeof input.published !== "boolean"
  ) {
    errors.push("قيمة النشر (published) يجب أن تكون صحيحة أو خاطئة.");
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const value: SourceInput = {
    name: (input.name as string).trim(),
    institution: (input.institution as string).trim(),
    sourceType: input.sourceType as string,
    url: (input.url as string).trim(),
    category: input.category as string,
    confidenceGrade: input.confidenceGrade as string,
    documentTitle: (input.documentTitle as string).trim(),
    documentYear: input.documentYear as number,
    documentType: input.documentType as string,
  };

  if (typeof input.notes === "string" && input.notes.trim()) {
    value.notes = input.notes.trim();
  }

  if (typeof input.accessedAt === "string" && input.accessedAt.trim()) {
    value.accessedAt = input.accessedAt;
  }

  if (typeof input.lastVerifiedAt === "string" && input.lastVerifiedAt.trim()) {
    value.lastVerifiedAt = input.lastVerifiedAt;
  }

  if (typeof input.published === "boolean") {
    value.published = input.published;
  }

  return { ok: true, value };
}
