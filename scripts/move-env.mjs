import pg from "pg";
const { Pool } = pg;
async function main() {
  const pool = new Pool({host:"52.28.178.228",port:5432,database:"neondb",user:"neondb_owner",password:"npg_IL7mW1trQyqo",ssl:{rejectUnauthorized:false,servername:"ep-jolly-shape-b2k89hux-pooler.c-6.eu-central-1.aws.neon.tech"}});
  const ex = await pool.query("SELECT project_id, category FROM projects WHERE project_id = 'recycling-collection'");
  console.log("exists:", ex.rows);
  if (ex.rowCount === 0) { console.log("NOT FOUND - stopping"); await pool.end(); return; }
  const r = await pool.query("UPDATE projects SET category = 'بيئة وتدوير' WHERE project_id = 'recycling-collection'");
  console.log("moved:", r.rowCount);
  const s = await pool.query("SELECT count(*) FROM projects WHERE category = 'بيئة وتدوير'");
  console.log("بيئة وتدوير now:", s.rows[0].count);
  await pool.end();
}
main().catch((e)=>{console.error("error:", e.message); process.exit(1);});
