const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const envFile = fs.readFileSync(path.join(__dirname, '..', '..', '.env.production.local'), 'utf8');
const match = envFile.match(/PRODUCTION_DATABASE_URL=(.+)/);
const cleanUrl = match[1].trim().replace(/&channel_binding=require/g, '');
const pool = new Pool({ connectionString: cleanUrl });

async function run() {
  // Check ALL no_capital_projects with their startCostType
  const { rows } = await pool.query('SELECT id, slug, "start_cost_type", active FROM no_capital_projects ORDER BY id');
  console.log('=== ALL no_capital_projects ===');
  console.log(`Total: ${rows.length}`);
  
  const byCostType = {};
  for (const r of rows) {
    const key = r.start_cost_type || 'NULL';
    byCostType[key] = (byCostType[key] || 0) + 1;
  }
  console.log('\nBy start_cost_type:');
  for (const [k, v] of Object.entries(byCostType)) {
    console.log(`  "${k}": ${v}`);
  }
  
  const zeroCost = rows.filter(r => r.start_cost_type === 'zero_tools_existing');
  console.log(`\nzero_tools_existing: ${zeroCost.length}`);
  for (const r of zeroCost) {
    console.log(`  id=${r.id} slug="${r.slug}" active=${r.active}`);
  }
  
  const nonZero = rows.filter(r => r.start_cost_type !== 'zero_tools_existing');
  console.log(`\nNOT zero_tools_existing: ${nonZero.length}`);
  for (const r of nonZero) {
    console.log(`  id=${r.id} slug="${r.slug}" start_cost_type="${r.start_cost_type}" active=${r.active}`);
  }

  // Check the no_capital_projects columns
  const cols = await pool.query(`SELECT column_name FROM information_schema.columns WHERE table_name='no_capital_projects' ORDER BY ordinal_position`);
  console.log('\n=== no_capital_projects columns ===');
  console.log(cols.rows.map(r => r.column_name).join(', '));

  await pool.end();
}

run();
