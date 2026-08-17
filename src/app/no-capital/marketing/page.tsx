"use client";

import { useEffect, useState } from "react";
import { Loader2, Megaphone } from "lucide-react";
import type { MarketingPlanItem } from "@/lib/noCapital/types";

const BUDGET_LABELS: Record<string, string> = {
  low: "ميزانية صفر",
  medium: "ميزانية صغيرة",
  high: "ميزانية متكاملة",
};

export default function NoCapitalMarketingPage() {
  const [plans, setPlans] = useState<MarketingPlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/no-capital/marketing", { cache: "no-store" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error("failed");
        return data.plans as MarketingPlanItem[];
      })
      .then(setPlans)
      .catch(() => setError("تعذر تحميل خطط التسويق. حاول مرة أخرى."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        <div className="border-b border-slate-200 pb-6">
          <span className="text-xs font-black text-emerald-600 uppercase tracking-wider">
            التسويق
          </span>

          <h1 className="text-2xl sm:text-4xl font-black mt-1">خطط تسويق حسب ميزانيتك</h1>

          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            ثلاث خلطات قنوات واقعية: تبدأ من الصفر وتتوسع حسب النتائج.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-3 py-20 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <p className="text-sm font-bold">جاري تحميل الخطط...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center">
            <p className="text-sm font-bold text-red-600">{error}</p>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.slug}
                className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 hover:shadow-lg transition-shadow flex flex-col"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Megaphone className="w-5 h-5" />
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-slate-900 text-white text-[10px] font-extrabold">
                    {BUDGET_LABELS[plan.budgetLevel] ?? plan.budgetLevel}
                  </span>
                </div>

                <div>
                  <h2 className="font-black text-base">{plan.title}</h2>

                  <ul className="mt-3 space-y-1.5">
                    {plan.goals.map((goal, gIndex) => (
                      <li key={gIndex} className="text-xs text-slate-600 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        {goal}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wide">
                    القنوات
                  </h3>

                  <div className="space-y-2">
                    {plan.channels.map((channel, cIndex) => (
                      <div key={cIndex} className="bg-slate-50 rounded-xl p-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-extrabold text-slate-800">
                            {channel.channel}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700">
                            {channel.priority}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-500 mt-1">{channel.notes}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pt-1 space-y-2 border-t border-slate-100">
                  <h3 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wide">
                    الجدول الزمني
                  </h3>

                  {plan.timelineWeeks.map((timeline, tIndex) => (
                    <div key={tIndex} className="flex items-start gap-2">
                      <span className="w-20 shrink-0 text-[10px] font-extrabold text-slate-500">
                        {timeline.week}
                      </span>
                      <div className="text-[11px] text-slate-600">
                        <strong className="text-slate-800 block">{timeline.focus}</strong>
                        {timeline.tasks.join("، ")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
