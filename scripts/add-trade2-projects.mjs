import pg from "pg";

const { Pool } = pg;

const P = [
["home-appliances-store","محل أجهزة كهربائية منزلية","تجارة","بيع الأجهزة الكهربائية المنزلية (خلاطات، مكاوي، مكانس) بالتفصيل مع ضمان.",300000,800000,2000000,"منخفضة",true,false,false,false,["بيع الأجهزة","معرفة المنتجات"],"دوام كامل","سهل","متوسطة","طوال السنة","مرتفعة","جميع المناطق","محل","بسيطة","سجل تجاري",[{"item":"رفوف عرض","cost":60000},{"item":"مخزون أجهزة","cost":400000}],400000,25000,15,"هامش 25%-40%","(سعر البيع - سعر الشراء) × الوحدات","التكاليف الثابتة / هامش القطعة",["منافسة","ضمانات"],["طلب دائم لكل بيت","ضمان يجذب العملاء","توسع بالتقسيط"],["مخزون كبير","ضمانات"],[{"week":"الأسبوع 1","title":"الموردون","tasks":["التعاقد مع موردين","تحديد الماركات"]},{"week":"الأسبوع 2","title":"التجهيز","tasks":["تجهيز المحل","عرض المنتجات"]},{"week":"الأسبوع 3","title":"الافتتاح","tasks":["افتتاح مع عروض","ضمانات"]},{"week":"الأسبوع 4","title":"التوسع","tasks":["معرفة الأكثر مبيعاً","تقسيط"]}],"سجل تجاري لنشاط بيع الأجهزة","سوق الأجهزة المنزلية الجزائري"],

["toys-games-store","متجر ألعاب الأطفال","تجارة","بيع ألعاب الأطفال التعليمية والترفيهية مع هدايا المناسبات.",200000,500000,1200000,"منخفضة",true,false,true,false,["بيع الألعاب","معرفة الألعاب"],"دوام كامل","سهل","مرتفعة","مواسم الأعياد والمدارس","مرتفعة","جميع المناطق","محل","بسيطة","سجل تجاري",[{"item":"رفوف عرض","cost":60000},{"item":"مخزون ألعاب","cost":300000}],300000,20000,15,"هامش 30%-50%","(سعر البيع - سعر الشراء) × الوحدات","التكاليف الثابتة / هامش القطعة",["منافسة","موسمية"],["طلب من الأولياء","ذروة الأعياد","توسع أونلاين"],["مخزون متنوع","موسمي"],[{"week":"الأسبوع 1","title":"الموردون","tasks":["التعاقد مع موردي ألعاب","تحديد التشكيلة"]},{"week":"الأسبوع 2","title":"التجهيز","tasks":["تجهيز المحل","عرض جذاب"]},{"week":"الأسبوع 3","title":"الافتتاح","tasks":["افتتاح مع عروض","بيع أونلاين"]},{"week":"الأسبوع 4","title":"التوسع","tasks":["هدايا مناسبات","زبائن دائمون"]}],"سجل تجاري لنشاط بيع الألعاب","سوق الألعاب الجزائري"]
];

async function main() {
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
  console.log("✅ أُضيف:", ok, "| تخطي:", skipped);
  await pool.end();
}
main().catch((e)=>{console.error("خطأ:", e.message); process.exit(1);});
