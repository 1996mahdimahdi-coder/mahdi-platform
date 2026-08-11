/**
 * Fix article images in the database to use available SVG files
 */

import { db } from "../src/db/index";
import { blogPosts } from "../src/db/schema";
import { eq } from "drizzle-orm";
import fs from "fs";
import path from "path";

async function fixImages() {
  const blogDir = path.join(process.cwd(), "public", "blog");
  const availableImages = fs.readdirSync(blogDir);
  const svgImages = availableImages.filter((f) => f.endsWith(".svg"));
  const jpgImages = availableImages.filter((f) => f.endsWith(".jpg"));

  console.log(`Available: ${svgImages.length} SVGs, ${jpgImages.length} JPGs`);

  const allPosts = await db.select().from(blogPosts);
  console.log(`Total articles: ${allPosts.length}`);

  // Create a comprehensive slug-to-image mapping
  const colorPalette = [
    "ecommerce-algeria-2025-guide",
    "online-business-low-capital-algeria",
    "yassir-heetch-business-lessons",
    "ecommerce-payment-methods-algeria",
    "facebook-ads-algeria-pricing-2025",
    "instagram-vs-tiktok-algeria-2025",
    "yalidine-pricing-2025-algeria",
    "auto-entrepreneur-status-algeria-guide",
    "50k-dzd-business-ideas-algeria",
    "100k-dzd-business-deep-dive",
    "product-photography-algeria-business",
    "car-wash-business-algeria",
    "coffee-shop-business-algeria",
    "solar-panel-cleaning-algeria",
    "home-cleaning-business-algeria",
    "bicycle-repair-algeria",
    "social-media-manager-algeria",
    "mobile-repair-shop-algeria",
    "home-staging-algeria",
    "fitness-gym-business-algeria",
  ];

  let updated = 0;
  for (let i = 0; i < allPosts.length; i++) {
    const post = allPosts[i];
    const slug = post.slug;
    const currentImage = post.image || "";

    // Check if current image exists
    const currentFile = currentImage.replace("/blog/", "");
    if (currentFile && availableImages.includes(currentFile)) {
      continue; // Image is valid
    }

    // Try to find a specific image for this slug
    let newImage = null;

    // Priority 1: Check if there's a dedicated SVG for this slug
    if (svgImages.includes(`${slug}.svg`)) {
      newImage = `/blog/${slug}.svg`;
    }
    // Priority 2: Check for matching JPG
    else if (jpgImages.includes(`${slug}.jpg`)) {
      newImage = `/blog/${slug}.jpg`;
    }
    // Priority 3: Use a thematically-appropriate image
    else {
      // Use the color palette cycling
      const themedImage = colorPalette[i % colorPalette.length];
      if (jpgImages.includes(`${themedImage}.jpg`)) {
        newImage = `/blog/${themedImage}.jpg`;
      } else if (svgImages.includes(`${themedImage}.svg`)) {
        newImage = `/blog/${themedImage}.svg`;
      }
    }

    // Final fallback - use the first available JPG
    if (!newImage && jpgImages.length > 0) {
      newImage = `/blog/${jpgImages[0]}`;
    }

    if (newImage) {
      await db.update(blogPosts).set({ image: newImage }).where(eq(blogPosts.id, post.id));
      updated++;
    }
  }

  console.log(`Updated ${updated} articles with valid image paths.`);
}

fixImages()
  .then(() => {
    console.log("Done!");
    process.exit(0);
  })
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  });
