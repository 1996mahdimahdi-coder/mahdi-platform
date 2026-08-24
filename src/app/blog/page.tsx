import { BookOpen } from "lucide-react";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import BlogFilter from "@/components/BlogFilter";

export const dynamic = "force-dynamic";

async function getPosts() {
  try {
    const rows = await db
      .select({
        id: blogPosts.id,
        slug: blogPosts.slug,
        title: blogPosts.title,
        summary: blogPosts.summary,
        category: blogPosts.category,
        image: blogPosts.image,
        readTime: blogPosts.readTime,
        capitalRange: blogPosts.capitalRange,
      })
      .from(blogPosts);
    return rows;
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-3 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold">
          <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
          <span>مدونة NABDA - أكثر من {posts.length} مقال موثق</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900">
          مكتبة المقالات والأدلة الشاملة
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl mx-auto leading-relaxed">
          مقالات ودراسات جدوى موثقة من مصادر رسمية جزائرية (وزارة التجارة، ONS، بنك الجزائر، CASNOS).
          أرقام حقيقية، مخططات بيانية توضيحية، ومصادر قابلة للتحقق.
        </p>
      </div>

      <BlogFilter posts={posts} />
    </div>
  );
}