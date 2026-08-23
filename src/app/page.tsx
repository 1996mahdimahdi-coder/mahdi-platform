import Link from "next/link";
import {
  Sparkles,
  Compass,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Lightbulb,
  AlertTriangle,
  ArrowLeft,
  DollarSign,
  Target,
  BarChart3,
  Rocket,
  GraduationCap,
} from "lucide-react";
import PlatformIcon from "@/components/PlatformIcon";

const SOCIAL_LINKS = [
  { label: "Facebook", href: "https://web.facebook.com/profile.php?id=61593142754403", platform: "facebook" },
  { label: "Instagram", href: "https://www.instagram.com/nabda_2026/", platform: "instagram" },
] as const;

export default function HomePage() {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Decorative Grid BG */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1b4b_1px,transparent_1px),linear-gradient(to_bottom,#1e1b4b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40" />

        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-semibold backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>قبل ما تبدأ مشروعك... اختبره</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight sm:leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-violet-100 to-white">
              عندك رأس مال ومحتار
            </span>{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-violet-300 to-fuchsia-300">
              واش تدير؟
            </span>
          </h1>

          {/* Brand Identity Subhead */}
          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            منصة <strong className="text-white">NABDA</strong> تساعدك على اختبار مدى ملاءمة المشروع لرأس مالك ووقتك وموقعك الجغرافي قبل أن تبدأ، مع محاكاة مالية وخطة تنفيذ عملية.
          </p>

          {/* Primary CTA & Secondary Links */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/test"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-fuchsia-600 text-white font-extrabold text-lg shadow-xl shadow-indigo-900/30 hover:shadow-indigo-900/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              <Sparkles className="w-6 h-6" />
              <span>اختبر وضعي الآن</span>
            </Link>

            <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
              <Link
                href="/projects"
                className="px-4 py-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:bg-slate-700 text-slate-200 text-sm font-bold transition-all text-center flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4 text-slate-400" />
                استكشف المشاريع
              </Link>
              <Link
                href="/calculator"
                className="px-4 py-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:bg-slate-700 text-slate-200 text-sm font-bold transition-all text-center flex items-center justify-center gap-2"
              >
                <Calculator className="w-4 h-4 text-indigo-400" />
                حاسبة الربح
              </Link>
            </div>
          </div>

          {/* Trust Value Statement */}
          <div className="pt-6 max-w-2xl mx-auto">
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-slate-300 text-xs sm:text-sm flex items-start sm:items-center justify-center gap-3 text-right">
              <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5 sm:mt-0" />
              <span>
                <strong>أهم مبدأ لدينا:</strong> لا نقول لك "هذا المشروع مضمون 100%"، بل نقول "هذا المشروع الأكثر توافقًا مع ظروفك الحالية". قبل ما تبدأ مشروعك... اختبره.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* What Do You Want To Do? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            ماذا تريد أن تفعل؟
          </h2>
          <p className="text-sm text-slate-600">
            اختر وضعك المالي وسنوجّهك نحو المسار الأنسب لك
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Capital Path */}
          <Link
            href="/test"
            className="group p-7 rounded-3xl bg-white border border-slate-200 hover:border-indigo-500 hover:shadow-lg transition-all flex flex-col gap-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Target className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                عندي رأس مال ومحتار
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                املأ اختبار الوضع لتحصل على أفضل 5 مشاريع مناسبة لرأس مالك وولايتك ومهاراتك، مع محاكاة مالية وخطة تنفيذ عملية.
              </p>
            </div>
            <div className="mt-auto flex items-center gap-1.5 text-sm font-bold text-indigo-600 pt-2">
              <span>اختبر وضعي الآن</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* No-Capital Path */}
          <Link
            href="/no-capital"
            className="group p-7 rounded-3xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all flex flex-col gap-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Rocket className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                ما عنديش رأس مال
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                ابدأ مشروعك بدون رأس مال: أجب على 7 أسئلة قصيرة واحصل على مشاريع مبادلة مهارات، مع خطط 90 يومًا وخطة أول عميل وتسويق عملي.
              </p>
            </div>
            <div className="mt-auto flex items-center gap-1.5 text-sm font-bold text-emerald-600 pt-2">
              <span>ابدأ بدون رأس مال</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Learn Path */}
          <Link
            href="/learn"
            className="group p-7 rounded-3xl bg-white border border-slate-200 hover:border-fuchsia-500 hover:shadow-lg transition-all flex flex-col gap-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-fuchsia-50 text-fuchsia-600 flex items-center justify-center group-hover:bg-fuchsia-600 group-hover:text-white transition-colors">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-fuchsia-600 transition-colors">
                بغيت نتعلم
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                تصفح دورات قصيرة، دروس، أفكار محتوى، عناوين جاهزة وفيديوهات عملية لتطوير مهاراتك قبل الإطلاق.
              </p>
            </div>
            <div className="mt-auto flex items-center gap-1.5 text-sm font-bold text-fuchsia-600 pt-2">
              <span>تصفح مركز التعلم</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Explore Projects */}
          <Link
            href="/projects"
            className="group p-7 rounded-3xl bg-white border border-slate-200 hover:border-slate-500 hover:shadow-lg transition-all flex flex-col gap-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-slate-700 group-hover:text-white transition-colors">
              <Compass className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                بغيت نتصفح المشاريع
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                استكشف دراسات الجدوى السريعة لأكثر من 25 مشروعًا مصنّفًا حسب رأس المال والولاية والمهارات.
              </p>
            </div>
            <div className="mt-auto flex items-center gap-1.5 text-sm font-bold text-slate-600 pt-2">
              <span>استكشف المشاريع</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* Quick Capital Jump */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            اختر رأس مالك المتاح واستكشف الخيارات
          </h2>
          <p className="text-sm text-slate-600">
            تصفح دراسات الجدوى السريعة لـ 25+ مشروعًا وفق ميزانيتك بالدينار الجزائري (دج)
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/test?capital=30000"
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500 hover:shadow-lg transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              5
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              أقل من 5 ملايين (50 ألف دج)
            </h3>
            <p className="text-xs text-slate-500 mt-2">
              مشاريع خدمات منزلية، أونلاين، صناعة محتوى وحلويات من المنزل بدون إيجار.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-indigo-600">
              <span>اختبر هذه الفئة</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/test?capital=80000"
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500 hover:shadow-lg transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              10
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              5 إلى 10 ملايين (100 ألف دج)
            </h3>
            <p className="text-xs text-slate-500 mt-2">
              طباعة حرارية، إكسسوارات هواتف، غسيل متنقل، وتجارة العسل والزيوت.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-indigo-600">
              <span>اختبر هذه الفئة</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/test?capital=200000"
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500 hover:shadow-lg transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              20
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              10 إلى 20 مليون (200 ألف دج)
            </h3>
            <p className="text-xs text-slate-500 mt-2">
              تجارة ملابس إلكترونية، صيانة كمبيوتر، عطور مستوردة، وخدمات تنظيف.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-indigo-600">
              <span>اختبر هذه الفئة</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/test?capital=500000"
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500 hover:shadow-lg transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              50+
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              أكثر من 50 مليون (500 ألف دج)
            </h3>
            <p className="text-xs text-slate-500 mt-2">
              محل تجاري مصغر، معدات تنظيف شمسية، توزيع منتجات، وتجارة جملة إلكترونية.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-indigo-600">
              <span>اختبر هذه الفئة</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-slate-100 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
              كيف يعمل نظام تقييم NABDA؟
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              رحلة خالية من التعقيد تحول أفكارك إلى خيارات رقمية قابلة للحساب والتطبيق الميداني
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-lg mb-4">
                1
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">إدخال معلوماتك</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                تُجيب على 11 سؤالاً بسيطاً حول رأس مالك، ولايتك، مكان عملك، وقتك، ومهاراتك المتوفرة.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-lg mb-4">
                2
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">تحليل محرك النقاط</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                يقوم النظام بتقييم 8 محاور (مالية، محلية، شخصية، مخاطرة، إلخ) وإعطاء درجة من 100 لكل مشروع.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-lg mb-4">
                3
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">أفضل 5 مشاريع مناسبة</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                تحصل على قائمة مرتبة تنازلياً مع درجات التوافق وأسباب التوصية الشفافة لكل اختيار.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-lg mb-4">
                4
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">المحاكاة وخطة التنفيذ</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                تصفح حاسبة نقطة التعادل، وسيناريوهات الأرباح، مع خطة تنفيذ عملية لمدة 30 يوماً.
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link
              href="/test"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 text-white font-extrabold hover:bg-indigo-700 transition-colors shadow-md"
            >
              <Sparkles className="w-5 h-5" />
              ابدأ اختبار الوضع الآن
            </Link>
          </div>
        </div>
      </section>

      {/* Scoring Engine Breakdown */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-700">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                معيار النقاط الـ 8 (Scoring System)
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-snug">
                كيف نحسب درجة الملاءمة لـ 100 نقطة؟
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                تعتمد NABDA على معادلة برمجية ثابتة خالية من العواطف والتوقعات الخيالية لتوزيع النقاط كالتالي:
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                  <span className="text-slate-300">الملاءمة المالية</span>
                  <span className="font-extrabold text-indigo-400">25 نقطة</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                  <span className="text-slate-300">الملاءمة الشخصية والمهارات</span>
                  <span className="font-extrabold text-indigo-400">15 نقطة</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                  <span className="text-slate-300">ملاءمة طريقة العمل</span>
                  <span className="font-extrabold text-indigo-400">10 نقاط</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                  <span className="text-slate-300">ملاءمة المنطقة والولاية</span>
                  <span className="font-extrabold text-indigo-400">15 نقطة</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                  <span className="text-slate-300">مستوى المخاطرة المقبول</span>
                  <span className="font-extrabold text-indigo-400">10 نقاط</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                  <span className="text-slate-300">سهولة السرعة والبداية</span>
                  <span className="font-extrabold text-indigo-400">10 نقاط</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                  <span className="text-slate-300">قابلية التوسع والنمو</span>
                  <span className="font-extrabold text-indigo-400">10 نقاط</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                  <span className="text-slate-300">توافق الساعات والوقت</span>
                  <span className="font-extrabold text-indigo-400">5 نقاط</span>
                </div>
              </div>
            </div>

            {/* Score Result Badges Display Box */}
            <div className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700 space-y-4">
              <h3 className="text-base font-bold text-slate-200 border-b border-slate-700 pb-3">
                تصنيف نتيجتك النهائية:
              </h3>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-indigo-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🟢</span>
                    <span className="font-bold">مناسب جدًا</span>
                  </div>
                  <span className="font-mono font-bold">80 - 100 نقطة</span>
                </div>

                <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🟡</span>
                    <span className="font-bold">مناسب مع شروط</span>
                  </div>
                  <span className="font-mono font-bold">60 - 79 نقطة</span>
                </div>

                <div className="p-3 rounded-xl bg-orange-950/60 border border-orange-500/40 text-orange-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🟠</span>
                    <span className="font-bold">يحتاج دراسة إضافية</span>
                  </div>
                  <span className="font-mono font-bold">40 - 59 نقطة</span>
                </div>

                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🔴</span>
                    <span className="font-bold">غير مناسب حاليًا</span>
                  </div>
                  <span className="font-mono font-bold">أقل من 40 نقطة</span>
                </div>
              </div>

              <div className="pt-2 text-xs text-slate-400 text-center">
                نتائج التقييم محاكاة مبنية على الظروف المدخلة ولا تعتبر ضمانًا قانونيًا أو ماليًا للربح.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Standalone Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            أدوات مالية وعملية مجانية لمشروعك
          </h2>
          <p className="text-sm text-slate-600">
            استفد من الحاسبات المستقلة بدون الحاجة لإكمال الاختبار في كل مرة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tool 1 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:shadow-lg transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Calculator className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              حاسبة الربح ونقطة التعادل
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              أدخل سعر الشراء، سعر البيع والمصاريف الثابتة لمعرفة عدد الوحدات الواجب بيعها شهرياً لتغطية كامل مصاريفك بالدينار.
            </p>
            <Link
              href="/calculator"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 pt-2"
            >
              <span>افتتح الحاسبة</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          {/* Tool 2 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:shadow-lg transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Lightbulb className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              مُختبر الفكرة الخاصة (Idea Test)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              لديك فكرة مشروع خاصة في رأسك؟ أدخل اسم الفكرة وسيقوم النظام بتفليك مخاطرها، وتوزيع رأس مالها ومزاياها.
            </p>
            <Link
              href="/idea-test"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 pt-2"
            >
              <span>اختبر فكرتك الآن</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          {/* Tool 3 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:shadow-lg transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-fuchsia-50 text-fuchsia-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              محاكي السيناريوهات (What-If)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              شاهد تأثير انخفاض المبيعات بـ 30% أو ارتفاع مصاريف الإعلانات فورياً على صافي هامش الأرباح الخاصة بمشروعك.
            </p>
            <Link
              href="/simulator"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-fuchsia-600 hover:text-fuchsia-700 pt-2"
            >
              <span>جرب المحاكاة التفاعلية</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900">
              أسئلة شائعة حول منصة NABDA
            </h2>
            <p className="text-xs text-slate-500">
              إجابات مباشرة وشفافة حول كيفية أخذ القرارات المالية الصحيحة
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                هل النتائج المقدمة تضمن الأرباح والنجاح؟
              </h3>
              <p className="text-slate-600 leading-relaxed">
                لا، أي منصة توعد بالربح المضمون هي منصة تبيع الوهم. جميع النتائج عبارة عن محاكاة وتقديرات مستندة لدراسات السوق والأسعار الفعلية بالجزائر، وملاءمة المشروع تتوقف أيضاً على التزامك بالتنفيذ الميداني.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                هل أستطيع تجربة اختبار الوضع مجاناً؟
              </h3>
              <p className="text-slate-600 leading-relaxed">
                نعم! NABDA مجانية بالكامل. يمكنك إجراء الاختبار الأساسي والحصول على أفضل 5 مشاريع وأدوات المحاكاة مجاناً وبدون الحاجة لإدخال بطاقة دفع.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                هل البيانات تشمل جميع ولايات بلديات الجزائر؟
              </h3>
              <p className="text-slate-600 leading-relaxed">
                نعم، قاعدة بيانات NABDA تحتوي على 69 ولاية مع البلديات التابعة لها لتحديد نطاق الملاءمة الجغرافية والمنطقة (مدن كبرى، بلديات صحراوية، ساحلية، أو زراعية).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              تابع NABDA على مواقع التواصل
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              انضم إلى مجتمعنا للحصول على نصائح عملية وأحدث المحتوى
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-slate-900 text-white text-sm font-extrabold hover:bg-slate-800 hover:scale-[1.03] active:scale-[0.98] transition-all"
              >
                <PlatformIcon platform={link.platform} size={20} />
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-xl">
          <h2 className="text-2xl sm:text-4xl font-black">
            جاهز لاكتشاف مشروعك المناسب في الجزائر؟
          </h2>
          <p className="text-indigo-100 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            يستغرق الاختبار أقل من دقيقتين ويحميك من اتخاذ قرار استثماري عشوائي. <strong>قبل ما تبدأ مشروعك... اختبره.</strong>
          </p>
          <div>
            <Link
              href="/test"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-slate-900 font-extrabold text-base sm:text-lg hover:bg-slate-100 transition-all shadow-lg"
            >
              <Sparkles className="w-5 h-5 text-indigo-600" />
              ابدأ اختبر وضعي الآن
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
