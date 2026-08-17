const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load PRODUCTION_DATABASE_URL from .env.production.local
const envFile = fs.readFileSync(path.join(__dirname, '..', '..', '.env.production.local'), 'utf8');
const match = envFile.match(/PRODUCTION_DATABASE_URL=(.+)/);
if (!match) { console.error('PRODUCTION_DATABASE_URL not found in .env.production.local'); process.exit(1); }

const rawUrl = match[1].trim();
const cleanUrl = rawUrl.replace(/&channel_binding=require/g, '');

console.log('DB host:', new URL(cleanUrl).hostname);
console.log('DB name:', new URL(cleanUrl).pathname.replace('/', ''));

const pool = new Pool({ connectionString: cleanUrl });

const migrationFile = process.argv[2];
if (!migrationFile) { console.error('Usage: node migrate.js <sql-file>'); process.exit(1); }

const sql = fs.readFileSync(path.resolve(migrationFile), 'utf8')
  .replace(/^--.*$/gm, '')
  .trim();

async function run() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    console.log('BEGIN');

    const statements = sql.split(/;\s*\n/).filter(s => s.trim().length > 0);
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i].trim();
      if (!stmt) continue;
      const fullStmt = stmt.endsWith(';') ? stmt : stmt + ';';
      console.log('[' + (i+1) + '/' + statements.length + '] ' + fullStmt.substring(0, 120));
      await client.query(fullStmt);
      console.log('  OK');
    }

    await client.query('COMMIT');
    console.log('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('ROLLBACK:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
