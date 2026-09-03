"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Award,
  Calculator,
  Printer,
  ChevronLeft,
  RotateCcw,
  Download,
  Loader2,
  Share2,
} from "lucide-react";
import { downloadResultsPdf } from "@/lib/pdfExport";
import DownloadProgress from "@/components/DownloadProgress";
import ConsentGate from "@/components/ConsentGate";
import { getOrCreateSessionId } from "@/lib/session";

type DownloadStage =
  | "preparing"
  | "generating"
  | "rendering"
  | "saving"
  | "complete"
  | "error";

interface ProjectResult {
  projectId: string;
  projectName: string;
  category?: string;
  description?: string;
  minCapital?: number;
  recommendedCapital?: number;
  maxCapital?: number;
  difficulty?: string;
  scalability?: string;
  riskLevel?: string;
  homeBased?: boolean;
  initialStock?: number;
  totalScore: number;
  recommendation: string;
  reasons?: string[];
}

interface ResultData {
  success?: boolean;
  analysisId?: number;
  shareToken?: string;
  userInput?: {
    capital?: number;
    wilayaId?: number;
    wilayaName?: string;
    communeName?: string;
    workspace?: string;
    availableHours?: string;
    riskLevel?: string;
    transport?: string;
    skills?: string[];
    objective?: string;
    existingIncome?: string;
  };
  userCapital?: number;
  top5Results?: ProjectResult[];
  explanationText?: string;
}

interface DownloadState {
  visible: boolean;
  stage: DownloadStage;
  progress: number;
  fileName?: string;
  errorMessage?: string;
}

export default function ResultsPage() {
  const router = useRouter();

  const [resultData, setResultData] = useState<ResultData | null>(null);

  const [consentGranted, setConsentGranted] = useState(false);

  const sessionId = getOrCreateSessionId();

  const [downloadState, setDownloadState] = useState<DownloadState>({
    visible: false,
    stage: "preparing",
    progress: 0,
  });

  useEffect(() => {
    const loadResults = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const shareToken = urlParams.get("share");

        if (shareToken) {
          const res = await fetch(
            `/api/share/${encodeURIComponent(shareToken)}`
          );

          if (!res.ok) {
            router.push("/test");
            return;
          }

          const data = await res.json();

          if (!data.success || !data.result) {
            router.push("/test");
            return;
          }

          const mapped: ResultData = {
            success: true,
            shareToken,
            userInput: data.result.testAnswers,
            userCapital: data.result.userCapital,
            top5Results: data.result.topProjects,
          };

          setResultData(mapped);
          setConsentGranted(true);
          return;
        }

        const stored = localStorage.getItem("nabda_last_result");

        if (!stored) {
          router.push("/test");
          return;
        }

        const parsed: ResultData = JSON.parse(stored);

        if (!parsed || !Array.isArray(parsed.top5Results)) {
          router.push("/test");
          return;
        }

        setResultData(parsed);
      } catch (error) {
        console.error("Failed to load results:", error);
        router.push("/test");
      }
    };

    loadResults();
  }, [router]);

  const animateProgress = (
    target: number,
    duration = 400
  ): Promise<void> => {
    return new Promise((resolve) => {
      setDownloadState((prev) => ({
        ...prev,
        progress: target,
      }));

      setTimeout(resolve, duration);
    });
  };

  const handleDownloadResultsPdf = async () => {
    if (!resultData) return;

    const fileName = `NABDA-Assessment-${Date.now()}.pdf`;

    setDownloadState({
      visible: true,
      stage: "preparing",
      progress: 0,
      fileName,
    });

    try {
      await animateProgress(20, 250);

      setDownloadState((prev) => ({
        ...prev,
        stage: "generating",
        progress: 35,
      }));

      await new Promise((resolve) => setTimeout(resolve, 300));

      await animateProgress(55, 400);

      setDownloadState((prev) => ({
        ...prev,
        stage: "rendering",
        progress: 70,
      }));

      await new Promise((resolve) => setTimeout(resolve, 300));

      await animateProgress(85, 400);

      setDownloadState((prev) => ({
        ...prev,
        stage: "saving",
        progress: 92,
      }));

      downloadResultsPdf({
        userInput: resultData.userInput || {},
        top5Results: (resultData.top5Results || []).map((project) => ({
          project: {
            projectName: project.projectName,
            projectId: project.projectId,
            category: project.category,
            recommendedCapital: project.recommendedCapital,
          },
          totalScore: project.totalScore,
          recommendation: project.recommendation,
          reasons: project.reasons || [],
        })),
        explanationText: resultData.explanationText || "",
      });

      await animateProgress(100, 300);

      setDownloadState((prev) => ({
        ...prev,
        stage: "complete",
        progress: 100,
      }));
    } catch (error: unknown) {
      console.error("PDF generation error:", error);

      const message =
        error instanceof Error
          ? error.message
          : "حدث خطأ غير متوقع. حاول مرة أخرى.";

      setDownloadState({
        visible: true,
        stage: "error",
        progress: 0,
        fileName,
        errorMessage: message,
      });
    }
  };

  const handleCloseDownload = () => {
    setDownloadState((prev) => ({
      ...prev,
      visible: false,
    }));
  };

  const isDownloading =
    downloadState.visible &&
    downloadState.stage !== "complete" &&
    downloadState.stage !== "error";

  const handleShare = async () => {
    const token = resultData?.shareToken;
    if (!token) return;

    const url = `${window.location.origin}/results?share=${token}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "نتائجي — NABDA",
          text: "شاهد نتائج تقييم مشروعني على منصة NABDA",
          url,
        });
        return;
      } catch {
        // user cancelled or share failed — fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      alert("تم نسخ رابط المشاركة.");
    } catch {
      // clipboard API unavailable
    }
  };

  if (!resultData) {
    return (
      <div
        dir="rtl"
        className="min-h-screen flex items-center justify-center bg-slate-50"
      >
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-600">
            جاري تحميل نتائج التقييم...
          </p>
        </div>
      </div>
    );
  }

  if (!consentGranted) {
    return (
      <ConsentGate
        purpose="assessment"
        sessionId={sessionId}
        onGranted={() => setConsentGranted(true)}
      />
    );
  }

  const userInput = resultData.userInput || {};

  const top5Results = Array.isArray(resultData.top5Results)
    ? resultData.top5Results
    : [];

  const topMatch = top5Results[0];

  const capital = Number(
    userInput.capital || resultData.userCapital || 0
  );

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-50 text-slate-900"
    >
      <div className="hidden print:block mb-8">
        <h1 className="text-2xl font-black">
          NABDA - تقرير نتائج الاختبار
        </h1>

        <p className="text-sm text-slate-600 mt-2">
          قبل ما تبدأ مشروعك... اختبره.
        </p>

        <p className="text-xs text-slate-500 mt-2">
          التاريخ: {new Date().toLocaleDateString("ar-DZ")}
        </p>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6 print:hidden">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              نتيجة تحليل NABDA
            </span>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 mt-1">
              أفضل 5 مشاريع مناسبة لظروفك الحالية
            </h1>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
            <button
              onClick={() => window.print()}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              طباعة
            </button>

            {resultData?.shareToken && (
              <button
                onClick={handleShare}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                مشاركة
              </button>
            )}

            <button
              onClick={handleDownloadResultsPdf}
              disabled={isDownloading}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-extrabold flex items-center justify-center gap-2 disabled:opacity-60"
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

            <Link
              href="/test"
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              إعادة الاختبار
            </Link>
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              ملخص معطياتك المدخلة
            </h2>

            <span className="text-xs text-slate-400">
              {userInput.wilayaName || "الجزائر"}
              {" - "}
              {userInput.communeName || ""}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm">
            <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700">
              <span className="text-slate-400 block text-[11px] mb-1">
                رأس المال
              </span>

              <span className="font-extrabold text-indigo-400 text-base">
                {capital.toLocaleString("ar-DZ")} دج
              </span>
            </div>

            <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700">
              <span className="text-slate-400 block text-[11px] mb-1">
                مكان العمل
              </span>

              <span className="font-bold text-white">
                {userInput.workspace || "غير محدد"}
              </span>
            </div>

            <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700">
              <span className="text-slate-400 block text-[11px] mb-1">
                الوقت المتاح
              </span>

              <span className="font-bold text-white">
                {userInput.availableHours || "غير محدد"}
              </span>
            </div>

            <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700">
              <span className="text-slate-400 block text-[11px] mb-1">
                تحمل المخاطرة
              </span>

              <span className="font-bold text-amber-300">
                {userInput.riskLevel || "غير محدد"}
              </span>
            </div>
          </div>
        </div>

        {topMatch && (
          <div className="bg-gradient-to-br from-indigo-50 via-sky-50 to-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-500/40 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-indigo-200 pb-6">
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-indigo-600 text-white font-extrabold text-xs inline-flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  المشروع الأكثر ملاءمة لك (#1)
                </span>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  {topMatch.projectName}
                </h2>

                {topMatch.description && (
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                    {topMatch.description}
                  </p>
                )}
              </div>

              <div className="text-center bg-white p-4 rounded-2xl border border-indigo-200 shadow-sm shrink-0 w-full sm:w-auto">
                <span className="text-[11px] font-bold text-slate-500 block">
                  درجة التوافق
                </span>

                <span className="text-4xl font-black text-indigo-600 font-mono">
                  {topMatch.totalScore}
                </span>

                <span className="text-xs font-bold text-slate-400">
                  /100
                </span>

                <div className="mt-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-indigo-200 text-indigo-700">
                    {topMatch.recommendation}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-indigo-200 space-y-2">
              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                لماذا اخترنا هذا المشروع؟
              </h3>

              {topMatch.reasons && topMatch.reasons.length > 0 ? (
                <ul className="list-disc list-inside text-xs sm:text-sm text-slate-700 space-y-1">
                  {topMatch.reasons.map((reason, index) => (
                    <li key={index}>{reason}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500">
                  تم اختيار المشروع بناءً على نتيجة التقييم الخاصة بك.
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">
                  رأس المال الأدنى
                </span>

                <span className="font-extrabold text-slate-900">
                  {topMatch.minCapital
                    ? `${topMatch.minCapital.toLocaleString("ar-DZ")} دج`
                    : "غير محدد"}
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">
                  رأس المال الموصى به
                </span>

                <span className="font-extrabold text-indigo-700">
                  {topMatch.recommendedCapital
                    ? `${topMatch.recommendedCapital.toLocaleString(
                        "ar-DZ"
                      )} دج`
                    : "غير محدد"}
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">
                  مستوى الصعوبة
                </span>

                <span className="font-bold text-slate-800">
                  {topMatch.difficulty || "غير محدد"}
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">
                  قابلية التوسع
                </span>

                <span className="font-bold text-slate-800">
                  {topMatch.scalability || "غير محدد"}
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <Link
                href={`/projects/${topMatch.projectId}`}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 text-white font-extrabold text-xs sm:text-sm hover:bg-indigo-700 shadow-md flex items-center justify-center gap-2"
              >
                تفاصيل هذا المشروع
                <ChevronLeft className="w-4 h-4" />
              </Link>

              <Link
                href={`/calculator?purchase=${
                  topMatch.initialStock || 500
                }&sale=1500&capital=${capital}`}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 text-slate-800 font-bold text-xs sm:text-sm hover:bg-slate-50 flex items-center justify-center gap-2"
              >
                <Calculator className="w-4 h-4 text-indigo-600" />
                فتح حاسبة الأرباح
              </Link>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              ترتيب أفضل 5 مشاريع مقترحة لك
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              يمكنك الضغط على أي مشروع لمشاهدة التفاصيل.
            </p>
          </div>

          <div className="space-y-4">
            {top5Results.map((project, index) => (
              <div
                key={`${project.projectId}-${index}`}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-black flex items-center justify-center text-sm shrink-0">
                      #{index + 1}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-bold text-slate-900">
                          {project.projectName}
                        </h3>

                        {project.category && (
                          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600">
                            {project.category}
                          </span>
                        )}
                      </div>

                      {project.description && (
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <div className="text-right">
                      <span className="text-xl font-black text-indigo-600 font-mono">
                        {project.totalScore}
                      </span>

                      <span className="text-xs text-slate-400">
                        /100
                      </span>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-xs font-bold border border-indigo-200 text-indigo-700">
                      {project.recommendation}
                    </span>
                  </div>
                </div>

                {project.reasons &&
                  project.reasons.length > 0 && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                      <span className="font-bold text-slate-900 block mb-1">
                        أبرز أسباب التوافق:
                      </span>

                      <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                        {project.reasons
                          .slice(0, 3)
                          .map((reason, reasonIndex) => (
                            <li key={reasonIndex}>{reason}</li>
                          ))}
                      </ul>
                    </div>
                  )}

                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-4 text-slate-600 flex-wrap">
                    {project.recommendedCapital && (
                      <span>
                        موصى به:{" "}
                        <strong>
                          {project.recommendedCapital.toLocaleString(
                            "ar-DZ"
                          )}{" "}
                          دج
                        </strong>
                      </span>
                    )}

                    <span>
                      العمل:{" "}
                      <strong>
                        {project.homeBased
                          ? "من المنزل"
                          : "محل / آخر"}
                      </strong>
                    </span>

                    {project.riskLevel && (
                      <span>
                        المخاطرة:{" "}
                        <strong>{project.riskLevel}</strong>
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/projects/${project.projectId}`}
                    className="px-4 py-2 rounded-lg bg-slate-100 text-slate-900 font-bold hover:bg-indigo-600 hover:text-white transition-colors flex items-center gap-1"
                  >
                    عرض التحليل الكامل
                    <ChevronLeft className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center py-4">
          <a
            href="https://t.me/+xvIo0_hK5k9mOWVk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 text-white font-extrabold text-xs hover:bg-sky-600 transition-colors"
          >
            فكرة مشروع في ولايتك — كل أسبوع
          </a>
        </div>

        <div className="hidden print:block mt-8 pt-4 border-t-2 border-slate-300 text-center text-xs text-slate-500">
          <p className="font-bold">
            منصة NABDA | قبل ما تبدأ مشروعك... اختبره
          </p>

          <p className="mt-1">
            هذا التقرير عبارة عن محاكاة وتقديرات مبنية على
            معطياتك وظروف السوق، ولا يُعد ضمانًا للربح أو
            توصية استثمارية.
          </p>

          <p className="mt-1">
            © {new Date().getFullYear()} NABDA - جميع الحقوق محفوظة.
          </p>
        </div>
      </main>

      <DownloadProgress
        state={downloadState}
        onClose={handleCloseDownload}
      />
    </div>
  );
}
