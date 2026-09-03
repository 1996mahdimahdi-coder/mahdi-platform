"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Loader2, BookOpen, ChevronLeft, Send, CheckCircle2, ListChecks, FileText } from "lucide-react";
import type { LibraryBookItem } from "@/lib/noCapital/types";

export default function LibraryBookDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [book, setBook] = useState<LibraryBookItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/library/${slug}`, { cache: "no-store" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "الكتاب غير متاح.");
        setBook(data.book as LibraryBookItem);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "الكتاب غير متاح حالياً."))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <main dir="rtl" className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-600">جاري تحميل الكتاب...</p>
        </div>
      </main>
    );
  }

  if (error || !book) {
    return (
      <main dir="rtl" className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 max-w-md">
          <p className="text-sm font-bold text-red-600">{error}</p>
          <Link
            href="/library"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-extrabold text-xs"
          >
            العودة للمكتبة
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <Link href="/library" className="hover:text-indigo-600 flex items-center gap-1">
            <ChevronLeft className="w-3.5 h-3.5" />
            محتوى نابدا
          </Link>
          <span>/</span>
          <Link href="/library" className="hover:text-indigo-600">
            مكتبة NABDA
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[240px_1fr] gap-6 items-start">
          <div className="bg-gradient-to-br from-indigo-100 via-violet-50 to-fuchsia-100 rounded-3xl flex items-center justify-center p-6 aspect-[3/4] sm:aspect-auto sm:h-[320px]">
            {book.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-contain drop-shadow-xl"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-white text-indigo-600 flex items-center justify-center">
                <BookOpen className="w-10 h-10" />
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-extrabold">
              <BookOpen className="w-3.5 h-3.5" />
              {book.category}
            </span>

            <h1 className="text-2xl sm:text-4xl font-black leading-tight">{book.title}</h1>

            <p className="text-sm text-slate-600 leading-relaxed">{book.shortDescription}</p>

            {book.priceDzd > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-3xl font-black text-indigo-700">
                  {book.priceDzd.toLocaleString("ar-DZ")} دج
                </span>
              </div>
            )}

            <div className="pt-2">
              <a
                href={`https://t.me/NABDA2026?text=${encodeURIComponent(
                  `السلام عليكم، أريد شراء كتاب من مكتبة NABDA.\nعنوان الكتاب: ${book.title}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-sky-500 text-white font-extrabold text-sm hover:bg-sky-600 transition-colors shadow-md"
              >
                <Send className="w-4 h-4" />
                شراء الكتاب عبر Telegram
              </a>
              <p className="text-[11px] text-slate-400 mt-2">
                لإتمام الشراء والتواصل معنا عبر Telegram.
              </p>
            </div>
          </div>
        </div>

        {book.description && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {book.description}
          </div>
        )}

        {book.whatYouLearn && book.whatYouLearn.length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
            <h2 className="text-lg font-black flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ماذا ستتعلم من الكتاب؟
            </h2>
            <ul className="grid sm:grid-cols-2 gap-2">
              {book.whatYouLearn.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {book.outline && book.outline.length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
            <h2 className="text-lg font-black flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-indigo-600" />
              محتوى الكتاب / المحاور
            </h2>
            <ol className="space-y-2">
              {book.outline.map((point, index) => (
                <li key={index} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                  <span className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-700 font-extrabold flex items-center justify-center shrink-0 text-[10px]">
                    {index + 1}
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ol>
          </div>
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