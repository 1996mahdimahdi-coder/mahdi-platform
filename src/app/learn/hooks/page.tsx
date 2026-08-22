"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Search,
  Sparkles,
} from "lucide-react";
import {
  HOOK_INTRO,
  HOOK_CATEGORIES,
  HOOKS,
  type HookCategory,
  type HookItem,
} from "@/lib/hookGuide";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? "تم النسخ" : "انسخ"}
    </button>
  );
}

function CategoryCard({
  category,
  hooks,
}: {
  category: HookCategory;
  hooks: HookItem[];
}) {
  const [expanded, setExpanded] = useState(false);
  const [showHooks, setShowHooks] = useState(false);
  const [showLesson, setShowLesson] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 text-right hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{category.emoji}</span>
          <div>
            <h3 className="font-black text-base">{category.nameAr}</h3>
            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
              {category.definition}
            </p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
        )}
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-slate-100 p-5 space-y-5">
          {/* Why it works */}
          <div className="bg-indigo-50 rounded-xl p-4">
            <h4 className="font-black text-xs text-indigo-700 mb-1">
              لماذا ينجح هذا النوع؟
            </h4>
            <p className="text-xs text-indigo-900 leading-relaxed">
              {category.whyItWorks}
            </p>
          </div>

          {/* Formula */}
          <div className="bg-slate-50 rounded-xl p-4">
            <h4 className="font-black text-xs text-slate-700 mb-1">
              الصيغة:
            </h4>
            <p className="text-sm font-bold text-slate-800">
              {category.formula}
            </p>
          </div>

          {/* Examples */}
          <div>
            <h4 className="font-black text-xs text-slate-700 mb-2">
              أمثلة عملية:
            </h4>
            <div className="space-y-2">
              {category.examples.map((ex, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between gap-2 bg-slate-50 rounded-lg p-3"
                >
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {ex}
                  </p>
                  <CopyButton text={ex} />
                </div>
              ))}
            </div>
          </div>

          {/* Niches */}
          <div>
            <h4 className="font-black text-xs text-slate-700 mb-2">
              المجالات المناسبة:
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {category.niches.map((n, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold"
                >
                  {n}
                </span>
              ))}
            </div>
          </div>

          {/* Hooks toggle */}
          <button
            onClick={() => setShowHooks(!showHooks)}
            className="flex items-center gap-2 text-xs font-black text-slate-700 hover:text-indigo-600 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            {showHooks
              ? "إخفاء الـ hooks"
              : `عرض ${hooks.length} hooks جاهزة`}
          </button>

          {showHooks && (
            <div className="space-y-2">
              {hooks.map((hook, i) => (
                <div
                  key={i}
                  className="bg-emerald-50 rounded-xl p-3 border border-emerald-100"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h5 className="font-black text-xs text-emerald-800">
                        {hook.name}
                      </h5>
                      <p className="text-[11px] text-emerald-700 mt-0.5">
                        {hook.definition}
                      </p>
                    </div>
                    <CopyButton text={hook.example} />
                  </div>
                  <div className="mt-2 text-[11px] text-emerald-900 bg-emerald-100 rounded-lg p-2 font-bold">
                    {hook.example}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Lesson toggle */}
          <button
            onClick={() => setShowLesson(!showLesson)}
            className="flex items-center gap-2 text-xs font-black text-slate-700 hover:text-indigo-600 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            {showLesson ? "إخفاء الدرس" : "الدرس التطبيقي"}
          </button>

          {showLesson && (
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <h4 className="font-black text-xs text-amber-800 mb-2">
                {category.lesson.title}
              </h4>
              <ol className="space-y-1.5">
                {category.lesson.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-amber-900">
                    <span className="font-black text-amber-500 shrink-0">
                      {i + 1}.
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function LearnHooksPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredHooks = HOOKS.filter((hook) => {
    const matchesSearch =
      !search ||
      hook.name.includes(search) ||
      hook.definition.includes(search) ||
      hook.example.includes(search) ||
      hook.formula.includes(search);
    const matchesCategory = !activeCategory || hook.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categoriesWithHooks = HOOK_CATEGORIES.filter(
    (cat) => !activeCategory || cat.slug === activeCategory
  );

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Header */}
        <div className="border-b border-slate-200 pb-6">
          <Link
            href="/learn"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            العودة للتعلم
          </Link>

          <span className="block text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">
            hooks
          </span>
          <h1 className="text-2xl sm:text-4xl font-black">
            مكتبة الـ hooks الكاملة
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed max-w-2xl">
            {HOOK_INTRO.definition}
          </p>
        </div>

        {/* Intro Cards */}
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <h3 className="font-black text-xs text-indigo-700 mb-1">
              {HOOK_INTRO.title}
            </h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {HOOK_INTRO.definition}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <h3 className="font-black text-xs text-amber-700 mb-1">
              لماذا Hooks؟
            </h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {HOOK_INTRO.why}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <h3 className="font-black text-xs text-emerald-700 mb-1">
              القاعدة الذهبية
            </h3>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {HOOK_INTRO.rule}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث في الـ hooks..."
            className="w-full pr-10 pl-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Category filter chips */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-colors ${
              !activeCategory
                ? "bg-slate-900 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:border-slate-400"
            }`}
          >
            الكل ({HOOKS.length})
          </button>
          {HOOK_CATEGORIES.map((cat) => {
            const count = HOOKS.filter((h) => h.category === cat.slug).length;
            return (
              <button
                key={cat.slug}
                onClick={() =>
                  setActiveCategory(
                    activeCategory === cat.slug ? null : cat.slug
                  )
                }
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-colors ${
                  activeCategory === cat.slug
                    ? "bg-slate-900 text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-slate-400"
                }`}
              >
                {cat.emoji} {cat.nameAr} ({count})
              </button>
            );
          })}
        </div>

        {/* Category cards with expandable details */}
        <div className="space-y-4">
          {categoriesWithHooks.map((cat) => (
            <CategoryCard
              key={cat.slug}
              category={cat}
              hooks={filteredHooks.filter((h) => h.category === cat.slug)}
            />
          ))}
        </div>

        {/* Flat hooks list */}
        {filteredHooks.length > 0 && (
          <div>
            <h2 className="font-black text-lg mb-4">
              جميع الـ hooks ({filteredHooks.length})
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {filteredHooks.map((hook, i) => {
                const cat = HOOK_CATEGORIES.find(
                  (c) => c.slug === hook.category
                );
                return (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-black text-sm">{hook.name}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                        {cat?.emoji} {cat?.nameAr}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {hook.definition}
                    </p>
                    <div className="bg-emerald-50 rounded-xl p-3 text-[11px] font-bold text-emerald-800">
                      {hook.example}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-bold">
                        الصيغة: {hook.formula}
                      </span>
                      <CopyButton text={hook.example} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
