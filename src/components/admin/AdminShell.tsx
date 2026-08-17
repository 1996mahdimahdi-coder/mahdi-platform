"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, LayoutGrid, ChevronLeft } from "lucide-react";

type AdminShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export default function AdminShell({ title, subtitle, children }: AdminShellProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok || !data.success || !data.user) {
          router.replace("/login");
          return;
        }
        if (data.user.role !== "admin") {
          router.replace("/dashboard");
          return;
        }
        if (!cancelled) setReady(true);
      } catch {
        if (!cancelled) router.replace("/login");
      }
    };

    check();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!ready) return null;

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
      <div className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>

            <div>
              <h1 className="text-base font-black">{title}</h1>
              {subtitle && <p className="text-[11px] text-slate-400">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-bold">
            <Link
              href="/admin"
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              الإحصائيات والمشاريع
            </Link>

            <Link
              href="/admin/sources"
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              المصادر
            </Link>

            <Link
              href="/admin/no-capital"
              className="px-3 py-2 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors flex items-center gap-1"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              محتوى نابدا
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">{children}</div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <Link
          href="/admin/no-capital"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600"
        >
          <ChevronLeft className="w-4 h-4" />
          العودة لمحتوى نابدا
        </Link>
      </div>
    </div>
  );
}
