"use client";
import { useEffect, useState } from "react";
import { isCapacitor } from "@/lib/capacitor";

/**
 * Client-only interactive part of the NABDA DZ login page.
 *
 * Authentication is Google-only (no email/password alternative) per product
 * decision. The existing Google OAuth flow is reused unchanged:
 *
 *   Login page -> /api/auth/google (redirect to Google) -> callback
 *   (/api/auth/google/callback) verifies the ID token, creates a session
 *   cookie, and redirects to "/" -> existing session/auth/redirect flow.
 *
 * On Capacitor (mobile app) the native Google Sign-In is used and the ID token
 * is exchanged via /api/auth/google/capacitor. Nothing here rebuilds the auth
 * system, creates its own sessions, or touches CSRF / rate limits.
 */
export default function LoginClient() {
  // Surfaced via the callback redirect (?error=google). Read from the client
  // URL at first render rather than setting state synchronously in an effect.
  const [error, setError] = useState(() => {
    if (
      typeof window !== "undefined" &&
      window.location.search.indexOf("error=google") !== -1
    ) {
      return "تعذر تسجيل الدخول بحساب Google. حاول مرة أخرى، أو تأكد من تفعيل تسجيل الدخول عبر Google.";
    }
    return "";
  });
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleEnabled, setGoogleEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/auth/config", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setGoogleEnabled(Boolean(d?.googleEnabled)))
      .catch(() => setGoogleEnabled(false));
  }, []);

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    setError("");

    if (isCapacitor()) {
      try {
        const { SocialLogin } = await import("@capgo/capacitor-social-login");
        const { result } = await SocialLogin.login({
          provider: "google",
          options: {},
        });
        const idToken =
          result.responseType === "online" ? result.idToken : null;

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
        setGoogleLoading(false);
        if (err instanceof Error && err.message.includes("cancelled")) {
          setError("تم إلغاء تسجيل الدخول.");
        } else {
          setError(
            err instanceof Error
              ? err.message
              : "حدث خطأ أثناء تسجيل الدخول بحساب Google."
          );
        }
      }
      return;
    }

    window.location.href = "/api/auth/google";
  }

  return (
    <div className="space-y-6">
      <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-extrabold border border-white/15">
        تسجيل الدخول إلى NABDA DZ
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          ادخل إلى حسابك
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          تسجيل الدخول بحساب Google هو الطريقة الوحيدة للوصول إلى المنصة
          ووظائفك المحفوظة — بدون كلمات مرور.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="p-3 rounded-xl bg-rose-500/15 border border-rose-400/40 text-rose-100 text-xs font-bold"
        >
          {error}
        </div>
      )}

      <button
        type="button"
        disabled={googleLoading}
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 rounded-2xl bg-white px-4 py-3.5 text-sm font-bold text-slate-800 shadow-xl hover:bg-slate-50 active:scale-[0.99] transition-all disabled:opacity-70"
      >
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        {googleLoading ? "جارٍ التوجيه..." : "المتابعة باستخدام Google"}
      </button>

      <p className="text-center text-[11px] text-slate-400">
        {googleEnabled === false
          ? "تسجيل Google غير متاح حاليًا."
          : "نستخدم حساب Google فقط — بدون كلمات مرور"}
      </p>
    </div>
  );
}
