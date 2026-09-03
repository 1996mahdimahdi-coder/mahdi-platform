"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import type { ReactNode } from "react";
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
  GraduationCap,
  Layers,
  Library,
  ChevronDown
} from "lucide-react";
import GlobalSearch from "@/components/GlobalSearch";

type NavItem = { href: string; label: string; icon?: ReactNode };

const MAIN_LINKS: NavItem[] = [
  { href: "/test", label: "اختبر وضعي", icon: <Sparkles className="w-4 h-4 text-indigo-600" /> },
  { href: "/no-capital", label: "بدون رأس مال", icon: <Rocket className="w-4 h-4 text-emerald-600" /> },
  { href: "/projects", label: "المشاريع", icon: <Compass className="w-4 h-4 text-slate-500" /> },
  { href: "/learn", label: "تعلم", icon: <GraduationCap className="w-4 h-4 text-slate-500" /> },
];

const TOOLS_LINKS: NavItem[] = [
  { href: "/calculator", label: "حاسبة الربح", icon: <Calculator className="w-4 h-4 text-slate-500" /> },
  { href: "/simulator", label: "المحاكاة", icon: <TrendingUp className="w-4 h-4 text-slate-500" /> },
  { href: "/idea-test", label: "اختبار فكرة", icon: <Lightbulb className="w-4 h-4 text-amber-500" /> },
  { href: "/plan", label: "خطة 30 يوم", icon: <CalendarCheck className="w-4 h-4 text-slate-500" /> },
];

const CONTENT_LINKS: NavItem[] = [
  { href: "/domains", label: "المجالات", icon: <Layers className="w-4 h-4 text-slate-500" /> },
  { href: "/legal-guide", label: "الدليل القانوني", icon: <span className="text-sm">⚖️</span> },
  { href: "/blog", label: "المقالات", icon: <FileText className="w-4 h-4 text-slate-500" /> },
];

const PRODUCTS_LINKS: NavItem[] = [
  { href: "/library", label: "مكتبة NABDA", icon: <Library className="w-4 h-4 text-slate-500" /> },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
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
            <span className="font-extrabold text-lg text-slate-900 leading-tight">
              NABDA
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="font-official hidden lg:flex items-center gap-1 xl:gap-2 text-[15px] font-bold text-slate-900">
            {MAIN_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                {item.icon}
                {item.label}
              </Link>
            ))}

            {/* أدوات dropdown */}
            <div className="relative group">
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Calculator className="w-4 h-4 text-slate-500" />
                أدوات
                <ChevronDown className="w-4 h-4 text-slate-400 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute right-0 top-full pt-1 hidden group-hover:block">
                <div className="w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                  {TOOLS_LINKS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-sm transition-colors"
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* محتوى dropdown */}
            <div className="relative group">
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Layers className="w-4 h-4 text-slate-500" />
                محتوى
                <ChevronDown className="w-4 h-4 text-slate-400 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute right-0 top-full pt-1 hidden group-hover:block">
                <div className="w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                  {CONTENT_LINKS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-sm transition-colors"
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* منتجات dropdown */}
            <div className="relative group">
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 transition-colors cursor-pointer"
              >
                <Library className="w-4 h-4 text-amber-600" />
                منتجات
                <ChevronDown className="w-4 h-4 text-amber-500 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute right-0 top-full pt-1 hidden group-hover:block">
                <div className="w-56 rounded-2xl border border-amber-200 bg-white p-2 shadow-xl">
                  <div className="px-3 pt-1 pb-2 text-[11px] font-bold text-amber-700">
                    منتجات قابلة للشراء
                  </div>
                  {PRODUCTS_LINKS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-sm transition-colors"
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* Right Actions / Auth */}
          <div className="hidden lg:flex items-center gap-2">
            <GlobalSearch />
            {user ? (
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
            )}
          </div>

          {/* Mobile: Search + Login + Menu Toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <GlobalSearch />
            {!user && (
              <Link
                href="/login"
                className="px-3 py-2 text-sm font-semibold rounded-lg bg-slate-900 text-white"
              >
                تسجيل الدخول
              </Link>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                if (mobileMenuOpen) setMobileGroup(null);
              }}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="font-official lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <div className="px-3 py-2">
            <GlobalSearch />
          </div>
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
            href="/projects"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800 font-medium"
          >
            <Compass className="w-4 h-4 text-slate-500" />
            تصفح جميع المشاريع
          </Link>
          <Link
            href="/learn"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800 font-medium"
          >
            <GraduationCap className="w-4 h-4 text-slate-500" />
            تعلم وأنشئ محتوى
          </Link>

          {/* أدوات group */}
          <div>
            <button
              type="button"
              onClick={() => setMobileGroup(mobileGroup === "tools" ? null : "tools")}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-100 text-slate-800 font-medium"
            >
              <span className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-slate-500" />
                أدوات
              </span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${mobileGroup === "tools" ? "rotate-180" : ""}`} />
            </button>
            {mobileGroup === "tools" && (
              <div className="pr-3 space-y-1">
                {TOOLS_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 font-medium"
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* محتوى group */}
          <div>
            <button
              type="button"
              onClick={() => setMobileGroup(mobileGroup === "content" ? null : "content")}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-100 text-slate-800 font-medium"
            >
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-500" />
                محتوى
              </span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${mobileGroup === "content" ? "rotate-180" : ""}`} />
            </button>
            {mobileGroup === "content" && (
              <div className="pr-3 space-y-1">
                {CONTENT_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 font-medium"
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* منتجات group */}
          <div>
            <button
              type="button"
              onClick={() => setMobileGroup(mobileGroup === "products" ? null : "products")}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 font-medium"
            >
              <span className="flex items-center gap-2">
                <Library className="w-4 h-4 text-amber-600" />
                منتجات
              </span>
              <ChevronDown className={`w-4 h-4 text-amber-500 transition-transform ${mobileGroup === "products" ? "rotate-180" : ""}`} />
            </button>
            {mobileGroup === "products" && (
              <div className="pr-3 space-y-1">
                <div className="px-3 pt-1.5 text-[11px] font-bold text-amber-700">
                  منتجات قابلة للشراء
                </div>
                {PRODUCTS_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 font-medium"
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
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
