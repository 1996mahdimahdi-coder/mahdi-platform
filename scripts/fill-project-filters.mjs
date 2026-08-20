import dotenv from "dotenv";
import pg from "pg";

dotenv.config({ path: ".env.local" });

const { Pool } = pg;

// المفتاح = project_id في جدول projects
const CAPITAL_VALUES = {
  "phone-accessories":       { work_location: "محل",     skill_level: "بسيطة",       legal_status: "سجل تجاري" },
  "product-photography":     { work_location: "متنقل",   skill_level: "احترافية",    legal_status: "غير مقنن" },
  "home-sweets-bakery":      { work_location: "من المنزل", skill_level: "متوسطة",     legal_status: "شروط صحية" },
  "natural-honey-oils":      { work_location: "محل",     skill_level: "بسيطة",       legal_status: "سجل تجاري" },
  "custom-printing-gifts":   { work_location: "محل",     skill_level: "متوسطة",      legal_status: "سجل تجاري" },
  "fast-food-delivery-hub":  { work_location: "محل",     skill_level: "بسيطة",       legal_status: "شروط صحية" },
  "mobile-repair-freelance": { work_location: "محل",     skill_level: "احترافية",    legal_status: "سجل تجاري" },
  "social-media-management": { work_location: "أونلاين", skill_level: "متوسطة",      legal_status: "غير مقنن" },
  "tutoring-learning-hub":   { work_location: "من المنزل", skill_level: "احترافية",  legal_status: "غير مقنن" },
  "clothing-e-commerce":     { work_location: "أونلاين", skill_level: "بسيطة",       legal_status: "سجل تجاري" },
  "car-detailing-mobile":    { work_location: "متنقل",   skill_level: "بسيطة",       legal_status: "غير مقنن" },
  "home-maintenance-agency": { work_location: "متنقل",   skill_level: "احترافية",    legal_status: "ترخيص/اعتماد" },
  "perfume-oils-refill":     { work_location: "محل",     skill_level: "بسيطة",       legal_status: "سجل تجاري" },
  "graphics-web-freelancing":{ work_location: "أونلاين", skill_level: "احترافية",    legal_status: "غير مقنن" },
  "agricultural-seedlings-honey": { work_location: "أرض فلاحية", skill_level: "متوسطة", legal_status: "غير مقنن" },
  "used-books-online":       { work_location: "أونلاين", skill_level: "بدون مهارة",  legal_status: "غير مقنن" },
  "home-event-planning":     { work_location: "متنقل",   skill_level: "متوسطة",      legal_status: "غير مقنن" },
  "home-appliance-spareparts": { work_location: "محل",   skill_level: "بسيطة",       legal_status: "سجل تجاري" },
  "custom-leather-handicrafts": { work_location: "ورشة", skill_level: "احترافية",    legal_status: "سجل تجاري" },
  "poultry-egg-distribution": { work_location: "أرض فلاحية", skill_level: "متوسطة",  legal_status: "شروط صحية" },
  "home-cleaning-services":  { work_location: "متنقل",   skill_level: "بسيطة",       legal_status: "غير مقنن" },
  "car-accessories-dashcam": { work_location: "محل",     skill_level: "متوسطة",      legal_status: "سجل تجاري" },
  "coffee-tea-kiosk":        { work_location: "محل",     skill_level: "بسيطة",       legal_status: "شروط صحية" },
  "translator-redaction-desk": { work_location: "أونلاين", skill_level: "احترافية",  legal_status: "غير مقنن" },
  "solar-cleaning-consulting": { work_location: "متنقل", skill_level: "احترافية",    legal_status: "ترخيص/اعتماد" },
};

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("لا يوجد DATABASE_URL في .env.local");

  const pool = new Pool({ connectionString: url });
  let updated = 0;

  for (const [projectId, v] of Object.entries(CAPITAL_VALUES)) {
    const r = await pool.query(
      `UPDATE projects SET work_location = $1, skill_level = $2, legal_status = $3 WHERE project_id = $4`,
      [v.work_location, v.skill_level, v.legal_status, projectId]
    );
    updated += r.rowCount ?? 0;
  }

  console.log("✅ مشاريع محدّثة:", updated);
  await pool.end();
}

main().catch((e) => { console.error("خطأ:", e.message); process.exit(1); });
