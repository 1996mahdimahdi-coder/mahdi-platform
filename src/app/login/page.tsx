"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Lock, Mail, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
    const bodyData = isRegister ? { name, email, password } : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();
      if (data.success && data.user) {
        localStorage.removeItem("nabda_user");
        if (data.user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      } else {
        setErrorMsg(data.error || "فشل تسجيل الدخول.");
      }
    } catch (e: any) {
      setErrorMsg("خطأ في الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-black text-xl flex items-center justify-center mx-auto">
            DZ
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            {isRegister ? "إنشاء حساب جديد" : "تسجيل الدخول إلى حسابك"}
          </h1>
          <p className="text-xs text-slate-500">
            احفظ تقاريرك ونتائج تقييم مشاريعك بالجزائر
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold">
          {isRegister && (
            <div className="space-y-1">
              <label className="text-slate-700">الاسم الكامل:</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="محمد جزائري"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pr-10 pl-3 py-2.5 rounded-xl border border-slate-300 font-bold"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-slate-700">البريد الإلكتروني:</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pr-10 pl-3 py-2.5 rounded-xl border border-slate-300 font-bold"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-700">كلمة المرور:</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-10 pl-3 py-2.5 rounded-xl border border-slate-300 font-bold"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-slate-900 text-white font-extrabold text-sm hover:bg-slate-800 transition-colors shadow-md"
          >
            {loading ? "جاري المعالجة..." : isRegister ? "إنشاء الحساب" : "تسجيل الدخول"}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-600">
          {isRegister ? (
            <button
              onClick={() => setIsRegister(false)}
              className="font-bold text-indigo-600 hover:underline"
            >
              لديك حساب بالفعل؟ سجل دخولك هنا
            </button>
          ) : (
            <button
              onClick={() => setIsRegister(true)}
              className="font-bold text-indigo-600 hover:underline"
            >
              ليس لديك حساب؟ أنشئ حساباً جديداً
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
