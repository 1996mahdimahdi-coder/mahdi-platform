// Shared helpers for building sourced-stat breakdowns used by
// GET /api/communes/[id] and GET /api/wilayas/[id].
// READ-ONLY: never writes numbers, never invents data.

export const NO_VERIFIED_DATA_TEXT =
  "لا تتوفر حاليًا بيانات رسمية موثقة قابلة للتحقق.";

export type SourceRef = {
  id: number;
  name: string;
  institution: string;
  sourceType: string;
  category: string;
  confidenceGrade: string;
  documentTitle: string | null;
  documentYear: number | null;
  documentType: string | null;
  url: string | null;
  lastVerifiedAt: string | null;
};

export type DataType = "official" | "calculated" | "estimated" | "secondary";

export type StatDetail = {
  hasData: boolean;
  value: number | string | null;
  year: number | null;
  confidence: string | null;
  dataType: DataType | null;
  source: SourceRef | null;
  sourceUrl: string | null;
  lastVerifiedAt: string | null;
  note: string | null;
};

export type DensityDetail = {
  hasData: boolean;
  value: number | string | null;
  dataType: "calculated" | null;
  note: string | null;
};

function toNumber(value: number | string | null | undefined): number | null {
  if (value == null || value === "") return null;

  const num = Number(value);

  if (!Number.isFinite(num)) return null;

  return num;
}

export function toSourceRef(
  source:
    | {
        id: number;
        name: string;
        institution: string;
        sourceType: string;
        category: string;
        confidenceGrade: string;
        documentTitle: string | null;
        documentYear: number | null;
        documentType: string | null;
        url: string | null;
        lastVerifiedAt: Date | string | null;
      }
    | null
    | undefined
): SourceRef | null {
  if (!source) return null;

  return {
    id: source.id,
    name: source.name,
    institution: source.institution,
    sourceType: source.sourceType,
    category: source.category,
    confidenceGrade: source.confidenceGrade,
    documentTitle: source.documentTitle,
    documentYear: source.documentYear,
    documentType: source.documentType,
    url: source.url,
    lastVerifiedAt:
      source.lastVerifiedAt instanceof Date
        ? source.lastVerifiedAt.toISOString()
        : source.lastVerifiedAt,
  };
}

export function deriveDataType(
  source: SourceRef | null,
  confidence: string | null
): DataType | null {
  if (!source || !confidence || confidence === "U") return null;

  if (confidence === "D" || source.sourceType === "estimated") {
    return "estimated";
  }

  if (confidence === "C") {
    return "secondary";
  }

  return "official";
}

export function buildStatDetail(input: {
  value: number | string | null;
  year: number | null;
  confidence: string | null;
  source: SourceRef | null;
  lastVerifiedAt: Date | string | null;
}): StatDetail {
  const hasData =
    input.value != null &&
    input.year != null &&
    input.source != null &&
    input.confidence != null;

  const dataType = deriveDataType(input.source, input.confidence);

  return {
    hasData,
    value: hasData ? input.value : null,
    year: hasData ? input.year : null,
    confidence: hasData ? input.confidence : null,
    dataType: hasData ? dataType : null,
    source: hasData ? input.source : null,
    sourceUrl: hasData && input.source?.url ? input.source.url : null,
    lastVerifiedAt: hasData
      ? input.lastVerifiedAt instanceof Date
        ? input.lastVerifiedAt.toISOString()
        : input.lastVerifiedAt
      : null,
    note: hasData ? null : NO_VERIFIED_DATA_TEXT,
  };
}

export function buildDensity(input: {
  population: number | string | null;
  area: number | string | null;
}): DensityDetail {
  const population = toNumber(input.population);
  const area = toNumber(input.area);

  if (population == null || area == null || area <= 0) {
    return {
      hasData: false,
      value: null,
      dataType: null,
      note: NO_VERIFIED_DATA_TEXT,
    };
  }

  return {
    hasData: true,
    value: String(Math.round(population / area)),
    dataType: "calculated",
    note: "محسوبة من عدد السكان ÷ المساحة (الكم²).",
  };
}
