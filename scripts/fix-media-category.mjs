import pg from "pg";
const { Pool } = pg;
async function main() {
  const pool = new Pool({host:"52.28.178.228",port:5432,database:"neondb",user:"neondb_owner",password:"npg_IL7mW1trQyqo",ssl:{rejectUnauthorized:false,servername:"ep-jolly-shape-b2k89hux-pooler.c-6.eu-central-1.aws.neon.tech"}});
  const r = await pool.query("UPDATE projects SET category = $1 WHERE category = $2 RETURNING project_id, category", ["إعلام وفنون", " الإعلام وفنون"]);
  console.log("fixed:", r.rowCount, r.rows);
  const total = await pool.query("SELECT count(*) FROM projects");
  console.log("total:", total.rows[0].count);
  const cat = await pool.query("SELECT count(*) FROM projects WHERE category = 'إعلام وفنون'");
  console.log("إعلام وفنون:", cat.rows[0].count);
  await pool.end();
}
main().catch((e)=>{console.error("error:", e.message); process.exit(1);});
