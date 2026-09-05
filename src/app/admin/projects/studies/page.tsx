"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { FileBadge2, Loader2 } from "lucide-react";

type StudyListItem = {
  id: number;
  projectId: string;
  projectName: string;
  category: string;
  hasStudy: boolean;
  studyStatus: string | null;
};

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-amber-50 text-amber-700 border-amber-200",
  review: "bg-sky-50 text-sky-700 border-sky-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft (مسودة)",
  review: "Review (مراجعة)",
  approved: "Approved (معتمدة)",
};

export default function AdminCapitalStudiesPage() {
  const [items, setItems] = useState<StudyListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/projects/studies", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error ?? "تعذر تحميل البيانات.");
        setItems([]);
        return;
      }
      setItems(data.items as StudyListItem[]);
      setError(null);
    } catch {
      setError("تعذر الاتصال بالخادم.");
      setItems([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <AdminShell
      title="دراسات مشاريع رأس المال"
      subtitle="الدراسات المدفوعة للمشاريع الكلاسيكية (برأس مال)، محمية من الواجهة العمومية حتى الاعتماد"
    >
      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-2xl p-4 mb-5">
          {error}
        </div>
      )}

      {items == null ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          جارٍ التحميل...
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center">
          <FileBadge2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="font-black text-slate-700">لا توجد مشاريع بعد</h3>
          <p className="text-sm text-slate-500 mt-1">
            أضف دراسة لأي مشروع من قائمة المشاريع. كل دراسة جديدة تبدأ كـ «draft» ولا تظهر لأي مستخدم.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-12 px-5 py-3 bg-slate-50 text-[11px] font-black text-slate-500 gap-2">
            <div className="col-span-4">المشروع</div>
            <div className="col-span-2">المعرّف</div>
            <div className="col-span-3">التصنيف</div>
            <div className="col-span-2">الحالة</div>
            <div className="col-span-1">إجراء</div>
          </div>

          <div className="divide-y divide-slate-100">
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-12 px-5 py-4 items-center gap-2">
                <div className="col-span-4">
                  <div className="font-bold text-sm text-slate-800">{item.projectName}</div>
                </div>
                <div className="col-span-2 text-xs text-slate-500 font-mono">{item.projectId}</div>
                <div className="col-span-3 text-xs text-slate-500">{item.category}</div>
                <div className="col-span-2">
                  {item.hasStudy ? (
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full border text-[11px] font-extrabold ${STATUS_STYLES[item.studyStatus ?? ""] ?? STATUS_STYLES.draft}`}
                    >
                      {STATUS_LABELS[item.studyStatus ?? ""] ?? item.studyStatus ?? "—"}
                    </span>
                  ) : (
                    <span className="inline-block px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-400">
                      لا توجد دراسة
                    </span>
                  )}
                </div>
                <div className="col-span-1">
                  <Link
                    href={`/admin/projects/studies/${encodeURIComponent(item.projectId)}`}
                    className="inline-block px-3 py-1.5 rounded-xl bg-slate-900 text-white text-[11px] font-extrabold hover:bg-slate-700 transition-colors"
                  >
                    {item.hasStudy ? "تحرير" : "إنشاء"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminShell>
  );
}