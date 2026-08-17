"use client";

import { useEffect, useState } from "react";
import { Loader2, FolderOpen } from "lucide-react";
import type { CategoryItem } from "@/lib/noCapital/types";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/categories", { cache: "no-store" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error("failed");
        return data.categories as CategoryItem[];
      })
      .then(setCategories)
      .catch(() => setError("تعذر تحميل المجالات. حاول مرة أخرى."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        <div className="border-b border-slate-200 pb-6">
          <span className="text-xs font-black text-emerald-600 uppercase tracking-wider">
            مجالات العمل
          </span>

          <h1 className="text-2xl sm:text-4xl font-black mt-1">من أين تريد أن تبدأ؟</h1>

          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            كل مجال سيجمع تدريجياً مشاريع ودروساً وأفكار محتوى وخطط عمل مناسبة.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-3 py-20 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <p className="text-sm font-bold">جاري تحميل المجالات...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center">
            <p className="text-sm font-bold text-red-600">{error}</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div
                key={category.slug}
                className="bg-white rounded-3xl border border-slate-200 p-6 hover:border-emerald-400 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <FolderOpen className="w-5 h-5" />
                  </div>

                  <div>
                    <h2 className="font-black text-sm">{category.nameAr}</h2>
                    <span className="text-[11px] text-slate-400">{category.nameFr}</span>
                  </div>
                </div>

                {category.description && (
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {category.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
