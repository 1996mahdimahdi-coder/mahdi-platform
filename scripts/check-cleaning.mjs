import pg from "pg";
const { Pool } = pg;
const pool = new Pool({host:"52.28.178.228",port:5432,database:"neondb",user:"neondb_owner",password:"npg_IL7mW1trQyqo",ssl:{rejectUnauthorized:false,servername:"ep-jolly-shape-b2k89hux-pooler.c-6.eu-central-1.aws.neon.tech"}});
async function main() {
  const r = await pool.query("SELECT project_id,project_name FROM projects WHERE category=$1 ORDER BY project_name", ["تنظيف"]);
  console.log("مشاريع تنظيف:", r.rowCount);
  console.table(r.rows);
  const cats = await pool.query("SELECT category, count(*) as cnt FROM projects GROUP BY category ORDER BY cnt DESC");
  console.log("\nجميع الفئات:");
  console.table(cats.rows);
  await pool.end();
}
main().catch(e=>{console.error(e.message);process.exit(1);});
