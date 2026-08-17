"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Sparkles,
  Calculator,
  Compass,
  Lightbulb,
  CalendarCheck,
  Menu,
  X,
  User,
  ShieldCheck,
  TrendingUp,
  FileText,
  Rocket,
  GraduationCap
} from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadUser = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          cache: "no-store",
        });

        if (res.status === 401) {
          if (cancelled) return;
          setUser(null);
          return;
        }

        const data = await res.json();

        if (!cancelled) {
          if (data.success && data.user) {
            setUser({
              name: data.user.name,
              role: data.user.role,
            });
          } else {
            setUser(null);
          }
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setAuthLoaded(true);
        }
      }
    };

    loadUser();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-black text-sm shadow-md group-hover:scale-105 transition-transform">
              NB
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-slate-900 leading-tight">
                NABDA <span className="text-indigo-600">نابدا</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                قبل ما تبدأ مشروعك... اختبره
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium text-slate-700">
            <Link
              href="/test"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors font-bold"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              اختبر وضعي
            </Link>
            <Link
              href="/no-capital"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors font-bold"
            >
              <Rocket className="w-4 h-4 text-emerald-600" />
              بدون رأس مال
            </Link>
            <Link
              href="/learn"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <GraduationCap className="w-4 h-4 text-slate-500" />
              تعلم
            </Link>
            <Link
              href="/projects"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Compass className="w-4 h-4 text-slate-500" />
              المشاريع
            </Link>
            <Link
              href="/calculator"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Calculator className="w-4 h-4 text-slate-500" />
              حاسبة الربح
            </Link>
            <Link
              href="/simulator"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <TrendingUp className="w-4 h-4 text-slate-500" />
              المحاكاة
            </Link>
            <Link
              href="/idea-test"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Lightbulb className="w-4 h-4 text-amber-500" />
              اختبار فكرة
            </Link>
            <Link
              href="/plan"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <CalendarCheck className="w-4 h-4 text-slate-500" />
              خطة 30 يوم
            </Link>
            <Link
              href="/blog"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              المقالات
            </Link>

            {/* Free Site Notice Badge */}
            <span className="hidden xl:flex items-center gap-1 px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-extrabold border border-indigo-200">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              مجاني بالكامل
            </span>
          </nav>

          {/* Right Actions / Auth */}
          <div className="hidden lg:flex items-center gap-3">
            {authLoaded && (user ? (
              <div className="flex items-center gap-2">
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-100 text-amber-900 hover:bg-amber-200 transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    لوحة الإدارة
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-600" />
                  حسابي ({user.name.split(" ")[0]})
                </Link>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
              >
                تسجيل الدخول
              </Link>
            ))}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            aria-label="القائمة"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <Link
            href="/test"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-indigo-600 text-white font-bold"
          >
            <Sparkles className="w-5 h-5" />
            اختبر وضعي الآن
          </Link>
          <Link
            href="/no-capital"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-600 text-white font-bold"
          >
            <Rocket className="w-5 h-5" />
            ابدأ بدون رأس مال
          </Link>
          <Link
            href="/learn"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800 font-medium"
          >
            <GraduationCap className="w-4 h-4 text-slate-500" />
            تعلم وأنشئ محتوى
          </Link>
          <Link
            href="/projects"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800 font-medium"
          >
            <Compass className="w-4 h-4 text-slate-500" />
            تصفح جميع المشاريع
          </Link>
          <Link
            href="/calculator"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800 font-medium"
          >
            <Calculator className="w-4 h-4 text-slate-500" />
            حاسبة الربح ونقطة التعادل
          </Link>
          <Link
            href="/simulator"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800 font-medium"
          >
            <TrendingUp className="w-4 h-4 text-slate-500" />
            محاكاة السيناريوهات
          </Link>
          <Link
            href="/idea-test"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800 font-medium"
          >
            <Lightbulb className="w-4 h-4 text-amber-500" />
            اختبار فكرة خاصة
          </Link>
          <Link
            href="/plan"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800 font-medium"
          >
            <CalendarCheck className="w-4 h-4 text-slate-500" />
            خطة تنفيذ 30 يوم
          </Link>
          <Link
            href="/blog"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800 font-medium"
          >
            <FileText className="w-4 h-4 text-slate-500" />
            المقالات والنصائح
          </Link>

          <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-800 font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>المنصة NABDA مجانية بالكامل لجميع المستخدمين</span>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {!authLoaded ? (
              <div className="w-full text-center py-2.5 text-xs text-slate-400 font-medium">
                جاري التحميل...
              </div>
            ) : user ? (
              <>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-white font-semibold"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    لوحة الإدارة
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-300 text-slate-800 font-semibold"
                >
                  <User className="w-4 h-4" />
                  حسابي الشخصي
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-slate-900 text-white font-semibold"
              >
                تسجيل الدخول / إنشاء حساب
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
