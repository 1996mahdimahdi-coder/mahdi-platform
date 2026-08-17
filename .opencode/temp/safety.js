const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const envFile = fs.readFileSync(path.join(__dirname, '..', '..', '.env.production.local'), 'utf8');
const match = envFile.match(/PRODUCTION_DATABASE_URL=(.+)/);
const cleanUrl = match[1].trim().replace(/&channel_binding=require/g, '');
const pool = new Pool({ connectionString: cleanUrl });

async function run() {
  try {
    console.log('=== PRODUCTION SAFETY CHECK ===\n');

    const checks = [
      { q: 'SELECT COUNT(*) as c FROM wilayas', name: 'wilayas', exp: 69 },
      { q: 'SELECT COUNT(*) as c FROM communes', name: 'communes', exp: 1541 },
      { q: 'SELECT COUNT(*) as c FROM projects', name: 'projects', exp: 25 },
      { q: 'SELECT COUNT(*) as c FROM blog_posts', name: 'blog_posts', exp: 102 },
      { q: 'SELECT COUNT(*) as c FROM commune_stats', name: 'commune_stats', exp: 1540 },
      { q: 'SELECT COUNT(*) as c FROM data_sources', name: 'data_sources', exp: 1 },
      { q: 'SELECT COUNT(*) as c FROM commune_stats WHERE population_year = 2008', name: 'population_year=2008', exp: 1540 },
      { q: "SELECT COUNT(*) as c FROM commune_stats WHERE population_confidence = 'A'", name: 'population_confidence=A', exp: 1540 },
      { q: 'SELECT COALESCE(SUM(population),0) as c FROM commune_stats', name: 'population_sum', exp: 34080021 },
      { q: 'SELECT COUNT(*) as c FROM categories', name: 'categories', exp: 7 },
      { q: 'SELECT COUNT(*) as c FROM no_capital_projects', name: 'no_capital_projects', exp: 15 },
      { q: 'SELECT COUNT(*) as c FROM no_capital_recommendation_rules', name: 'no_capital_recommendation_rules', exp: 18 },
      { q: "SELECT COUNT(*) as c FROM consent_versions WHERE active = true", name: 'consent_versions_active', exp: 1 },
    ];

    let allOk = true;
    for (const ck of checks) {
      const r = await pool.query(ck.q);
      const v = parseInt(r.rows[0].c);
      const ok = v === ck.exp;
      if (!ok) allOk = false;
      console.log((ok ? 'OK' : 'MISMATCH') + ' | ' + ck.name + ': ' + v + (ck.name === 'population_sum' ? '' : ' (expected ' + ck.exp + ')'));
    }

    console.log('\n' + (allOk ? 'ALL CHECKS PASSED' : 'SOME CHECKS FAILED'));

  } catch (err) {
    console.error('ERROR:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();
