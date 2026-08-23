import { NextResponse } from "next/server";
import { or, ilike, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  projects,
  noCapitalProjects,
  blogPosts,
  courses,
  courseLessons,
  videos,
  hookLibrary,
} from "@/db/schema";
import { isMissingTableError, serializeRow } from "@/lib/noCapital/fallback";

export const dynamic = "force-dynamic";

type SearchItem = {
  id: number;
  type: string;
  title: string;
  description: string;
  href: string;
  score: number;
};

const TYPE_LABELS: Record<string, string> = {
  project: "مشروع",
  no_capital: "بدون رأس مال",
  blog: "مقالة",
  course: "دورة",
  lesson: "درس",
  video: "فيديو",
  hook: "هوك",
};

const MAX_PER_TYPE = 5;
const TOTAL_LIMIT = 30;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ success: true, results: [], query: q ?? "" });
  }

  const pattern = `%${q}%`;

  try {
    const results: SearchItem[] = [];

    // 1. Projects
    try {
      const rows = await db
        .select({
          id: projects.id,
          title: projects.projectName,
          description: projects.description,
          category: projects.category,
        })
        .from(projects)
        .where(
          or(
            ilike(projects.projectName, pattern),
            ilike(projects.description, pattern),
            ilike(projects.category, pattern),
          ),
        )
        .limit(MAX_PER_TYPE);

      for (const r of rows) {
        const titleScore = r.title.includes(q) ? 10 : 0;
        const descScore = r.description.includes(q) ? 5 : 0;
        results.push({
          id: r.id,
          type: "project",
          title: r.title,
          description: r.description.slice(0, 150),
          href: `/projects`,
          score: 15 + titleScore + descScore,
        });
      }
    } catch (e) {
      if (!isMissingTableError(e)) console.error("search projects:", e);
    }

    // 2. No-capital projects
    try {
      const rows = await db
        .select({
          id: noCapitalProjects.id,
          slug: noCapitalProjects.slug,
          title: noCapitalProjects.nameAr,
          description: noCapitalProjects.description,
        })
        .from(noCapitalProjects)
        .where(
          or(
            ilike(noCapitalProjects.nameAr, pattern),
            ilike(noCapitalProjects.description, pattern),
          ),
        )
        .limit(MAX_PER_TYPE);

      for (const r of rows) {
        const titleScore = r.title.includes(q) ? 10 : 0;
        results.push({
          id: r.id,
          type: "no_capital",
          title: r.title,
          description: r.description.slice(0, 150),
          href: `/no-capital/${r.slug}`,
          score: 12 + titleScore,
        });
      }
    } catch (e) {
      if (!isMissingTableError(e)) console.error("search no_capital:", e);
    }

    // 3. Blog posts
    try {
      const rows = await db
        .select({
          id: blogPosts.id,
          slug: blogPosts.slug,
          title: blogPosts.title,
          summary: blogPosts.summary,
          category: blogPosts.category,
        })
        .from(blogPosts)
        .where(
          or(
            ilike(blogPosts.title, pattern),
            ilike(blogPosts.summary, pattern),
            ilike(blogPosts.category, pattern),
          ),
        )
        .limit(MAX_PER_TYPE);

      for (const r of rows) {
        const titleScore = r.title.includes(q) ? 10 : 0;
        results.push({
          id: r.id,
          type: "blog",
          title: r.title,
          description: r.summary.slice(0, 150),
          href: `/blog/${r.slug}`,
          score: 10 + titleScore,
        });
      }
    } catch (e) {
      if (!isMissingTableError(e)) console.error("search blog:", e);
    }

    // 4. Courses
    try {
      const rows = await db
        .select({
          id: courses.id,
          slug: courses.slug,
          title: courses.title,
          summary: courses.summary,
        })
        .from(courses)
        .where(
          or(
            ilike(courses.title, pattern),
            ilike(courses.summary, pattern),
          ),
        )
        .limit(MAX_PER_TYPE);

      for (const r of rows) {
        const titleScore = r.title.includes(q) ? 10 : 0;
        results.push({
          id: r.id,
          type: "course",
          title: r.title,
          description: r.summary.slice(0, 150),
          href: `/learn/courses/${r.slug}`,
          score: 10 + titleScore,
        });
      }
    } catch (e) {
      if (!isMissingTableError(e)) console.error("search courses:", e);
    }

    // 5. Course lessons
    try {
      const rows = await db
        .select({
          id: courseLessons.id,
          title: courseLessons.title,
          summary: courseLessons.summary,
        })
        .from(courseLessons)
        .where(
          or(
            ilike(courseLessons.title, pattern),
            ilike(courseLessons.summary, pattern),
          ),
        )
        .limit(MAX_PER_TYPE);

      for (const r of rows) {
        const titleScore = r.title.includes(q) ? 10 : 0;
        results.push({
          id: r.id,
          type: "lesson",
          title: r.title,
          description: (r.summary ?? "").slice(0, 150),
          href: `/learn/courses`,
          score: 8 + titleScore,
        });
      }
    } catch (e) {
      if (!isMissingTableError(e)) console.error("search lessons:", e);
    }

    // 6. Videos
    try {
      const rows = await db
        .select({
          id: videos.id,
          slug: videos.slug,
          title: videos.title,
          description: videos.description,
        })
        .from(videos)
        .where(
          or(
            ilike(videos.title, pattern),
            ilike(videos.description, pattern),
          ),
        )
        .limit(MAX_PER_TYPE);

      for (const r of rows) {
        const titleScore = r.title.includes(q) ? 10 : 0;
        results.push({
          id: r.id,
          type: "video",
          title: r.title,
          description: (r.description ?? "").slice(0, 150),
          href: `/learn/videos/${r.slug}`,
          score: 9 + titleScore,
        });
      }
    } catch (e) {
      if (!isMissingTableError(e)) console.error("search videos:", e);
    }

    // 7. Hook library
    try {
      const rows = await db
        .select({
          id: hookLibrary.id,
          title: hookLibrary.title,
          hookText: hookLibrary.hookText,
          type: hookLibrary.type,
        })
        .from(hookLibrary)
        .where(
          or(
            ilike(hookLibrary.title, pattern),
            ilike(hookLibrary.hookText, pattern),
            ilike(hookLibrary.type, pattern),
          ),
        )
        .limit(MAX_PER_TYPE);

      for (const r of rows) {
        const titleScore = r.title.includes(q) ? 10 : 0;
        results.push({
          id: r.id,
          type: "hook",
          title: r.title,
          description: r.hookText.slice(0, 150),
          href: `/learn/hooks`,
          score: 8 + titleScore,
        });
      }
    } catch (e) {
      if (!isMissingTableError(e)) console.error("search hooks:", e);
    }

    // Sort by score desc, then limit total
    results.sort((a, b) => b.score - a.score);
    const limited = results.slice(0, TOTAL_LIMIT);

    // Group by type
    const grouped: Record<string, SearchItem[]> = {};
    for (const item of limited) {
      if (!grouped[item.type]) grouped[item.type] = [];
      grouped[item.type].push(item);
    }

    return NextResponse.json({
      success: true,
      query: q,
      total: limited.length,
      types: Object.keys(grouped).map((t) => ({
        key: t,
        label: TYPE_LABELS[t] ?? t,
        count: grouped[t].length,
      })),
      results: grouped,
    });
  } catch (error) {
    console.error("search error:", error);
    return NextResponse.json(
      { success: false, error: "Search failed" },
      { status: 500 },
    );
  }
}
