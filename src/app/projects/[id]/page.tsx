"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  Compass,
  DollarSign,
  Calculator,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  ChevronLeft,
  Printer,
  Sliders,
  Sparkles,
  RotateCcw,
  Target,
  FileText,
  Download,
  Loader2,
  Send
} from "lucide-react";
import {
  calculateFinancials,
  calculateScenarios,
  calculateCapitalAllocation,
  evaluateShouldIStart
} from "@/lib/financialCalc";
import { downloadProjectPdf, ProjectPdfData } from "@/lib/pdfExport";
import DownloadProgress, { DownloadProgressState } from "@/components/DownloadProgress";
import StartSmallTest from "@/components/StartSmallTest";
import ProjectVideo from "@/components/ProjectVideo";
import ShareButtons from "@/components/ShareButtons";
import { getCapitalProjectVideos } from "@/lib/projectVideos";

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Interactive Financial Calculator States
  const [purchasePrice, setPurchasePrice] = useState<number>(500);
  const [salePrice, setSalePrice] = useState<number>(1500);
  const [salesUnits, setSalesUnits] = useState<number>(50);
  const [deliveryCost, setDeliveryCost] = useState<number>(200);
  const [packagingCost, setPackagingCost] = useState<number>(50);
  const [adSpend, setAdSpend] = useState<number>(5000);
  const [fixedCosts, setFixedCosts] = useState<number>(3000);
  const [returnRate, setReturnRate] = useState<number>(5);

  // Capital Slider State
  const [selectedCapital, setSelectedCapital] = useState<number>(100000);

  // PDF Generation State
  const [downloadState, setDownloadState] = useState<DownloadProgressState>({
    visible: false,
    stage: "preparing",
    progress: 0,
  });

  useEffect(() => {
    fetchProject();
  }, [id]);

  // Helper: smoothly animate progress to a target value
  const animateProgress = (target: number, duration: number = 400) => {
    return new Promise<void>((resolve) => {
      setDownloadState((prev) => ({ ...prev, progress: target }));
      setTimeout(resolve, duration);
    });
  };

  // PDF Download Handler - generates a styled multi-section report with progress
  const handleDownloadPdf = async () => {
    if (!project) return;

    const fileName = `NABDA-${project.projectId}-${Date.now()}.pdf`;

    // Show notification & reset progress
    setDownloadState({
      visible: true,
      stage: "preparing",
      progress: 0,
      fileName,
    });

    try {
      // Stage 1: Preparing data (0% - 20%)
      await animateProgress(15, 200);
      setDownloadState((prev) => ({ ...prev, stage: "preparing", progress: 20 }));

      // Small delay to let UI update
      await new Promise((r) => setTimeout(r, 200));

      // Stage 2: Generating report (20% - 55%)
      setDownloadState((prev) => ({ ...prev, stage: "generating", progress: 30 }));
      await new Promise((r) => setTimeout(r, 300));
      await animateProgress(50, 400);

      const pdfData: ProjectPdfData = {
        projectName: project.projectName,
        projectId: project.projectId,
        category: project.category,
        description: project.description,
        minCapital: project.minCapital,
        recommendedCapital: project.recommendedCapital,
        maxCapital: project.maxCapital,
        riskLevel: project.riskLevel,
        difficulty: project.difficulty,
        scalability: project.scalability,
        timeRequired: project.timeRequired,
        homeBased: project.homeBased,
        onlinePossible: project.onlinePossible,
        transportRequired: project.transportRequired,
        seasonality: project.seasonality,
        competitionLevel: project.competitionLevel,
        targetArea: project.targetArea,
        advantages: project.advantages || [],
        risks: project.risks || [],
        launchPlan: project.launchPlan || [],
        calc: {
          grossRevenue: calc.grossRevenue,
          totalExpenses: calc.totalExpenses,
          netProfitMonthly: calc.netProfitMonthly,
          breakEvenUnits: calc.breakEvenUnits,
          profitMarginPercent: calc.profitMarginPercent,
        },
        scenarios: {
          conservative: { netProfitMonthly: scenarios.conservative.netProfitMonthly },
          base: { netProfitMonthly: scenarios.base.netProfitMonthly },
          optimistic: { netProfitMonthly: scenarios.optimistic.netProfitMonthly },
        },
        capitalAllocation,
        shouldIStart: {
          verdict: shouldIStart.verdict,
          explanation: shouldIStart.explanation,
        },
        selectedCapital,
      };

      // Stage 3: Rendering pages (55% - 85%)
      setDownloadState((prev) => ({ ...prev, stage: "rendering", progress: 65 }));
      await new Promise((r) => setTimeout(r, 300));
      await animateProgress(80, 400);

      // Stage 4: Saving file (85% - 100%)
      setDownloadState((prev) => ({ ...prev, stage: "saving", progress: 90 }));

      // Call the actual PDF generator
      downloadProjectPdf(pdfData);

      await animateProgress(100, 300);

      // Stage 5: Complete
      setDownloadState((prev) => ({ ...prev, stage: "complete", progress: 100 }));
    } catch (error: any) {
      console.error("PDF generation error:", error);
      setDownloadState({
        visible: true,
        stage: "error",
        progress: 0,
        fileName,
        errorMessage: error?.message || "حدث خطأ غير متوقع. حاول مرة أخرى.",
      });
    }
  };

  const handleCloseDownload = () => {
    setDownloadState((prev) => ({ ...prev, visible: false }));
  };

  const isDownloading =
    downloadState.visible &&
    downloadState.stage !== "complete" &&
    downloadState.stage !== "error";

  const fetchProject = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${id}`);
      const data = await res.json();
      if (data.success && data.project) {
        const p = data.project;
        setProject(p);
        setSelectedCapital(p.recommendedCapital || 100000);
        setFixedCosts(p.fixedCosts || 3000);
        if (p.initialStock && p.initialStock > 0) {
          setPurchasePrice(Math.round(p.initialStock / 100) || 500);
        }
      } else {
        setErrorMsg(data.error || "المشروع غير موجود");
      }
    } catch (e: any) {
      setErrorMsg("خطأ في الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-600 text-xs font-bold">جاري تحميل دراسة جدوى المشروع...</p>
      </div>
    );
  }

  if (errorMsg || !project) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-4">
        <div className="p-6 rounded-3xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-bold">
          {errorMsg || "لم يتم العثور على هذا المشروع."}
        </div>
        <Link href="/projects" className="inline-block px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs">
          العودة لدليل المشاريع
        </Link>
      </div>
    );
  }

  // Financial Calculations Realtime Output
  const calc = calculateFinancials({
    purchasePrice,
    salePrice,
    monthlySalesUnits: salesUnits,
    deliveryCostPerUnit: deliveryCost,
    packagingCostPerUnit: packagingCost,
    adSpendMonthly: adSpend,
    fixedCostsMonthly: fixedCosts,
    returnRatePercent: returnRate,
  });

  const scenarios = calculateScenarios({
    purchasePrice,
    salePrice,
    monthlySalesUnits: salesUnits,
    deliveryCostPerUnit: deliveryCost,
    packagingCostPerUnit: packagingCost,
    adSpendMonthly: adSpend,
    fixedCostsMonthly: fixedCosts,
    returnRatePercent: returnRate,
  });

  const capitalAllocation = calculateCapitalAllocation(selectedCapital);

  const shouldIStart = evaluateShouldIStart(
    selectedCapital,
    project.minCapital,
    project.recommendedCapital,
    calc.netProfitMonthly,
    calc.breakEvenUnits,
    salesUnits,
    calc.breakEvenStatus
  );

  const videos = getCapitalProjectVideos(project.projectId);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 print:py-2 print:px-0">
      {videos.length > 0 && <ProjectVideo videos={videos} title={project.projectName} />}
      {/* Print-Only Header - shown only when printing */}
      <div className="hidden print:block print-header">
        <h2>NABDA – دراسة جدوى المشروع</h2>
        <p>قبل ما تبدأ مشروعك... اختبره.</p>
        <p>التاريخ: {new Date().toLocaleDateString("en-GB")}</p>
      </div>

      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
            <Link href="/projects" className="hover:text-indigo-600">المشاريع</Link>
            <span>/</span>
            <span className="text-indigo-600">{project.category}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900">
            {project.projectName}
          </h1>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => window.print()}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            طباعة
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white hover:from-indigo-700 hover:to-fuchsia-700 text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                جاري التحميل...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                تنزيل PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 border border-slate-200 p-4">
        <span className="text-sm font-black text-slate-700">شارك هذا المشروع 👇</span>
        <ShareButtons title={project.projectName} />
      </div>

      {/* Overview Cards & Basic Parameters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Compass className="w-5 h-5 text-indigo-600" />
              الوصف العام للمشروع
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              {project.description}
            </p>

            {/* Badges list */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">مستوى المخاطرة</span>
                <span className="font-bold text-slate-900">{project.riskLevel}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">مكان العمل</span>
                <span className="font-bold text-slate-900">{project.homeBased ? "من المنزل" : "محل / خروج"}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">الوقت المطلوب</span>
                <span className="font-bold text-slate-900">{project.timeRequired}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">قابلية التوسع</span>
                <span className="font-bold text-slate-900">{project.scalability}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">المستوى الصعوبة</span>
                <span className="font-bold text-slate-900">{project.difficulty}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[10px]">الموسمية</span>
                <span className="font-bold text-slate-900">{project.seasonality}</span>
              </div>
            </div>
          </div>

          {/* Advantages & Disadvantages & Risks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Advantages */}
            <div className="bg-indigo-50/60 p-6 rounded-3xl border border-indigo-200 space-y-3">
              <h3 className="font-bold text-sm text-indigo-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                المزايا والفرص
              </h3>
              <ul className="space-y-1.5 text-xs text-indigo-950 list-disc list-inside">
                {project.advantages?.map((adv: string, idx: number) => (
                  <li key={idx}>{adv}</li>
                ))}
              </ul>
            </div>

            {/* Risks & Disadvantages */}
            <div className="bg-amber-50/60 p-6 rounded-3xl border border-amber-200 space-y-3">
              <h3 className="font-bold text-sm text-amber-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                المخاطر والتحديات
              </h3>
              <ul className="space-y-1.5 text-xs text-amber-950 list-disc list-inside">
                {project.risks?.map((r: string, idx: number) => (
                  <li key={idx}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Capital 3 Levels */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl border border-slate-800">
            <h3 className="text-base font-bold flex items-center gap-2 border-b border-slate-800 pb-3">
              <DollarSign className="w-5 h-5 text-indigo-400" />
              مستويات بداية رأس المال
            </h3>

            <div className="space-y-3 text-xs">
              <button
                type="button"
                onClick={() => setSelectedCapital(project.minCapital)}
                className={`w-full text-right p-4 rounded-2xl border transition-all ${
                  selectedCapital === project.minCapital
                    ? "bg-slate-800 border-indigo-500 shadow-sm"
                    : "bg-slate-800/40 border-slate-700 hover:bg-slate-800"
                }`}
              >
                <span className="text-slate-400 block text-[10px]">بداية محافظة (الحد الأدنى)</span>
                <span className="font-extrabold text-base text-white font-mono">
                  {project.minCapital?.toLocaleString()} دج
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedCapital(project.recommendedCapital)}
                className={`w-full text-right p-4 rounded-2xl border transition-all ${
                  selectedCapital === project.recommendedCapital
                    ? "bg-slate-800 border-indigo-500 shadow-sm"
                    : "bg-slate-800/40 border-slate-700 hover:bg-slate-800"
                }`}
              >
                <span className="text-indigo-400 font-bold block text-[10px]">بداية متوسطة (موصى بها) ★</span>
                <span className="font-extrabold text-lg text-indigo-400 font-mono">
                  {project.recommendedCapital?.toLocaleString()} دج
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedCapital(project.maxCapital)}
                className={`w-full text-right p-4 rounded-2xl border transition-all ${
                  selectedCapital === project.maxCapital
                    ? "bg-slate-800 border-indigo-500 shadow-sm"
                    : "bg-slate-800/40 border-slate-700 hover:bg-slate-800"
                }`}
              >
                <span className="text-slate-400 block text-[10px]">بداية موسعة (تنوع أكبر)</span>
                <span className="font-extrabold text-base text-white font-mono">
                  {project.maxCapital?.toLocaleString()} دج
                </span>
              </button>
            </div>

            {/* Slider to adjust capital */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">تعديل المبلغ يدوياً:</span>
                <span className="font-mono font-bold text-indigo-400">
                  {selectedCapital.toLocaleString()} دج
                </span>
              </div>
              <input
                type="range"
                min={project.minCapital || 10000}
                max={(project.maxCapital || 500000) * 1.5}
                step={5000}
                value={selectedCapital}
                onChange={(e) => setSelectedCapital(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Paid Study Offer — 490 دج (non-blocking upsell) */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-700 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold">
              <FileText className="w-4 h-4" />
              عرض مدفوع اختياري
            </div>
            <h2 className="text-2xl sm:text-3xl font-black flex items-center gap-2">
              <span>📊</span> دراسة مشروع كاملة
            </h2>
          </div>

          <div className="text-center bg-slate-900/80 border border-slate-700 px-6 py-4 rounded-2xl shrink-0">
            <span className="text-[11px] text-slate-400 block font-bold">السعر</span>
            <span className="text-3xl font-black text-indigo-400 font-mono">490 دج</span>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          دراسة تفصيلية تساعدك على معرفة تكلفة المشروع، المصاريف، المداخيل المتوقعة، نقطة التعادل، المخاطر وخطوات الانطلاق.
        </p>

        <div className="grid sm:grid-cols-2 gap-2 text-xs text-slate-200">
          {[
            "وصف المشروع",
            "رأس المال المطلوب",
            "المعدات والتجهيزات",
            "المواد الأولية",
            "المصاريف الثابتة",
            "المصاريف المتغيرة",
            "المداخيل المتوقعة",
            "هامش الربح",
            "نقطة التعادل",
            "المخاطر",
            "الأخطاء الشائعة",
            "خطوات الانطلاق",
            "خطة عمل 30 يوم",
            "ملاحظات عملية مرتبطة بالسوق الجزائري",
          ].map((point, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>{point}</span>
            </div>
          ))}
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-3 border-t border-slate-700">
          <a
            href={`https://t.me/NABDA2026?text=${encodeURIComponent(
              `السلام عليكم، أريد طلب دراسة المشروع الكاملة — 490 دج.\nاسم المشروع: ${project.projectName}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-sky-500 text-white font-extrabold text-sm hover:bg-sky-600 transition-colors shadow-md"
          >
            <Send className="w-4 h-4" />
            طلب الدراسة عبر Telegram
          </a>

          <div className="flex-1 min-w-0">
            <p className="text-xs text-indigo-300 font-bold">لإتمام الشراء والتواصل معنا عبر Telegram</p>
            <p className="text-[11px] text-slate-400 leading-snug">
              تُسلَّم الدراسة بعد تأكيد الدفع. المعلومات المعروضة هنا استرشادية وقد تُعرض بعض البيانات على أنها «غير متوفرة» إذا لم نتوفر عليها.
            </p>
          </div>
        </div>
      </section>

      {/* CAPITAL ALLOCATION BREAKDOWN */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              مقترح توزيع رأس المال ({selectedCapital.toLocaleString()} دج)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              النسب التشغيلية المقترحة لتوزيع ميزانيتك قبل الشراء والتنفيذ
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 text-xs font-bold">
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-1">
            <span className="text-indigo-800 block text-[11px]">المخزون/البضاعة ({capitalAllocation.stock.percent}%)</span>
            <span className="text-lg font-black text-indigo-900 font-mono">
              {capitalAllocation.stock.amount.toLocaleString()} دج
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200 space-y-1">
            <span className="text-cyan-800 block text-[11px]">المعدات والأدوات ({capitalAllocation.equipment.percent}%)</span>
            <span className="text-lg font-black text-cyan-900 font-mono">
              {capitalAllocation.equipment.amount.toLocaleString()} دج
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-1">
            <span className="text-indigo-800 block text-[11px]">التسويق والإعلانات ({capitalAllocation.marketing.percent}%)</span>
            <span className="text-lg font-black text-indigo-900 font-mono">
              {capitalAllocation.marketing.amount.toLocaleString()} دج
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
            <span className="text-amber-800 block text-[11px]">مصاريف التشغيل ({capitalAllocation.operations.percent}%)</span>
            <span className="text-lg font-black text-amber-900 font-mono">
              {capitalAllocation.operations.amount.toLocaleString()} دج
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 space-y-1">
            <span className="text-slate-700 block text-[11px]">احتياطي الطوارئ ({capitalAllocation.reserve.percent}%)</span>
            <span className="text-lg font-black text-slate-900 font-mono">
              {capitalAllocation.reserve.amount.toLocaleString()} دج
            </span>
          </div>
        </div>
      </section>

      {/* INTERACTIVE PROFIT CALCULATOR & BREAK-EVEN TOOL */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold mb-2">
              <Calculator className="w-4 h-4 text-indigo-400" />
              حاسبة الأرباح وميزة "ماذا لو؟" التفاعلية
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">
              محاكي الأرباح الصافية ونقطة التعادل
            </h2>
          </div>
        </div>

        {/* Inputs Sliders & Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 text-xs">
          {/* Purchase Price Input */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="font-bold text-slate-300">سعر الشراء / تكلفة الوحدة:</label>
              <span className="font-mono text-indigo-400 font-bold">{purchasePrice} دج</span>
            </div>
            <input
              type="number"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
            />
          </div>

          {/* Sale Price Input */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="font-bold text-slate-300">سعر البيع للزبون:</label>
              <span className="font-mono text-indigo-400 font-bold">{salePrice} دج</span>
            </div>
            <input
              type="number"
              value={salePrice}
              onChange={(e) => setSalePrice(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
            />
          </div>

          {/* Monthly Sales Volume */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="font-bold text-slate-300">المبيعات المتوقعة شهرياً:</label>
              <span className="font-mono text-indigo-400 font-bold">{salesUnits} وحدة</span>
            </div>
            <input
              type="range"
              min="5"
              max="500"
              step="5"
              value={salesUnits}
              onChange={(e) => setSalesUnits(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          {/* Delivery Cost */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="font-bold text-slate-300">مصاريف الشحن للوحدة:</label>
              <span className="font-mono text-slate-300">{deliveryCost} دج</span>
            </div>
            <input
              type="number"
              value={deliveryCost}
              onChange={(e) => setDeliveryCost(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
            />
          </div>

          {/* Ad Spend Monthly */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="font-bold text-slate-300">ميزانية الإعلانات الشهرية:</label>
              <span className="font-mono text-slate-300">{adSpend} دج</span>
            </div>
            <input
              type="number"
              value={adSpend}
              onChange={(e) => setAdSpend(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
            />
          </div>

          {/* Fixed Costs Monthly */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="font-bold text-slate-300">المصاريف الثابتة الشهري:</label>
              <span className="font-mono text-slate-300">{fixedCosts} دج</span>
            </div>
            <input
              type="number"
              value={fixedCosts}
              onChange={(e) => setFixedCosts(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
            />
          </div>
        </div>

        {/* Realtime Outputs Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-800/90 p-5 rounded-2xl border border-slate-700 space-y-1">
            <span className="text-slate-400 text-xs block">الإيرادات الإجمالية</span>
            <span className="text-2xl font-black text-white font-mono">
              {calc.grossRevenue.toLocaleString()} دج
            </span>
          </div>

          <div className="bg-slate-800/90 p-5 rounded-2xl border border-slate-700 space-y-1">
            <span className="text-slate-400 text-xs block">إجمالي التكاليف والمصاريف</span>
            <span className="text-2xl font-black text-slate-300 font-mono">
              {calc.totalExpenses.toLocaleString()} دج
            </span>
          </div>

          <div className="bg-indigo-950/80 p-5 rounded-2xl border border-indigo-500/50 space-y-1">
            <span className="text-indigo-300 text-xs font-bold block">الربح الصافي التقريبي</span>
            <span className="text-2xl font-black text-indigo-400 font-mono">
              {calc.netProfitMonthly.toLocaleString()} دج
            </span>
            <span className="text-[11px] text-indigo-300 block font-bold">
              هامش الربح: {calc.profitMarginPercent}%
            </span>
          </div>

          <div className={`p-5 rounded-2xl border space-y-1 ${
            calc.breakEvenStatus === "NO_PROFITABLE_BREAK_EVEN"
              ? "bg-rose-950/80 border-rose-500/50"
              : "bg-amber-950/80 border-amber-500/50"
          }`}>
            <span className={`text-xs font-bold block ${
              calc.breakEvenStatus === "NO_PROFITABLE_BREAK_EVEN"
                ? "text-rose-300" : "text-amber-300"
            }`}>نقطة التعادل (Break-Even)</span>
            <span className={`text-2xl font-black font-mono ${
              calc.breakEvenStatus === "NO_PROFITABLE_BREAK_EVEN"
                ? "text-rose-400" : "text-amber-400"
            }`}>
              {calc.breakEvenStatus === "NO_PROFITABLE_BREAK_EVEN"
                ? "—"
                : `${calc.breakEvenUnits} وحدة`}
            </span>
            <span className={`text-[11px] block font-bold ${
              calc.breakEvenStatus === "NO_PROFITABLE_BREAK_EVEN"
                ? "text-rose-300" : "text-amber-300"
            }`}>
              {calc.breakEvenStatus === "NO_PROFITABLE_BREAK_EVEN"
                ? calc.breakEvenMessage
                : `تساوي إيرادات ${calc.breakEvenRevenue.toLocaleString()} دج`}
            </span>
          </div>
        </div>

        {/* Break-Even Arabic Explanation */}
        <div className={`p-4 rounded-2xl border text-xs leading-relaxed flex items-start gap-3 ${
          calc.breakEvenStatus === "NO_PROFITABLE_BREAK_EVEN"
            ? "bg-rose-950/60 border-rose-700 text-rose-300"
            : "bg-slate-800/60 border-slate-700 text-slate-300"
        }`}>
          <Sparkles className={`w-5 h-5 shrink-0 mt-0.5 ${
            calc.breakEvenStatus === "NO_PROFITABLE_BREAK_EVEN"
              ? "text-rose-400" : "text-amber-400"
          }`} />
          <span>
            <strong>شرح نقطة التعادل بأسلوب مبسط:</strong>{" "}
            {calc.breakEvenStatus === "NO_PROFITABLE_BREAK_EVEN" ? (
              <span className="font-bold">{calc.breakEvenMessage}</span>
            ) : calc.breakEvenStatus === "IMMEDIATELY_BREAK_EVEN" ? (
              <span>{calc.breakEvenMessage}</span>
            ) : (
              <>
                وفق المعطيات أعلاه، تحتاج تقريبًا إلى بيع{" "}
                <strong className="text-amber-300 font-mono">{calc.breakEvenUnits} وحدة</strong> شهريًا لتغطية كافة المصاريف الثابتة وميزانية الإعلانات. أي مبيعات تتجاوز هذا العدد تعتبر ربحًا صافيًا في جيبك."
              </>
            )}
          </span>
        </div>

        {/* 3 SCENARIOS COMPARISON */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            محاكاة السيناريوهات الـ 3 للمبيعات
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Conservative */}
            <div className="bg-rose-950/40 p-5 rounded-2xl border border-rose-500/30 space-y-2">
              <span className="font-extrabold text-rose-300 text-sm block">🔴 سيناريو حذر (-30% مبيعات)</span>
              <p className="text-slate-400 text-[11px]">مبيعات: {scenarios.conservative.monthlySalesUnits} وحدة</p>
              <div className="pt-2 border-t border-rose-900/50 flex justify-between font-bold">
                <span>الربح الصافي:</span>
                <span className="font-mono text-rose-400">{scenarios.conservative.netProfitMonthly.toLocaleString()} دج</span>
              </div>
            </div>

            {/* Base */}
            <div className="bg-amber-950/40 p-5 rounded-2xl border border-amber-500/30 space-y-2">
              <span className="font-extrabold text-amber-300 text-sm block">🟡 سيناريو أساسي (متوقع)</span>
              <p className="text-slate-400 text-[11px]">مبيعات: {scenarios.base.monthlySalesUnits} وحدة</p>
              <div className="pt-2 border-t border-amber-900/50 flex justify-between font-bold">
                <span>الربح الصافي:</span>
                <span className="font-mono text-amber-400">{scenarios.base.netProfitMonthly.toLocaleString()} دج</span>
              </div>
            </div>

            {/* Optimistic */}
            <div className="bg-indigo-950/40 p-5 rounded-2xl border border-indigo-500/30 space-y-2">
              <span className="font-extrabold text-indigo-300 text-sm block">🟢 سيناريو متفائل (+40% مبيعات)</span>
              <p className="text-slate-400 text-[11px]">مبيعات: {scenarios.optimistic.monthlySalesUnits} وحدة</p>
              <div className="pt-2 border-t border-indigo-900/50 flex justify-between font-bold">
                <span>الربح الصافي:</span>
                <span className="font-mono text-indigo-400">{scenarios.optimistic.netProfitMonthly.toLocaleString()} دج</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SHOULD I START? VERDICT DECISION BOX */}
      <section className="space-y-6">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase">ميزة التقييم الميداني</span>
              <h2 className="text-xl font-black text-slate-900">هل أبدأ بهذا المشروع أم لا؟</h2>
            </div>

            <span className={`px-4 py-2 rounded-full font-extrabold text-sm border ${shouldIStart.badgeClass}`}>
              {shouldIStart.verdict}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
            {shouldIStart.explanation}
          </p>
        </div>

        {/* Conditionally render the actionable Small Test Plan if verdict is positive */}
        {shouldIStart.verdict.includes("ابدأ") && (
          <StartSmallTest
            projectName={project.projectName}
            projectId={project.projectId}
            category={project.category}
            recommendedCapital={project.recommendedCapital}
            netProfitMonthly={calc.netProfitMonthly}
            breakEvenUnits={calc.breakEvenUnits}
          />
        )}
      </section>

      {/* 30-DAY EXECUTION PLAN & PRE-LAUNCH MARKET TEST */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>خطة تنفيذ 30 يوم واستراتيجية اختبار السوق</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900">خارطة الطريق للأسبوع الأول حتى الرابع</h2>
        </div>

        {/* Weekly Launch Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {project.launchPlan?.map((weekItem: any, wIdx: number) => (
            <div key={wIdx} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-extrabold text-xs text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                  {weekItem.week}
                </span>
                <h3 className="font-bold text-slate-900 text-sm">{weekItem.title}</h3>
              </div>

              <ul className="space-y-2 text-xs text-slate-700">
                {weekItem.tasks?.map((task: string, tIdx: number) => (
                  <li key={tIdx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Pre-launch 6-Stage Market Test Box */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-sm text-indigo-400 flex items-center gap-2">
            <Target className="w-4 h-4" />
            مراحل اختبار السوق الـ 6 قبل شراء الكميات الكبيرة
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-[11px] text-center">
            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 space-y-1">
              <span className="text-indigo-400 font-bold block">1. المنافسين</span>
              <span className="text-slate-300">تحليل 3 منافسين محليين</span>
            </div>
            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 space-y-1">
              <span className="text-indigo-400 font-bold block">2. السعر</span>
              <span className="text-slate-300">تحديد هامش الربح</span>
            </div>
            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 space-y-1">
              <span className="text-indigo-400 font-bold block">3. اختبار الطلب</span>
              <span className="text-slate-300">نشر عينات وصور</span>
            </div>
            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 space-y-1">
              <span className="text-indigo-400 font-bold block">4. الطلبات</span>
              <span className="text-slate-300">استقبال طلبات أولية</span>
            </div>
            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 space-y-1">
              <span className="text-indigo-400 font-bold block">5. التحليل</span>
              <span className="text-slate-300">قياس التكلفة للزبون</span>
            </div>
            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 space-y-1">
              <span className="text-indigo-400 font-bold block">6. القرار</span>
              <span className="text-slate-300">Start / Test / Stop</span>
            </div>
          </div>
        </div>

        {/* Legal Notes */}
        {project.legalNotes && (
          <div className="p-4 rounded-xl bg-slate-100 text-slate-700 text-xs leading-relaxed flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-500 shrink-0" />
            <span><strong>ملاحظة قانونية وحرفية:</strong> {project.legalNotes}</span>
          </div>
        )}
      </section>

      {/* Legal Disclaimer */}
      <div dir="rtl" className="mt-8 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
        <p className="font-bold text-slate-700 mb-1">⚠️ إخلاء مسؤولية قانونية</p>
        <p>
          المعلومات الواردة في هذه الصفحة استرشادية وتعليمية فقط، ولا تُعد استشارة قانونية أو ضماناً للربح.
          قد تخضع بعض الأنشطة لشروط وتراخيص إدارية (سجل تجاري، بطاقة مقاول ذاتي، تراخيص صحية أو بيئية،
          أو مهن منظمة تتطلب تأهيلاً خاصاً). تقع مسؤولية التحقق من المتطلبات القانونية والإدارية
          الخاصة بالنشاط قبل الانطلاق على عاتق صاحب المشروع وحده، ولا تتحمل منصة NABDA أي مسؤولية
          عن أي قرار يتخذه المستخدم بناءً على هذا المحتوى.
        </p>
      </div>

      {/* Print-Only Footer - shown only when printing */}
      <div className="hidden print:block mt-8 pt-4 border-t-2 border-slate-300 text-center text-xs text-slate-500">
        <p className="font-bold">منصة NABDA | قبل ما تبدأ مشروعك... اختبره</p>
        <p>هذا التقرير عبارة عن محاكاة وتقديرات مبنية على معطيات السوق، ولا يُعد ضماناً للربح أو التوصية الاستثمارية.</p>
        <p>© {new Date().getFullYear()} NABDA - جميع الحقوق محفوظة.</p>
      </div>

      {/* Download Progress Notification */}
      <DownloadProgress state={downloadState} onClose={handleCloseDownload} />
    </div>
  );
}
