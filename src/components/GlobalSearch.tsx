"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Search, X, Loader2, FileText, BookOpen, Video, Lightbulb, Briefcase, Rocket, GraduationCap } from "lucide-react";

type SearchItem = {
  id: number;
  type: string;
  title: string;
  description: string;
  href: string;
  score: number;
};

type SearchGroup = {
  key: string;
  label: string;
  count: number;
};

type SearchResponse = {
  success: boolean;
  query: string;
  total: number;
  types: SearchGroup[];
  results: Record<string, SearchItem[]>;
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  project: <Briefcase className="w-4 h-4 text-emerald-600" />,
  no_capital: <Rocket className="w-4 h-4 text-green-600" />,
  blog: <FileText className="w-4 h-4 text-blue-600" />,
  course: <GraduationCap className="w-4 h-4 text-indigo-600" />,
  lesson: <BookOpen className="w-4 h-4 text-violet-600" />,
  video: <Video className="w-4 h-4 text-red-500" />,
  hook: <Lightbulb className="w-4 h-4 text-amber-500" />,
};

const TYPE_LABELS: Record<string, string> = {
  project: "مشاريع",
  no_capital: "بدون رأس مال",
  blog: "مقالات",
  course: "دورات",
  lesson: "دروس",
  video: "فيديوهات",
  hook: "هوكات",
};

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus input when opening
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setQuery("");
        setResults(null);
      }
      // Ctrl+K or Cmd+K to open
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setQuery("");
        setResults(null);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults(null);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        const data: SearchResponse = await res.json();
        if (data.success) {
          setResults(data);
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("search error:", err);
        }
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const clearSearch = useCallback(() => {
    setQuery("");
    setResults(null);
    inputRef.current?.focus();
  }, []);

  const hasResults = results && results.total > 0;

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        aria-label="بحث"
        title="بحث (Ctrl+K)"
      >
        <Search className="w-4 h-4" />
        <span className="hidden xl:inline text-sm font-medium">بحث</span>
      </button>

      {/* Search Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-start justify-center pt-[10vh] px-4">
          <div
            ref={containerRef}
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
          >
            {/* Input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث عن مشروع، مقالة، دورة، فيديو..."
                className="flex-1 text-base text-slate-900 placeholder:text-slate-400 outline-none bg-transparent font-medium"
                dir="rtl"
              />
              {query && (
                <button
                  onClick={clearSearch}
                  className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => {
                  setIsOpen(false);
                  setQuery("");
                  setResults(null);
                }}
                className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-md hover:bg-slate-200 transition-colors"
              >
                ESC
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {/* Loading */}
              {loading && (
                <div className="flex items-center justify-center gap-2 py-8 text-slate-400">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">جاري البحث...</span>
                </div>
              )}

              {/* No query yet */}
              {!loading && query.length < 2 && (
                <div className="py-8 text-center text-slate-400 text-sm">
                  اكتب حرفين على الأقل للبحث
                  <div className="mt-2 text-xs text-slate-300">Ctrl+K لفتح البحث بسرعة</div>
                </div>
              )}

              {/* No results */}
              {!loading && results && results.total === 0 && (
                <div className="py-8 text-center text-slate-400 text-sm">
                  لا توجد نتائج لـ &ldquo;{results.query}&rdquo;
                </div>
              )}

              {/* Results by type */}
              {!loading && hasResults && (
                <div className="py-2">
                  {/* Type summary */}
                  <div className="flex flex-wrap gap-2 px-5 py-2">
                    {results.types.map((t) => (
                      <span
                        key={t.key}
                        className="inline-flex items-center gap-1 text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-full"
                      >
                        {TYPE_ICONS[t.key]}
                        {t.label} ({t.count})
                      </span>
                    ))}
                  </div>

                  {/* Grouped results */}
                  {Object.entries(results.results).map(([type, items]) => (
                    <div key={type} className="mt-1">
                      <div className="px-5 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {TYPE_LABELS[type] ?? type}
                      </div>
                      {items.map((item) => (
                        <Link
                          key={`${item.type}-${item.id}`}
                          href={item.href}
                          onClick={() => {
                            setIsOpen(false);
                            setQuery("");
                            setResults(null);
                          }}
                          className="flex items-start gap-3 px-5 py-3 hover:bg-slate-50 transition-colors"
                        >
                          <span className="mt-0.5 shrink-0">{TYPE_ICONS[item.type]}</span>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-semibold text-slate-900 truncate">
                              {item.title}
                            </div>
                            {item.description && (
                              <div className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                                {item.description}
                              </div>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
