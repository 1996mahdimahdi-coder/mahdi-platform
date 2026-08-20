"use client";

import { useState } from "react";
import Link from "next/link";
import { DEFAULT_DOMAINS } from "@/lib/domainsData";

const CAPITAL_OPTIONS = [
  "0 إلى منخفض",
  "منخفض",
  "منخفض إلى متوسط",
  "متوسط",
  "متوسط إلى مرتفع",
  "مرتفع",
];

export default function DomainsPage() {
  const [query, setQuery] = useState("");
  const [capital, setCapital] = useState("");
  const [onlyRegulated, setOnlyRegulated] = useState<"" | "yes" | "no">("");

  const filtered = DEFAULT_DOMAINS.filter((d) => {
    const q = query.trim();
    if (q) {
      const hay = (d.nameAr + " " + d.services.join(" ")).toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    if (capital && d.capitalLevel !== capital) return false;
    if (onlyRegulated === "yes" && !d.regulated) return false;
    if (onlyRegulated === "no" && d.regulated) return false;
    return true;
  });

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-4xl font-black">مجالات المشاريع في الجزائر</h1>
          <p className="text-sm text-slate-500 mt-3 max-w-2xl mx-auto">
            35 مجالاً تجارياً. فلتر حسب رأس المال أو النشاط المقنن، أو ابحث في اسم المجال ومشاريعه الفرعية.
          </p>
        </div>

        {/* الفلاتر */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث: مثلاً عطور، سيارات، تعليم، صيانة..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-bold outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />

            <select
              value={capital}
              onChange={(e) => setCapital(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-bold outline-none focus:border-indigo-500"
            >
              <option value="">💰 كل مستويات رأس المال</option>
              {CAPITAL_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={onlyRegulated}
              onChange={(e) => setOnlyRegulated(e.target.value as any)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-bold outline-none focus:border-indigo-500"
            >
              <option value="">⚖️ كل الأنشطة</option>
              <option value="yes">يتطلب ترخيصاً/تنظيماً</option>
              <option value="no">غير مقنن</option>
            </select>
          </div>

          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>النتائج: {filtered.length} من {DEFAULT_DOMAINS.length} مجال</span>
            {(query || capital || onlyRegulated) && (
              <button
                onClick={() => { setQuery(""); setCapital(""); setOnlyRegulated(""); }}
                className="text-indigo-600 hover:underline"
              >
                مسح الفلاتر ✕
              </button>
            )}
          </div>
        </div>

        {/* الشبكة */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <p className="font-black text-lg mb-2">لا توجد نتائج</p>
            <p className="text-sm">جرّب كلمة أخرى أو امسح الفلاتر.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((d) => (
              <Link
                key={d.slug}
                href={`/domains/${d.slug}`}
                className="group bg-white rounded-2xl border border-slate-200 p-5 hover:border-indigo-400 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{d.icon}</span>
                  {d.regulated && (
                    <span className="text-[10px] font-extrabold bg-amber-100 text-amber-700 rounded-full px-2 py-0.5">
                      يتطلب ترخيصاً
                    </span>
                  )}
                </div>
                <h2 className="font-black mt-3 group-hover:text-indigo-600 transition-colors">{d.nameAr}</h2>
                <p className="text-[11px] text-slate-500 mt-1">💰 {d.capitalLevel}</p>
                <p className="text-[11px] text-slate-400 mt-1">{d.services.length} مشروع فرعي</p>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2">{d.definition}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
