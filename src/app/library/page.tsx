"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Loader2, BookOpen, Inbox, ChevronLeft, Send, FileText } from "lucide-react";
import type { LibraryBookItem } from "@/lib/noCapital/types";

const TELEGRAM_URL = "https://t.me/+xvIo0_hK5k9mOWVk";

export default function LibraryPage() {
  const [books, setBooks] = useState<LibraryBookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/library", { cache: "no-store" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error("failed");
        return data.books as LibraryBookItem[];
      })
      .then(setBooks)
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const map: Record<string, number> = { all: books.length };
    const seen: string[] = [];
    for (const book of books) {
      const key = book.category || "عام";
      if (!seen.includes(key)) seen.push(key);
      map[key] = (map[key] ?? 0) + 1;
    }
    return { counts: map, list: seen };
  }, [books]);

  const filtered = useMemo(
    () =>
      activeCategory == null
        ? books
        : books.filter((b) => (b.category || "عام") === activeCategory),
    [books, activeCategory],
  );

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        <div className="border-b border-slate-200 pb-6">
          <span className="text-xs font-black text-indigo-600 uppercase tracking-wider">
            📚 مكتبة NABDA
          </span>

          <h1 className="text-2xl sm:text-4xl font-black mt-1">كتب وأدلة عملية</h1>

          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            كتب وأدلة عملية تساعدك على فهم المشاريع والتجارة والتسويق والإدارة والمهارات العملية.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-3 py-20 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-sm font-bold">جاري تحميل المكتبة...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
              <Inbox className="w-7 h-7" />
            </div>

            <div>
              <h2 className="font-black text-lg">المكتبة قيد الإعداد</h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                نضيف قريباً كتباً وأدلة عملية. تابع معنا عبر Telegram ليصلك أول كتاب.
              </p>
            </div>

            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-sky-500 text-white font-extrabold text-xs hover:bg-sky-600 transition-colors"
            >
              <Send className="w-4 h-4" />
              تابعنا على Telegram
            </a>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold border transition-colors ${
                  activeCategory === null
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                }`}
              >
                الكل
                <span className={`mr-1 text-[10px] ${activeCategory === null ? "text-slate-300" : "text-slate-400"}`}>
                  ({categories.counts.all})
                </span>
              </button>

              {categories.list.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold border transition-colors ${
                    activeCategory === cat
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                  }`}
                >
                  {cat}
                  <span className={`mr-1 text-[10px] ${activeCategory === cat ? "text-slate-300" : "text-slate-400"}`}>
                    ({categories.counts[cat] ?? 0})
                  </span>
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                  <Inbox className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="font-black text-lg">لا توجد كتب في هذا المجال حالياً.</h2>
                </div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((book) => (
                  <div key={book.slug} className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:border-indigo-300 hover:shadow-lg transition-all group flex flex-col">
                    <Link href={`/library/${book.slug}`} className="block">
                      <div className="bg-gradient-to-br from-indigo-100 via-violet-50 to-fuchsia-100 flex items-center justify-center p-6 aspect-[4/3]">
                        {book.coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="w-full h-full object-contain drop-shadow-lg"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-2xl bg-white text-indigo-600 flex items-center justify-center">
                            <BookOpen className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="p-5 flex flex-col flex-1">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 self-start">
                        {book.category}
                      </span>

                      <Link href={`/library/${book.slug}`}>
                        <h2 className="font-black text-sm sm:text-base mt-2 mb-1.5 group-hover:text-indigo-700 transition-colors">
                          {book.title}
                        </h2>
                      </Link>

                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 flex-1">
                        {book.shortDescription}
                      </p>

                      {book.whatYouLearn && book.whatYouLearn.length > 0 && (
                        <p className="text-[11px] text-slate-400 mt-3 line-clamp-1">
                          <span className="font-bold text-slate-500">ماذا ستتعلم:</span>{" "}
                          {book.whatYouLearn.slice(0, 2).join(" • ")}
                        </p>
                      )}

                      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                        <span className="text-base font-black text-indigo-700">
                          {book.priceDzd > 0 ? `${book.priceDzd.toLocaleString("ar-DZ")} دج` : "مجاني"}
                        </span>

                        <a
                          href={TELEGRAM_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-500 text-white text-[11px] font-extrabold hover:bg-sky-600 transition-colors"
                        >
                          <Send className="w-3.5 h-3.5" />
                          شراء الكتاب عبر Telegram
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center gap-3 text-[11px] text-slate-300">
          <FileText className="w-4 h-4 shrink-0 text-sky-400" />
          <span>
            بعد طلب الكتاب عبر Telegram نتواصل معك لإتمام الدفع يدوياً، ويُرسل لك ملف PDF بعد تأكيد الشراء. لا تتوفر الوثائق للتحميل المباشر هنا.
          </span>
        </div>
      </div>
    </main>
  );
}