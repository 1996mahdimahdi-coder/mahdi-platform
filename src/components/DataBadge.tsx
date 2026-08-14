export type DataBadgeType =
  | "official"
  | "calculated"
  | "estimated"
  | "undocumented"
  | "analytical";

const DATA_BADGE_CONFIG: Record<
  DataBadgeType,
  { label: string; className: string }
> = {
  official: {
    label: "رسمي",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  calculated: {
    label: "محسوب بواسطة NABDA",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  estimated: {
    label: "تقديري",
    className: "bg-orange-50 text-orange-700 border-orange-200",
  },
  undocumented: {
    label: "غير موثق",
    className: "bg-slate-100 text-slate-500 border-slate-200",
  },
  analytical: {
    label: "مؤشر تحليلي",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
};

export default function DataBadge({
  type,
}: {
  type: DataBadgeType;
}) {
  const item = DATA_BADGE_CONFIG[type];

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold ${item.className}`}
    >
      {item.label}
    </span>
  );
}
