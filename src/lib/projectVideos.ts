export type VideoTrust = "A" | "B" | "C" | "D" | "X";

export interface ProjectVideoItem {
  id: string;          // رقم يوتيوب ID
  label: string;       // عنوان الفيديو (مثلاً: الفيديو الأساسي)
  trust: VideoTrust;   // درجة الثقة
  note?: string;       // ملاحظة NABDA (اختياري)
}

export const TRUST_META: Record<VideoTrust, { label: string; className: string; desc: string }> = {
  A: { label: "A — جزائري تطبيقي", className: "bg-emerald-100 text-emerald-700", desc: "منفذ في الجزائر + أرقام جزائرية" },
  B: { label: "B — جزائري تعليمي", className: "bg-lime-100 text-lime-700", desc: "جزائري بلا دراسة مالية كاملة" },
  C: { label: "C — عربي", className: "bg-amber-100 text-amber-700", desc: "مفيد للتعلم، لا تعتمد أسعاره" },
  D: { label: "D — عالمي", className: "bg-sky-100 text-sky-700", desc: "مفيد للتقنية فقط" },
  X: { label: "X — غير مناسب", className: "bg-rose-100 text-rose-700", desc: "لا يدخل NABDA" },
};

export const NO_CAPITAL_VIDEOS: Record<string, ProjectVideoItem[]> = {
  // "content-writing": [
  //   { id: "AbCdEfGhIjK", label: "الفيديو الأساسي", trust: "A", note: "أسعار جزائرية 2025" },
  //   { id: "XyZ123", label: "التسويق والبيع", trust: "B" },
  // ],
};

export const CAPITAL_VIDEOS: Record<string, ProjectVideoItem[]> = {
  // "perfume-oils-refill": [
  //   { id: "YwUrZj1nSxQ", label: "الفيديو الأساسي", trust: "A", note: "موجه لمشاريع في الجزائر ورأس مال صغير" },
  // ],
};

export function getProjectVideos(slug: string): ProjectVideoItem[] {
  return NO_CAPITAL_VIDEOS[slug] ?? [];
}

export function getCapitalProjectVideos(projectId: string): ProjectVideoItem[] {
  return CAPITAL_VIDEOS[projectId] ?? [];
}
