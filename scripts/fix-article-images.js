/**
 * Simple Node.js script using direct SQL via the app's database
 * Update all article images to point to existing SVG files
 */

const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

// Read existing images
const blogDir = path.join(__dirname, "..", "public", "blog");
const existing = fs.readdirSync(blogDir);
console.log(`Found ${existing.length} image files`);

// All article slugs
const articleSlugs = [
  "ecommerce-algeria-2025-guide", "online-business-low-capital-algeria", "yassir-heetch-business-lessons",
  "ecommerce-payment-methods-algeria", "facebook-marketplace-selling-guide", "dropshipping-algeria-feasibility",
  "credit-card-vs-cod-algeria", "best-selling-products-algeria", "boutique-en-ligne-algeria-guide",
  "ecommerce-customer-service-algeria", "facebook-ads-algeria-pricing-2025", "instagram-vs-tiktok-algeria-2025",
  "social-media-content-strategy-algeria", "google-ads-algeria-ecommerce", "whatsapp-business-algeria-guide",
  "product-photography-algeria-business", "car-wash-business-algeria", "coffee-shop-business-algeria",
  "solar-panel-cleaning-algeria", "home-cleaning-business-algeria", "bicycle-repair-algeria",
  "social-media-manager-algeria", "mobile-repair-shop-algeria", "home-staging-algeria",
  "fitness-gym-business-algeria", "language-school-algeria", "pet-shop-business-algeria",
  "salon-coiffure-algeria", "laundry-service-algeria", "car-wash-station-algeria", "event-planning-algeria",
  "printing-press-business-algeria", "boutique-clothing-algeria", "mobile-store-algeria",
  "driving-school-algeria", "restaurant-business-algeria", "bakery-business-algeria-complete",
  "pharmacy-assistant-algeria", "video-production-algeria", "mobile-electronics-repair-shop",
  "elderly-care-services-algeria", "qahwa-traditionnelle-business", "tailoring-business-algeria",
  "ceramics-pottery-algeria", "language-translation-agency", "wholesale-business-algeria",
  "solar-installation-business-algeria", "car-detailing-mobile", "agricultural-investment-algeria",
  "olive-oil-business-algeria", "fish-farming-algeria", "poultry-farm-algeria",
  "beekeeping-honey-algeria", "real-estate-brokerage-algeria", "car-rental-business-algeria",
  "apartment-rental-algeria-monthly", "tourism-guide-algeria", "youtube-channel-algeria",
  "podcast-business-algeria", "online-course-creator-algeria", "stock-photography-algeria",
  "youtuber-algeria-monetization", "print-on-demand-algeria", "dropservicing-algeria",
  "affiliate-marketing-algeria", "freelance-accounting-algeria", "freelance-graphic-design-algeria",
  "tutoring-online-algeria", "freelance-web-development", "online-surveys-algeria",
  "freelance-arabic-platforms", "virtual-assistant-algeria", "translation-services-algeria",
  "mobile-photography-business-algeria", "luxury-honey-business-algeria", "fashion-design-algeria",
  "tutoring-business-algeria", "mobile-app-developer-algeria", "tech-startup-algeria-funding",
  "perfume-business-algeria-deep-analysis", "wedding-photography-algeria",
  "event-photography-algeria", "mobile-photography", "ramadan-business-ideas-algeria",
  "back-to-school-business-algeria", "aid-al-adha-business-ideas", "summer-business-ideas-algeria",
  "50k-dzd-business-ideas-algeria", "100k-dzd-business-deep-dive", "second-hand-clothing-algeria",
  "import-business-algeria-legal", "export-business-algeria-opportunities", "used-car-business-algeria",
  "perfume-oils-refill", "mobile-coffee-cart", "boutique-clothing-algeria-real",
  "home-sweets-bakery", "investment-gold-algeria", "auto-entrepreneur-status-algeria-guide",
  "yalidine-pricing-2025-algeria"
];

// Available images to cycle through
const availableJpg = existing.filter((f) => f.endsWith(".jpg"));
const availableSvg = existing.filter((f) => f.endsWith(".svg"));

// Function to find the best image for a slug
function findImage(slug) {
  // Check exact match
  if (existing.includes(`${slug}.svg`)) return `/blog/${slug}.svg`;
  if (existing.includes(`${slug}.jpg`)) return `/blog/${slug}.jpg`;

  // Return first available JPG as fallback
  if (availableJpg.length > 0) return `/blog/${availableJpg[0]}`;
  if (availableSvg.length > 0) return `/blog/${availableSvg[0]}`;
  return null;
}

// Build update queries
const updates = articleSlugs.map((slug, idx) => {
  const image = findImage(slug);
  return { slug, image, index: idx };
}).filter((u) => u.image);

// Connect to DB using DATABASE_URL
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function updateImages() {
  console.log(`Will update ${updates.length} article images...`);

  let success = 0;
  for (const { slug, image } of updates) {
    try {
      await pool.query(`UPDATE blog_posts SET image = $1 WHERE slug = $2`, [image, slug]);
      success++;
    } catch (e) {
      console.error(`Failed to update ${slug}:`, e.message);
    }
  }

  console.log(`Successfully updated ${success} article images.`);
  await pool.end();
}

updateImages().catch(console.error);
