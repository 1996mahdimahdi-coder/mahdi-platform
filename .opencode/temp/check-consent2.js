const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const envFile = fs.readFileSync(path.join(__dirname, '..', '..', '.env.production.local'), 'utf8');
const match = envFile.match(/PRODUCTION_DATABASE_URL=(.+)/);
const cleanUrl = match[1].trim().replace(/&channel_binding=require/g, '');
const pool = new Pool({ connectionString: cleanUrl });

async function run() {
  try {
    // consent_records columns
    const crCols = await pool.query(`SELECT column_name FROM information_schema.columns WHERE table_name='consent_records' ORDER BY ordinal_position`);
    console.log('=== consent_records columns ===');
    console.log(crCols.rows.map(r => r.column_name).join(', '));

    // no_capital_test_results columns
    const trCols = await pool.query(`SELECT column_name FROM information_schema.columns WHERE table_name='no_capital_test_results' ORDER BY ordinal_position`);
    console.log('\n=== no_capital_test_results columns ===');
    console.log(trCols.rows.map(r => r.column_name).join(', '));

    // consent_records recent
    const cr = await pool.query('SELECT * FROM consent_records ORDER BY id DESC LIMIT 10');
    console.log('\n=== consent_records (last 10) ===');
    for (const r of cr.rows) {
      console.log('  ' + JSON.stringify(r));
    }

    // no_capital_test_results recent
    const tr = await pool.query('SELECT * FROM no_capital_test_results ORDER BY id DESC LIMIT 10');
    console.log('\n=== no_capital_test_results (last 10) ===');
    for (const r of tr.rows) {
      console.log('  ' + JSON.stringify(r));
    }

  } catch (err) {
    console.error('ERROR:', err.message);
  } finally {
    await pool.end();
  }
}

run();
