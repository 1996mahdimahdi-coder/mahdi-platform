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
  const r = await pool.query("SELECT project_id, project_name, category FROM projects ORDER BY category, project_name");
  console.table(r.rows);
  await pool.end();
}

main().catch(e => { console.error("error:", e.message); process.exit(1); });
