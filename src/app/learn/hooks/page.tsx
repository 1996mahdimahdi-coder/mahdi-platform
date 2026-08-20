"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, LayoutGrid, Inbox } from "lucide-react";

type HookItem = {
  id: number;
  title: string;
  hookText: string;
  type?: string;
  niche?: string;
  usageContext?: string;
  strength?: string;
  example?: string;
};

const TYPE_LABELS: Record<string, string> = {
  question: "سؤال",
  number: "رقم",
  curiosity: "فضول",
  contrast: "تباين",
  story: "قصة",
};

export default function LearnHooksPage() {
  const [hooks, setHooks] = useState<HookItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/learn/hooks", { cache: "no-store" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error("failed");
        return data.hooks as HookItem[];
      })
      .then(setHooks)
      .catch(() => setHooks([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        <div className="border-b border-slate-200 pb-6">
          <span className="text-xs font-black text-emerald-600 uppercase tracking-wider">
            hooks
          </span>

          <h1 className="text-2xl sm:text-4xl font-black mt-1">مكتبة hooks الفيديو</h1>

          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            جمل تفتح بها فيديو قصير وتشد الجمهور في أول ثانيتين.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-3 py-20 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <p className="text-sm font-bold">جاري تحميل الـ hooks...</p>
          </div>
        ) : hooks.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
              <Inbox className="w-7 h-7" />
            </div>

            <div>
              <h2 className="font-black text-lg">المكتبة قيد البناء</h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                سنضيف هنا أكثر من 100 hook مجرّب لأنواع المحتوى المختلفة. ابدأ
                الآن بفهم أنواع المحتوى وأفضل الممارسات.
              </p>
            </div>

            <Link
              href="/learn/content"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 text-white font-extrabold text-xs hover:bg-slate-800"
            >
              <LayoutGrid className="w-4 h-4" />
              اكتشف أنواع المحتوى
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {hooks.map((hook) => (
              <div key={hook.id} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-black text-sm">{hook.title}</h2>

                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-extrabold">
                    {TYPE_LABELS[hook.type ?? ""] ?? hook.type}
                  </span>
                </div>

                <p className="text-sm font-bold text-slate-800 leading-relaxed">
                  {hook.hookText}
                </p>

                {hook.usageContext && (
                  <p className="text-[11px] text-slate-500">{hook.usageContext}</p>
                )}

                {hook.example && (
                  <div className="bg-slate-50 rounded-xl p-3 text-[11px] text-slate-600">
                    <span className="font-extrabold text-slate-800 block mb-0.5">مثال:</span>
                    {hook.example}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
