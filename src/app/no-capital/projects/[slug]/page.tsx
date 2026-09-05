import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Wrench, Brain, Clock, AlertTriangle, ThumbsUp, ThumbsDown, Target, Megaphone, ChevronLeft } from "lucide-react";
import NoCapitalActions from "@/components/NoCapitalActions";
import ProjectVideo from "@/components/ProjectVideo";
import { getProjectVideos } from "@/lib/projectVideos";
import type { NoCapitalPdfData } from "@/lib/pdfExport";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, noCapitalProjects } from "@/db/schema";
import { DEFAULT_NO_CAPITAL_PROJECTS } from "@/lib/noCapital/defaults";
import { DEFAULT_FIRST_ORDER_PLAN, DEFAULT_MARKETING_PLANS } from "@/lib/noCapital/publicData";

export const dynamic = "force-dynamic";

const MATCH_STYLES: Record<string, { label: string; className: string }> = {
  high: { label: "توافق عالٍ", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  medium: { label: "توافق متوسط", className: "bg-amber-100 text-amber-700 border-amber-200" },
  low: { label: "توافق مبدئي", className: "bg-slate-100 text-slate-600 border-slate-200" },
};

export default async function NoCapitalProjectPage(props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ score?: string; level?: string; reason?: string }>;
}) {
  const { slug } = await props.params;
  const sp = await props.searchParams;

  let project: Record<string, unknown> | null = null;
  let categorySlug: string | null = null;
  let categoryNameAr: string | null = null;

  try {
    const rows = await db
      .select()
      .from(noCapitalProjects)
      .where(eq(noCapitalProjects.slug, slug))
      .limit(1);
    const row = rows[0];
    if (row && row.active) {
      project = row as unknown as Record<string, unknown>;
      if (row.categoryId != null) {
        const catRows = await db
          .select({ slug: categories.slug, nameAr: categories.nameAr })
          .from(categories)
          .where(eq(categories.id, row.categoryId))
          .limit(1);
        if (catRows[0]) {
          categorySlug = catRows[0].slug;
          categoryNameAr = catRows[0].nameAr;
        }
      }
    }
  } catch {
    // Table might not exist — fall through to defaults
  }

  if (!project) {
    const fallback = DEFAULT_NO_CAPITAL_PROJECTS.find((p) => p.slug === slug);
    if (fallback) {
      project = fallback as unknown as Record<string, unknown>;
      categorySlug = (fallback as { categorySlug?: string }).categorySlug ?? null;
      categoryNameAr = null;
    }
  }

  if (!project) notFound();

  const nameAr = project.nameAr as string;
  const description = project.description as string;
  const effortLevel = project.effortLevel as string;
  const timeRequired = project.timeRequired as string;
  const skillsRequired = (project.skillsRequired ?? []) as string[];
  const toolsNeeded = (project.toolsNeeded ?? []) as string[];
  const startCostEstimate = project.startCostEstimate as string;
  const startCostType = (project.startCostType ?? "zero_tools_existing") as string;
  const tags = (project.tags ?? []) as string[];
  const risks = (project.risks ?? []) as string[];
  const advantages = (project.advantages ?? []) as string[];
  const disadvantages = (project.disadvantages ?? []) as string[];
  const steps = ((project.steps ?? []) as Record<string, string>[]).map((s) => ({
    title: s.title ?? s.t ?? "",
    detail: s.detail ?? s.d ?? "",
  }));

  const score = sp.score ? Number(sp.score) : null;
  const level = sp.level as string | undefined;
  const reason = sp.reason ?? null;

  const pdfData: NoCapitalPdfData = {
    nameAr,
    description,
    score,
    effortLevel,
    timeRequired,
    startCostType,
    startCostEstimate,
    skillsRequired,
    toolsNeeded,
    tags,
    risks,
    advantages,
    steps,
  };

  const videos = getProjectVideos(slug);

  const meta = [
    { icon: Clock, label: "الوقت المطلوب", value: timeRequired },
    { icon: Brain, label: "مستوى الجهد", value: effortLevel },
    { icon: Wrench, label: "تكلفة البدء", value: startCostEstimate },
  ];

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        <div className="space-y-3">
          <Link
            href="/no-capital"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600"
          >
            <ChevronLeft className="w-3.5 h-3.5 rotate-180" />
            المشاريع بدون رأس مال
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              {categoryNameAr && (
                <span className="text-xs font-black text-emerald-600">{categoryNameAr}</span>
              )}
              <h1 className="text-2xl sm:text-4xl font-black mt-1">{nameAr}</h1>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed max-w-2xl">{description}</p>
            </div>

            {score !== null && level && (
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-center bg-slate-50 rounded-2xl px-4 py-2">
                  <span className="text-2xl font-black text-emerald-600 font-mono">{score}</span>
                  <span className="text-[10px] text-slate-400">/100</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold border ${MATCH_STYLES[level]?.className ?? MATCH_STYLES.low.className}`}>
                  {MATCH_STYLES[level]?.label ?? level}
                </span>
              </div>
            )}
          </div>

          <NoCapitalActions data={pdfData} title={nameAr} />
          {reason && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-sm text-emerald-800">
              <span className="font-extrabold">لماذا تم اقتراحه لك:</span> {reason}
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          {meta.map((m) => (
            <div key={m.label} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                <m.icon className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-[11px] text-slate-400">{m.label}</span>
                <span className="block text-sm font-black">{m.value}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 text-[11px]">
          <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-bold">نوع التكلفة: {startCostType === "zero_tools_existing" ? "بدون رأس مال" : startCostType}</span>
          <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 font-bold border border-amber-200">رأس المال: 0 دج — بشرط توفر هاتف/حاسوب وإنترنت ومهارة قابلة للبيع</span>
          {tags.map((t) => (
            <span key={t} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold">{t}</span>
          ))}
        </div>

        {videos.length > 0 && <ProjectVideo videos={videos} title={nameAr} />}

        {skillsRequired.length > 0 && (
          <section>
            <h2 className="text-lg font-black mb-3">المهارات المطلوبة</h2>
            <div className="flex flex-wrap gap-2">
              {skillsRequired.map((s) => (
                <span key={s} className="px-3 py-1.5 rounded-xl bg-sky-50 text-sky-700 text-xs font-bold">{s}</span>
              ))}
            </div>
          </section>
        )}

        {toolsNeeded.length > 0 && (
          <section>
            <h2 className="text-lg font-black mb-3">الأدوات المطلوبة</h2>
            <div className="flex flex-wrap gap-2">
              {toolsNeeded.map((t) => (
                <span key={t} className="px-3 py-1.5 rounded-xl bg-violet-50 text-violet-700 text-xs font-bold">{t}</span>
              ))}
            </div>
          </section>
        )}

        {advantages.length > 0 && (
          <section className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
            <h2 className="text-lg font-black flex items-center gap-2">
              <ThumbsUp className="w-5 h-5 text-emerald-600" />
              المزايا
            </h2>
            <ul className="space-y-2">
              {advantages.map((a, i) => (
                <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">+</span>
                  {a}
                </li>
              ))}
            </ul>
          </section>
        )}

        {disadvantages.length > 0 && (
          <section className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
            <h2 className="text-lg font-black flex items-center gap-2">
              <ThumbsDown className="w-5 h-5 text-amber-600" />
              العيوب
            </h2>
            <ul className="space-y-2">
              {disadvantages.map((d, i) => (
                <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">-</span>
                  {d}
                </li>
              ))}
            </ul>
          </section>
        )}

        {risks.length > 0 && (
          <section className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
            <h2 className="text-lg font-black flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              المخاطر
            </h2>
            <ul className="space-y-2">
              {risks.map((r, i) => (
                <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">!</span>
                  {r}
                </li>
              ))}
            </ul>
          </section>
        )}

        {steps.length > 0 && (
          <section className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-lg font-black">خطوات البداية</h2>
            <div className="space-y-4">
              {steps.map((s, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-xs font-black">{i + 1}</div>
                  <div>
                    <h3 className="font-black text-sm">{s.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{s.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
          <h2 className="text-lg font-black flex items-center gap-2">
            <Target className="w-5 h-5 text-sky-600" />
            خطة الحصول على أول عميل
          </h2>
          <p className="text-xs text-slate-500 mb-2">خطة عامة قابلة للتخصيص حسب مشروعك</p>
          <ol className="space-y-2">
            {DEFAULT_FIRST_ORDER_PLAN.outreachSteps.map((s: string, i: number) => (
              <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                <span className="text-sky-500 font-black mt-0.5">{i + 1}.</span>
                {s}
              </li>
            ))}
          </ol>
        </section>

        <section className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
          <h2 className="text-lg font-black flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-violet-600" />
            خطة التسويق
          </h2>
          <p className="text-xs text-slate-500 mb-2">بدون ميزانية — ميزانية صغيرة — ميزانية متكاملة</p>
          <div className="space-y-4">
            {DEFAULT_MARKETING_PLANS.map((plan: (typeof DEFAULT_MARKETING_PLANS)[number]) => (
              <div key={plan.slug} className="border border-slate-100 rounded-2xl p-4">
                <h3 className="font-black text-sm mb-1">{plan.title}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {plan.channels.map((ch: (typeof plan.channels)[number], i: number) => (
                    <span key={i} className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600">{ch.channel} ({ch.effort})</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-3xl p-6">
          <h2 className="font-black text-sm text-slate-900 flex items-center gap-2 mb-2">
            <span className="text-lg">🤖</span>
            اسأل مساعد NABDA عن هذا المشروع
          </h2>
          <p className="text-xs text-slate-600 mb-3">
            اسأل مساعد NABDA عن خطوات هذا المشروع، التسويق، أو أي استفسار آخر.
          </p>
          <Link
            href={`/ai?context=project:${slug}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-extrabold hover:bg-emerald-700 transition-colors shadow-md"
          >
            ابدأ محادثة
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </section>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/no-capital/plans"
            className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-extrabold text-xs hover:bg-slate-800 inline-flex items-center gap-2"
          >
            خطة 90 يوماً
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <Link
            href="/no-capital/test"
            className="px-6 py-3 rounded-2xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
          >
            أعد الاختبار
          </Link>
          <Link
            href="/no-capital"
            className="px-6 py-3 rounded-2xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 inline-flex items-center gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            العودة للقائمة
          </Link>
        </div>
      </div>
    </main>
  );
}
