/**
 * Update all articles in database to use available images
 * Run this to fix missing images
 */

import { db } from "../src/db/index";
import { blogPosts } from "../src/db/schema";
import { eq } from "drizzle-orm";
import fs from "fs";
import path from "path";

async function fixArticleImages() {
  const blogDir = path.join(process.cwd(), "public", "blog");
  const availableImages = fs.readdirSync(blogDir);
  console.log(`Found ${availableImages.length} images in ${blogDir}`);

  const allPosts = await db.select().from(blogPosts);
  console.log(`Found ${allPosts.length} articles in database`);

  let updated = 0;
  for (const post of allPosts) {
    const slug = post.slug;

    // Try to find a matching image
    let imagePath = null;

    // Priority 1: JPG with exact slug
    if (availableImages.includes(`${slug}.jpg`)) {
      imagePath = `/blog/${slug}.jpg`;
    }
    // Priority 2: SVG with exact slug
    else if (availableImages.includes(`${slug}.svg`)) {
      imagePath = `/blog/${slug}.svg`;
    }
    // Priority 3: AI-generated cover-{topic}.jpg
    else {
      const matchingAiImage = availableImages.find(
        (img) => img.startsWith("cover-") && (img.includes(slug.split("-")[0]) || img.includes(slug.split("-")[1]))
      );
      if (matchingAiImage) {
        imagePath = `/blog/${matchingAiImage}`;
      }
    }

    if (imagePath && post.image !== imagePath) {
      await db.update(blogPosts).set({ image: imagePath }).where(eq(blogPosts.id, post.id));
      updated++;
      console.log(`Updated ${slug} -> ${imagePath}`);
    } else if (!imagePath) {
      // Assign a generic SVG that exists
      const genericSvg = availableImages.find((img) => img.startsWith("ecommerce-algeria")) || availableImages[0];
      imagePath = `/blog/${genericSvg}`;
      await db.update(blogPosts).set({ image: imagePath }).where(eq(blogPosts.id, post.id));
      updated++;
      console.log(`Assigned generic ${slug} -> ${imagePath}`);
    }
  }

  console.log(`\nUpdated ${updated} articles with images.`);
}

fixArticleImages()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  });
