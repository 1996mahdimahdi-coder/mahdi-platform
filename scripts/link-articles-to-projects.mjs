import pg from "pg";
import { readFileSync } from "fs";
const { Pool } = pg;
const pool = new Pool({
  host: "52.28.178.228", port: 5432, database: "neondb",
  user: "neondb_owner", password: "npg_IL7mW1trQyqo",
  ssl: { rejectUnauthorized: false, servername: "ep-jolly-shape-b2k89hux-pooler.c-6.eu-central-1.aws.neon.tech" },
});

const MAP = JSON.parse(readFileSync("scripts/link-map.json","utf8"));

async function main() {
  const cap = await pool.query("SELECT project_id, project_name FROM projects");
  const capNames = {};
  for (const r of cap.rows) capNames[r.project_id] = r.project_name;

  const ncap = await pool.query("SELECT slug, name_ar FROM no_capital_projects");
  const ncapNames = {};
  for (const r of ncap.rows) ncapNames[r.slug] = r.name_ar;

  let ok = 0, skipped = 0, noMatch = 0;

  for (const [slug, links] of Object.entries(MAP)) {
    const res = await pool.query("SELECT id, content FROM blog_posts WHERE slug = $1", [slug]);
    if (res.rowCount === 0) { noMatch++; continue; }
    let content = res.rows[0].content || "";

    if (content.includes("مشاريع ذات صلة")) { skipped++; continue; }

    const items = [];
    for (const l of links) {
      if (l.t === "c" && capNames[l.id]) {
        items.push(`- [${capNames[l.id]}](/projects/${l.id})`);
      } else if (l.t === "n" && ncapNames[l.id]) {
        items.push(`- [${ncapNames[l.id]}](/no-capital/projects/${l.id})`);
      }
    }

    if (items.length === 0) { noMatch++; continue; }

    const section = `\n\n---\n\n## مشاريع ذات صلة\n\n${items.join("\n")}\n`;
    const newContent = content + section;

    await pool.query("UPDATE blog_posts SET content = $1 WHERE id = $2", [newContent, res.rows[0].id]);
    ok++;
  }

  console.log("✅ مقالات مربوطة:", ok);
  console.log("⏭️ تخطي (مربوطة مسبقاً):", skipped);
  console.log("⚠️ بدون تطابق/مشروع مفقود:", noMatch);
  await pool.end();
}

main().catch((e) => { console.error("خطأ:", e.message); process.exit(1); });
