"use client";
import { FormEvent, useEffect, useState } from "react";
import { isCapacitor } from "@/lib/capacitor";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleEnabled, setGoogleEnabled] = useState<boolean | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/config", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setGoogleEnabled(Boolean(d?.googleEnabled)))
      .catch(() => setGoogleEnabled(false));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const csrfResponse = await fetch("/api/csrf", { credentials: "include", cache: "no-store" });
      const csrfData = await csrfResponse.json();
      if (!csrfResponse.ok || !csrfData?.token) throw new Error("تعذر تجهيز حماية الطلب.");

      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", "x-csrf-token": csrfData.token },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok || !data?.success) throw new Error(data?.error || "بيانات الدخول غير صحيحة.");
      window.location.assign("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء تسجيل الدخول.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    setError("");

    if (isCapacitor()) {
      try {
        const { SocialLogin } = await import("@capgo/capacitor-social-login");
        const { result } = await SocialLogin.login({ provider: "google", options: {} });
        const idToken = result.responseType === "online" ? result.idToken : null;

        if (!idToken) {
          throw new Error("لم يتم الحصول على رمز الدخول من Google.");
        }

        const res = await fetch("/api/auth/google/capacitor", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken }),
        });

        const data = await res.json();
        if (!res.ok || !data?.success) {
          throw new Error(data?.error || "تعذر تسجيل الدخول.");
        }

        window.location.href = "/";
      } catch (err) {
        if (err instanceof Error && err.message.includes("cancelled")) {
          setError("تم إلغاء تسجيل الدخول.");
        } else {
          setError(err instanceof Error ? err.message : "حدث خطأ أثناء تسجيل الدخول بحساب Google.");
        }
        setGoogleLoading(false);
      }
      return;
    }

    window.location.href = "/api/auth/google";
  }

  return (
    <main dir="rtl" className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-xl flex items-center justify-center mx-auto">NB</div>
          <h1 className="text-2xl font-black text-slate-900">تسجيل الدخول</h1>
          <p className="text-xs text-slate-500">ادخل إلى حسابك بالبريد الإلكتروني وكلمة المرور.</p>
        </div>
        {error && <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" dir="ltr" placeholder="أدخل بريدك الإلكتروني" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" dir="ltr" placeholder="أدخل كلمة المرور" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm" />
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-60">
            {loading ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
          </button>
        </form>
        {googleEnabled === false && (
          <p className="text-center text-[11px] text-slate-400">تسجيل Google غير متاح حالياً.</p>
        )}
        {googleEnabled === true && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
              <div className="relative flex justify-center text-[11px]"><span className="bg-white px-2 text-slate-400">أو</span></div>
            </div>
            <button
              type="button"
              disabled={googleLoading}
              onClick={handleGoogleLogin}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {googleLoading ? "جارٍ التوجيه..." : "تسجيل الدخول بحساب Google"}
            </button>
          </>
        )}
      </div>
    </main>
  );
}
