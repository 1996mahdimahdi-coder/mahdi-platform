"use client";

import { useEffect, useState } from "react";

function GoogleLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}

export default function LoginPage() {
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    try {
      if (window.location.search.indexOf("error=google") !== -1) {
        setShowError(true);
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-xl flex items-center justify-center mx-auto">
            NB
          </div>
          <h1 className="text-2xl font-black text-slate-900">تسجيل الدخول</h1>
          <p className="text-xs text-slate-500">
            ادخل بحساب Google للمتابعة — سيتم إنشاء حسابك تلقائياً عند أول دخول
          </p>
        </div>

        {showError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
            تعذر تسجيل الدخول بحساب Google. حاول مرة أخرى.
          </div>
        )}

        <a
          href="/api/auth/google"
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 transition-colors font-bold text-sm text-slate-700"
        >
          <GoogleLogo />
          المتابعة باستخدام Google
        </a>

        <p className="text-center text-[11px] text-slate-400">
          نستخدم حساب Google فقط — بدون كلمات مرور
        </p>
      </div>
    </div>
  );
}