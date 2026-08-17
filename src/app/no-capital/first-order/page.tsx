"use client";

import { useEffect, useState } from "react";
import { Loader2, Users, Copy, Check, Megaphone, Target } from "lucide-react";
import type { FirstOrderPlanItem } from "@/lib/noCapital/types";

export default function NoCapitalFirstOrderPage() {
  const [plan, setPlan] = useState<FirstOrderPlanItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/no-capital/first-order", { cache: "no-store" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error("failed");
        return data.plan as FirstOrderPlanItem;
      })
      .then(setPlan)
      .catch(() => setError("تعذر تحميل خطة أول عميل. حاول مرة أخرى."))
      .finally(() => setLoading(false));
  }, []);

  const copyScript = async () => {
    if (!plan?.scriptText) return;
    try {
      await navigator.clipboard.writeText(plan.scriptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  };

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        <div className="border-b border-slate-200 pb-6">
          <span className="text-xs font-black text-emerald-600 uppercase tracking-wider">
            أول عميل
          </span>

          <h1 className="text-2xl sm:text-4xl font-black mt-1">خطة الحصول على أول عميل</h1>

          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            منهجية عملية للوصول إلى أول عميل مدفوع، بأساليب لا تحتاج ميزانية.
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
            <div className="grid gap-4 md:grid-cols-2">
              {plan.targetAudience && (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-black text-sm">الجمهور المستهدف</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {plan.targetAudience}
                  </p>
                </div>
              )}

              {plan.valueProposition && (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-black text-sm">عرض القيمة</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {plan.valueProposition}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
              <h3 className="font-black text-sm">قنوات الوصول</h3>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-100">
                      <th className="text-right font-bold py-2">القناة</th>
                      <th className="text-right font-bold py-2">المجهود</th>
                      <th className="text-right font-bold py-2">ملاحظات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plan.channels.map((channel, index) => (
                      <tr key={index} className="border-b border-slate-50">
                        <td className="py-2.5 font-extrabold text-slate-800">{channel.channel}</td>
                        <td className="py-2.5 text-slate-600">{channel.effort}</td>
                        <td className="py-2.5 text-slate-500">{channel.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
              <h3 className="font-black text-sm">الخطوات العملية</h3>

              <ol className="space-y-3">
                {plan.outreachSteps.map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-700 font-black text-xs flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-700 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {plan.scriptText && (
              <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-black text-sm flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-emerald-400" />
                    رسالة العرض الجاهزة
                  </h3>

                  <button
                    onClick={copyScript}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-bold hover:bg-slate-700 flex items-center gap-1.5"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "نُسخت" : "نسخ"}
                  </button>
                </div>

                <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                  {plan.scriptText}
                </p>
              </div>
            )}

            {plan.successMetrics.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
                <h3 className="font-black text-sm">مؤشرات النجاح</h3>

                <div className="flex flex-wrap gap-2">
                  {plan.successMetrics.map((metric, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-extrabold"
                    >
                      {metric}
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
