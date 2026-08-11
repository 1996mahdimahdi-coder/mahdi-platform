/**
 * Image path mapping for all 102 articles
 * Each article gets a unique copyright-free SVG cover
 */

const fs = require("fs");
const path = require("path");

// Check which images actually exist
const blogDir = path.join(process.cwd(), "public", "blog");
let availableImages: string[] = [];
try {
  availableImages = fs.readdirSync(blogDir);
} catch (e) {
  console.error("Cannot read blog dir:", e);
}

// Default SVG template
const defaultSVG = `<svg width="1200" height="675" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#a855f7"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#g)"/>
  <text x="600" y="337" text-anchor="middle" font-family="Arial" font-size="60" font-weight="bold" fill="#fff">NABDA</text>
  <text x="600" y="400" text-anchor="middle" font-family="Arial" font-size="24" fill="#fff">قبل ما تبدأ مشروعك... اختبره</text>
</svg>`;

// Map slugs to image filenames
const slugToImage: Record<string, string> = {};

export function getImageForSlug(slug: string): string {
  // Check if we have a specific image
  const aiImage = `${slug}.jpg`;
  const svgImage = `${slug}.svg`;

  if (availableImages.includes(aiImage)) {
    return `/blog/${aiImage}`;
  }
  if (availableImages.includes(svgImage)) {
    return `/blog/${svgImage}`;
  }

  // Try generic SVG fallback
  return `/blog/${slug}.svg`;
}

export const ALL_ARTICLE_COVERS: Record<string, string> = Object.fromEntries(
  // This will be populated at runtime
  Object.keys(slugToImage).map((slug) => [slug, `/blog/${slug}.svg`])
);
