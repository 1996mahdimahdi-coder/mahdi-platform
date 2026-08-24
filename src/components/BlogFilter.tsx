"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, ArrowLeft, Sparkles } from "lucide-react";

type Post = {
  id: number;
  slug: string;
  title: string;
  summary: string | null;
  category: string | null;
  image: string | null;
  readTime: string | null;
  capitalRange: string | null;
};

export default function BlogFilter({ posts }: { posts: Post[] }) {
  const categories = ["الكل", ...Array.from(new Set(posts.map((p) => p.category).filter((c): c is string => !!c)))];
  const [selectedCategory, setSelectedCategory] = useState<string>("الكل");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPosts = posts.filter((post) => {
    if (selectedCategory !== "الكل" && post.category !== selectedCategory) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        post.title?.toLowerCase().includes(term) ||
        post.summary?.toLowerCase().includes(term) ||
        post.category?.toLowerCase().includes(term)
      );
    }
    return true;
  });

  return (
    <>
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث عن مقال..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-4 pl-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm font-bold"
            />
          </div>
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm font-bold bg-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "الكل" ? "كل التصنيفات" : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
          <span>يوجد {filteredPosts.length} مقال</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-2xl hover:border-indigo-400 transition-all flex flex-col"
          >
            {post.image ? (
              <div className="relative h-48 bg-gradient-to-br from-indigo-500 to-fuchsia-500 overflow-hidden">
                {post.image && <img src={post.image} alt={post.title} className="w-full h-full object-cover" loading="lazy" />}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm text-indigo-800 text-xs font-extrabold shadow-md">
                    {post.category}
                  </span>
                </div>
              </div>
            ) : (
              <div className="h-48 bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center text-white text-5xl">
                📚
              </div>
            )}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{post.readTime}</span>
                  {post.capitalRange && (
                    <>
                      <span>•</span>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">{post.capitalRange}</span>
                    </>
                  )}
                </div>
                <h2 className="text-base font-extrabold text-slate-900 leading-snug line-clamp-2">{post.title}</h2>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{post.summary}</p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-1 text-xs font-extrabold text-indigo-600 hover:text-indigo-700">
                  <span>اقرأ المقال الكامل</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <Link href="/test" className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-[11px] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  اختبر وضعك
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
          <p className="text-slate-600 text-sm font-bold">لم يتم العثور على مقالات في هذه الفئة.</p>
        </div>
      )}
    </>
  );
}