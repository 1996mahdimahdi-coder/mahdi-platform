"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Download, X, FileText, Loader2 } from "lucide-react";

export type DownloadStage = "preparing" | "generating" | "rendering" | "saving" | "complete" | "error";

export interface DownloadProgressState {
  visible: boolean;
  stage: DownloadStage;
  progress: number; // 0-100
  fileName?: string;
  errorMessage?: string;
}

interface DownloadProgressProps {
  state: DownloadProgressState;
  onClose: () => void;
}

const STAGE_LABELS: Record<DownloadStage, string> = {
  preparing: "جاري تجهيز البيانات...",
  generating: "جاري توليد التقرير...",
  rendering: "جاري تنسيق الصفحات...",
  saving: "جاري حفظ الملف...",
  complete: "تم التنزيل بنجاح!",
  error: "حدث خطأ أثناء التنزيل",
};

const STAGE_DESCRIPTIONS: Record<DownloadStage, string> = {
  preparing: "نقوم بتجميع معلومات المشروع والبيانات المالية",
  generating: "ننشئ التقرير بأقسامه المختلفة (الوصف، التكاليف، السيناريوهات)",
  rendering: "ننسق الصفحات والألوان والجداول",
  saving: "نحفظ الملف على جهازك",
  complete: "يمكنك الآن فتح الملف أو مشاركته",
  error: "حدث خطأ غير متوقع. حاول مرة أخرى",
};

export default function DownloadProgress({ state, onClose }: DownloadProgressProps) {
  // Auto-close on success after 3 seconds
  useEffect(() => {
    if (state.stage === "complete") {
      const timer = setTimeout(() => {
        onClose();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [state.stage, onClose]);

  if (!state.visible) return null;

  const isComplete = state.stage === "complete";
  const isError = state.stage === "error";
  const isSuccess = isComplete;

  return (
    <>
      {/* Subtle backdrop - just to dim the background slightly */}
      <div
        className="fixed inset-0 z-[90] bg-slate-900/20 backdrop-blur-[2px] transition-opacity"
        aria-hidden="true"
      />

      {/* Notification Card - Bottom Right */}
      <div className="fixed bottom-6 right-6 z-[95] animate-slideIn">
        <div
          className={`bg-white rounded-2xl shadow-2xl border-2 w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden ${
            isError
              ? "border-rose-300"
              : isSuccess
              ? "border-indigo-300"
              : "border-indigo-200"
          }`}
        >
          {/* Top Section with Icon & Status */}
          <div className="p-4 pb-3 flex items-start gap-3">
            {/* Icon */}
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                isError
                  ? "bg-rose-100 text-rose-600"
                  : isSuccess
                  ? "bg-indigo-100 text-indigo-600"
                  : "bg-indigo-50 text-indigo-600"
              }`}
            >
              {isError ? (
                <X className="w-6 h-6" />
              ) : isSuccess ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <Loader2 className="w-6 h-6 animate-spin" />
              )}
            </div>

            {/* Text Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-extrabold text-slate-900 truncate">
                  {isError
                    ? "فشل التنزيل"
                    : isSuccess
                    ? "اكتمل التنزيل"
                    : "تنزيل ملف PDF"}
                </h3>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors shrink-0"
                  aria-label="إغلاق"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-600 font-bold mt-0.5">
                {STAGE_LABELS[state.stage]}
              </p>

              {state.fileName && (
                <p className="text-[10px] text-slate-500 mt-0.5 truncate flex items-center gap-1 font-mono">
                  <FileText className="w-3 h-3 shrink-0" />
                  <span className="truncate">{state.fileName}</span>
                </p>
              )}
            </div>
          </div>

          {/* Progress Bar Section */}
          <div className="px-4 pb-4">
            {/* Percentage Display */}
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-slate-500">
                {STAGE_DESCRIPTIONS[state.stage]}
              </span>
              <span
                className={`text-xs font-black font-mono ${
                  isError
                    ? "text-rose-600"
                    : isSuccess
                    ? "text-indigo-600"
                    : "text-indigo-600"
                }`}
              >
                {Math.round(state.progress)}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ease-out rounded-full ${
                  isError
                    ? "bg-gradient-to-r from-rose-500 to-rose-600"
                    : isSuccess
                    ? "bg-gradient-to-r from-indigo-500 to-fuchsia-500"
                    : "bg-gradient-to-r from-indigo-500 to-fuchsia-500"
                }`}
                style={{ width: `${Math.max(0, Math.min(100, state.progress))}%` }}
              />
            </div>

            {/* Success Message Footer */}
            {isSuccess && (
              <div className="mt-3 p-2.5 rounded-lg bg-indigo-50 border border-indigo-200 text-[11px] text-indigo-800 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>تم حفظ الملف في مجلد التنزيلات بجهازك</span>
              </div>
            )}

            {/* Error Message Footer */}
            {isError && state.errorMessage && (
              <div className="mt-3 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-[11px] text-rose-800 font-bold">
                {state.errorMessage}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(120%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </>
  );
}
