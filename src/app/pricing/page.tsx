import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Check, ShieldCheck, Heart } from "lucide-react";
import { PROJECT_COUNT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "الأسعار",
  description: "منصة NABDA مجانية بالكامل — لا توجد اشتراكات أو رسوم خفية. استخدم جميع الأدوات والحسابات مجاناً.",
};

export default function FreePricingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-800 text-xs font-extrabold border border-indigo-200">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>خبر سار لجميع المستخدمين</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight">
          منصة NABDA <span className="text-indigo-600">مجانية بالكامل</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          اتخذنا قراراً بأن نُبقي جميع أدوات منصة NABDA، التقييم، الحاسبات، ودراسات الجدوى متاحة بشكل مجاني 100% لجميع الشباب والمقاولين الجزائريين بدون اشتراكات أو رسوم مخفية.
        </p>
      </div>

      {/* Main Free Box */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border-4 border-indigo-500/60 space-y-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1b4b_1px,transparent_1px),linear-gradient(to_bottom,#1e1b4b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />

        <div className="relative text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-extrabold border border-indigo-500/30">
            <Heart className="w-4 h-4 text-indigo-400 fill-indigo-400" />
            <span>لأن رؤيتنا هي خدمة الشباب الجزائري قبل كل شيء</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black mt-4 leading-tight">
            <span className="text-indigo-400">0 دج</span>
            <br />
            <span className="text-2xl sm:text-3xl text-slate-300">رسوم الاستخدام</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            كل أداة، كل حاسبة، وكل دراسة جدوى متاحة الآن بلا حدود وبدون أي اشتراك شهري أو سنوي.
          </p>
        </div>

        {/* All Features Included */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-700/60">
          {[
            "اختبار الوضع والملاءمة (11 سؤالاً)",
            "أفضل 5 مشاريع مناسبة لظروفك",
            "حاسبة الأرباح ونقطة التعادل الكاملة",
            "محاكي السيناريوهات (What-If)",
            "اختبار فكرتك الخاصة (Idea Test)",
            "مُولد خطة 30 يوم",
            `تفاصيل كاملة لكل مشروع مع ${PROJECT_COUNT} فكرة`,
            "تصدير التقارير وتنزيلها PDF",
            "لوحة تحكم شخصية لحفظ الاختبارات",
            "بدون حدود وبدون اشتراك",
          ].map((feature, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm text-slate-200 font-medium">
              <Check className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3 pt-6 border-t border-slate-700/60">
          <Link
            href="/test"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white font-extrabold text-base sm:text-lg shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            ابدأ اختبار وضعك الآن مجاناً
          </Link>
        </div>
      </div>

      {/* Why Free Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900">رسالتنا قبل الربح</h3>
          <p className="text-slate-600 leading-relaxed">
            "قبل ما تبدأ مشروعك... اختبره. نحن لا نبيع لك حلمًا. نحن نحاول أن نريك تكلفة القرار قبل أن تتخذه." – هذه هي فلسفتنا. الربح ليس هدفاً أولوياً في هذه المرحلة.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Heart className="w-5 h-5 fill-amber-500" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900">خدمة للشباب الجزائري</h3>
          <p className="text-slate-600 leading-relaxed">
            نؤمن بأن كل شاب جزائري يستحق فرصة حقيقية لاتخاذ قراره الاستثماري بأمان. لذلك رفعنا كل الحواجز المالية بين المستخدم وأدوات التقييم.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-fuchsia-50 text-fuchsia-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900">تجربة قبل أي التزام</h3>
          <p className="text-slate-600 leading-relaxed">
            إن أعجبك الموقع ووجدته مفيداً، يمكنك دعم استمراره ومشاركته مع أصدقائك ومحيطك فقط. لا يوجد أي التزام مالي.
          </p>
        </div>
      </div>

      {/* Final Disclaimer */}
      <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200 text-xs text-slate-600 text-center leading-relaxed">
        ⚠️ تنبيه: NABDA لا تدّعي ضمان الأرباح. جميع النتائج تقديرات ومحاكاة مبنية على معطياتك وظروف السوق. قرار الاستثمار النهائي يبقى مسؤوليتك الكاملة.
      </div>
    </div>
  );
}
