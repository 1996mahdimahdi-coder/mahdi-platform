import DataBadge, { type DataBadgeType } from "@/components/DataBadge";

export const NO_VERIFIED_DATA_TEXT =
  "لا تتوفر حاليًا بيانات رسمية موثقة قابلة للتحقق.";

export type StatDetail = {
  hasData: boolean;
  value: number | string | null;
  year: number | null;
  confidence: string | null;
  dataType: "official" | "calculated" | "estimated" | "secondary" | null;
  source: {
    id: number;
    name: string;
    institution: string;
    url: string | null;
  } | null;
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

export function badgeForDataType(
  dataType: StatDetail["dataType"]
): DataBadgeType {
  switch (dataType) {
    case "official":
      return "official";
    case "calculated":
      return "calculated";
    case "estimated":
      return "estimated";
    case "secondary":
      return "estimated";
    default:
      return "undocumented";
  }
}

export function formatNumber(value: number | null | undefined) {
  if (value == null) return "غير متوفر";
  return value.toLocaleString("ar-DZ");
}

export function SourcedStatCard({
  title,
  detail,
  format,
}: {
  title: string;
  detail: StatDetail;
  format: (value: number | string) => string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-slate-500 font-bold">{title}</p>
        <DataBadge type={badgeForDataType(detail.dataType)} />
      </div>

      {detail.hasData ? (
        <>
          <p className="text-2xl font-black text-slate-900 mt-3">
            {format(detail.value as number | string)}
          </p>

          <p className="text-xs text-slate-400 mt-3 leading-5">
            {detail.source?.institution || "المصدر غير متوفر"} — سنة{" "}
            {detail.year}
            {detail.confidence ? ` • الثقة: ${detail.confidence}` : ""}
          </p>

          <p className="text-xs text-slate-400 mt-1 leading-5">
            {detail.source?.name}
          </p>

          {detail.sourceUrl && (
            <a
              href={detail.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-3 text-indigo-600 font-bold text-xs hover:text-indigo-800"
              dir="ltr"
            >
              ↗ التحقق من المصدر
            </a>
          )}
        </>
      ) : (
        <p className="text-sm font-bold text-slate-400 mt-3 leading-6">
          {detail.note || NO_VERIFIED_DATA_TEXT}
        </p>
      )}
    </div>
  );
}

export function DensityCard({
  detail,
  populationValue,
  areaValue,
}: {
  detail: DensityDetail;
  populationValue: number | string | null;
  areaValue: number | string | null;
}) {
  const isCalculated = detail.hasData;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-slate-500 font-bold">الكثافة السكانية</p>
        <DataBadge type={isCalculated ? "calculated" : "undocumented"} />
      </div>

      {isCalculated ? (
        <>
          <p className="text-2xl font-black text-slate-900 mt-3">
            {formatNumber(Number(detail.value))} نسمة/كم²
          </p>

          <p className="text-xs text-slate-400 mt-3 leading-5">
            محسوبة بواسطة NABDA: عدد السكان ÷ المساحة (الكم²)
          </p>

          <p className="text-xs text-slate-400 mt-1 leading-5">
            من {formatNumber(Number(populationValue))} نسمة على{" "}
            {Number(areaValue)} كم²
          </p>
        </>
      ) : (
        <p className="text-sm font-bold text-slate-400 mt-3 leading-6">
          {detail.note || NO_VERIFIED_DATA_TEXT}
        </p>
      )}
    </div>
  );
}
