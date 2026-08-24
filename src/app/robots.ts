import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/dashboard", "/api/", "/login", "/results", "/no-capital/test", "/no-capital/results"],
    },
    sitemap: "https://nabda-dz.vercel.app/sitemap.xml",
  };
}
