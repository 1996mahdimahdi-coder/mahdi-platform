import Link from "next/link";
import { ShieldCheck, Heart, ArrowLeft, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-fuchsia-500 flex items-center justify-center text-white font-black text-xs">
                NB
              </div>
              <span className="font-extrabold text-xl text-white">
                NABDA
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              منصة NABDA تساعدك على اختبار مدى ملاءمة مشروعك لوضعك المالي والشخصي والمحلي قبل أن تبدأ، لتقليل المخاطرة وزيادة فرص النجاح في الجزائر.
            </p>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-amber-300 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                "قبل ما تبدأ مشروعك... اختبره. نحن نحاول أن نريك تكلفة القرار قبل أن تتخذه."
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              أدوات المنصة
            </h3>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/test" className="hover:text-indigo-400 transition-colors flex items-center gap-1">
                  <ArrowLeft className="w-3 h-3 text-slate-500" />
                  اختبار الوضع والملاءمة
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="hover:text-indigo-400 transition-colors flex items-center gap-1">
                  <ArrowLeft className="w-3 h-3 text-slate-500" />
                  حاسبة الربح ونقطة التعادل
                </Link>
              </li>
              <li>
                <Link href="/simulator" className="hover:text-indigo-400 transition-colors flex items-center gap-1">
                  <ArrowLeft className="w-3 h-3 text-slate-500" />
                  محاكاة سيناريوهات المبيعات
                </Link>
              </li>
              <li>
                <Link href="/idea-test" className="hover:text-indigo-400 transition-colors flex items-center gap-1">
                  <ArrowLeft className="w-3 h-3 text-slate-500" />
                  اختبار فكرتك الخاصة
                </Link>
              </li>
              <li>
                <Link href="/plan" className="hover:text-indigo-400 transition-colors flex items-center gap-1">
                  <ArrowLeft className="w-3 h-3 text-slate-500" />
                  مُولد خطة 30 يوم
                </Link>
              </li>
            </ul>
          </div>

          {/* Content & SEO Pages */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              دليل الاستثمار
            </h3>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/projects" className="hover:text-indigo-400 transition-colors">
                  قاعدة جميع المشاريع الجزائرية
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-indigo-400 transition-colors">
                  مشاريع بـ 5 ملايين سنتيم (50 ألف دج)
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-indigo-400 transition-colors">
                  مشاريع بـ 10 ملايين سنتيم (100 ألف دج)
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-indigo-400 transition-colors">
                  مدونة NABDA
                </Link>
              </li>
              <li>
                <Link href="/sources" className="hover:text-indigo-400 transition-colors">
                  مصادرنا الموثوقة
                </Link>
              </li>
              <li>
                <Link href="/methodology" className="hover:text-indigo-400 transition-colors">
                  منهجية البيانات
                </Link>
              </li>
              <li className="pt-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-bold border border-indigo-500/30">
                  ✨ المنصة مجانية بالكامل
                </span>
              </li>
            </ul>
          </div>

          {/* Legal & About */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              معلومات واشتراطات
            </h3>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/about" className="hover:text-indigo-400 transition-colors">
                  عن منصة NABDA
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-indigo-400 transition-colors">
                  الشروط والأحكام
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-indigo-400 transition-colors">
                  سياسة الخصوصية
                </Link>
              </li>
            </ul>

            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                <span>الجزائر العاصمة، الجزائر</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-500" />
                <span>nabda2026@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} NABDA. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>صُنِع بـ</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>لخدمة الشباب والمقاولين بالجزائر</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
