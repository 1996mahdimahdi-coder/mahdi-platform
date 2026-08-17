import Link from "next/link";
import { ShieldCheck, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="space-y-2 border-b border-slate-100 pb-4">
          <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold">
            عن المنصة
          </span>
          <h1 className="text-3xl font-black text-slate-900">
            NABDA
          </h1>
          <p className="text-sm font-bold text-indigo-600">
            "قبل ما تبدأ مشروعك... اختبره"
          </p>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            <strong>NABDA</strong> هي منصة جزائرية متخصصة في مساعدة المقاولين الشباب وأصحاب رؤوس الأموال المصغرة على اختبار مدى ملاءمة المشروع قبل البدء، بدلاً من الاعتماد على العاطفة أو التجارب العشوائية.
          </p>

          <p>
            المنصة ليست مجرد قائمة أفكار عادية، وليست موقعاً لإنشاء Business Plan معقد. نحن نركز على <strong>الملاءمة الشخصية والمالية والمحلية</strong> للمستخدم بناءً على ميزانيته، ولايته، بلديته، ووقته المتاح.
          </p>

          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
            <h2 className="font-extrabold text-amber-400 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              هوية ورسالة NABDA
            </h2>
            <p className="text-slate-300 text-xs">
              "قبل ما تبدأ مشروعك... اختبره. نحن لا نبيع لك حلمًا. نحن نحاول أن نريك تكلفة القرار قبل أن تتخذه."
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <Link href="/test" className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-extrabold text-xs">
            اختبر وضعك الآن
          </Link>
        </div>
      </div>
    </div>
  );
}
