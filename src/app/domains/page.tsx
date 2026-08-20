import Link from "next/link";
import type { Metadata } from "next";
import { DEFAULT_DOMAINS } from "@/lib/domainsData";

export const metadata: Metadata = {
  title: "مجالات المشاريع — NABDA",
  description: "اكتشف 25 مجالاً تجارياً في الجزائر مع شرح كامل: التعريف، المتطلبات، والأساسيات لكل مجال.",
};

export default function DomainsPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-4xl font-black">مجالات المشاريع في الجزائر</h1>
          <p className="text-sm text-slate-500 mt-3 max-w-2xl mx-auto">
            اضغط على أي مجال لتعرف تعريفه، ماذا تحتاج للانطلاق فيه، الأساسيات الضرورية، والأشياء الثانوية إذا توفر رأس المال.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {DEFAULT_DOMAINS.map((d) => (
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
              <p className="text-[11px] text-slate-500 mt-1">رأس المال: {d.capitalLevel}</p>
              <p className="text-xs text-slate-400 mt-2 line-clamp-2">{d.definition}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
