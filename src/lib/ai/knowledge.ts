import { db } from "@/db";
import {
  noCapitalProjects,
  categories,
  courses,
  blogPosts,
  executionPlans,
  firstOrderPlans,
  marketingPlans,
  hookLibrary,
  contentTypes,
} from "@/db/schema";
import { eq } from "drizzle-orm";

type KnowledgeItem = {
  type: "project" | "article" | "plan" | "course" | "hook" | "content_type";
  title: string;
  slug?: string;
  summary: string;
  tags?: string[];
  relevance: number;
};

const MAX_ITEMS_PER_TYPE = 5;
const MAX_TOTAL_ITEMS = 15;

function scoreRelevance(item: { tags?: string[]; title?: string; summary?: string }, queryTerms: string[]): number {
  let score = 0;
  const tagSet = new Set((item.tags ?? []).map((t) => t.toLowerCase()));
  const text = `${item.title ?? ""} ${item.summary ?? ""}`.toLowerCase();

  for (const term of queryTerms) {
    const t = term.toLowerCase();
    for (const tag of tagSet) {
      if (tag.includes(t) || t.includes(tag)) score += 10;
    }
    if (text.includes(t)) score += 5;
  }
  return score;
}

function pickTop(items: KnowledgeItem[], max: number): KnowledgeItem[] {
  return items.sort((a, b) => b.relevance - a.relevance).slice(0, max);
}

export async function retrieveKnowledge(
  query: string,
  context?: { currentProject?: string; currentArticle?: string }
): Promise<KnowledgeItem[]> {
  const queryTerms = query.split(/\s+/).filter((t) => t.length > 1);
  const allItems: KnowledgeItem[] = [];

  try {
    if (context?.currentProject) {
      const rows = await db.select().from(noCapitalProjects)
        .where(eq(noCapitalProjects.slug, context.currentProject)).limit(1);
      if (rows[0]) {
        allItems.push({
          type: "project",
          title: rows[0].nameAr,
          slug: rows[0].slug,
          summary: rows[0].description ?? "",
          tags: rows[0].tags ?? [],
          relevance: 1000,
        });
      }
    }

    const projects = await db.select({
      nameAr: noCapitalProjects.nameAr,
      slug: noCapitalProjects.slug,
      description: noCapitalProjects.description,
      tags: noCapitalProjects.tags,
      skillsRequired: noCapitalProjects.skillsRequired,
    }).from(noCapitalProjects).where(eq(noCapitalProjects.active, true));

    for (const p of projects) {
      const rel = scoreRelevance({ tags: [...(p.tags ?? []), ...(p.skillsRequired ?? [])], title: p.nameAr, summary: p.description }, queryTerms);
      if (rel > 0 || context?.currentProject === p.slug) {
        allItems.push({
          type: "project",
          title: p.nameAr,
          slug: p.slug,
          summary: p.description ?? "",
          tags: p.tags ?? [],
          relevance: context?.currentProject === p.slug ? 1000 : rel,
        });
      }
    }

    const arts = await db.select({
      title: blogPosts.title,
      slug: blogPosts.slug,
      summary: blogPosts.summary,
      category: blogPosts.category,
    }).from(blogPosts).limit(30);

    for (const a of arts) {
      const rel = scoreRelevance({ title: a.title, summary: a.summary, tags: [a.category ?? ""] }, queryTerms);
      if (rel > 0) {
        allItems.push({
          type: "article",
          title: a.title,
          slug: a.slug,
          summary: a.summary ?? "",
          tags: [a.category ?? ""],
          relevance: rel,
        });
      }
    }

    const plans = await db.select().from(firstOrderPlans).limit(5);
    for (const p of plans) {
      allItems.push({
        type: "plan",
        title: p.title,
        slug: p.slug,
        summary: p.outreachSteps?.join(" → ") ?? "",
        relevance: 1,
      });
    }

    const crs = await db.select().from(courses).where(eq(courses.published, true)).limit(10);
    for (const c of crs) {
      const rel = scoreRelevance({ title: c.title, summary: c.summary }, queryTerms);
      if (rel > 0) {
        allItems.push({
          type: "course",
          title: c.title,
          slug: c.slug,
          summary: c.summary ?? "",
          relevance: rel,
        });
      }
    }
  } catch (err) {
    console.error("Knowledge retrieval error:", err);
  }

  return pickTop(allItems, MAX_TOTAL_ITEMS);
}

export function buildKnowledgeContext(items: KnowledgeItem[]): string {
  if (items.length === 0) return "";

  const sections: string[] = ["# معرفة NABDA المتاحة:"];

  const byType = items.reduce((acc, item) => {
    (acc[item.type] ??= []).push(item);
    return acc;
  }, {} as Record<string, KnowledgeItem[]>);

  if (byType.project) {
    sections.push("\n## المشاريع:");
    for (const p of byType.project) {
      sections.push(`- **${p.title}** (${p.slug}): ${p.summary}${p.tags?.length ? ` [${p.tags.join(", ")}]` : ""}`);
    }
  }

  if (byType.article) {
    sections.push("\n## المقالات:");
    for (const a of byType.article) {
      sections.push(`- **${a.title}**: ${a.summary}`);
    }
  }

  if (byType.plan) {
    sections.push("\n## الخطط:");
    for (const p of byType.plan) {
      sections.push(`- **${p.title}**: ${p.summary}`);
    }
  }

  if (byType.course) {
    sections.push("\n## الدورات:");
    for (const c of byType.course) {
      sections.push(`- **${c.title}**: ${c.summary}`);
    }
  }

  return sections.join("\n");
}
