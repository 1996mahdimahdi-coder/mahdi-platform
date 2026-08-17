const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const envFile = fs.readFileSync(path.join(__dirname, '..', '..', '.env.production.local'), 'utf8');
const match = envFile.match(/PRODUCTION_DATABASE_URL=(.+)/);
const cleanUrl = match[1].trim().replace(/&channel_binding=require/g, '');
const pool = new Pool({ connectionString: cleanUrl });

async function run() {
  try {
    const r = await pool.query(`SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name='__drizzle_migrations') as exists`);
    console.log('__drizzle_migrations exists:', r.rows[0].exists);

    // List all tables
    const tables = await pool.query(`SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name`);
    console.log('\nAll tables (' + tables.rows.length + '):');
    for (const t of tables.rows) {
      console.log('  ' + t.table_name);
    }
  } catch (err) {
    console.error('ERROR:', err.message);
  } finally {
    await pool.end();
  }
}

run();
