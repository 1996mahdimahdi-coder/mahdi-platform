import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Clock, ArrowRight, Sparkles, BarChart3, ImageIcon } from "lucide-react";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { eq } from "drizzle-orm";
import MarkdownContent from "@/components/MarkdownContent";
import ArticleImage from "@/components/ArticleImage";
import SourcesSection from "@/components/SourcesSection";

export const dynamic = "force-dynamic";

type ArticleSource = {
  institution?: string;
  title?: string;
  year?: number | string;
  url?: string;
  accessedAt?: string;
  type?: string;
};

function translateKey(key: string): string {
  const translations: Record<string, string> = {
    marketSize: "حجم السوق", marketSize2024: "حجم السوق 2024", growthRate: "معدل النمو",
    onlineBuyers: "المتسوقون الأونلاين", deliveryCompanies: "شركات التوصيل",
    minCapital: "رأس المال الأدنى", avgMonthlyRevenue: "متوسط الإيراد الشهري",
    breakEvenMonths: "فترة الاسترداد", platforms: "المنصات",
    yassirUsers: "مستخدمو Yassir", yassirValuation: "تقييم Yassir",
    initialFunding: "التمويل الأولي", yearsToSuccess: "سنوات النجاح",
    cashOnDelivery: "الدفع عند الاستلام", cibCards: "بطاقات CIB",
    edinar: "E-Dinar", postalTransfer: "تحويل CCP", yalidine: "Yalidine",
    avgCostPerOrder: "متوسط تكلفة الطلب", deliveryTime: "مدة التوصيل",
    codCommission: "عمولة COD", instagramUsers: "مستخدمو Instagram",
    tiktokUsers: "مستخدمو TikTok", avgEngagementIG: "تفاعل Instagram",
    avgEngagementTT: "تفاعل TikTok", topCategories: "أهم الفئات",
    avgGrowth: "متوسط النمو", dailyIncome: "الدخل اليومي",
    monthlyIncome: "الدخل الشهري", avgHourly: "الأجر بالساعة",
    monthlyHours: "الساعات الشهرية", income: "الدخل",
    algerianUsers: "مستخدمو الجزائر", businessAdoption: "تبني الأعمال",
    avgOpenRate: "معدل الفتح", pagesManaged: "الصفحات المُدارة",
    avgMonthly: "متوسط شهري", avgSession: "متوسط الجلسة",
    successRate: "نسبة النجاح", paybackPeriod: "فترة الاسترداد",
    profitMargin: "هامش الربح", avgRepair: "متوسط الإصلاح",
    monthlyRepairs: "إصلاحات شهرية", avgCPC: "متوسط CPC",
    avgCPM: "متوسط CPM", avgCTR: "متوسط CTR",
    minDailyBudget: "الحد الأدنى للميزانية اليومية",
    revenueIncrease: "زيادة الإيرادات", ramadanMonth: "شهر رمضان",
    marketGrowth: "نمو السوق", avgJob: "متوسط الوظيفة",
    occupancyRate: "نسبة الإشغال", avgNightly: "متوسط السعر الليلي",
    season: "الموسم", profitIncrease: "زيادة الربح", duration: "المدة",
    profitRate: "نسبة الربح", cost: "التكلفة", perHour: "بالساعة",
    perProject: "لكل مشروع", juniorDev: "مطور مبتدئ",
    seniorDev: "مطور خبير", perPage: "لكل صفحة", perWord: "لكل كلمة",
    perSurvey: "لكل استطلاع", monthlySurveys: "استطلاعات شهرية",
    perMinute: "لكل دقيقة", perDownload: "لكل تحميل",
    listensMonthly: "استماعات شهرية", coursePrice: "سعر الدورة",
    salesTarget: "هدف المبيعات", commission: "العمولة",
    cpmAlgeria: "CPM في الجزائر", monthlyViews: "المشاهدات الشهرية",
    fiverr: "Fiverr", upwork: "Upwork", mostaql: "Mostaql",
    khamsat: "خمسات", avgDay: "متوسط اليوم",
  };
  return translations[key] || key;
}

async function getPost(slug: string) {
  try {
    const rows = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPost(slug);
  if (!post) return { title: "المقال غير موجود — NABDA" };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nabda.dz";

  return {
    title: `${post.title} — NABDA`,
    description: post.summary?.slice(0, 160) ?? post.title,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      url: `${baseUrl}/blog/${post.slug}`,
      images: post.image ? [{ url: post.image, alt: post.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: post.image ? [post.image] : [],
    },
    alternates: {
      canonical: `${baseUrl}/blog/${post.slug}`,
    },
  };
}

export default async function SingleBlogPostPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const post = await getPost(slug);

  if (!post) notFound();

  let sources: (string | ArticleSource)[] = [];
  try {
    if (post.sources) sources = JSON.parse(post.sources);
  } catch { /* ignore */ }

  let financialData: Record<string, unknown> = {};
  try {
    if (post.financialData) financialData = JSON.parse(post.financialData);
  } catch { /* ignore */ }

  let relatedPosts: { id: number; slug: string; title: string; summary: string; category: string; image: string | null }[] = [];
  try {
    if (post.category) {
      const all = await db.select({ id: blogPosts.id, slug: blogPosts.slug, title: blogPosts.title, summary: blogPosts.summary, category: blogPosts.category, image: blogPosts.image })
        .from(blogPosts);
      relatedPosts = all.filter((p) => p.category === post.category && p.id !== post.id).slice(0, 3);
    }
  } catch { /* ignore */ }

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          العودة للمدونة
        </Link>

        <article className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
          {/* Cover Image */}
          {post.image && (
            <div className="relative h-64 sm:h-96 bg-gradient-to-br from-indigo-500 to-fuchsia-500 overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 right-6 left-6">
                <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-indigo-800 text-xs font-extrabold shadow-md">
                  {post.category}
                </span>
              </div>
            </div>
          )}

          <div className="p-6 sm:p-10 space-y-6">
            {/* Header */}
            <header className="space-y-4 border-b border-slate-100 pb-6">
              <div className="flex items-center gap-3 text-xs font-bold text-slate-500 flex-wrap">
                {!post.image && (
                  <span className="px-3 py-1 rounded-md bg-indigo-50 text-indigo-700">
                    {post.category}
                  </span>
                )}
                {post.readTime && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </span>
                )}
                {post.capitalRange && (
                  <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-700">
                    {post.capitalRange}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
                {post.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
                {post.summary}
              </p>
            </header>

            {/* Financial Data Box */}
            {Object.keys(financialData).length > 0 && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-fuchsia-50 border border-indigo-200">
                <h2 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 mb-3">
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                  أرقام موثقة من المقال
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  {Object.entries(financialData).map(([key, value]) => (
                    <div key={key} className="p-3 bg-white rounded-xl border border-indigo-100">
                      <span className="text-slate-500 text-[10px] block">{translateKey(key)}</span>
                      <span className="font-extrabold text-slate-900 text-sm">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Content Body — Markdown */}
            <div className="article-content">
              <MarkdownContent content={post.content} />
            </div>

            {/* Infographic */}
            {post.infographic && (
              <ArticleImage
                src={post.infographic}
                alt={`مخطط توضيحي: ${post.title}`}
                caption="مخطط توضيحي"
              />
            )}

            {/* Sources */}
            <SourcesSection sources={sources} />

            {/* AI CTA */}
            <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200">
              <h2 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 mb-2">
                <span className="text-lg">🤖</span>
                اسأل مساعد NABDA عن هذا الموضوع
              </h2>
              <p className="text-xs text-slate-600 mb-3">
                اسأل مساعد NABDA عن هذا المقال أو مواضيع ذات صلة.
              </p>
              <Link
                href={`/ai?context=article:${post.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-extrabold hover:bg-emerald-700 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                ابدأ محادثة
              </Link>
            </div>

            {/* Assessment CTA */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="font-extrabold text-base">هل تريد معرفة المشاريع التي تناسب ميزانيتك؟</h2>
                <p className="text-indigo-100 text-xs mt-1">اختبر وضعك المالي ووقتك مجانًا في دقيقتين.</p>
              </div>
              <Link
                href="/test"
                className="px-6 py-3 rounded-xl bg-white text-slate-900 font-black text-xs hover:bg-slate-100 transition-colors shadow-md shrink-0 flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                اختبر وضعي الآن
              </Link>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-black text-slate-900">مقالات مشابهة</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedPosts.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/blog/${rp.slug}`}
                  className="bg-white p-4 rounded-2xl border border-slate-200 hover:shadow-lg transition-all group"
                >
                  {rp.image && (
                    <div className="h-32 rounded-xl overflow-hidden mb-3 bg-slate-100">
                      <img src={rp.image} alt={rp.title} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  )}
                  <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {rp.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">{rp.summary}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
