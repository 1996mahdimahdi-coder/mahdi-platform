import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  host: "52.28.178.228",
  port: 5432,
  database: "neondb",
  user: "neondb_owner",
  password: "npg_IL7mW1trQyqo",
  ssl: {
    rejectUnauthorized: false,
    servername: "ep-jolly-shape-b2k89hux-pooler.c-6.eu-central-1.aws.neon.tech",
  },
});

async function main() {
  const count = await pool.query("SELECT count(*) FROM projects");
  console.log("العدد:", count.rows[0].count);
  if (count.rows[0].count !== "142") {
    console.error("Expected 142, got", count.rows[0].count);
    await pool.end();
    process.exit(1);
  }

  const found = await pool.query(
    "SELECT project_id, project_name, category FROM projects WHERE project_name LIKE '%cleaning%' OR project_name LIKE '%wash%' OR project_name LIKE '%detailing%'"
  );
  console.log("\nمشاريع التنظيف/الغسيل الموجودة:");
  console.table(found.rows);

  const toMove = found.rows.map(r => r.project_id);
  if (toMove.length > 0) {
    const r = await pool.query(
      "UPDATE projects SET category = $1 WHERE project_id = ANY($2)",
      ["تنظيف", toMove]
    );
    console.log("✅ تم نقل", r.rowCount, "مشروع إلى تنظيف");
  }

  const countAfter = await pool.query("SELECT count(*) FROM projects WHERE category = 'تنظيف'");
  console.log("مشاريع تنظيف بعد النقل:", countAfter.rows[0].count);

  await pool.end();
}

main().catch(e => { console.error("خطأ:", e.message); process.exit(1); });
