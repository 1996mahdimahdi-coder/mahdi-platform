import Link from "next/link";
import {
  Users,
  Map,
  Calculator,
  ShieldAlert,
  FileCheck2,
  EyeOff,
  Scale,
} from "lucide-react";
import DataBadge from "@/components/DataBadge";

const METHODOLOGY_POINTS = [
  {
    icon: Users,
    title: "1. السكان — المصدر الأصلي",
    text: "عدد سكان الولاية أو البلدية يُؤخذ حصريًا من جهة إحصائية رسمية مختصة (مثل الديوان الوطني للإحصائيات — ONS، نتائج التعدادات والإحصاءات الرسمية). لا نأخذ السكان من مواقع غير رسمية، ولا نقدّرهم عشوائيًا.",
  },
  {
    icon: Map,
    title: "2. المساحة — المصدر الأصلي",
    text: "مساحة الولاية أو البلدية تُؤخذ من مصدر جغرافي/خرائطي رسمي (مثل المعهد الوطني للخرائط، أو وثائق إدارية رسمية). كل مساحة مرتبطة بوثيقة وسنة.",
  },
  {
    icon: Calculator,
    title: "3. الكثافة تُحسب: population ÷ area_km2",
    text: "الكثافة السكانية = عدد السكان ÷ المساحة بالكيلومتر المربع، وتُقرّب إلى أقرب عدد صحيح (نسمة/كم²). نحن لا نخترع الكثافة، بل نحسبها من الرقمين الموثقين أعلاه.",
  },
  {
    icon: ShieldAlert,
    title: "4. لا نحسب الكثافة إذا لم تتوفر القيمتان",
    text: "إذا كان عدد السكان أو المساحة غير متوفرين بمصدر موثق، لا تُحسب الكثافة أصلًا. تظهر رسالة واضحة بدلًا من رقم ناقص.",
  },
  {
    icon: FileCheck2,
    title: "5. الرقم المحسوب ليس رقمًا رسميًا",
    text: "الكثافة التي نحسبها بنفسنا تُصنَّف دائمًا على أنها \"محسوبة بواسطة NABDA\" ولا تُعرض أبدًا كإحصاء صادر عن جهة رسمية.",
  },
  {
    icon: Scale,
    title: "6. كل رقم إحصائي مرتبط بمصدر وسنة",
    text: "لا يعرض النظام أي رقم سكان أو مساحة أو كثافة دون: اسم المصدر، الوثيقة، السنة، درجة الثقة، وتاريخ التحقق. لا أرقام معلّقة في الهواء.",
  },
  {
    icon: EyeOff,
    title: "7. البيانات غير الموثقة لا تُعرض كحقيقة",
    text: "البيانات غير الموثقة لا تظهر أبدًا كأرقام رسمية. نعرض الصيغة الصريحة: \"لا تتوفر حاليًا بيانات رسمية موثقة قابلة للتحقق.\"",
  },
];

export default function MethodologyPage() {
  return (
    <main dir="rtl" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold">
          المنهجية
        </span>

        <h1 className="text-3xl font-black text-slate-900 mt-4">
          منهجية البيانات الإحصائية في NABDA
        </h1>

        <p className="text-slate-600 mt-3 leading-8 text-sm">
          هذه الصفحة توضح كيف نتعامل مع الأرقام التي تعرضها المنصة: من أين
          تأتي، وكيف تُحسب، ومتى لا تُعرض إطلاقًا.
        </p>
      </section>

      {/* The 7 rules */}
      <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        {METHODOLOGY_POINTS.map((point) => (
          <div
            key={point.title}
            className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200"
          >
            <div className="w-12 h-12 shrink-0 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shadow-sm">
              <point.icon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-black text-slate-900 text-sm">{point.title}</h2>
              <p className="text-slate-600 text-xs mt-2 leading-7">
                {point.text}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* Badge glossary */}
      <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-black text-slate-900 mb-5">
          تصنيف الأرقام في المنصة
        </h2>

        <div className="space-y-3 text-xs">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <DataBadge type="official" />
            <p className="text-slate-600 leading-6">
              رقم رسمي منشور من جهة مختصة، مرتبط بوثيقة وسنة.
            </p>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <DataBadge type="calculated" />
            <p className="text-slate-600 leading-6">
              رقم نحسبه من أرقام رسمية موثقة (مثل الكثافة). ليس رقمًا رسميًا.
            </p>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <DataBadge type="estimated" />
            <p className="text-slate-600 leading-6">
              رقم تقديري مبني على مؤشرات؛ يعرض بدرجة ثقة منخفضة وإخلاء مسؤولية.
            </p>
          </div>
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <DataBadge type="undocumented" />
            <p className="text-slate-600 leading-6">
              لا بيانات موثقة؛ نعرض الرسالة الصريحة ولا ننشر رقمًا.
            </p>
          </div>
        </div>
      </section>

      {/* Links */}
      <section className="rounded-3xl bg-slate-900 text-white p-8">
        <h2 className="text-xl font-black mb-2">تفقد المصادر بنفسك</h2>
        <p className="text-slate-300 leading-8 text-sm">
          يمكنك الاطلاع على سجل المصادر الموثقة بالكامل مع روابط الوثائق
          الأصلية في صفحة المصادر.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/sources"
            className="px-6 py-3 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-xs"
          >
            صفحة المصادر
          </Link>
          <Link
            href="/test"
            className="px-6 py-3 rounded-xl border border-slate-600 text-white font-extrabold text-xs"
          >
            ابدأ اختبار الملاءمة
          </Link>
        </div>
      </section>
    </main>
  );
}
