"use client";

import { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  Download,
  Target,
  TrendingUp,
  Clock,
  DollarSign,
  Users,
  Calendar,
  Loader2,
  X,
  CheckSquare,
  Square,
  Save,
  Megaphone,
  Package
} from "lucide-react";
import DownloadProgress, { DownloadProgressState } from "@/components/DownloadProgress";

interface StartSmallTestProps {
  projectName: string;
  projectId: string;
  category: string;
  recommendedCapital: number;
  netProfitMonthly: number;
  breakEvenUnits: number;
  onClose?: () => void;
}

interface TestPlan {
  budget: number;
  duration: number; // days
  location: string;
  testAudience: string;
  unitPrice: number;
  expectedSales: number;
  // 6 stages of the pre-launch market test
  completedStages: boolean[];
}

const TEST_STAGES = [
  {
    id: 0,
    title: "البحث عن المنافسين المباشرين",
    desc: "حدد 3-5 منافسين يقدمون نفس المنتج/الخدمة في منطقتك.ادرس أسعارهم، نقاط قوتهم وضعفهم.",
    duration: "يوم 1-2",
    tasks: [
      "قائمة بـ 5 منافسين محليين",
      "تحليل جدول أسعارهم",
      "تحديد نقطة البيع الفريدة لمشروعك (USP)",
    ],
  },
  {
    id: 1,
    title: "تحديد السعر التجريبي",
    desc: "احسب تكلفة الوحدة الكاملة (شراء + تغليف + شحن) ثم ضع سعر بيع بهامش ربح يتراوح بين 30% و 50%.",
    duration: "يوم 3",
    tasks: [
      "حساب التكلفة الكاملة للوحدة",
      "تحديد سعر البيع التجريبي",
      "تحديد هامش الربح المستهدف",
    ],
  },
  {
    id: 2,
    title: "اختبار الطلب الفعلي",
    desc: "انشر إعلانات تجريبية بميزانية صغيرة جداً على Facebook/Instagram لتقييم الاستجابة الحقيقية.",
    duration: "يوم 4-7",
    tasks: [
      "إنشاء 3 إعلانات تجريبية",
      "استهداف جمهور محلي محدد",
      "قياس عدد النقرات والرسائل الواردة",
    ],
  },
  {
    id: 3,
    title: "الحصول على طلبات فعلية",
    desc: "استقبل أول 5-10 طلبات حقيقية بأسعار مخفضة قليلاً مقابل الحصول على تقييم صريح من الزبون.",
    duration: "يوم 8-14",
    tasks: [
      "استلام 5 طلبات على الأقل",
      "توثيق ملاحظات الزبائن",
      "قياس سرعة اتخاذ قرار الشراء",
    ],
  },
  {
    id: 4,
    title: "تحليل نتائج الاختبار",
    desc: "قارن بين عدد الطلبات الفعلية، معدل التحويل، متوسط رضا الزبائن، والتكلفة الإجمالية للحصول على زبون (CAC).",
    duration: "يوم 15-18",
    tasks: [
      "حساب معدل التحويل من الإعلانات",
      "حساب تكلفة اكتساب الزبون (CAC)",
      "تقييم رضا الزبائن (تقييم من 1-5)",
    ],
  },
  {
    id: 5,
    title: "اتخاذ قرار الانطلاق أو التوقف",
    desc: "بناءً على النتائج: Start (انطلق بكامل رأس المال) / Test More (كرر الاختبار) / Stop (غيّر الفكرة).",
    duration: "يوم 19-21",
    tasks: [
      "تلخيص كل النتائج في جدول",
      "اتخاذ قرار: Start / Test More / Stop",
      "تسجيل الدروس المستفادة",
    ],
  },
];

export default function StartSmallTest({
  projectName,
  projectId,
  category,
  recommendedCapital,
  netProfitMonthly,
  breakEvenUnits,
  onClose,
}: StartSmallTestProps) {
  const [plan, setPlan] = useState<TestPlan>({
    budget: Math.min(20000, Math.round(recommendedCapital * 0.2)),
    duration: 21,
    location: "محلي (بلدية واحدة)",
    testAudience: "العملاء المحتملون مباشرة",
    unitPrice: 1500,
    expectedSales: 10,
    completedStages: [false, false, false, false, false, false],
  });

  const [generating, setGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [savedPlanId, setSavedPlanId] = useState<string | null>(null);
  const [downloadState, setDownloadState] = useState<DownloadProgressState>({
    visible: false,
    stage: "preparing",
    progress: 0,
  });

  const toggleStage = (index: number) => {
    setPlan((prev) => {
      const newStages = [...prev.completedStages];
      newStages[index] = !newStages[index];
      return { ...prev, completedStages: newStages };
    });
  };

  const completedCount = plan.completedStages.filter(Boolean).length;
  const progressPercent = Math.round((completedCount / 6) * 100);

  const totalRevenue = plan.unitPrice * plan.expectedSales;
  const totalCost = plan.budget;
  const testProfit = totalRevenue - totalCost;
  const profitMarginPercent = totalRevenue > 0 ? Math.round((testProfit / totalRevenue) * 100) : 0;

  // Helper: smoothly animate progress to a target value
  const animateProgress = (target: number, duration: number = 350) => {
    return new Promise<void>((resolve) => {
      setDownloadState((prev) => ({ ...prev, progress: target }));
      setTimeout(resolve, duration);
    });
  };

  // Save plan via API
  const handleSavePlan = async () => {
    setGenerating(true);
    try {
      await new Promise((r) => setTimeout(r, 800));

      // Save to localStorage (and would normally POST to API)
      const planId = `testplan_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      const fullPlan = {
        id: planId,
        projectId,
        projectName,
        category,
        plan,
        createdAt: new Date().toISOString(),
        estimatedProfit: testProfit,
        profitMargin: profitMarginPercent,
      };

      try {
        const existing = JSON.parse(localStorage.getItem("nabda_test_plans") || "[]");
        existing.push(fullPlan);
        localStorage.setItem("nabda_test_plans", JSON.stringify(existing));
        setSavedPlanId(planId);
      } catch (e) {
        console.error(e);
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const handleCloseDownload = () => {
    setDownloadState((prev) => ({ ...prev, visible: false }));
  };

  const isDownloading =
    downloadState.visible &&
    downloadState.stage !== "complete" &&
    downloadState.stage !== "error";

  // Download test plan as PDF with progress notification
  const handleDownloadPlan = async () => {
    const fileName = `NABDA-Small-Test-${projectId}-${Date.now()}.pdf`;

    // Show download notification & reset progress
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
      await new Promise((r) => setTimeout(r, 200));

      // Stage 2: Generating report (20% - 55%)
      setDownloadState((prev) => ({ ...prev, stage: "generating", progress: 30 }));
      await new Promise((r) => setTimeout(r, 250));

      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;
      let cursorY = margin;

      await animateProgress(50, 350);

      // Header
      pdf.setFillColor(15, 23, 42);
      pdf.rect(0, 0, pageWidth, 30, "F");
      pdf.setTextColor(129, 140, 248);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.text("NABDA", margin, 13);
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.text("Small Test Plan - Before you start your project... test it.", margin, 19);
      pdf.setTextColor(129, 140, 248);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.text(new Date().toLocaleDateString("en-GB"), pageWidth - margin, 13, { align: "right" });
      pdf.setTextColor(148, 163, 184);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.text("Small Market Test", pageWidth - margin, 19, { align: "right" });

      cursorY = 40;

      // Stage 3: Rendering pages
      setDownloadState((prev) => ({ ...prev, stage: "rendering", progress: 65 }));
      await new Promise((r) => setTimeout(r, 200));

      // Project title
      pdf.setTextColor(15, 23, 42);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.text("Small Test Plan: " + projectName, margin, cursorY);
      cursorY += 8;
      pdf.setTextColor(100, 116, 139);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.text("Category: " + category, margin, cursorY);
      cursorY += 10;

      // Test parameters
      pdf.setFillColor(241, 245, 249);
      pdf.roundedRect(margin, cursorY, contentWidth, 38, 2, 2, "F");
      pdf.setTextColor(15, 23, 42);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.text("Test Parameters", margin + 4, cursorY + 6);

      pdf.setTextColor(100, 116, 139);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      const params = [
        ["Test Budget", plan.budget.toLocaleString() + " DZD"],
        ["Duration", plan.duration + " days"],
        ["Location", plan.location],
        ["Target Audience", plan.testAudience],
        ["Unit Price", plan.unitPrice.toLocaleString() + " DZD"],
        ["Expected Sales", plan.expectedSales + " units"],
      ];

      params.forEach((p, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const x = margin + 4 + col * ((contentWidth - 8) / 2);
        const y = cursorY + 12 + row * 8;

        pdf.setTextColor(100, 116, 139);
        pdf.text(p[0] + ":", x, y);

        pdf.setTextColor(15, 23, 42);
        pdf.setFont("helvetica", "bold");
        pdf.text(p[1], x + 30, y);
        pdf.setFont("helvetica", "normal");
      });

      cursorY += 44;

      // Financial forecast
      pdf.setFillColor(129, 140, 248);
      pdf.roundedRect(margin, cursorY, contentWidth, 22, 2, 2, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.text("Financial Forecast", margin + 4, cursorY + 6);

      pdf.setFontSize(9);
      pdf.text("Expected Revenue: " + totalRevenue.toLocaleString() + " DZD", margin + 4, cursorY + 12);
      pdf.text("Test Cost: " + totalCost.toLocaleString() + " DZD", margin + 4, cursorY + 17);
      pdf.text("Test Profit: " + testProfit.toLocaleString() + " DZD  (Margin: " + profitMarginPercent + "%)", pageWidth - margin - 4, cursorY + 12, { align: "right" });
      pdf.text("Reference: Break-even: " + breakEvenUnits + " units  |  Monthly Net: " + netProfitMonthly.toLocaleString() + " DZD", pageWidth - margin - 4, cursorY + 17, { align: "right" });

      cursorY += 28;

      // 6 Stages
      pdf.setTextColor(15, 23, 42);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(13);
      pdf.text("6-Stage Market Test Plan", margin, cursorY);
      cursorY += 7;

      TEST_STAGES.forEach((stage, idx) => {
        if (cursorY > pageHeight - 40) {
          pdf.addPage();
          cursorY = margin;
        }

        const isCompleted = plan.completedStages[idx];
        const bgColor: [number, number, number] = isCompleted ? [209, 250, 229] : [241, 245, 249];
        const textColor: [number, number, number] = isCompleted ? [16, 185, 129] : [100, 116, 139];

        pdf.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
        pdf.roundedRect(margin, cursorY, contentWidth, 26, 1.5, 1.5, "F");

        pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(9);
        pdf.text("Stage " + (idx + 1) + " - " + stage.duration, margin + 4, cursorY + 5);

        pdf.setTextColor(15, 23, 42);
        pdf.setFontSize(10);
        pdf.text(stage.title, margin + 4, cursorY + 10);

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8);
        pdf.setTextColor(71, 85, 105);
        const descLines = pdf.splitTextToSize(stage.desc, contentWidth - 8);
        pdf.text(descLines.slice(0, 2), margin + 4, cursorY + 15);

        pdf.setFontSize(7.5);
        pdf.setTextColor(100, 116, 139);
        const tasks = "Tasks: " + stage.tasks.join(" | ");
        const taskLines = pdf.splitTextToSize(tasks, contentWidth - 8);
        pdf.text(taskLines, margin + 4, cursorY + 22);

        cursorY += 28;
      });

      // Footer
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setDrawColor(226, 232, 240);
        pdf.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
        pdf.setTextColor(100, 116, 139);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(7);
        pdf.text("NABDA - Small Test Plan", margin, pageHeight - 7);
        pdf.text("Page " + i + " of " + totalPages, pageWidth - margin, pageHeight - 7, { align: "right" });
      }

      // Stage 4: Saving file (85% - 100%)
      await animateProgress(85, 250);
      setDownloadState((prev) => ({ ...prev, stage: "saving", progress: 92 }));

      pdf.save(fileName);

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
        errorMessage: error?.message || "حدث خطأ أثناء توليد ملف PDF للخطة",
      });
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-fuchsia-50 p-6 sm:p-8 rounded-3xl border-2 border-indigo-300 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-indigo-200/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-fuchsia-500 text-white flex items-center justify-center shadow-md shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-extrabold uppercase tracking-wider">
              متاح الآن
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
              ابدأ باختبار صغير قبل التوسع
            </h2>
            <p className="text-xs text-slate-600">
              اختبر فكرتك بأقل ميزانية ممكنة قبل استثمار رأس المال الكامل
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/60 text-slate-500 hover:text-slate-800 transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Configuration Form */}
      <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-indigo-100 space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
          <Target className="w-4 h-4 text-indigo-600" />
          إعدادات الاختبار التجريبي
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
          <div className="space-y-1">
            <label className="text-slate-700 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              ميزانية الاختبار (دج)
            </label>
            <input
              type="number"
              value={plan.budget}
              onChange={(e) => setPlan({ ...plan, budget: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm font-mono"
            />
            <p className="text-[10px] text-slate-500">
              {Math.round((plan.budget / recommendedCapital) * 100)}% من رأس المال المتاح للبدء
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-slate-700 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              مدة الاختبار (بالأيام)
            </label>
            <select
              value={plan.duration}
              onChange={(e) => setPlan({ ...plan, duration: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
            >
              <option value={14}>14 يوم (سريع)</option>
              <option value={21}>21 يوم (موصى به)</option>
              <option value={30}>30 يوم (شامل)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-slate-700 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              الجمهور المستهدف
            </label>
            <select
              value={plan.testAudience}
              onChange={(e) => setPlan({ ...plan, testAudience: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
            >
              <option>العملاء المحتملون مباشرة</option>
              <option>الأصدقاء والمعارف</option>
              <option>الزبائن عبر الإعلانات</option>
              <option>الأسواق المحلية والأكشاك</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-slate-700">موقع الاختبار</label>
            <select
              value={plan.location}
              onChange={(e) => setPlan({ ...plan, location: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
            >
              <option>محلي (بلدية واحدة)</option>
              <option>محلي (ولاية كاملة)</option>
              <option>أونلاين (58 ولاية)</option>
              <option>متنقل بين عدة بلديات</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-slate-700">سعر بيع الوحدة التجريبي (دج)</label>
            <input
              type="number"
              value={plan.unitPrice}
              onChange={(e) => setPlan({ ...plan, unitPrice: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-700">عدد المبيعات المتوقع خلال الاختبار</label>
            <input
              type="number"
              value={plan.expectedSales}
              onChange={(e) => setPlan({ ...plan, expectedSales: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm font-mono"
            />
          </div>
        </div>
      </div>

      {/* Live Forecast */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold">
        <div className="bg-white p-3 rounded-xl border border-indigo-100">
          <span className="text-slate-500 text-[10px] block">إيرادات متوقعة</span>
          <span className="text-base font-black text-slate-900 font-mono">
            {totalRevenue.toLocaleString()} دج
          </span>
        </div>
        <div className="bg-white p-3 rounded-xl border border-indigo-100">
          <span className="text-slate-500 text-[10px] block">تكلفة الاختبار</span>
          <span className="text-base font-black text-rose-700 font-mono">
            {totalCost.toLocaleString()} دج
          </span>
        </div>
        <div className="bg-white p-3 rounded-xl border border-indigo-100">
          <span className="text-slate-500 text-[10px] block">صافي الربح المتوقع</span>
          <span className={`text-base font-black font-mono ${testProfit > 0 ? "text-indigo-700" : "text-rose-700"}`}>
            {testProfit.toLocaleString()} دج
          </span>
        </div>
        <div className="bg-white p-3 rounded-xl border border-indigo-100">
          <span className="text-slate-500 text-[10px] block">هامش الربح %</span>
          <span className={`text-base font-black font-mono ${profitMarginPercent > 20 ? "text-indigo-700" : "text-amber-700"}`}>
            {profitMarginPercent}%
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleSavePlan}
          disabled={generating}
          className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-extrabold text-sm hover:from-indigo-700 hover:to-fuchsia-700 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {generating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>حفظ خطة الاختبار</span>
        </button>

        <button
          onClick={handleDownloadPlan}
          disabled={isDownloading}
          className="flex-1 px-5 py-3 rounded-xl bg-white border-2 border-indigo-600 text-indigo-700 font-extrabold text-sm hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {isDownloading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>{isDownloading ? "جاري التحميل..." : "تنزيل الخطة PDF"}</span>
        </button>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-300 text-indigo-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-indigo-600" />
          <span>
            تم حفظ خطة الاختبار بنجاح! يمكنك الوصول إليها من لوحة التحكم.
            {savedPlanId && <span className="font-mono text-[10px] mr-2">#{savedPlanId.substring(0, 12)}</span>}
          </span>
        </div>
      )}

      {/* 6-Stage Plan */}
      <div className="space-y-3 pt-4 border-t border-indigo-200">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-indigo-600" />
            مراحل الاختبار الست ({completedCount}/6)
          </h3>
          <div className="text-[10px] font-mono font-bold text-indigo-700">
            {progressPercent}% مكتمل
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 bg-indigo-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
          {TEST_STAGES.map((stage) => (
            <div
              key={stage.id}
              className={`p-3 rounded-xl border-2 transition-all ${
                plan.completedStages[stage.id]
                  ? "bg-indigo-50 border-indigo-300"
                  : "bg-white border-slate-200 hover:border-indigo-200"
              }`}
            >
              <button
                onClick={() => toggleStage(stage.id)}
                className="w-full text-right flex items-start gap-2"
              >
                {plan.completedStages[stage.id] ? (
                  <CheckSquare className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`text-xs font-extrabold ${
                      plan.completedStages[stage.id] ? "text-indigo-900 line-through opacity-70" : "text-slate-900"
                    }`}>
                      المرحلة {stage.id + 1}: {stage.title}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-500 shrink-0">
                      {stage.duration}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    {stage.desc}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {stage.tasks.map((task, tIdx) => (
                      <li key={tIdx} className="text-[10px] text-slate-500 flex items-start gap-1">
                        <Package className="w-2.5 h-2.5 text-indigo-400 shrink-0 mt-0.5" />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Final Note */}
      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
        <TrendingUp className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <span>
          <strong>نصيحة NABDA:</strong> الاختبار التجريبي الصغير لا يضمن النجاح، لكنه يكشف المخاطر الحقيقية قبل المخاطرة برأس مالك الكامل. إذا نجحت، يمكنك التوسع بثقة. إذا فشلت، خسرت مبلغاً صغيراً وتعلمت درساً ثميناً.
        </span>
      </div>

      {/* Download Progress Notification */}
      <DownloadProgress state={downloadState} onClose={handleCloseDownload} />
    </div>
  );
}
