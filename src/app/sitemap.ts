import type { MetadataRoute } from "next";
import { db } from "@/db";
import { blogPosts, projects, noCapitalProjects, wilayas } from "@/db/schema";
import { DEFAULT_DOMAINS } from "@/lib/domainsData";

const BASE = "https://nabda-dz.vercel.app";

async function safeQuery<T>(fn: () => Promise<T>, fallback: T, label: string): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    console.error(`sitemap: skipped ${label}`, e);
    return fallback;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    "", "/test", "/no-capital", "/no-capital/plans",
    "/no-capital/first-order", "/no-capital/marketing", "/learn",
    "/learn/courses", "/learn/hooks", "/learn/videos",
    "/blog", "/projects", "/calculator", "/simulator", "/idea-test",
    "/plan", "/ai", "/about", "/domains", "/categories", "/wilayas",
    "/legal-guide", "/methodology", "/pricing", "/privacy", "/terms", "/sources",
  ].map((p) => ({
    url: BASE + p,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.7,
  }));

  const domainRoutes: MetadataRoute.Sitemap = DEFAULT_DOMAINS.map((d) => ({
    url: `${BASE}/domains/${d.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const [posts, projs, ncProjs, allWilayas] = await Promise.all([
    safeQuery(
      () => db.select({ slug: blogPosts.slug }).from(blogPosts),
      [] as { slug: string }[],
      "blog routes",
    ),
    safeQuery(
      () => db.select({ projectId: projects.projectId }).from(projects),
      [] as { projectId: string }[],
      "project routes",
    ),
    safeQuery(
      () => db.select({ slug: noCapitalProjects.slug }).from(noCapitalProjects),
      [] as { slug: string }[],
      "no-capital routes",
    ),
    safeQuery(
      () => db.select({ id: wilayas.id }).from(wilayas),
      [] as { id: number }[],
      "wilaya routes",
    ),
  ]);

  const dbRoutes: MetadataRoute.Sitemap = [
    ...posts.map((p) => ({
      url: `${BASE}/blog/${p.slug}`, lastModified: new Date(),
      changeFrequency: "monthly" as const, priority: 0.6,
    })),
    ...projs.map((p) => ({
      url: `${BASE}/projects/${p.projectId}`, lastModified: new Date(),
      changeFrequency: "monthly" as const, priority: 0.6,
    })),
    ...ncProjs.map((p) => ({
      url: `${BASE}/no-capital/projects/${p.slug}`, lastModified: new Date(),
      changeFrequency: "monthly" as const, priority: 0.6,
    })),
    ...allWilayas.map((w) => ({
      url: `${BASE}/wilayas/${w.id}`, lastModified: new Date(),
      changeFrequency: "monthly" as const, priority: 0.5,
    })),
  ];

  return [...staticRoutes, ...domainRoutes, ...dbRoutes];
}
