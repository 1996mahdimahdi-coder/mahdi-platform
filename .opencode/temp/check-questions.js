const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const envFile = fs.readFileSync(path.join(__dirname, '..', '..', '.env.production.local'), 'utf8');
const match = envFile.match(/PRODUCTION_DATABASE_URL=(.+)/);
const cleanUrl = match[1].trim().replace(/&channel_binding=require/g, '');
const pool = new Pool({ connectionString: cleanUrl });

async function run() {
  try {
    // Check no_capital_questions table
    const qCols = await pool.query(`SELECT column_name FROM information_schema.columns WHERE table_name='no_capital_questions' ORDER BY ordinal_position`);
    console.log('=== no_capital_questions columns ===');
    console.log(qCols.rows.map(r => r.column_name).join(', '));

    const qCount = await pool.query('SELECT COUNT(*) as cnt FROM no_capital_questions');
    console.log(`\nno_capital_questions: ${qCount.rows[0].cnt} rows`);

    const questions = await pool.query('SELECT id, "questionKey", title, "order", type, required FROM no_capital_questions ORDER BY "order" LIMIT 20');
    console.log('\n=== Questions (first 20) ===');
    for (const q of questions.rows) {
      console.log(`  #${q.order} | key="${q.questionKey}" | type=${q.type} | required=${q.required} | title="${q.title?.substring(0, 60)}..."`);
    }

    // Check no_capital_projects table  
    const pCount = await pool.query('SELECT COUNT(*) as cnt FROM no_capital_projects');
    console.log(`\nno_capital_projects: ${pCount.rows[0].cnt} rows`);

    // Check no_capital_recommendation_rules
    const rCount = await pool.query('SELECT COUNT(*) as cnt FROM no_capital_recommendation_rules');
    console.log(`no_capital_recommendation_rules: ${rCount.rows[0].cnt} rows`);

    // Now simulate the full assess flow locally
    console.log('\n=== Simulating full assess flow ===');

    // loadQuestions
    const allQ = (await pool.query('SELECT * FROM no_capital_questions ORDER BY "order"')).rows;
    console.log(`  loadQuestions: ${allQ.length} questions`);

    // loadNoCapitalProfiles  
    const profiles = (await pool.query('SELECT * FROM no_capital_projects WHERE "startCostType" = $1', ['zero_tools_existing'])).rows;
    console.log(`  loadNoCapitalProfiles (zero_tools_existing): ${profiles.length} profiles`);

    // loadRecommendationRules
    const rules = (await pool.query('SELECT * FROM no_capital_recommendation_rules')).rows;
    console.log(`  loadRecommendationRules: ${rules.length} rules`);

    // loadCategories
    const cats = (await pool.query('SELECT * FROM categories')).rows;
    console.log(`  loadCategories: ${cats.length} categories`);

  } catch (err) {
    console.error('ERROR:', err.message);
  } finally {
    await pool.end();
  }
}

run();
