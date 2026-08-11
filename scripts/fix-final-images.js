const { Pool } = require("pg");
require("dotenv").config({ path: "/app/.env" });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Map each broken article to a valid image
const fixes = [
  { slug: "bakery-home-business-algeria", image: "/blog/cover-bakery.jpg" },
  { slug: "data-entry-business-algeria", image: "/blog/cover-freelance-work.jpg" },
  { slug: "handmade-soap-business-algeria", image: "/blog/cover-ecommerce-business.jpg" },
  { slug: "mobile-coffee-cart-algeria", image: "/blog/cover-restaurant-modern.jpg" },
  { slug: "freelancer-arabic-platforms", image: "/blog/cover-freelance-work.jpg" },
];

async function fix() {
  for (const { slug, image } of fixes) {
    await pool.query(`UPDATE blog_posts SET image = $1 WHERE slug = $2`, [image, slug]);
    console.log(`Fixed: ${slug} -> ${image}`);
  }
  await pool.end();
}

fix().catch(console.error);
