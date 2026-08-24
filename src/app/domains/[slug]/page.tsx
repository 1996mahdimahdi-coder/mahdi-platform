import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronLeft, CheckCircle2, AlertTriangle } from "lucide-react";
import { getDomainBySlug, DEFAULT_DOMAINS } from "@/lib/domainsData";

export async function generateStaticParams() {
  return DEFAULT_DOMAINS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = getDomainBySlug(slug);
  if (!d) return { title: "المجال غير موجود" };
  return { title: d.nameAr, description: d.definition };
}

export default async function DomainPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = getDomainBySlug(slug);
  if (!d) notFound();

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
        <Link href="/domains" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600">
          <ChevronLeft className="w-3.5 h-3.5 rotate-180" />
          كل المجالات
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-5xl">{d.icon}</span>
          <div>
            <h1 className="text-2xl sm:text-4xl font-black">{d.nameAr}</h1>
            <p className="text-xs text-slate-500 mt-1">رأس المال: {d.capitalLevel}</p>
          </div>
        </div>

        {d.regulated && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-800 text-xs font-bold">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            بعض الأنشطة في هذا المجال تتطلب شروطاً أو تراخيص — النشاط المقنن لا يعني &quot;مشروعاً ممنوعاً&quot;، بل يحتاج احترام شروط ممارسة النشاط.
          </div>
        )}

        <section className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-black mb-2">📖 تعريف المجال</h2>
          <p className="text-sm text-slate-700 leading-relaxed">{d.definition}</p>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-black mb-3">💻 ماذا تحتاج للانطلاق</h2>
          <ul className="space-y-2">
            {d.requirements.map((r) => (
              <li key={r} className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                {r}
              </li>
            ))}
          </ul>
        </section>

        <div className="grid sm:grid-cols-2 gap-4">
          <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
            <h2 className="font-black text-emerald-800 mb-3">🟢 أساسيات ضرورية (بلا رأس مال)</h2>
            <ul className="space-y-2">
              {d.essentials.map((r) => (
                <li key={r} className="flex items-start gap-2 text-sm text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  {r}
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <h2 className="font-black text-amber-800 mb-3">🟡 ثانوية (إذا توفر رأس مال)</h2>
            <ul className="space-y-2">
              {d.secondary.map((r) => (
                <li key={r} className="flex items-start gap-2 text-sm text-amber-900">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  {r}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-black mb-3">📋 المشاريع الفرعية ({d.services.length})</h2>
          <div className="flex flex-wrap gap-2">
            {d.services.map((s) => (
              <Link
                key={s}
                href={`/projects?q=${encodeURIComponent(s)}`}
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-indigo-100 hover:text-indigo-700 border border-transparent hover:border-indigo-300 transition-colors"
              >
                {s} ←
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
