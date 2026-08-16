"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DataBadge from "@/components/DataBadge";
import {
  NO_VERIFIED_DATA_TEXT,
  formatNumber,
  SourcedStatCard,
  type StatDetail,
} from "@/components/SourcedStatCard";

type Commune = {
  id: number;
  wilayaId: number;
  nameAr: string;
  nameFr: string;
  populationDensity: string | null;
};

type Wilaya = {
  id: number;
  code: string;
  nameAr: string;
  nameFr: string;
  areaType: string;
};

type CommercialActivity = {
  activity: string;
  count?: number;
};

type Stats = {
  id: number;
  communeId: number;

  population: number | null;
  populationSource: string | null;
  populationYear: number | null;

  areaKm2: string | null;
  areaSource: string | null;
  areaYear: number | null;

  density: string | null;
  densityType: string | null;

  dairaNameAr: string | null;
  dairaNameFr: string | null;
  dairaSource: string | null;

  wilayaId: number;
  wilayaSource: string | null;

  merchantCount: number | null;
  merchantCountSource: string | null;
  merchantCountYear: number | null;

  commercialActivities: CommercialActivity[] | null;
  commercialActivitiesSource: string | null;

  marketScore: number | null;
  marketScoreMethod: string | null;

  purchasingPowerScore: number | null;
  purchasingPowerMethod: string | null;

  competitionScore: number | null;
  competitionMethod: string | null;

  commercialActivityScore: number | null;
  commercialActivityMethod: string | null;

  overallScore: number | null;
  overallScoreMethod: string | null;

  notes: string | null;
  lastVerifiedAt: string | null;
};

function scoreLabel(value: number | null) {
  if (value == null) return "غير متوفر";
  return `${value}/100`;
}

function scoreWidth(value: number | null) {
  if (value == null) return "0%";
  return `${Math.max(0, Math.min(100, value))}%`;
}

function sourceText(source: string | null, year?: number | null) {
  if (!source) return "المصدر غير متوفر حاليًا";
  return year ? `${source} — سنة ${year}` : source;
}

function InfoCard({
  title,
  value,
  source,
  badge,
}: {
  title: string;
  value: string;
  source: string;
  badge: "official" | "calculated" | "analytical" | "estimated";
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-slate-500 font-bold">{title}</p>
        <DataBadge type={badge} />
      </div>

      <p className="text-2xl font-black text-slate-900 mt-3">{value}</p>

      <p className="text-xs text-slate-400 mt-3 leading-5">{source}</p>
    </div>
  );
}

function ScoreCard({
  label,
  value,
  method,
}: {
  label: string;
  value: number | null;
  method: string | null;
}) {
  const available = value != null;

  return (
    <div className="rounded-2xl border border-slate-200 p-5 bg-white">
      <div className="flex justify-between items-center gap-3 mb-3">
        <div>
          <span className="font-bold text-slate-700">{label}</span>
        </div>

        {available ? (
          <span className="font-black text-indigo-600">
            {scoreLabel(value)}
          </span>
        ) : (
          <span className="text-sm font-bold text-slate-400">
            غير متوفر
          </span>
        )}
      </div>

      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        {available && (
          <div
            className="h-full bg-indigo-600 rounded-full transition-all"
            style={{ width: scoreWidth(value) }}
          />
        )}
      </div>

      <div className="mt-4 flex items-start gap-2">
        <DataBadge type="analytical" />

        <p className="text-xs text-slate-400 leading-5">
          {method ||
            "هذا المؤشر تحليلي وليس إحصاءً حكوميًا رسميًا."}
        </p>
      </div>
    </div>
  );
}

export default function CommuneDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [commune, setCommune] = useState<Commune | null>(null);
  const [wilaya, setWilaya] = useState<Wilaya | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [population, setPopulation] = useState<StatDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const { id } = await params;

        const response = await fetch(`/api/communes/${id}`, {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.error || "تعذر تحميل معلومات البلدية"
          );
        }

        setCommune(data.commune);
        setWilaya(data.wilaya);
        setStats(data.stats);
        setPopulation(data.population);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "حدث خطأ أثناء تحميل معلومات البلدية"
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [params]);

  if (loading) {
    return (
      <main
        dir="rtl"
        className="min-h-screen flex items-center justify-center bg-slate-50"
      >
        <div className="text-center">
          <div className="h-10 w-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />

          <p className="font-bold text-slate-700 mt-4">
            جاري تحميل معلومات البلدية...
          </p>
        </div>
      </main>
    );
  }

  if (error || !commune) {
    return (
      <main
        dir="rtl"
        className="min-h-screen flex items-center justify-center bg-slate-50 p-6"
      >
        <div className="text-center max-w-lg">
          <h1 className="text-2xl font-black text-red-600 mb-4">
            {error || "البلدية غير موجودة"}
          </h1>

          <Link
            href="/wilayas"
            className="inline-block rounded-xl bg-slate-900 px-6 py-3 font-bold text-white"
          >
            العودة إلى الولايات
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-50 py-8 px-4"
    >
      <div className="max-w-6xl mx-auto">

        {/* Navigation */}
        <Link
          href="/wilayas"
          className="inline-flex mb-6 text-indigo-600 font-bold hover:text-indigo-800"
        >
          ← العودة إلى الولايات
        </Link>

        {/* Header */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>
              <p className="text-sm font-bold text-indigo-600 mb-2">
                البيانات المحلية
              </p>

              <h1 className="text-3xl md:text-4xl font-black text-slate-900">
                {commune.nameAr}
              </h1>

              <p className="text-slate-500 mt-2">
                {commune.nameFr}
              </p>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl px-5 py-4 min-w-[220px]">
              <p className="text-xs text-indigo-600 font-bold">
                الولاية
              </p>

              <p className="text-lg font-black text-indigo-900 mt-1">
                {wilaya?.nameAr || "غير محددة"}
              </p>

              {wilaya?.code && (
                <p className="text-xs text-indigo-500 mt-1">
                  رمز الولاية: {wilaya.code}
                </p>
              )}
            </div>

          </div>
        </section>

        {/* Data quality notice */}
        <section className="bg-blue-50 border border-blue-200 rounded-3xl p-5 mb-6">
          <div className="flex gap-3">
            <div className="text-xl">ℹ️</div>

            <div>
              <h2 className="font-black text-blue-900">
                منهجية عرض البيانات
              </h2>

              <p className="text-sm text-blue-800 leading-7 mt-2">
                نميز بين البيانات الرسمية المنشورة من الجهات المختصة،
                والبيانات المحسوبة رياضيًا، والمؤشرات التحليلية التي
                ينتجها نظام تقييم السوق. لا نعتبر المؤشرات التحليلية
                إحصاءات حكومية رسمية.
              </p>
            </div>
          </div>
        </section>

        {/* Basic information */}
        <section className="mb-6">

          <div className="mb-4">
            <h2 className="text-2xl font-black text-slate-900">
              معلومات البلدية
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              البيانات الإدارية والديموغرافية المتوفرة حاليًا.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {population ? (
              <SourcedStatCard
                title="عدد السكان"
                detail={population}
                format={(value) => `${formatNumber(Number(value))} نسمة`}
              />
            ) : (
              <InfoCard
                title="عدد السكان"
                value="غير متوفر"
                source={NO_VERIFIED_DATA_TEXT}
                badge="official"
              />
            )}

            <InfoCard
              title="الدائرة"
              value={stats?.dairaNameAr || "غير متوفر"}
              source={
                stats?.dairaSource ||
                "المصدر الإداري غير متوفر حاليًا"
              }
              badge="official"
            />

          </div>
        </section>

        {/* Commercial data */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 mb-6">

          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-900">
              النشاط الاقتصادي والتجاري
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              البيانات التجارية تعرض فقط عندما يتوفر مصدر موثق وسنة
              للبيانات.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <InfoCard
              title="عدد التجار / المؤسسات"
              value={formatNumber(stats?.merchantCount)}
              source={sourceText(
                stats?.merchantCountSource ?? null,
                stats?.merchantCountYear
              )}
              badge="official"
            />

            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-black text-slate-900">
                  الأنشطة التجارية
                </h3>

                <DataBadge type="official" />
              </div>

              {stats?.commercialActivities &&
              stats.commercialActivities.length > 0 ? (
                <div className="mt-4 space-y-2">
                  {stats.commercialActivities.map(
                    (activity, index) => (
                      <div
                        key={`${activity.activity}-${index}`}
                        className="flex justify-between items-center bg-white rounded-xl border border-slate-200 px-4 py-3"
                      >
                        <span className="font-bold text-slate-700">
                          {activity.activity}
                        </span>

                        {activity.count != null && (
                          <span className="font-black text-indigo-600">
                            {activity.count.toLocaleString("ar-DZ")}
                          </span>
                        )}
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="text-sm text-slate-400 mt-4">
                  لا توجد بيانات تجارية موثقة قابلة للعرض حاليًا.
                </p>
              )}

              <p className="text-xs text-slate-400 mt-4">
                {stats?.commercialActivitiesSource ||
                  "مصدر النشاط التجاري غير متوفر حاليًا"}
              </p>
            </div>

          </div>
        </section>

        {/* Market analysis */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 mb-6">

          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  تحليل السوق في {commune.nameAr}
                </h2>

                <p className="text-sm text-slate-500 mt-2">
                  مؤشرات تحليلية لمساعدة المستخدم على فهم البيئة
                  التجارية، وليست إحصاءات حكومية رسمية.
                </p>
              </div>

              <DataBadge type="analytical" />

            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <ScoreCard
              label="قوة السوق"
              value={stats?.marketScore ?? null}
              method={stats?.marketScoreMethod ?? null}
            />

            <ScoreCard
              label="القدرة الشرائية"
              value={stats?.purchasingPowerScore ?? null}
              method={stats?.purchasingPowerMethod ?? null}
            />

            <ScoreCard
              label="مستوى المنافسة"
              value={stats?.competitionScore ?? null}
              method={stats?.competitionMethod ?? null}
            />

            <ScoreCard
              label="النشاط التجاري"
              value={stats?.commercialActivityScore ?? null}
              method={stats?.commercialActivityMethod ?? null}
            />

          </div>

          {/* Overall score */}
          <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50 p-6">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div>
                <p className="text-sm font-bold text-indigo-700">
                  التقييم العام للمنطقة
                </p>

                <p className="text-xs text-indigo-600 mt-2">
                  نتيجة تحليلية وليست تصنيفًا رسميًا صادرًا عن جهة حكومية.
                </p>
              </div>

              <div className="text-3xl font-black text-indigo-900">
                {stats?.overallScore != null
                  ? `${stats.overallScore}/100`
                  : "غير متوفر"}
              </div>

            </div>

            {stats?.overallScoreMethod && (
              <p className="text-xs text-indigo-600 mt-4 leading-6">
                المنهجية: {stats.overallScoreMethod}
              </p>
            )}

          </div>
        </section>

        {/* Projects */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 mb-6">

          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-900">
              المشاريع المناسبة للمنطقة
            </h2>

            <p className="text-sm text-slate-500 mt-2 leading-6">
              سيتم اختيار المشاريع المناسبة اعتمادًا على بيانات البلدية،
              رأس المال، خصائص المشروع، مستوى المنافسة، الطلب المحلي،
              ومتطلبات التشغيل. لن يتم اعتبار أي مشروع مناسبًا لمجرد
              وجوده في فئة تجارية عامة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
              <h3 className="font-black text-slate-900">
                التجارة المحلية
              </h3>

              <p className="text-sm text-slate-500 mt-2 leading-6">
                ستُقيّم حسب حجم الطلب، عدد السكان، المنافسة، ورأس المال
                المطلوب.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
              <h3 className="font-black text-slate-900">
                الخدمات
              </h3>

              <p className="text-sm text-slate-500 mt-2 leading-6">
                ستُقارن مع خصائص البلدية واحتياجات السوق ومتطلبات
                المشروع.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
              <h3 className="font-black text-slate-900">
                المشاريع المنزلية
              </h3>

              <p className="text-sm text-slate-500 mt-2 leading-6">
                ستُرشح عند توافق رأس المال، المهارات، الوقت وإمكانية
                التشغيل من المنزل.
              </p>
            </div>

          </div>

          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <p className="text-sm text-amber-800 leading-7">
              <strong>ملاحظة:</strong> لا توجد توصية بمشروع محدد في هذه
              المرحلة لأن محرك ملاءمة المشاريع لم يتم ربطه بعد ببيانات
              البلدية. هذا مقصود لتجنب تقديم توصيات غير مبنية على بيانات.
            </p>
          </div>

        </section>

        {/* Verification */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 mb-6">

          <h2 className="text-xl font-black text-slate-900 mb-4">
            حالة التحقق من البيانات
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold text-slate-500">
                آخر تحقق
              </p>

              <p className="font-bold text-slate-800 mt-2">
                {stats?.lastVerifiedAt
                  ? new Date(
                      stats.lastVerifiedAt
                    ).toLocaleString("ar-DZ")
                  : "لم يتم تحديد تاريخ التحقق"}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold text-slate-500">
                حالة البيانات
              </p>

              <p className="font-bold text-slate-800 mt-2">
                بيانات رسمية ومحسوبة وتحليلية حسب توفر المصدر
              </p>
            </div>

          </div>

        </section>

        {/* Notes */}
        {stats?.notes && (
          <section className="bg-amber-50 border border-amber-200 rounded-3xl p-6 mb-6">

            <h2 className="font-black text-amber-900 mb-2">
              ملاحظات حول المنطقة
            </h2>

            <p className="text-amber-800 leading-7">
              {stats.notes}
            </p>

          </section>
        )}

        {/* Methodology */}
        <section className="rounded-3xl bg-slate-900 text-white p-6 md:p-8">

          <h2 className="text-xl font-black mb-4">
            ملاحظة حول المصداقية والمنهجية
          </h2>

          <p className="text-slate-300 leading-8 text-sm">
            يعتمد النظام على فصل البيانات الرسمية عن البيانات المحسوبة
            والمؤشرات التحليلية. البيانات الديموغرافية والإدارية يجب أن
            ترتبط بمصدر رسمي وسنة بيانات محددة، بينما الكثافة السكانية
            يمكن حسابها رياضيًا من السكان والمساحة. أما قوة السوق
            والقدرة الشرائية والمنافسة والتقييم العام فهي مؤشرات تحليلية
            يجب أن تُبنى على منهجية معلنة ومدخلات قابلة للتحقق، ولا ينبغي
            تقديمها على أنها أرقام رسمية.
          </p>

        </section>

      </div>
    </main>
  );
}