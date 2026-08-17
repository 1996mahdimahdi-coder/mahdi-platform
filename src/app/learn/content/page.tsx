"use client";

import { useEffect, useState } from "react";
import { Loader2, Sparkles, CalendarClock } from "lucide-react";

type ContentDataType = {
  slug: string;
  nameAr: string;
  description?: string;
  bestPractices?: string[];
  example?: string;
};

type PublishingPlanType = {
  platform: string;
  cadence?: string;
  bestTimes?: string[];
  tips?: string[];
};

export default function LearnContentPage() {
  const [contentTypes, setContentTypes] = useState<ContentDataType[]>([]);
  const [publishingPlans, setPublishingPlans] = useState<PublishingPlanType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/learn/content", { cache: "no-store" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error("failed");
        setContentTypes(data.contentTypes ?? []);
        setPublishingPlans(data.publishingPlans ?? []);
      })
      .catch(() => {
        setContentTypes([]);
        setPublishingPlans([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
        <div className="border-b border-slate-200 pb-6">
          <span className="text-xs font-black text-emerald-600 uppercase tracking-wider">
            صناعة المحتوى
          </span>

          <h1 className="text-2xl sm:text-4xl font-black mt-1">أنواع المحتوى وخطط النشر</h1>

          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            مرجع عملي يبسّط صناعة المحتوى لصاحب مشروع صغير بدون فريق.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-3 py-20 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <p className="text-sm font-bold">جاري تحميل المحتوى...</p>
          </div>
        ) : (
          <>
            <section className="space-y-4">
              <h2 className="text-lg font-black flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                أنواع المحتوى وأفضل الممارسات
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                {contentTypes.map((type) => (
                  <div key={type.slug} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
                    <h3 className="font-black text-sm">{type.nameAr}</h3>

                    {type.description && (
                      <p className="text-xs text-slate-500 leading-relaxed">{type.description}</p>
                    )}

                    {type.bestPractices && type.bestPractices.length > 0 && (
                      <ul className="space-y-1.5">
                        {type.bestPractices.map((practice, index) => (
                          <li key={index} className="text-[11px] text-slate-600 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                            {practice}
                          </li>
                        ))}
                      </ul>
                    )}

                    {type.example && (
                      <div className="bg-slate-50 rounded-xl p-3 text-[11px] text-slate-600 leading-relaxed">
                        <span className="font-extrabold text-slate-800 block mb-0.5">مثال:</span>
                        {type.example}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-black flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-emerald-600" />
                إيقاع النشر وأفضل الأوقات
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                {publishingPlans.map((plan) => (
                  <div key={plan.platform} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-black text-sm capitalize">{plan.platform}</h3>

                      {plan.cadence && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold">
                          {plan.cadence}
                        </span>
                      )}
                    </div>

                    {plan.bestTimes && plan.bestTimes.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-extrabold text-slate-400 block">أفضل الأوقات</span>
                        <div className="flex flex-wrap gap-1.5">
                          {plan.bestTimes.map((time, index) => (
                            <span key={index} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                              {time}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {plan.tips && plan.tips.length > 0 && (
                      <ul className="space-y-1.5 pt-1 border-t border-slate-100">
                        {plan.tips.map((tip, index) => (
                          <li key={index} className="text-[11px] text-slate-600 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
