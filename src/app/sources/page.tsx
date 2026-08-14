"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Globe,
  CheckCircle2,
  Scale,
  Compass,
  Database,
} from "lucide-react";
import DataBadge from "@/components/DataBadge";

type Source = {
  id: number;
  name: string;
  institution: string;
  sourceType: string;
  url: string | null;
  category: string;
  confidenceGrade: string;
  documentTitle: string | null;
  documentYear: number | null;
  documentType: string | null;
  accessedAt: string | null;
  notes: string | null;
  lastVerifiedAt: string | null;
};

const CATEGORY_LABELS: Record<string, string> = {
  population: "سكان",
  area: "مساحة",
  economy: "اقتصاد",
  market: "سوق",
  transport: "نقل",
  projects: "مشاريع",
  legal: "قانوني",
  other: "أخرى",
};

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  census: "إحصاء (تعداد)",
  report: "تقرير",
  law: "قانون",
  decree: "مرسوم",
  dataset: "مجموعة بيانات",
  portal: "بوابة إلكترونية",
  other: "أخرى",
};

const CONFIDENCE_EXPLAINER: {
  grade: string;
  title: string;
  text: string;
}[] = [
  {
    grade: "A",
    title: "عالية جدًا",
    text: "مصدر رسمي مباشر (إحصاء رسمي، جريدة رسمية، جهة رسمية مختصة).",
  },
  {
    grade: "B",
    title: "عالية",
    text: "مصدر رسمي/مؤسسي موثوق لكنه يحتاج تحققًا أو تفسيرًا عند الاستخدام.",
  },
  {
    grade: "C",
    title: "متوسطة",
    text: "مصدر ثانوي موثوق (بنوك بيانات دولية، دراسات مؤسسية موثقة).",
  },
  {
    grade: "D",
    title: "منخفضة",
    text: "تقدير أو بيانات غير كافية للاعتماد؛ تُعرض كتقدير فقط.",
  },
  {
    grade: "U",
    title: "غير موثقة",
    text: "لا يوجد توثيق كافٍ؛ لا تُعرض كحقيقة أبدًا.",
  },
];

const TYPE_EXPLAINER = [
  {
    kind: "رسمي",
    badge: "official" as const,
    text: "رقم منشور من جهة رسمية مختصة (مثل ONS). يُعرض مع اسم الجهة والسنة.",
  },
  {
    kind: "محسوب بواسطة NABDA",
    badge: "calculated" as const,
    text: "رقم نحسبه نحن رياضيًا من أرقام رسمية (مثل الكثافة = السكان ÷ المساحة). لا يوصف بأنه رقم رسمي.",
  },
  {
    kind: "تقديري",
    badge: "estimated" as const,
    text: "رقم مبني على تقدير أو مصدر منخفض الثقة؛ يُعرض بوضوح مع إخلاء مسؤولية.",
  },
  {
    kind: "غير موثق",
    badge: "undocumented" as const,
    text: "لا بيانات متاحة موثقة. نعرض الرسالة الصريحة بدلًا من اختراع رقم.",
  },
];

export default function SourcesPage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch("/api/sources");
        const data = await res.json();

        if (!cancelled) {
          if (data.success) {
            setSources(data.sources || []);
          } else {
            setError(data.error || "تعذر تحميل المصادر.");
          }
          setLoading(false);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setError("تعذر تحميل المصادر.");
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main dir="rtl" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold inline-flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          الشفافية والمصداقية
        </span>

        <h1 className="text-3xl font-black text-slate-900 mt-4">
          مصادر NABDA الرسمية
        </h1>

        <p className="text-slate-600 mt-3 leading-8 text-sm">
          في NABDA نؤمن أن القرار الجيد يبدأ من رقم صادق. لذلك نبني سجلًا
          مفتوحًا للمصادر التي تستند إليها أرقامنا: السكان، المساحة، الكثافة،
          والمؤشرات. كل رقم معروض في المنصة يجب أن يرتبط بمصدره وسنته — وإلا
          لا يُعرض أصلًا.
        </p>
      </section>

      {/* How we choose */}
      <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Compass className="w-5 h-5 text-indigo-600" />
          كيف نختار المصادر؟
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <p className="font-black text-slate-900 mb-1">1. الجهة الرسمية أولًا</p>
            <p className="text-slate-600 leading-6">
              نبدأ من الجهات الرسمية المختصة: الديوان الوطني للإحصائيات (ONS)،
              الجريدة الرسمية، وزارة الداخلية، المعهد الوطني للخرائط (INCT)،
              ثم المصادر المؤسسية والدولية الموثقة.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <p className="font-black text-slate-900 mb-1">2. توثيق كامل</p>
            <p className="text-slate-600 leading-6">
              كل مصدر يدخل السجل بعنوان وثيقة وسنة ونوع وثيقة ورابط مباشر —
              لا يكفي أن نقول "وفق ONS"، بل نحدد الوثيقة نفسها.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <p className="font-black text-slate-900 mb-1">3. سنة واضحة</p>
            <p className="text-slate-600 leading-6">
              كل رقم مرتبط بسنة الوثيقة التي جاء منها، ونميز بين سنوات مختلفة
              عند الجمع بينها.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <p className="font-black text-slate-900 mb-1">4. لا أرقام مخترعة</p>
            <p className="text-slate-600 leading-6">
              إذا لم يتوفر مصدر موثق، نعرض رسالة صريحة بأن البيانات غير
              متوفرة — لا نملأ الفراغ بأرقام من الإنترنت أو التقدير.
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-4">
          نستبعد صراحة المصادر غير الموثوقة مثل ويكيبيديا أو الصفحات غير
          الرسمية على مواقع التواصل، حتى لو كانت قريبة في القيمة.
        </p>
      </section>

      {/* Confidence grades */}
      <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Scale className="w-5 h-5 text-indigo-600" />
          معنى درجات الثقة A / B / C / D / U
        </h2>

        <div className="mt-5 space-y-3 text-xs">
          {CONFIDENCE_EXPLAINER.map((item) => (
            <div
              key={item.grade}
              className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200"
            >
              <span className="w-10 h-10 shrink-0 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-indigo-700">
                {item.grade}
              </span>
              <div>
                <p className="font-black text-slate-900">{item.title}</p>
                <p className="text-slate-600 mt-1 leading-6">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Official vs computed vs estimated */}
      <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-indigo-600" />
          الفرق بين الرقم الرسمي والمحسوب والتقديري
        </h2>

        <div className="mt-5 space-y-3 text-xs">
          {TYPE_EXPLAINER.map((item) => (
            <div
              key={item.kind}
              className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200"
            >
              <DataBadge type={item.badge} />
              <p className="text-slate-600 leading-6">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs leading-7">
          <p className="font-black mb-1">
            القاعدة الذهبية: أي رقم معروض في NABDA يكون إما (رسميًا بمصدر
            وسنة) أو (محسوبًا رياضيًا من أرقام رسمية) أو (تقديريًا معلنًا).
            لا يوجد رقم "من فراغ".
          </p>
        </div>
      </section>

      {/* Registry */}
      <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-600" />
            سجل المصادر المنشورة
          </h2>

          <Link
            href="/methodology"
            className="text-indigo-600 font-bold text-xs hover:text-indigo-800"
          >
            اقرأ منهجيتنا ←
          </Link>
        </div>

        {loading ? (
          <p className="text-sm font-bold text-slate-400">
            جاري تحميل المصادر...
          </p>
        ) : error ? (
          <p className="text-sm font-bold text-rose-600">{error}</p>
        ) : sources.length === 0 ? (
          <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200">
            <p className="text-sm font-black text-amber-900">
              لا توجد مصادر منشورة حاليًا
            </p>
            <p className="text-xs text-amber-800 mt-2 leading-6">
              مرحلة إدخال بيانات السكان والمساحة لم تبدأ بعد. بمجرد توثيق
              المصادر الرسمية سيظهر كل مصدر هنا مع رابط الوثيقة الأصلية.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sources.map((source) => (
              <div
                key={source.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-black text-slate-900">{source.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {source.institution}
                    </p>
                    {source.documentTitle && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        الوثيقة: {source.documentTitle}
                        {source.documentYear ? ` (${source.documentYear})` : ""}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {source.documentType && (
                      <span className="px-2 py-1 rounded-full bg-white border border-slate-200 text-[10px] font-bold text-slate-600">
                        {DOCUMENT_TYPE_LABELS[source.documentType] ||
                          source.documentType}
                      </span>
                    )}
                    <span className="px-2 py-1 rounded-full bg-white border border-slate-200 text-[10px] font-bold text-slate-600">
                      {CATEGORY_LABELS[source.category] || source.category}
                    </span>
                    <span className="px-2 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-[10px] font-black text-indigo-700">
                      الثقة: {source.confidenceGrade}
                    </span>
                  </div>
                </div>

                {source.url && (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 text-indigo-600 font-bold text-xs hover:text-indigo-800 break-all"
                    dir="ltr"
                  >
                    <Globe className="w-3.5 h-3.5 shrink-0" />
                    {source.url}
                  </a>
                )}

                {source.lastVerifiedAt && (
                  <p className="text-[10px] text-slate-400 mt-2">
                    آخر تحقق:{" "}
                    {new Date(source.lastVerifiedAt).toLocaleDateString("ar-DZ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="rounded-3xl bg-slate-900 text-white p-8">
        <h2 className="text-xl font-black mb-2">لماذا نهتم بهذا كله؟</h2>
        <p className="text-slate-300 leading-8 text-sm">
          لأن قرار بدء مشروعك يستحق أرقامًا حقيقية. أي رقم نعرضه عليك يمكنك
          تتبعه حتى مصدره الأصلي والتحقق منه بنفسك.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/test"
            className="px-6 py-3 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-xs"
          >
            ابدأ اختبار ملاءمة مشروعك
          </Link>
          <Link
            href="/methodology"
            className="px-6 py-3 rounded-xl border border-slate-600 text-white font-extrabold text-xs"
          >
            صفحة المنهجية
          </Link>
        </div>
      </section>
    </main>
  );
}
