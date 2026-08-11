const { Pool } = require("pg");
require("dotenv").config({ path: "/app/.env" });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const brokenArticles = [
  "best-selling-products-algeria-2025",
  "build-online-store-salla-youcan",
  "product-sourcing-china-algeria",
  "video-editor-algeria",
  "mrah-residential-services-algeria",
];

const fixImage = "/blog/cover-ecommerce-business.jpg";

async function fix() {
  for (const slug of brokenArticles) {
    await pool.query(`UPDATE blog_posts SET image = $1 WHERE slug = $2`, [fixImage, slug]);
    console.log(`Fixed: ${slug}`);
  }
  await pool.end();
}

fix().catch(console.error);
