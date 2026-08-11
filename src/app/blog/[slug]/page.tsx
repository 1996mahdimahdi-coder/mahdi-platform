"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  Clock,
  ArrowRight,
  Sparkles,
  FileText,
  Share2,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  Image as ImageIcon
} from "lucide-react";

export default function SingleBlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const { slug } = resolvedParams;

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/blog/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPost(data.post);
          if (data.post?.category) {
            fetchRelatedPosts(data.post.category, data.post.id);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  const fetchRelatedPosts = async (category: string, excludeId: number) => {
    try {
      const res = await fetch("/api/blog");
      const data = await res.json();
      if (data.success) {
        setRelatedPosts(
          (data.posts || [])
            .filter((p: any) => p.category === category && p.id !== excludeId)
            .slice(0, 3)
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <p className="text-slate-600 font-bold">المقال غير موجود.</p>
        <Link href="/blog" className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs">
          العودة للمدونة
        </Link>
      </div>
    );
  }

  // Parse sources if available
  let sources: string[] = [];
  try {
    if (post.sources) {
      sources = JSON.parse(post.sources);
    }
  } catch (e) {
    console.error("Error parsing sources", e);
  }

  // Parse financial data if available
  let financialData: any = {};
  try {
    if (post.financialData) {
      financialData = JSON.parse(post.financialData);
    }
  } catch (e) {
    console.error("Error parsing financial data", e);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Link */}
      <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900">
        <ArrowRight className="w-4 h-4" />
        العودة للمدونة
      </Link>

      {/* Article Container */}
      <article className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
        {/* Cover Image */}
        {post.image && (
          <div className="relative h-72 sm:h-96 bg-gradient-to-br from-indigo-500 to-fuchsia-500 overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
            <div className="absolute bottom-6 right-6 left-6">
              <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-indigo-800 text-xs font-extrabold">
                {post.category}
              </span>
            </div>
          </div>
        )}

        <div className="p-6 sm:p-10 space-y-6">
          {/* Header */}
          <div className="space-y-3 border-b border-slate-100 pb-6">
            <div className="flex items-center gap-3 text-xs font-bold text-slate-500 flex-wrap">
              <span className="px-3 py-1 rounded-md bg-indigo-50 text-indigo-700">
                {post.category}
              </span>
              {post.readTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readTime}
                </span>
              )}
              {post.capitalRange && (
                <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-700">
                  💰 {post.capitalRange}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
              {post.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
              {post.summary}
            </p>
          </div>

          {/* Financial Data Box */}
          {Object.keys(financialData).length > 0 && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-fuchsia-50 border border-indigo-200">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 mb-3">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                أرقام موثقة من المقال
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                {Object.entries(financialData).map(([key, value]) => (
                  <div key={key} className="p-3 bg-white rounded-xl border border-indigo-100">
                    <span className="text-slate-500 text-[10px] block">
                      {translateKey(key)}
                    </span>
                    <span className="font-extrabold text-slate-900 text-sm">
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content Body */}
          <div className="prose prose-slate max-w-none text-sm leading-loose text-slate-800 space-y-3 whitespace-pre-line">
            {post.content}
          </div>

          {/* Infographic */}
          {post.infographic && (
            <div className="my-8 rounded-2xl overflow-hidden border border-slate-200 shadow-md">
              <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center gap-2 text-xs font-extrabold">
                <ImageIcon className="w-4 h-4 text-indigo-400" />
                <span>مخطط توضيحي</span>
              </div>
              <img
                src={post.infographic}
                alt="مخطط توضيحي"
                className="w-full h-auto"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).parentElement!.style.display = "none";
                }}
              />
            </div>
          )}

          {/* Sources / Citations */}
          {sources.length > 0 && (
            <div className="mt-8 p-5 rounded-2xl bg-amber-50 border-2 border-amber-200">
              <h3 className="font-extrabold text-sm text-amber-900 flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-amber-700" />
                المصادر الرسمية والوثائق المعتمدة
              </h3>
              <ul className="space-y-2 text-xs text-amber-900">
                {sources.map((source, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-amber-600 font-bold shrink-0 mt-0.5">{idx + 1}.</span>
                    <span>{source}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[10px] text-amber-700 italic">
                ⚠️ جميع الأرقام والمعلومات في هذا المقال مستندة إلى مصادر رسمية جزائرية حديثة. الأسعار والمبالغ قابلة للتغيير حسب السوق المحلي.
              </p>
            </div>
          )}

          {/* Call to Action Banner */}
          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-base">هل تريد معرفة المشاريع التي تناسب ميزانيتك؟</h3>
              <p className="text-indigo-100 text-xs mt-1">
                اختبر وضعك المالي ووقتك مجانًا في دقيقتين.
              </p>
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
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            مقالات مشابهة
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedPosts.map((rp) => (
              <Link
                key={rp.id}
                href={`/blog/${rp.slug}`}
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:shadow-lg transition-all group"
              >
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
  );
}

// Helper to translate JSON keys to Arabic
function translateKey(key: string): string {
  const translations: Record<string, string> = {
    marketSize: "حجم السوق",
    marketSize2024: "حجم السوق 2024",
    growthRate: "معدل النمو",
    onlineBuyers: "المتسوقون الأونلاين",
    deliveryCompanies: "شركات التوصيل",
    minCapital: "رأس المال الأدنى",
    avgMonthlyRevenue: "متوسط الإيراد الشهري",
    breakEvenMonths: "فترة الاسترداد",
    platforms: "المنصات",
    yassirUsers: "مستخدمو Yassir",
    yassirValuation: "تقييم Yassir",
    initialFunding: "التمويل الأولي",
    yearsToSuccess: "سنوات النجاح",
    cashOnDelivery: "الدفع عند الاستلام",
    cibCards: "بطاقات CIB",
    edinar: "E-Dinar",
    postalTransfer: "تحويل CCP",
    yalidine: "Yalidine",
    avgCostPerOrder: "متوسط تكلفة الطلب",
    deliveryTime: "مدة التوصيل",
    codCommission: "عمولة COD",
    instagramUsers: "مستخدمو Instagram",
    tiktokUsers: "مستخدمو TikTok",
    avgEngagementIG: "تفاعل Instagram",
    avgEngagementTT: "تفاعل TikTok",
    topCategories: "أهم الفئات",
    avgGrowth: "متوسط النمو",
    dailyIncome: "الدخل اليومي",
    monthlyIncome: "الدخل الشهري",
    avgHourly: "الأجر بالساعة",
    monthlyHours: "الساعات الشهرية",
    income: "الدخل",
    algerianUsers: "مستخدمو الجزائر",
    businessAdoption: "تبني الأعمال",
    avgOpenRate: "معدل الفتح",
    pagesManaged: "الصفحات المُدارة",
    avgMonthly: "متوسط شهري",
    avgSession: "متوسط الجلسة",
    successRate: "نسبة النجاح",
    paybackPeriod: "فترة الاسترداد",
    profitMargin: "هامش الربح",
    avgRepair: "متوسط الإصلاح",
    monthlyRepairs: "إصلاحات شهرية",
    avgCPC: "متوسط CPC",
    avgCPM: "متوسط CPM",
    avgCTR: "متوسط CTR",
    minDailyBudget: "الحد الأدنى للميزانية اليومية",
    revenueIncrease: "زيادة الإيرادات",
    ramadanMonth: "شهر رمضان",
    marketGrowth: "نمو السوق",
    avgJob: "متوسط الوظيفة",
    occupancyRate: "نسبة الإشغال",
    avgNightly: "متوسط السعر الليلي",
    season: "الموسم",
    profitIncrease: "زيادة الربح",
    duration: "المدة",
    profitRate: "نسبة الربح",
    cost: "التكلفة",
    perHour: "بالساعة",
    perProject: "لكل مشروع",
    juniorDev: "مطور مبتدئ",
    seniorDev: "مطور خبير",
    perPage: "لكل صفحة",
    perWord: "لكل كلمة",
    perSurvey: "لكل استطلاع",
    monthlySurveys: "استطلاعات شهرية",
    perMinute: "لكل دقيقة",
    perDownload: "لكل تحميل",
    listensMonthly: "استماعات شهرية",
    coursePrice: "سعر الدورة",
    salesTarget: "هدف المبيعات",
    commission: "العمولة",
    cpmAlgeria: "CPM في الجزائر",
    monthlyViews: "المشاهدات الشهرية",
    fiverr: "Fiverr",
    upwork: "Upwork",
    mostaql: "Mostaql",
    khamsat: "خمسات",
    avgDay: "متوسط اليوم",
  };
  return translations[key] || key;
}
