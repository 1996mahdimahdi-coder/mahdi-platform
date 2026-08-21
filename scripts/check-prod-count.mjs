import pg from "pg";

const { Pool } = pg;

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

  const client = await pool.connect();
  try {
    const r = await client.query("SELECT count(*) FROM projects");
    console.log("العدد:", r.rows[0].count);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((e) => { console.error("خطأ:", e.message); process.exit(1); });
