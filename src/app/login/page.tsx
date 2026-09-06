import type { Metadata } from "next";
import { count, countDistinct } from "drizzle-orm";
import { db } from "@/db";
import { projects, wilayas } from "@/db/schema";
import { PROJECT_COUNT } from "@/lib/constants";
import LoginClient from "@/components/LoginClient";

export const metadata: Metadata = {
  title: "تسجيل الدخول",
  description:
    "ادخل إلى منصة NABDA DZ بحساب Google لاكتشاف واختيار مشاريع مناسبة حسب رأس المال والمجال والولاية.",
};

// Render at request time so the wilaya/field aggregates reflect live data.
export const dynamic = "force-dynamic";

/**
 * NABDA DZ — Login page (server component) with a two-column professional
 * layout:
 *   Section 1: Google-only login (interactive client component).
 *   Section 2: NABDA DZ intro with verified stats.
 *
 * Data contract (all bounded, read-only server aggregates — no full table load):
 *   - Projects/ideas: MARKETING catalog stat from PROJECT_COUNT (349). This is
 *     the advertised catalog size, labelled as مرشحة "وأفكار" (not a live
 *     COUNT of the projects table).
 *   - Wilayas: live COUNT(*) FROM wilayas (verified 69).
 *   - Fields: live COUNT(DISTINCT category) FROM projects (verified 6).
 * Any failed aggregate degrades to the verified static value so login never
 * hard-fails.
 */
export default async function LoginPage() {
  let wilayaCount = 69;
  let fieldCount = 6;

  try {
    const [wRow] = await db.select({ value: count() }).from(wilayas).limit(1);
    const [fRow] = await db
      .select({ value: countDistinct(projects.category) })
      .from(projects)
      .limit(1);
    if (wRow && wRow.value > 0) wilayaCount = wRow.value;
    if (fRow && fRow.value > 0) fieldCount = fRow.value;
  } catch {
    // Keep verified fallbacks.
  }

  return (
    <div dir="rtl" className="w-full max-w-6xl mx-auto px-4 py-10 sm:py-14">
      <div className="grid lg:grid-cols-2 overflow-hidden rounded-3xl border border-slate-200 shadow-xl bg-white">
        {/* Section 1 — Login (Google only) */}
        <section className="order-2 p-8 sm:p-12 flex flex-col justify-center bg-gradient-to-br from-indigo-700 via-indigo-800 to-indigo-900">
          <div className="w-12 h-12 rounded-2xl bg-white text-indigo-700 font-black text-xl flex items-center justify-center mb-6 shadow-lg">
            NB
          </div>
          <LoginClient />
        </section>

        {/* Section 2 — NABDA DZ intro */}
        <section className="order-1 p-8 sm:p-12 bg-slate-50/60">
          <div className="space-y-7">
            <div className="space-y-2">
              <p className="text-indigo-600 font-black text-sm tracking-wide">
                نبضة DZ
              </p>
              <h1 className="text-3xl sm:text-4xl font-black leading-tight text-slate-900">
                NABDA DZ
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed">
                منصة جزائرية تساعدك على اكتشاف واختيار أفكار ومشاريع مناسبة
                حسب رأس المال، المجال، والولاية.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-white border border-slate-200 p-4 text-center shadow-sm">
                <div className="text-2xl sm:text-3xl font-black text-indigo-700">
                  {PROJECT_COUNT}+
                </div>
                <div className="mt-1 text-[11px] sm:text-xs font-bold text-slate-500">
                  مشروعًا وأفكارًا
                </div>
              </div>
              <div className="rounded-2xl bg-white border border-slate-200 p-4 text-center shadow-sm">
                <div className="text-2xl sm:text-3xl font-black text-indigo-700">
                  {wilayaCount}
                </div>
                <div className="mt-1 text-[11px] sm:text-xs font-bold text-slate-500">
                  ولاية
                </div>
              </div>
              <div className="rounded-2xl bg-white border border-slate-200 p-4 text-center shadow-sm">
                <div className="text-2xl sm:text-3xl font-black text-indigo-700">
                  {fieldCount}
                </div>
                <div className="mt-1 text-[11px] sm:text-xs font-bold text-slate-500">
                  مجال
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              كتالوج وأفكار مشاريع قابلة للاستكشاف
            </p>

            <p className="text-sm text-slate-600 leading-relaxed">
              اكتشف مشروعك القادم وابدأ خطوتك الأولى مع نبضة DZ.
            </p>

            <ul className="space-y-2.5 text-sm text-slate-700">
              {[
                "اكتشاف المشاريع والأفكار",
                "اختيار مشروع مناسب لظروفك",
                "حساب الميزانية ورأس المال",
                "استكشاف المشاريع حسب الولاية والمجال",
                "الاستفادة من الاختبارات والحاسبات والمحتوى المتوفر",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-black shrink-0">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
