"use client";

import { useState } from "react";
import Link from "next/link";
import { DEFAULT_NO_CAPITAL_PROJECTS } from "@/lib/noCapital/defaults";
import { NO_CAPITAL_FILTER_META } from "@/lib/noCapitalFilterMeta";
import { Clock, Brain, Wrench, ArrowLeft } from "lucide-react";

const LOCATIONS = ["الكل", "من المنزل", "أونلاين"];
const SKILLS = ["الكل", "بسيطة", "متوسطة", "احترافية"];

export default function NoCapitalPage() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("الكل");
  const [skill, setSkill] = useState("الكل");

  const filtered = DEFAULT_NO_CAPITAL_PROJECTS.filter((p) => {
    const q = query.trim();
    if (q && !(p.nameAr + " " + p.description).toLowerCase().includes(q.toLowerCase())) return false;
    const meta = NO_CAPITAL_FILTER_META[p.slug];
    if (location !== "الكل" && meta?.workLocation !== location) return false;
    if (skill !== "الكل" && meta?.skillLevel !== skill) return false;
    return true;
  });

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-4xl font-black">مشاريع تبدأ بدون رأس مال</h1>
          <p className="text-sm text-slate-500 mt-3 max-w-2xl mx-auto">
            15 مشروعاً يمكن البدء فيها بهاتف أو حاسوب وإنترنت ومهارة قابلة للبيع.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث: كتابة، تصميم، مونتاج، برمجة..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-bold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            />
            <select value={location} onChange={(e) => setLocation(e.target.value)} className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-bold outline-none">
              <option value="الكل">📍 كل الأماكن</option>
              <option value="من المنزل">من المنزل</option>
              <option value="أونلاين">أونلاين</option>
            </select>
            <select value={skill} onChange={(e) => setSkill(e.target.value)} className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-bold outline-none">
              <option value="الكل">🎓 كل المهارات</option>
              <option value="بسيطة">مهارة بسيطة</option>
              <option value="متوسطة">مهارة متوسطة</option>
              <option value="احترافية">مهارة احترافية</option>
            </select>
          </div>
          <div className="text-xs font-bold text-slate-500">
            النتائج: {filtered.length} من {DEFAULT_NO_CAPITAL_PROJECTS.length} مشروع — كلها بلا رأس مال تجاري (بشرط هاتف/حاسوب + إنترنت + مهارة)
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <Link
              key={p.slug}
              href={`/no-capital/projects/${p.slug}`}
              className="group bg-white rounded-2xl border border-slate-200 p-5 hover:border-emerald-400 hover:shadow-lg transition-all flex flex-col gap-3"
            >
              <h2 className="font-black group-hover:text-emerald-600 transition-colors">{p.nameAr}</h2>
              <p className="text-xs text-slate-500 line-clamp-2 flex-1">{p.description}</p>
              <div className="space-y-1.5 text-[11px] text-slate-600 font-bold">
                <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /> {p.timeRequired}</div>
                <div className="flex items-center gap-1.5"><Brain className="w-3.5 h-3.5 text-slate-400" /> {p.effortLevel}</div>
                <div className="flex items-center gap-1.5"><Wrench className="w-3.5 h-3.5 text-slate-400" /> {p.startCostEstimate}</div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-[11px] font-extrabold text-emerald-700">
                  {NO_CAPITAL_FILTER_META[p.slug]?.workLocation} · {NO_CAPITAL_FILTER_META[p.slug]?.skillLevel}
                </span>
                <span className="text-[11px] font-bold text-slate-400 inline-flex items-center gap-1">
                  التفاصيل <ArrowLeft className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
