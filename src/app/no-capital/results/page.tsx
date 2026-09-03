"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Trophy, ArrowLeft, Target, Megaphone, Users, Inbox } from "lucide-react";
import type { NoCapitalRecommendation } from "@/lib/noCapital/types";

type AssessResponse = {
  success?: boolean;
  recommendations: NoCapitalRecommendation[];
  consentVersion?: string;
  source?: string;
  categories?: { id?: number; slug?: string; nameAr?: string; nameFr?: string; icon?: string }[];
  generatedAt?: string;
};

const matchLevelStyles: Record<string, { label: string; className: string }> = {
  high: { label: "توافق عالٍ", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  medium: { label: "توافق متوسط", className: "bg-amber-100 text-amber-700 border-amber-200" },
  low: { label: "توافق مبدئي", className: "bg-slate-100 text-slate-600 border-slate-200" },
};

export default function NoCapitalResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<AssessResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void Promise.resolve().then(() => {
      try {
        const stored = localStorage.getItem("nabda_no_capital_result");
        if (!stored) {
          router.push("/no-capital/test");
          return;
        }
        const parsed: AssessResponse = JSON.parse(stored);
        if (!parsed || !Array.isArray(parsed.recommendations)) {
          router.push("/no-capital/test");
          return;
        }
        setResult(parsed);
      } catch {
        router.push("/no-capital/test");
      } finally {
        setLoading(false);
      }
    });
  }, [router]);

  if (loading) {
    return (
      <div dir="rtl" className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-600">جاري تحميل النتائج...</p>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const recommendations = result.recommendations ?? [];
  const isEmpty = recommendations.length === 0;

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
        <div className="border-b border-slate-200 pb-6">
          <span className="text-xs font-black text-emerald-600 uppercase tracking-wider">
            نتيجة اختبار المشاريع بدون رأس مال
          </span>

          <h1 className="text-2xl sm:text-4xl font-black mt-1">
            {isEmpty ? "اقتراحاتنا في طريقها إليك" : "أفكار تناسب وقتك ومهاراتك"}
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            التوصيات استرشادية، مبنية على إجاباتك ومعطيات عامة عن السوق
            الجزائري. تحقق دائماً من الشروط القانونية والإدارية الخاصة بنشاطك
            قبل الانطلاق.
          </p>
        </div>

        {isEmpty ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
              <Inbox className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h2 className="font-black text-lg">
                لا توجد مشاريع معروضة بعد
              </h2>

              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                فريقنا يعمل على إضافة مشاريع مراجعة ومحلية تبدأ فعلياً بدون رأس
                مال. ستصلك هذه القائمة تدريجياً، ويمكنك في هذه الأثناء استخدام
                الخطة العامة وخطط العمل الجاهزة.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/no-capital/plans"
                className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-extrabold text-xs hover:bg-slate-800"
              >
                شاهد خطة 90 يوماً
              </Link>

              <Link
                href="/no-capital/test"
                className="px-6 py-3 rounded-2xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
              >
                إعادة الاختبار
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-3 gap-3">
              <Link
                href="/no-capital/plans"
                className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-emerald-400 hover:shadow-md transition-all flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-sm font-extrabold">خطة 90 يوماً</span>
                  <span className="block text-[11px] text-slate-500">من الفكرة لأول عميل</span>
                </div>
              </Link>

              <Link
                href="/no-capital/first-order"
                className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-emerald-400 hover:shadow-md transition-all flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-sm font-extrabold">خطة أول عميل</span>
                  <span className="block text-[11px] text-slate-500">وصول منهجي بلا ميزانية</span>
                </div>
              </Link>

              <Link
                href="/no-capital/marketing"
                className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-emerald-400 hover:shadow-md transition-all flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-sm font-extrabold">خطة التسويق</span>
                  <span className="block text-[11px] text-slate-500">حسب ميزانيتك</span>
                </div>
              </Link>
            </div>

            <div className="space-y-5">
              {recommendations.map((rec, index) => {
                const style = matchLevelStyles[rec.matchLevel] ?? matchLevelStyles.low;

                return (
                  <div
                    key={`${rec.profile.slug}-${index}`}
                    className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 space-y-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white font-black flex items-center justify-center shrink-0">
                          {index + 1}
                        </div>

                        <div>
                          <h2 className="text-lg font-black text-slate-900">
                            {rec.profile.nameAr}
                          </h2>

                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            {rec.profile.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                        <div className="text-center bg-slate-50 rounded-2xl px-4 py-2">
                          <span className="text-2xl font-black text-emerald-600 font-mono">
                            {rec.totalScore}
                          </span>
                          <span className="text-[10px] text-slate-400">/100</span>
                        </div>

                        <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold border ${style.className}`}>
                          {style.label}
                        </span>
                      </div>
                    </div>

                    {rec.reasons.length > 0 && (
                      <div className="bg-slate-50 rounded-2xl p-4 text-xs space-y-2">
                        <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                          <Trophy className="w-4 h-4 text-emerald-600" />
                          لماذا هذا المشروع مناسب لك؟
                        </span>

                        <ul className="list-disc list-inside space-y-1 text-slate-600">
                          {rec.reasons.map((reason, rIndex) => (
                            <li key={rIndex}>{reason}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100">
                          المجهود: <strong>{rec.profile.effortLevel}</strong>
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100">
                          الوقت: <strong>{rec.profile.timeRequired}</strong>
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100">
                          تكلفة الانطلاق: <strong>{rec.profile.startCostEstimate}</strong>
                        </span>
                      </div>

                      <Link
                        href={`/no-capital/projects/${rec.profile.slug}?score=${rec.totalScore}&level=${rec.matchLevel}${rec.reasons[0] ? "&reason=" + encodeURIComponent(rec.reasons[0]) : ""}`}
                        className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-extrabold hover:bg-emerald-700 inline-flex items-center gap-1.5 shrink-0"
                      >
                        عرض التفاصيل
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <div className="text-center pt-4">
          <a
            href="https://t.me/+xvIo0_hK5k9mOWVk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 text-white font-extrabold text-xs hover:bg-sky-600 transition-colors"
          >
            فكرة مشروع في ولايتك — كل أسبوع
          </a>
        </div>

        <div className="text-center pt-2">
          <Link
            href="/no-capital"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-600"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة لصفحة المشاريع بدون رأس مال
          </Link>
        </div>
      </div>
    </main>
  );
}
