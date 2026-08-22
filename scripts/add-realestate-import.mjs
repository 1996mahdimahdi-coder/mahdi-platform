import pg from "pg";
import fs from "fs";
const { Pool } = pg;
const P1 = JSON.parse(fs.readFileSync(new URL("./realestate-data.json", import.meta.url), "utf8"));
const P2 = JSON.parse(fs.readFileSync(new URL("./realestate-data2.json", import.meta.url), "utf8"));
const P = [...P1, ...P2];
async function main() {
  const pool = new Pool({host:"52.28.178.228",port:5432,database:"neondb",user:"neondb_owner",password:"npg_IL7mW1trQyqo",ssl:{rejectUnauthorized:false,servername:"ep-jolly-shape-b2k89hux-pooler.c-6.eu-central-1.aws.neon.tech"}});
  const mv = await pool.query("UPDATE projects SET category = $1 WHERE project_id = $2 AND category = $3 RETURNING project_id", ["عقار وتجارة دولية", "real-estate-management", "خدمات"]);
  console.log("moved:", mv.rowCount);
  let ok = 0, skipped = 0;
  for (const p of P) {
    const ex = await pool.query("SELECT 1 FROM projects WHERE project_id = $1", [p[0]]);
    if (ex.rowCount > 0) { skipped++; continue; }
    await pool.query(
      `INSERT INTO projects (project_id, project_name, category, description, min_capital, recommended_capital, max_capital, risk_level, requires_shop, home_based, online_possible, transport_required, skills_required, time_required, difficulty, scalability, seasonality, competition_level, target_area, work_location, skill_level, legal_status, equipment, initial_stock, fixed_costs, variable_costs_percent, pricing_method, profit_formula, break_even_formula, risks, advantages, disadvantages, launch_plan, legal_notes, source)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13::jsonb,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23::jsonb,$24,$25,$26,$27,$28,$29,$30::jsonb,$31::jsonb,$32::jsonb,$33::jsonb,$34,$35)`,
      [p[0],p[1],p[2],p[3],p[4],p[5],p[6],p[7],p[8],p[9],p[10],p[11],JSON.stringify(p[12]),p[13],p[14],p[15],p[16],p[17],p[18],p[19],p[20],p[21],JSON.stringify(p[22]),p[23],p[24],p[25],p[26],p[27],p[28],JSON.stringify(p[29]),JSON.stringify(p[30]),JSON.stringify(p[31]),JSON.stringify(p[32]),p[33],p[34]]
    );
    ok++;
  }
  console.log("done:", ok, "| skipped:", skipped);
  const total = await pool.query("SELECT count(*) FROM projects");
  console.log("total:", total.rows[0].count);
  const cat = await pool.query("SELECT count(*) FROM projects WHERE category = 'عقار وتجارة دولية'");
  console.log("عقار وتجارة دولية:", cat.rows[0].count);
  const sv = await pool.query("SELECT count(*) FROM projects WHERE category = 'خدمات'");
  console.log("خدمات:", sv.rows[0].count);
  await pool.end();
}
main().catch((e)=>{console.error("error:", e.message); process.exit(1);});
