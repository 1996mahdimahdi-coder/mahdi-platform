import Link from "next/link";
import { BookOpen, Sparkles, Video, LayoutGrid, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "تعلم وأنشئ محتوى",
  description: "دروس مجانية، أفكار محتوى، مكتبة hooks وفيديوهات لتطوير مشروعك.",
};

const sections = [
  {
    icon: BookOpen,
    title: "الدورات المجانية",
    desc: "دروس مبسطة للمبتدئين في التسويق والبيع والخدمات.",
    href: "/learn/courses",
    color: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
  },
  {
    icon: Sparkles,
    title: "أفكار المحتوى",
    desc: "أنواع المحتوى وأفضل الممارسات وخطط النشر لكل منصة.",
    href: "/learn/content",
    color: "bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white",
  },
  {
    icon: LayoutGrid,
    title: "مكتبة hooks",
    desc: "جمل تفتح بها فيديوهاتك وتجذب الانتباه في أول ثوانٍ.",
    href: "/learn/hooks",
    color: "bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white",
  },
  {
    icon: Video,
    title: "الفيديوهات",
    desc: "شرائط مرئية لشرح المفاهيم العملية خطوة بخطوة.",
    href: "/learn/videos",
    color: "bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white",
  },
];

export default function LearnPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        <div className="border-b border-slate-200 pb-6">
          <span className="text-xs font-black text-emerald-600 uppercase tracking-wider">
            التعلم والنمو
          </span>

          <h1 className="text-2xl sm:text-4xl font-black mt-1">تعلم وابدأ في صناعة المحتوى</h1>

          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            محتوى عملي مجاني: دروس، أفكار نشر، hooks فيديو وفيديوهات تطبيقية.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group bg-white rounded-3xl border border-slate-200 p-6 hover:border-emerald-400 hover:shadow-lg transition-all flex items-start gap-4"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${section.color}`}>
                <section.icon className="w-6 h-6" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-black text-sm sm:text-base">{section.title}</h2>
                  <ArrowLeft className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors shrink-0" />
                </div>

                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{section.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
