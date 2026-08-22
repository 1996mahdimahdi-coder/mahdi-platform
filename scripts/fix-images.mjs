import pg from "pg";
const { Pool } = pg;
const pool = new Pool({
  host: "52.28.178.228", port: 5432, database: "neondb",
  user: "neondb_owner", password: "npg_IL7mW1trQyqo",
  ssl: { rejectUnauthorized: false, servername: "ep-jolly-shape-b2k89hux-pooler.c-6.eu-central-1.aws.neon.tech" },
});

async function main() {
  const res = await pool.query(`
    UPDATE blog_posts
    SET image = regexp_replace(image, '\\.(jpg|jpeg|png|webp)$', '.svg'),
        infographic = regexp_replace(infographic, '\\.(jpg|jpeg|png|webp)$', '.svg')
    WHERE image LIKE '%.jpg' OR image LIKE '%.jpeg' OR image LIKE '%.png' OR image LIKE '%.webp'
       OR infographic LIKE '%.jpg' OR infographic LIKE '%.png' OR infographic LIKE '%.webp'
  `);
  console.log("✅ صور محدثة:", res.rowCount, "صف");
  await pool.end();
}

main().catch((e) => { console.error("خطأ:", e.message); process.exit(1); });
