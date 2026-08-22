import pg from "pg";
const { Pool } = pg;
const P = [
["grape-vineyard","زراعة الكروم والعنب","فلاحة","زراعة الكروم وإنتاج العنب (طازج وزبيب) وبيعه للأسواق.",200000,500000,1500000,"متوسطة",false,false,false,true,["زراعة الكروم","الفلاحة"],"دوام كامل","متوسط","متوسطة","موسمي (صيف)","منخفضة","المناطق الفلاحية","أرض فلاحية","متوسطة","غير مقنن",[{"item":"شتلات كروم","cost":250000},{"item":"معدات وسقي","cost":150000}],150000,20000,30,"بيع الكيلوغرام","(سعر الكيلو × الكمية) - التكاليف","التكاليف الثابتة / هامش الكيلو",["استثمار متوسط الأمد","تقلب الأسعار"],["منتج مطلوب صيفاً","طلب محلي","إمكانية الزبيب"],["صبر (الكروم يثمر بعد سنوات)","رأس مال"],[{"week":"الأسبوع 1","title":"الأرض","tasks":["اختيار أرض مناسبة","دراسة التربة"]},{"week":"الأسبوع 2","title":"الغرس","tasks":["شراء شتلات","غرس"]},{"week":"الأسبوع 3","title":"الرعاية","tasks":["سقي وتقليم","مكافحة أمراض"]},{"week":"الأسبوع 4","title":"التسويق","tasks":["بيع أول محصول","أسواق"]}],"لا يحتاج سجلاً تجارياً للبداية","سوق العنب الجزائري"]
];
async function main() {
  const pool = new Pool({host:"52.28.178.228",port:5432,database:"neondb",user:"neondb_owner",password:"npg_IL7mW1trQyqo",ssl:{rejectUnauthorized:false,servername:"ep-jolly-shape-b2k89hux-pooler.c-6.eu-central-1.aws.neon.tech"}});
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
  const agri = await pool.query("SELECT count(*) FROM projects WHERE category = 'فلاحة'");
  console.log("فلاحة:", agri.rows[0].count);
  await pool.end();
}
main().catch((e)=>{console.error("error:", e.message); process.exit(1);});
