const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const envFile = fs.readFileSync(path.join(__dirname, '..', '..', '.env.production.local'), 'utf8');
const match = envFile.match(/PRODUCTION_DATABASE_URL=(.+)/);
const cleanUrl = match[1].trim().replace(/&channel_binding=require/g, '');
const pool = new Pool({ connectionString: cleanUrl });

async function run() {
  try {
    // 1. All consent_versions rows
    const allVersions = await pool.query('SELECT id, version, title, active, created_at FROM consent_versions ORDER BY id');
    console.log('=== consent_versions (ALL) ===');
    for (const r of allVersions.rows) {
      console.log(`  id=${r.id} | version="${r.version}" | title="${r.title}" | active=${r.active} | created_at=${r.created_at}`);
    }

    // 2. Active count
    const activeCount = await pool.query('SELECT COUNT(*) as cnt FROM consent_versions WHERE active = true');
    console.log('\n=== ACTIVE COUNT ===');
    console.log(`  active=true count: ${activeCount.rows[0].cnt}`);

    // 3. Active versions detail
    const activeVersions = await pool.query('SELECT id, version, title FROM consent_versions WHERE active = true');
    console.log('\n=== ACTIVE VERSIONS ===');
    for (const r of activeVersions.rows) {
      console.log(`  id=${r.id} | version="${r.version}" | title="${r.title}"`);
    }

    // 4. Recent consent records
    const recentRecords = await pool.query('SELECT id, session_id, purpose, consent_version_id, created_at FROM consent_records ORDER BY id DESC LIMIT 10');
    console.log('\n=== RECENT consent_records (last 10) ===');
    for (const r of recentRecords.rows) {
      console.log(`  id=${r.id} | session="${r.session_id}" | purpose="${r.purpose}" | version_id=${r.consent_version_id} | created_at=${r.created_at}`);
    }

    // 5. Recent no_capital_test_results
    const recentResults = await pool.query('SELECT id, session_id, created_at FROM no_capital_test_results ORDER BY id DESC LIMIT 10');
    console.log('\n=== RECENT no_capital_test_results (last 10) ===');
    for (const r of recentResults.rows) {
      console.log(`  id=${r.id} | session="${r.session_id}" | created_at=${r.created_at}`);
    }

  } catch (err) {
    console.error('ERROR:', err.message);
  } finally {
    await pool.end();
  }
}

run();
