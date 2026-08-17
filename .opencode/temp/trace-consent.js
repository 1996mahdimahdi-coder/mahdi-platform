const fs = require('fs');
const path = require('path');

// Load env
const envFile = fs.readFileSync(path.join(__dirname, '..', '..', '.env.production.local'), 'utf8');
const match = envFile.match(/PRODUCTION_DATABASE_URL=(.+)/);

// We can't call the API directly since we don't have the Vercel URL.
// Instead, let's verify the DB-side behavior by checking what loadActiveConsent returns
// and what resolveVersionId would return.

const { Pool } = require('pg');
const cleanUrl = match[1].trim().replace(/&channel_binding=require/g, '');
const pool = new Pool({ connectionString: cleanUrl });

async function run() {
  try {
    // Simulate loadActiveConsent()
    const [row] = (await dbQuery(pool,
      `SELECT id, version, title, text, required, active
       FROM consent_versions
       WHERE active = true
       ORDER BY updated_at DESC
       LIMIT 1`
    )).rows;

    console.log('=== loadActiveConsent() result ===');
    if (row) {
      console.log(`  id: ${row.id}`);
      console.log(`  version: "${row.version}"`);
      console.log(`  title: "${row.title}"`);
      console.log(`  text length: ${row.text ? row.text.length : 0}`);
      console.log(`  required: ${row.required}`);
      console.log(`  active: ${row.active}`);
    } else {
      console.log('  NO ACTIVE CONSENT → would fall back to DEFAULT_CONSENT');
    }

    // Simulate resolveVersionId("1.0")
    const versionRow = (await dbQuery(pool,
      `SELECT id FROM consent_versions WHERE version = '1.0' LIMIT 1`
    )).rows[0];

    console.log('\n=== resolveVersionId("1.0") ===');
    console.log(`  result: ${versionRow ? versionRow.id : 'null'}`);

    // Check if consent POST would succeed
    console.log('\n=== Would consent POST succeed? ===');
    if (row && versionRow) {
      console.log('  version found in DB: YES');
      console.log('  versionId would be: ' + versionRow.id);
      console.log('  INSERT INTO consent_records(session_id, purpose, consent_version_id) → should succeed');
    }

    // Check if assess POST consent check would pass
    console.log('\n=== Would assess POST consent check pass? ===');
    if (row) {
      console.log('  consent.version from DB: "' + row.version + '"');
      console.log('  If client sends version "1.0" → match: ' + (row.version === '1.0'));
    }

    // Check: does consent_records have any data at all?
    const crCount = (await dbQuery(pool, 'SELECT COUNT(*) as cnt FROM consent_records')).rows[0];
    const trCount = (await dbQuery(pool, 'SELECT COUNT(*) as cnt FROM no_capital_test_results')).rows[0];
    console.log('\n=== Data check ===');
    console.log(`  consent_records: ${crCount.cnt} rows`);
    console.log(`  no_capital_test_results: ${trCount.cnt} rows`);

    // Verify: is there an index/constraint that could cause silent failure?
    console.log('\n=== consent_records constraints ===');
    const constraints = await dbQuery(pool, `
      SELECT conname, contype, pg_get_constraintdef(oid) as def
      FROM pg_constraint
      WHERE conrelid = 'consent_records'::regclass
    `);
    for (const c of constraints.rows) {
      console.log(`  ${c.conname} (${c.contype}): ${c.def}`);
    }

  } catch (err) {
    console.error('ERROR:', err.message);
  } finally {
    await pool.end();
  }
}

function dbQuery(pool, sql) {
  return pool.query(sql);
}

run();
