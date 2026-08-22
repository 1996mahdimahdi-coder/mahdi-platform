import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PLATFORM_GUIDES } from "@/lib/platformGuides";

export default function LearnContentPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        <div className="text-center">
          <h1 className="text-2xl sm:text-4xl font-black">تعلّم صناعة المحتوى لكل منصة</h1>
          <p className="text-sm text-slate-500 mt-3 max-w-2xl mx-auto">
            اضغط على أي منصة لتتعلمها بالتفصيل: شنو تصلح لها، كيفاش تبدأ، وشنو تتجنب — بطريقة بسيطة ودقيقة.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PLATFORM_GUIDES.map((g) => (
            <Link
              key={g.slug}
              href={`/learn/content/${g.slug}`}
              className="group bg-white rounded-2xl border border-slate-200 p-6 hover:border-indigo-400 hover:shadow-lg transition-all"
            >
              <span className="text-4xl">{g.icon}</span>
              <h2 className="font-black text-xl mt-3 group-hover:text-indigo-600 transition-colors">{g.name}</h2>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">{g.tagline}</p>
              <p className="text-xs font-bold text-indigo-600 mt-3 inline-flex items-center gap-1">
                اقرأ الدليل الكامل <ArrowLeft className="w-3.5 h-3.5" />
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}