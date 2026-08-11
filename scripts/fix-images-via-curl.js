/**
 * Map every article slug to an actual SVG file that exists
 */

const fs = require("fs");
const path = require("path");

const blogDir = path.join(__dirname, "..", "public", "blog");
const existing = fs.readdirSync(blogDir);

// Get all slugs from the database
async function getSlugs() {
  const res = await fetch("http://localhost:3000/api/blog");
  const data = await res.json();
  return data.posts.map((p) => p.slug);
}

// Check which image each slug should have
function findImageForSlug(slug) {
  // Check exact match
  if (existing.includes(`${slug}.svg`)) return `${slug}.svg`;
  if (existing.includes(`${slug}.jpg`)) return `${slug}.jpg`;

  // Find similar slug (e.g., slug-v2 matches slug)
  const similar = existing.find(
    (file) =>
      file.replace(/\.(svg|jpg)$/, "").toLowerCase() === slug.toLowerCase() ||
      file.toLowerCase().includes(slug.toLowerCase())
  );
  if (similar) return similar;

  // Default to first available SVG
  const firstSvg = existing.find((f) => f.endsWith(".svg"));
  return firstSvg || existing[0];
}

async function main() {
  const slugs = await getSlugs();
  console.log(`Found ${slugs.length} slugs`);

  // Build a map of slug -> image
  const map = {};
  for (const slug of slugs) {
    map[slug] = findImageForSlug(slug);
  }

  // Show distribution
  const counts = {};
  Object.values(map).forEach((img) => {
    counts[img] = (counts[img] || 0) + 1;
  });

  console.log("\nTop 10 most-used images:");
  Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([img, count]) => {
      console.log(`  ${img}: ${count} articles`);
    });

  // Save mapping to a file for later use
  fs.writeFileSync(
    path.join(__dirname, "image-mapping.json"),
    JSON.stringify(map, null, 2)
  );
  console.log(`\nSaved mapping to scripts/image-mapping.json`);
}

main().catch(console.error);
