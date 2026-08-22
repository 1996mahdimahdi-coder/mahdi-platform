import pg from "pg";
import { readFileSync } from "fs";
const { Pool } = pg;
const pool = new Pool({
  host: "52.28.178.228", port: 5432, database: "neondb",
  user: "neondb_owner", password: "npg_IL7mW1trQyqo",
  ssl: { rejectUnauthorized: false, servername: "ep-jolly-shape-b2k89hux-pooler.c-6.eu-central-1.aws.neon.tech" },
});

const posts = [...JSON.parse(readFileSync("scripts/blog-posts-7a.json","utf8")), ...JSON.parse(readFileSync("scripts/blog-posts-7b.json","utf8"))];
let ok = 0;
for (const p of posts) {
  await pool.query(
    `INSERT INTO blog_posts (slug,title,summary,content,category,capital_range,read_time,image)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     ON CONFLICT (slug) DO UPDATE SET
       title=EXCLUDED.title,summary=EXCLUDED.summary,content=EXCLUDED.content,
       category=EXCLUDED.category,capital_range=EXCLUDED.capital_range,
       read_time=EXCLUDED.read_time,image=EXCLUDED.image`,
    [p.slug, p.title, p.summary, p.content, p.category, p.capital_range, p.read_time, p.image]
  );
  ok++;
  console.log("✅", p.slug);
}
console.log("تم:", ok);
await pool.end();
