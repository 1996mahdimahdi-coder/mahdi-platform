"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LogOut,
  Sparkles,
  Compass,
  Calculator,
  ChevronLeft,
} from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
}

interface Analysis {
  id: number;
  userId: number | null;
  userCapital: number;
  sessionId: string;
  testAnswers?: any;
  topProjects?: any[];
}

interface DashboardResult {
  success: boolean;
  analysis: Analysis | null;
}

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [lastResult, setLastResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const meRes = await fetch("/api/auth/me", {
          cache: "no-store",
        });

        if (meRes.status === 401 || !meRes.ok) {
          router.replace("/login");
          return;
        }

        const meData = await meRes.json();

        if (!meData.success || !meData.user?.id) {
          router.replace("/login");
          return;
        }

        const currentUser: User = meData.user;

        setUser(currentUser);

        // جلب آخر تحليل من PostgreSQL
        const response = await fetch(
          `/api/dashboard`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (response.status === 401) {
          router.replace("/login");
          return;
        }

        const data: DashboardResult = await response.json();

        if (data.success && data.analysis) {
          const analysis = data.analysis;

          // تحويل بيانات PostgreSQL إلى نفس الشكل المستعمل في الواجهة
          const result = {
            success: true,
            analysisId: analysis.id,
            userInput: {
              capital: analysis.userCapital,
              ...(analysis.testAnswers || {}),
            },
            top5Results: analysis.topProjects || [],
            explanationText: "",
          };

          setLastResult(result);

          // تحديث النسخة المحلية أيضًا
          localStorage.setItem(
            "nabda_last_result",
            JSON.stringify(result)
          );
        } else {
          // احتياط: استعمال النتيجة المحلية إذا لم توجد نتيجة في DB
          const storedResult =
            localStorage.getItem("nabda_last_result");

          if (storedResult) {
            setLastResult(JSON.parse(storedResult));
          }
        }
      } catch (error) {
        console.error("Dashboard loading error:", error);

        // احتياط في حالة فشل API
        try {
          const storedResult =
            localStorage.getItem("nabda_last_result");

          if (storedResult) {
            setLastResult(JSON.parse(storedResult));
          }
        } catch {
          // تجاهل خطأ localStorage
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  const handleLogout = async () => {
    try {
      const csrfRes = await fetch("/api/csrf", { credentials: "include", cache: "no-store" });
      const csrfData = await csrfRes.json();
      if (csrfRes.ok && csrfData?.token) {
        await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
          headers: { "x-csrf-token": csrfData.token },
        });
      }
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem("nabda_user");
    localStorage.removeItem("nabda_last_result");
    window.location.replace("/login");
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <Sparkles className="w-8 h-8 text-indigo-600 mx-auto animate-pulse" />
          <p className="text-sm font-bold text-slate-600">
            جاري تحميل بياناتك...
          </p>
        </div>
      </div>
    );
  }

  const firstProject = lastResult?.top5Results?.[0];

  const projectName =
    firstProject?.project?.projectName ||
    firstProject?.projectName ||
    "لم يتم تحديد مشروع بعد";

  const capital =
    lastResult?.userInput?.capital ||
    lastResult?.userCapital ||
    0;

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-50 text-slate-900"
    >
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div>
              <h1 className="font-black text-lg">
                مرحبًا بك، {user.name}
              </h1>

              <p className="text-xs text-slate-500">
                {user.email}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-10 space-y-6">
        {/* Last Result */}
        {lastResult ? (
          <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl space-y-5 shadow-xl border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <h2 className="text-base font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                آخر تحليل محفوظ لك
              </h2>

              <span className="text-xs text-slate-400">
                رأس المال:{" "}
                {Number(capital).toLocaleString("ar-DZ")} دج
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-slate-400">
                أفضل مشروع مقترح لك
              </p>

              <h3 className="text-xl font-black text-white">
                #1 {projectName}
              </h3>

              <p className="text-xs text-slate-300">
                التحليل محفوظ في حسابك ويمكنك الرجوع إليه في أي وقت.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/results"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors"
              >
                <span>عرض التقرير الكامل</span>
                <ChevronLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4">
            <Sparkles className="w-8 h-8 text-indigo-600 mx-auto" />

            <p className="text-slate-600 text-sm font-bold">
              لم تقم بإجراء أي اختبار تقييم بعد.
            </p>

            <Link
              href="/test"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white text-xs font-bold"
            >
              إجراء أول اختبار
              <Sparkles className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Quick shortcuts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold">
          <Link
            href="/test"
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:shadow-md transition-all flex items-center justify-between"
          >
            <span className="text-slate-900">
              إجراء اختبار ملاءمة جديد
            </span>

            <Sparkles className="w-5 h-5 text-indigo-600" />
          </Link>

          <Link
            href="/calculator"
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:shadow-md transition-all flex items-center justify-between"
          >
            <span className="text-slate-900">
              حاسبة الربح ونقطة التعادل
            </span>

            <Calculator className="w-5 h-5 text-indigo-600" />
          </Link>

          <Link
            href="/projects"
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:shadow-md transition-all flex items-center justify-between"
          >
            <span className="text-slate-900">
              تصفح دليل المشاريع
            </span>

            <Compass className="w-5 h-5 text-indigo-600" />
          </Link>
        </div>
      </main>
    </div>
  );
}