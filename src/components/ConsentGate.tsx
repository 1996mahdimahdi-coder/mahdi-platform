"use client";

import { useEffect, useState } from "react";
import { Loader2, ShieldCheck, RefreshCcw } from "lucide-react";
import type { ConsentVersion } from "@/lib/noCapital/types";
import { getCsrfToken } from "@/lib/clientCsrf";

type ConsentGateProps = {
  purpose: "assessment" | "no-capital" | "plan";
  sessionId?: string;
  onGranted: (consentVersion: string) => void;
  onCancel?: () => void;
};

// Mandatory legal gate: no test results are shown until the user reads and
// accepts the current consent text (fetched server-side). Fail-closed: if the
// consent cannot be loaded, the results stay hidden.
export default function ConsentGate({ purpose, sessionId, onGranted, onCancel }: ConsentGateProps) {
  const [consent, setConsent] = useState<ConsentVersion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadConsent = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/no-capital/consent", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.success || !data.consent) {
        throw new Error("consent unavailable");
      }
      setConsent(data.consent);
    } catch {
      setError("تعذر تحميل شروط العرض. تأكد من اتصالك ثم حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(loadConsent);
  }, []);

  const handleAgree = async () => {
    if (!consent) return;
    setSubmitting(true);
    try {
      const csrfToken = await getCsrfToken();

      const res = await fetch("/api/no-capital/consent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify({ sessionId, purpose, version: consent.version }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error("consent record failed");
      }
      onGranted(consent.version);
    } catch {
      setError("تعذر تسجيل موافقتك. حاول مرة أخرى.");
      setSubmitting(false);
    }
  };

  return (
    <div dir="rtl" className="fixed inset-0 z-[120] min-h-screen bg-slate-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              {consent?.title ?? "شروط عرض النتائج"}
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              قبل عرض نتائجك، يطلب منا القانون والحس السليم أن نؤكد معك هذه
              النقاط. المحتوى استرشادي ولا يغني عن استشارة المختصين.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-bold">جاري تحميل الشروط...</span>
          </div>
        ) : error || !consent ? (
          <div className="space-y-4 py-6 text-center">
            <p className="text-sm font-bold text-red-600">{error}</p>
            <button
              onClick={loadConsent}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-extrabold hover:bg-slate-800"
            >
              <RefreshCcw className="w-4 h-4" />
              إعادة المحاولة
            </button>
          </div>
        ) : (
          <>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {consent.text}
            </div>

            <p className="text-[11px] text-slate-400 text-center">
              إصدار الشروط: {consent.version}
            </p>

            <label className="flex items-start gap-3 p-4 rounded-2xl border border-slate-200 hover:border-emerald-400 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 accent-emerald-600"
              />
              <span className="text-xs sm:text-sm font-bold text-slate-800">
                قرأت الشروط وفهمتها وأوافق عليها، وأتحمل مسؤولية التحقق من أي
                شروط قانونية أو إدارية خاصة بنشاطي قبل الانطلاق.
              </span>
            </label>

            <div className="space-y-3">
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="w-full px-6 py-3 rounded-2xl border border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors"
                >
                  العودة
                </button>
              )}

              <button
                onClick={handleAgree}
                disabled={!agreed || submitting}
                className="w-full px-6 py-3.5 rounded-2xl bg-emerald-600 text-white font-black text-sm hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    جاري التسجيل...
                  </>
                ) : (
                  "أوافق وأعرض نتائجي"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
