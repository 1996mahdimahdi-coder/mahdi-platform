"use client";

import { useEffect, useState } from "react";
import { Loader2, Target, CalendarCheck, CheckCircle2 } from "lucide-react";
import type { ExecutionPlanItem } from "@/lib/noCapital/types";

export default function NoCapitalPlansPage() {
  const [plans, setPlans] = useState<ExecutionPlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/no-capital/plans", { cache: "no-store" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error("failed");
        return data.plans as ExecutionPlanItem[];
      })
      .then(setPlans)
      .catch(() => setError("تعذر تحميل خطة 90 يوماً. حاول مرة أخرى."))
      .finally(() => setLoading(false));
  }, []);

  const plan = plans[0];

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        <div className="border-b border-slate-200 pb-6">
          <span className="text-xs font-black text-emerald-600 uppercase tracking-wider">
            خطة العمل
          </span>

          <h1 className="text-2xl sm:text-4xl font-black mt-1">خطة 90 يوماً</h1>

          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            خريطة عمل عامة قابلة للتطبيق على أي مشروع بدون رأس مال: من اختيار
            الفكرة حتى أول عميلين ثابتين.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-3 py-20 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <p className="text-sm font-bold">جاري تحميل الخطة...</p>
          </div>
        ) : error || !plan ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center">
            <p className="text-sm font-bold text-red-600">{error}</p>
          </div>
        ) : (
          <>
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black">{plan.title}</h2>
                  {plan.subtitle && (
                    <p className="text-xs sm:text-sm text-slate-300 mt-1">{plan.subtitle}</p>
                  )}
                </div>

                <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-extrabold shrink-0">
                  {plan.durationDays} يوماً
                </span>
              </div>

              {plan.objective && (
                <div className="bg-slate-800 rounded-2xl p-4 text-xs sm:text-sm flex items-start gap-3">
                  <Target className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-emerald-300 block mb-0.5">
                      الهدف
                    </span>
                    {plan.objective}
                  </div>
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {plan.phases.map((phase, index) => (
                <div
                  key={`${phase.month}-${index}`}
                  className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-sm shrink-0">
                        {phase.month}
                      </div>

                      <div>
                        <span className="text-[11px] text-slate-400 block">
                          الشهر {phase.month} {phase.week ? `- ${phase.week}` : ""}
                        </span>

                        <h3 className="font-black text-sm">{phase.title}</h3>
                      </div>
                    </div>

                    <CalendarCheck className="w-4 h-4 text-slate-300 shrink-0" />
                  </div>

                  <ul className="space-y-2">
                    {phase.tasks.map((task, tIndex) => (
                      <li
                        key={tIndex}
                        className="text-xs text-slate-600 flex items-start gap-2"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        {task}
                      </li>
                    ))}
                  </ul>

                  {phase.kpis && phase.kpis.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                      {phase.kpis.map((kpi, kIndex) => (
                        <span
                          key={kIndex}
                          className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold"
                        >
                          {kpi}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {plan.kpis && plan.kpis.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
                <h3 className="font-black text-sm">مؤشرات النجاح في نهاية المدة</h3>

                <div className="flex flex-wrap gap-2">
                  {plan.kpis.map((kpi, kIndex) => (
                    <span
                      key={kIndex}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-extrabold"
                    >
                      {kpi}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
