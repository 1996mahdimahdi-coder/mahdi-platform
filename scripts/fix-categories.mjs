import pg from "pg";

const { Pool } = pg;

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

async function main() {
  // Step 1: Verify count
  const count = await pool.query("SELECT count(*) FROM projects");
  console.log("العدد:", count.rows[0].count);
  if (count.rows[0].count !== "106") {
    console.error("❌ العدد غير صحيح! متوقع 106");
    await pool.end();
    process.exit(1);
  }

  // Step 2: Update categories
  const updates = [
    ["سيارات", ['car-wash-mobile','used-cars-brokerage','car-detailing-studio','car-parts-online','dashcam-installation','tire-service','car-accessories-retail','car-photography-ads','car-mechanics-workshop','car-electrical-repair','quick-oil-change','car-battery-shop','used-car-dealership','car-interior-cleaning','car-detailing-mobile']],
    ["جمال وعناية", ['barbershop-men','women-beauty-salon','perfume-mixing-shop','cosmetics-retail','henna-artist','mobile-beauty-services','natural-skincare','eyebrow-lashes']],
    ["صيانة وإصلاح", ['phone-repair-shop','computer-repair','appliance-repair','home-electrician','plumber-service','welding-workshop','aluminum-workshop','plaster-painter']],
    ["تعليم وتكوين", ['language-courses','school-support-center','it-training-center','online-course-creator','kindergarten-nursery','exam-prep-courses','kids-activities','professional-training','tutoring-learning-hub']],
    ["أزياء وخياطة", ['womens-sewing','mens-tailoring','traditional-dress','embroidery-service','clothing-alterations','fabric-store','leather-goods','clothing-online','tailoring-workshop','custom-leather-handicrafts']],
    ["فلاحة", ['vegetable-farming','date-palm-cultivation','olive-oil-production','poultry-farming','egg-production','beekeeping-honey','plant-nursery','feed-distribution','agricultural-seedlings-honey','poultry-egg-distribution']],
    ["مطاعم", ['home-cakes-sweets','meals-delivery-home','coffee-kiosk-takeaway','shawarma-grill','juice-smoothie-bar','workers-meals-catering','pizza-delivery','mahjouba-traditional','frozen-food-production','grillades-barbecue','healthy-meal-prep','traditional-sweets-shop','tacos-grill','burger-shop','food-truck-street','home-sweets-bakery','fast-food-delivery-hub']],
  ];

  let totalUpdated = 0;
  for (const [cat, ids] of updates) {
    const r = await pool.query(
      `UPDATE projects SET category = $1 WHERE project_id = ANY($2)`,
      [cat, ids]
    );
    console.log(`✅ ${cat}: ${r.rowCount} مشروع`);
    totalUpdated += r.rowCount;
  }

  console.log(`\n📊 الإجمالي المحدّث: ${totalUpdated}`);

  // Step 3: Show final grouping
  const result = await pool.query(
    "SELECT category, count(*) as count FROM projects GROUP BY category ORDER BY count DESC"
  );
  console.log("\nالتصنيفات النهائية:");
  console.table(result.rows);

  await pool.end();
}

main().catch((e) => { console.error("خطأ:", e.message); process.exit(1); });
