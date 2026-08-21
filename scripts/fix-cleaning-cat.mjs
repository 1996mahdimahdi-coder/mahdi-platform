import pg from "pg";
const { Pool } = pg;
const pool = new Pool({host:"52.28.178.228",port:5432,database:"neondb",user:"neondb_owner",password:"npg_IL7mW1trQyqo",ssl:{rejectUnauthorized:false,servername:"ep-jolly-shape-b2k89hux-pooler.c-6.eu-central-1.aws.neon.tech"}});
async function main() {
  const bad = await pool.query("SELECT project_id, project_name, category FROM projects WHERE category != $1 AND category != $2 AND category != $3 AND category != $4 AND category != $5 AND category != $6 AND category != $7 AND category != $8 AND category != $9 AND category != $10 AND category != $11", ["مطاعم","تجارة","صيانة وإصلاح","جمال وعناية","أزياء وخياطة","فلاحة","تعليم وتكوين","خدمات","سيارات","أونلاين","صناعة تقليدية"]);
  console.log("فئات مشوّفة:");
  console.table(bad.rows);
  for (const r of bad.rows) {
    const upd = await pool.query("UPDATE projects SET category = $1 WHERE project_id = $2", ["تنظيف", r.project_id]);
    console.log("✅ صُلّح:", r.project_id, "-> تنظيف");
  }
  const count = await pool.query("SELECT count(*) FROM projects WHERE category = $1", ["تنظيف"]);
  console.log("مشاريع تنظيف الإجمالية:", count.rows[0].count);
  await pool.end();
}
main().catch(e=>{console.error(e.message);process.exit(1);});
