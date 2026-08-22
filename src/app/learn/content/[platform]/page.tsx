import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronLeft, CheckCircle2, XCircle, Clock, CalendarClock, Lightbulb, Wrench } from "lucide-react";
import { PLATFORM_GUIDES } from "@/lib/platformGuides";

export async function generateStaticParams() {
  return PLATFORM_GUIDES.map((p) => ({ platform: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ platform: string }> }): Promise<Metadata> {
  const { platform } = await params;
  const g = PLATFORM_GUIDES.find((p) => p.slug === platform);
  if (!g) return { title: "المنصة غير موجودة — NABDA" };
  return { title: `دليل ${g.name} — NABDA`, description: g.tagline };
}

export default async function PlatformPage({ params }: { params: Promise<{ platform: string }> }) {
  const { platform } = await params;
  const g = PLATFORM_GUIDES.find((p) => p.slug === platform);
  if (!g) notFound();

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
        <Link href="/learn/content" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600">
          <ChevronLeft className="w-3.5 h-3.5 rotate-180" />
          كل المنصات
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-5xl">{g.icon}</span>
          <div>
            <h1 className="text-2xl sm:text-4xl font-black">دليل {g.name}</h1>
            <p className="text-sm text-slate-500 mt-1">{g.tagline}</p>
          </div>
        </div>

        <section className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5">
          <h2 className="font-black text-indigo-900 mb-2">💡 ليش {g.name} تصلح لمشروعك؟</h2>
          <p className="text-sm text-indigo-900/80 leading-relaxed">{g.why}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {g.bestFor.map((b) => (
              <span key={b} className="text-[11px] font-bold bg-white text-indigo-700 rounded-full px-3 py-1 border border-indigo-200">{b}</span>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
          <h2 className="font-black">📱 أنواع المحتوى</h2>
          {g.contentTypes.map((c) => (
            <div key={c.title} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">{c.title}</p>
                <p className="text-xs text-slate-600">{c.desc}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
          <h2 className="font-black">🚀 كيفاش تبدأ (خطوة بخطوة)</h2>
          {g.steps.map((s, i) => (
            <div key={s.title} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-black flex items-center justify-center shrink-0">{i + 1}</span>
              <div>
                <p className="font-bold text-sm">{s.title}</p>
                <p className="text-xs text-slate-600">{s.detail}</p>
              </div>
            </div>
          ))}
        </section>

        <div className="grid sm:grid-cols-2 gap-4">
          <section className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
            <h2 className="font-black text-sm flex items-center gap-2"><CalendarClock className="w-4 h-4 text-indigo-600" /> مواعيد النشر</h2>
            <p className="text-xs text-slate-600 font-bold">التردد: {g.cadence}</p>
            {g.bestTimes.map((t) => (
              <p key={t} className="text-xs text-slate-600 flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-slate-400" /> {t}</p>
            ))}
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
            <h2 className="font-black text-sm flex items-center gap-2"><Wrench className="w-4 h-4 text-indigo-600" /> أدوات مجانية</h2>
            {g.tools.map((t) => (
              <p key={t} className="text-xs text-slate-600 flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {t}</p>
            ))}
          </section>
        </div>

        <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-2">
          <h2 className="font-black text-emerald-900 flex items-center gap-2"><Lightbulb className="w-4 h-4" /> نصائح ذهبية</h2>
          {g.tips.map((t) => (
            <p key={t} className="text-xs text-emerald-900 flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" /> {t}</p>
          ))}
        </section>

        <section className="bg-rose-50 border border-rose-200 rounded-2xl p-5 space-y-2">
          <h2 className="font-black text-rose-900 flex items-center gap-2"><XCircle className="w-4 h-4" /> أخطاء تجنّبها</h2>
          {g.mistakes.map((m) => (
            <p key={m} className="text-xs text-rose-900 flex items-start gap-2"><XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" /> {m}</p>
          ))}
        </section>
      </div>
    </main>
  );
}