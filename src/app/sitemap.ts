import type { MetadataRoute } from "next";
import { db } from "@/db";
import { blogPosts, projects, noCapitalProjects } from "@/db/schema";

const BASE = "https://nabda-dz.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    "", "/test", "/no-capital", "/no-capital/test", "/no-capital/plans",
    "/no-capital/first-order", "/no-capital/marketing", "/learn", "/blog",
    "/projects", "/calculator", "/simulator", "/idea-test", "/plan", "/ai",
    "/about", "/pricing", "/privacy", "/terms", "/sources", "/methodology",
  ].map((p) => ({
    url: BASE + p,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.7,
  }));

  let dynamicRoutes: MetadataRoute.Sitemap = [];
  try {
    const [posts, projs, ncProjs] = await Promise.all([
      db.select({ slug: blogPosts.slug }).from(blogPosts),
      db.select({ projectId: projects.projectId }).from(projects),
      db.select({ slug: noCapitalProjects.slug }).from(noCapitalProjects),
    ]);
    dynamicRoutes = [
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
    ];
  } catch (e) {
    console.error("sitemap: skipped dynamic routes", e);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
