const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const envFile = fs.readFileSync(path.join(__dirname, '..', '..', '.env.production.local'), 'utf8');
const match = envFile.match(/PRODUCTION_DATABASE_URL=(.+)/);
const cleanUrl = match[1].trim().replace(/&channel_binding=require/g, '');
const pool = new Pool({ connectionString: cleanUrl });

const table = process.argv[2];
if (!table) { console.error('Usage: node verify.js <table-name>'); process.exit(1); }

async function run() {
  const client = await pool.connect();
  try {
    // 1. Table exists?
    const tbl = await client.query(`
      SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name=$1) as exists,
             (SELECT COUNT(*) FROM information_schema.columns WHERE table_name=$1) as col_count
    `, [table]);
    console.log('Table:', table, '| Exists:', tbl.rows[0].exists, '| Columns:', tbl.rows[0].col_count);

    // 2. Columns detail
    const cols = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name=$1
      ORDER BY ordinal_position
    `, [table]);
    console.log('\nColumns:');
    for (const c of cols.rows) {
      console.log('  ' + c.column_name + ' | ' + c.data_type + ' | nullable=' + c.is_nullable + ' | default=' + (c.column_default || 'none'));
    }

    // 3. PK
    const pk = await client.query(`
      SELECT kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
      WHERE tc.table_name=$1 AND tc.constraint_type='PRIMARY KEY'
    `, [table]);
    console.log('\nPK:', pk.rows.map(r => r.column_name).join(', ') || 'NONE');

    // 4. FKs
    const fks = await client.query(`
      SELECT
        kcu.column_name,
        ccu.table_name AS foreign_table,
        ccu.column_name AS foreign_column,
        rc.delete_rule
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
      JOIN information_schema.referential_constraints rc ON tc.constraint_name = rc.constraint_name
      WHERE tc.table_name=$1 AND tc.constraint_type='FOREIGN KEY'
    `, [table]);
    console.log('\nFKs:');
    for (const f of fks.rows) {
      console.log('  ' + f.column_name + ' → ' + f.foreign_table + '(' + f.foreign_column + ') ON DELETE ' + f.delete_rule);
    }

    // 5. Indexes
    const idxs = await client.query(`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename=$1
    `, [table]);
    console.log('\nIndexes:');
    for (const i of idxs.rows) {
      console.log('  ' + i.indexname + ' | ' + i.indexdef);
    }

    // 6. UNIQUE constraints
    const uniques = await client.query(`
      SELECT kcu.column_name, tc.constraint_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
      WHERE tc.table_name=$1 AND tc.constraint_type='UNIQUE'
    `, [table]);
    console.log('\nUNIQUE:');
    for (const u of uniques.rows) {
      console.log('  ' + u.constraint_name + '(' + u.column_name + ')');
    }
    if (uniques.rows.length === 0) console.log('  NONE');

    // 7. Row count
    const count = await client.query('SELECT COUNT(*) as cnt FROM ' + table);
    console.log('\nRows:', count.rows[0].cnt);

  } catch (err) {
    console.error('ERROR:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
