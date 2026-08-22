import pg from "pg";
const { Pool } = pg;
async function main() {
  const pool = new Pool({host:"52.28.178.228",port:5432,database:"neondb",user:"neondb_owner",password:"npg_IL7mW1trQyqo",ssl:{rejectUnauthorized:false,servername:"ep-jolly-shape-b2k89hux-pooler.c-6.eu-central-1.aws.neon.tech"}});
  const r = await pool.query("UPDATE projects SET legal_status = $1 WHERE legal_status = $2", ["مقاول ذاتي/سجل تجاري عند النشاط المنتظم", "غير مقنن"]);
  console.log("updated:", r.rowCount);
  const total = await pool.query("SELECT count(*) FROM projects");
  console.log("total:", total.rows[0].count);
  await pool.end();
}
main().catch((e)=>{console.error("error:", e.message); process.exit(1);});
