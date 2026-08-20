import dotenv from "dotenv";
import pg from "pg";

dotenv.config({ path: ".env.local" });

const { Pool } = pg;

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  await pool.query(`ALTER TABLE projects ADD COLUMN IF NOT EXISTS work_location text NOT NULL DEFAULT 'محل'`);
  await pool.query(`ALTER TABLE projects ADD COLUMN IF NOT EXISTS skill_level text NOT NULL DEFAULT 'بسيطة'`);
  await pool.query(`ALTER TABLE projects ADD COLUMN IF NOT EXISTS legal_status text NOT NULL DEFAULT 'غير مقنن'`);
  console.log("✅ Migration done");
  await pool.end();
}

main().catch((e) => { console.error(e.message); process.exit(1); });
