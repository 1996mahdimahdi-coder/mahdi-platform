const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const envFile = fs.readFileSync(path.join(__dirname, '..', '..', '.env.production.local'), 'utf8');
const match = envFile.match(/PRODUCTION_DATABASE_URL=(.+)/);
const cleanUrl = match[1].trim().replace(/&channel_binding=require/g, '');
const pool = new Pool({ connectionString: cleanUrl });

async function run() {
  // Clean up test data
  const del = await pool.query("DELETE FROM consent_records WHERE session_id LIKE 'e2e-test-%'");
  console.log('Cleaned up test consent_records:', del.rowCount, 'rows');

  const cnt = await pool.query('SELECT COUNT(*) as cnt FROM consent_records');
  console.log('Total consent_records now:', cnt.rows[0].cnt);

  await pool.end();
}

run();
