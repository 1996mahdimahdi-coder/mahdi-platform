"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import ConsentGate from "@/components/ConsentGate";
import { getOrCreateSessionId } from "@/lib/session";
import { getCsrfToken } from "@/lib/clientCsrf";
import type { NoCapitalAnswer, NoCapitalAnswers, NoCapitalQuestion } from "@/lib/noCapital/types";

export default function NoCapitalTestPage() {
  const router = useRouter();

  const [questions, setQuestions] = useState<NoCapitalQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<NoCapitalAnswers>({});
  const [submitting, setSubmitting] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [consentVersion, setConsentVersion] = useState<string | null>(null);
  const [validationError, setValidationError] = useState("");

  const sessionId = getOrCreateSessionId();

  useEffect(() => {
    let cancelled = false;
    fetch("/api/no-capital/questions", { cache: "no-store" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error("failed");
        return data.questions as NoCapitalQuestion[];
      })
      .then((qs) => {
        if (!cancelled) {
          const ordered = [...qs].sort((a, b) => a.order - b.order);
          setQuestions(ordered);
        }
      })
      .catch(() => {
        if (!cancelled) setError("تعذر تحميل أسئلة الاختبار. حاول مرة أخرى.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const question = questions[current];
  const progress = questions.length > 0 ? Math.round(((current + 1) / questions.length) * 100) : 0;

  const isLast = current === questions.length - 1;

  const currentAnswer = question ? (answers[question.questionKey] ?? "") : "";

  const hasAnswer = (q: NoCapitalQuestion): boolean => {
    const a = answers[q.questionKey];
    if (q.type === "multi") return Array.isArray(a) && a.length > 0;
    if (q.type === "text") return typeof a === "string" && a.trim().length > 0;
    return typeof a === "string" && a.length > 0;
  };

  const selectSingle = (value: string) => {
    if (!question) return;
    setAnswers((prev) => ({ ...prev, [question.questionKey]: value }));
  };

  const toggleMulti = (value: string) => {
    if (!question) return;
    setAnswers((prev) => {
      const existing = Array.isArray(prev[question.questionKey]) ? (prev[question.questionKey] as string[]) : [];
      const next = existing.includes(value) ? existing.filter((v) => v !== value) : [...existing, value];
      return { ...prev, [question.questionKey]: next };
    });
  };

  const handleNext = () => {
    if (!question) return;
    if (question.required && !hasAnswer(question)) {
      setValidationError("يرجى الإجابة على هذا السؤال للمتابعة.");
      return;
    }
    setValidationError("");
    if (isLast) {
      setShowConsent(true);
      return;
    }
    setCurrent((c) => c + 1);
  };

  const handleBack = () => {
    setShowConsent(false);
    setCurrent((c) => Math.max(0, c - 1));
  };

  const handleGranted = async (version: string) => {
    setConsentVersion(version);
    setSubmitting(true);
    try {
      const csrfToken = await getCsrfToken();

      const res = await fetch("/api/no-capital/assess", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify({ answers, sessionId, consentVersion: version }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "assess failed");
      }
      localStorage.setItem("nabda_no_capital_result", JSON.stringify(data));
      router.push("/no-capital/results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ. حاول مرة أخرى.");
      setSubmitting(false);
      setShowConsent(false);
      setConsentVersion(null);
    }
  };

  const answeredCount = questions.filter((q) => hasAnswer(q)).length;

  if (showConsent) {
    return (
      <ConsentGate
        purpose="no-capital"
        sessionId={sessionId}
        onGranted={handleGranted}
      />
    );
  }

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-emerald-600">
              اختبار المشاريع بدون رأس مال
            </span>

            <span className="text-xs font-bold text-slate-400">
              {answeredCount} / {questions.length} أُجيب
            </span>
          </div>

          <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <p className="text-sm font-bold">جاري تجهيز الأسئلة...</p>
          </div>
        ) : error || !question ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4">
            <p className="text-sm font-bold text-red-600">
              {error ?? "لا توجد أسئلة متاحة حالياً."}
            </p>
            <button
              onClick={() => router.push("/no-capital")}
              className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-extrabold text-xs"
            >
              العودة لصفحة المشاريع
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900">
                {question.title}
              </h1>

              {question.subtitle && (
                <p className="text-xs sm:text-sm text-slate-500 mt-2">
                  {question.subtitle}
                </p>
              )}
            </div>

            {question.type === "text" ? (
              <textarea
                value={typeof currentAnswer === "string" ? currentAnswer : ""}
                onChange={(e) =>
                  setAnswers((prev) => ({
                    ...prev,
                    [question.questionKey]: e.target.value,
                  }))
                }
                rows={4}
                className="w-full p-4 rounded-2xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm resize-none"
                placeholder="اكتب إجابتك هنا..."
              />
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {question.options.map((option) => {
                  const values = Array.isArray(currentAnswer) ? currentAnswer : currentAnswer ? [currentAnswer] : [];
                  const selected = values.includes(option.value);

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        question.type === "multi"
                          ? toggleMulti(option.value)
                          : selectSingle(option.value)
                      }
                      className={`text-right p-4 rounded-2xl border-2 transition-all ${
                        selected
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-sm">{option.label}</span>
                        {selected && question.type === "multi" && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                      </div>

                      {option.desc && (
                        <p className="text-[11px] text-slate-500 mt-1">
                          {option.desc}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {validationError && (
              <p className="text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-2 text-xs font-bold">
                {validationError}
              </p>
            )}

            <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <button
                onClick={handleBack}
                disabled={current === 0}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1.5"
              >
                <ArrowRight className="w-4 h-4" />
                السابق
              </button>

              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-extrabold hover:bg-emerald-700 flex items-center gap-1.5 shadow-sm"
              >
                {isLast ? "عرض نتائجي" : "التالي"}
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
