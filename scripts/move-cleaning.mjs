import pg from "pg";
const { Pool } = pg;
const pool = new Pool({host:"52.28.178.228",port:5432,database:"neondb",user:"neondb_owner",password:"npg_IL7mW1trQyqo",ssl:{rejectUnauthorized:false,servername:"ep-jolly-shape-b2k89hux-pooler.c-6.eu-central-1.aws.neon.tech"}});
async function main() {
  const count = await pool.query("SELECT count(*) FROM projects");
  console.log("العدد:", count.rows[0].count);
  if (count.rows[0].count !== "142") { console.error("Expected 142"); await pool.end(); process.exit(1); }
  const toMove = ["home-cleaning-services","car-wash-service","car-wash-mobile","car-interior-cleaning","car-detailing-mobile"];
  const r = await pool.query("UPDATE projects SET category = 'تنظيف' WHERE project_id = ANY($1)", [toMove]);
  console.log("✅ تم نقل", r.rowCount, "مشروع إلى تنظيف");
  const catCount = await pool.query("SELECT count(*) FROM projects WHERE category = 'تنظيف'");
  console.log("مشاريع تنظيف بعد النقل:", catCount.rows[0].count);
  await pool.end();
}
main().catch(e=>{console.error("خطأ:",e.message);process.exit(1);});
