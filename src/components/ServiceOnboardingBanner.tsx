"use client";

import { useState, useEffect } from "react";
import { User, X, ArrowLeft } from "lucide-react";

export default function ServiceOnboardingBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem("dismissed_onboarding");
      if (!dismissed) {
        setVisible(true);
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  if (!visible) return null;

  const handleDismiss = () => {
    try {
      localStorage.setItem("dismissed_onboarding", "true");
    } catch {
      // localStorage unavailable
    }
    setVisible(false);
  };

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative bg-gradient-to-r from-indigo-50 via-white to-fuchsia-50 border border-indigo-200 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-3 left-3 p-1.5 rounded-lg hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
          <User className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0 pe-8 sm:pe-0">
          <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
            خصص تجربتك في NABDA
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            أدخل معلوماتك للحصول على تجربة أكثر ملاءمة — اسمك وولايتك فقط يكفي للبدء.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="/test"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-extrabold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <span>أكمل معلوماتك</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </a>
          <button
            type="button"
            onClick={handleDismiss}
            className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 transition-colors"
          >
            لاحقاً
          </button>
        </div>
      </div>
    </section>
  );
}
