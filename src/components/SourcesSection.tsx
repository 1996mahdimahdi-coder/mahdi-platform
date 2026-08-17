"use client";

import { BookOpen, ExternalLink } from "lucide-react";

type ArticleSource = {
  institution?: string;
  title?: string;
  year?: number | string;
  url?: string;
  accessedAt?: string;
  type?: string;
};

type SourceItem = string | ArticleSource;

function isStructuredSource(s: SourceItem): s is ArticleSource {
  return typeof s === "object" && s !== null && ("institution" in s || "title" in s || "url" in s);
}

function isSafeUrl(url: string): boolean {
  const trimmed = url.trim();
  return /^https?:\/\//i.test(trimmed);
}

function SourceEntry({ source, index }: { source: SourceItem; index: number }) {
  if (typeof source === "string") {
    return (
      <li className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed">
        <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 text-xs font-extrabold mt-0.5">
          {index + 1}
        </span>
        <span>{source}</span>
      </li>
    );
  }

  return (
    <li className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed">
      <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 text-xs font-extrabold mt-0.5">
        {index + 1}
      </span>
      <div className="space-y-1">
        <div>
          {source.institution && (
            <span className="font-extrabold text-slate-900">{source.institution}</span>
          )}
          {source.title && (
            <span className="text-slate-600"> — {source.title}</span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          {source.year && <span>{source.year}</span>}
          {source.type && (
            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">{source.type}</span>
          )}
          {source.accessedAt && <span>تم الوصول: {source.accessedAt}</span>}
          {source.url && isSafeUrl(source.url) && (
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 underline decoration-indigo-300"
            >
              رابط
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
          {source.url && !isSafeUrl(source.url) && (
            <span className="text-slate-400 text-[10px]">رابط غير متاح</span>
          )}
        </div>
      </div>
    </li>
  );
}

export default function SourcesSection({ sources }: { sources: SourceItem[] }) {
  if (!sources || sources.length === 0) return null;

  return (
    <section className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/30 border border-slate-200">
      <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-indigo-600" />
        المصادر والمراجع
      </h2>
      <ol className="space-y-3">
        {sources.map((source, idx) => (
          <SourceEntry key={idx} source={source} index={idx} />
        ))}
      </ol>
    </section>
  );
}
