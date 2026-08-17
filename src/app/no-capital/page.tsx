import Link from "next/link";
import { Sparkles, ClipboardList, Target, Megaphone, Users, ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "ابدأ مشروعك بدون رأس مال | NABDA",
  description: "اكتشف أفكار مشاريع تبدأ بدون رأس مال، مع خطة 90 يوماً وخطة أول عميل وخطة تسويق عملية.",
};

const features = [
  {
    icon: ClipboardList,
    title: "اختبار مخصص",
    desc: "أجب على 7 أسئلة قصيرة لتحصل على توصيات مبنية على وقتك ومهاراتك ووسائلك المتاحة.",
    href: "/no-capital/test",
  },
  {
    icon: Target,
    title: "خطة 90 يوماً",
    desc: "خريطة عمل شهرية أسبوعية من اختيار الفكرة إلى أول عميلين ثابتين.",
    href: "/no-capital/plans",
  },
  {
    icon: Users,
    title: "خطة أول عميل",
    desc: "منهجية عملية للوصول إلى أول عميل مدفوع بأساليب لا تحتاج ميزانية.",
    href: "/no-capital/first-order",
  },
  {
    icon: Megaphone,
    title: "خطة تسويق",
    desc: "خلطات قنوات تسويقية حسب ميزانيتك (صفر، صغيرة، متكاملة).",
    href: "/no-capital/marketing",
  },
];

export default function NoCapitalPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
      <section className="bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 space-y-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-extrabold">
            <Sparkles className="w-3.5 h-3.5" />
            مشاريع تبدأ بدون رأس مال
          </span>

          <h1 className="text-3xl sm:text-5xl font-black leading-tight max-w-3xl">
            عندك الوقت والمهارة... <br />
            <span className="text-emerald-400">ولا تحتاج رأس مال للبداية</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            اكتشف أفكاراً تبدأ من صفر دينار، تعتمد على ما تملكه اليوم: وقتك،
            مهاراتك، هاتفك واتصالك. ستجد مع كل فكرة خطة 90 يوماً وخطة أول عميل
            وخطة تسويق تناسب ميزانيتك.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/no-capital/test"
              className="px-7 py-3.5 rounded-2xl bg-emerald-500 text-slate-900 font-black text-sm hover:bg-emerald-400 transition-colors inline-flex items-center justify-center gap-2"
            >
              ابدأ الاختبار المجاني
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <Link
              href="/no-capital/plans"
              className="px-6 py-3.5 rounded-2xl border border-slate-600 text-white font-bold text-sm hover:bg-slate-800 transition-colors inline-flex items-center justify-center"
            >
              شاهد خطة 90 يوماً مباشرة
            </Link>
          </div>

          <div className="flex items-center gap-2 pt-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            النتائج استرشادية. سنطلب موافقتك قبل عرضها، ونتائج الاختبار لا تحتاج
            أي بيانات شخصية.
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-black">ماذا ستحصل عليه؟</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            مسار كامل من الفكرة إلى أول عميل، بدون إنفاق مادي.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature) => (
            <Link
              key={feature.href}
              href={feature.href}
              className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-emerald-400 hover:shadow-lg transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <feature.icon className="w-5 h-5" />
              </div>

              <h3 className="font-black text-sm sm:text-base mb-1.5">
                {feature.title}
              </h3>

              <p className="text-xs text-slate-500 leading-relaxed">
                {feature.desc}
              </p>
            </Link>
          ))}
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-black text-lg">لست متأكداً من أين تبدأ؟</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              الاختبار يستغرق أقل من دقيقتين ولا يطلب منك أي معلومات شخصية.
            </p>
          </div>

          <Link
            href="/no-capital/test"
            className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-extrabold text-xs hover:bg-slate-800 transition-colors"
          >
            أبدأ الاختبار الآن
          </Link>
        </div>
      </section>
    </main>
  );
}
