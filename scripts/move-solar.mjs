import pg from "pg";
const { Pool } = pg;
async function main() {
  const pool = new Pool({host:"52.28.178.228",port:5432,database:"neondb",user:"neondb_owner",password:"npg_IL7mW1trQyqo",ssl:{rejectUnauthorized:false,servername:"ep-jolly-shape-b2k89hux-pooler.c-6.eu-central-1.aws.neon.tech"}});
  
  // Check solar-cleaning-consulting exists
  const ex = await pool.query("SELECT project_id, category FROM projects WHERE project_id = 'solar-cleaning-consulting'");
  console.log("exists:", ex.rows);
  
  // Move it
  const r = await pool.query("UPDATE projects SET category = 'طاقة شمسية' WHERE project_id = 'solar-cleaning-consulting'");
  console.log("moved:", r.rowCount);

  // Check solar count after move
  const s = await pool.query("SELECT count(*) FROM projects WHERE category = 'طاقة شمسية'");
  console.log("solar now:", s.rows[0].count);

  await pool.end();
}
main().catch((e)=>{console.error("error:", e.message); process.exit(1);});
