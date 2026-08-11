const { Pool } = require("pg");
require("dotenv").config({ path: "/app/.env" });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function fix() {
  await pool.query(
    `UPDATE blog_posts SET image = $1 WHERE slug = $2`,
    ["/blog/home-sweets-bakery.svg", "bakery-home-business-algeria"]
  );
  console.log("Fixed bakery-home-business-algeria");
  await pool.end();
}

fix().catch(console.error);
