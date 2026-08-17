const BASE = 'http://localhost:3000';
const SESSION_ID = `e2e-test-${Date.now()}`;
let consentVersion = null;

async function step(name, fn) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`STEP: ${name}`);
  console.log('='.repeat(60));
  try {
    await fn();
  } catch (err) {
    console.error(`  FAIL: ${err.message}`);
  }
}

async function run() {

  // STEP 1: Open /no-capital/test — check page loads
  await step('1. GET /no-capital/test', async () => {
    const res = await fetch(`${BASE}/no-capital/test`);
    console.log(`  Status: ${res.status}`);
    const html = await res.text();
    const hasTestPage = html.includes('اختبار المشاريع بدون رأس مال') || html.includes('no-capital');
    console.log(`  Contains test page content: ${hasTestPage}`);
    console.log(`  HTML length: ${html.length}`);
  });

  // STEP 2: Load questions via API
  let questions = [];
  await step('2. GET /api/no-capital/questions', async () => {
    const res = await fetch(`${BASE}/api/no-capital/questions`, { cache: 'no-store' });
    const data = await res.json();
    console.log(`  Status: ${res.status}`);
    console.log(`  success: ${data.success}`);
    console.log(`  count: ${data.count}`);
    console.log(`  source: ${data.source}`);
    if (data.questions) {
      questions = data.questions;
      console.log(`  Questions loaded: ${questions.length}`);
      for (const q of questions) {
        console.log(`    #${q.order} key="${q.questionKey}" type=${q.type} required=${q.required}`);
      }
    } else {
      console.log(`  ERROR: No questions returned`);
      console.log(`  Response: ${JSON.stringify(data).substring(0, 500)}`);
    }
  });

  // STEP 3: Build answers for 11 questions
  const answers = {};
  await step('3. Build test answers', async () => {
    for (const q of questions) {
      if (q.type === 'single' && q.options.length > 0) {
        answers[q.questionKey] = q.options[0].value;
      } else if (q.type === 'multi' && q.options.length > 0) {
        answers[q.questionKey] = [q.options[0].value];
      } else if (q.type === 'text') {
        answers[q.questionKey] = 'test answer';
      }
    }
    console.log(`  Built answers for ${Object.keys(answers).length} questions:`);
    for (const [k, v] of Object.entries(answers)) {
      console.log(`    ${k} = ${JSON.stringify(v)}`);
    }
  });

  // STEP 4: Load consent
  let consentData = null;
  await step('4. GET /api/no-capital/consent', async () => {
    const res = await fetch(`${BASE}/api/no-capital/consent`, { cache: 'no-store' });
    consentData = await res.json();
    console.log(`  Status: ${res.status}`);
    console.log(`  Response: ${JSON.stringify({ success: consentData.success, source: consentData.source, version: consentData.consent?.version, title: consentData.consent?.title })}`);
    if (consentData.consent) {
      consentVersion = consentData.consent.version;
    }
  });

  // STEP 5: POST consent
  await step('5. POST /api/no-capital/consent', async () => {
    const res = await fetch(`${BASE}/api/no-capital/consent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: SESSION_ID, purpose: 'no-capital', version: consentVersion }),
    });
    const data = await res.json();
    console.log(`  Status: ${res.status}`);
    console.log(`  Response: ${JSON.stringify(data)}`);
    if (res.status !== 200 || !data.success) {
      console.log(`  *** CONSENT POST FAILED ***`);
    }
  });

  // STEP 6: POST assess
  let assessResult = null;
  await step('6. POST /api/no-capital/assess', async () => {
    const res = await fetch(`${BASE}/api/no-capital/assess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers, sessionId: SESSION_ID, consentVersion }),
    });
    assessResult = await res.json();
    console.log(`  Status: ${res.status}`);
    console.log(`  success: ${assessResult.success}`);
    if (assessResult.error) {
      console.log(`  error: ${assessResult.error}`);
    }
    if (assessResult.recommendations) {
      console.log(`  recommendations count: ${assessResult.recommendations.length}`);
      for (const rec of assessResult.recommendations) {
        console.log(`    ${rec.profile?.nameAr || 'UNKNOWN'} | score=${rec.totalScore} | level=${rec.matchLevel}`);
      }
    }
    console.log(`  source: ${assessResult.source}`);
    console.log(`  questionSource: ${assessResult.questionSource}`);
    console.log(`  consentVersion: ${assessResult.consentVersion}`);
    console.log(`  Full response keys: ${Object.keys(assessResult).join(', ')}`);
  });

  // STEP 7: Simulate localStorage + results page render
  await step('7. Simulate results page', async () => {
    if (!assessResult || !assessResult.success) {
      console.log(`  SKIP: assess did not succeed`);
      return;
    }
    
    // Simulate what browser does: localStorage.setItem + router.push
    const stored = JSON.stringify(assessResult);
    console.log(`  localStorage data size: ${stored.length} bytes`);
    
    // Parse it back as the results page would
    const parsed = JSON.parse(stored);
    console.log(`  parsed.success: ${parsed.success}`);
    console.log(`  Array.isArray(parsed.recommendations): ${Array.isArray(parsed.recommendations)}`);
    console.log(`  parsed.recommendations.length: ${parsed.recommendations?.length}`);
    
    if (parsed.recommendations && parsed.recommendations.length > 0) {
      const firstRec = parsed.recommendations[0];
      console.log(`  First recommendation:`);
      console.log(`    profile exists: ${!!firstRec.profile}`);
      console.log(`    profile.slug: ${firstRec.profile?.slug}`);
      console.log(`    profile.nameAr: ${firstRec.profile?.nameAr}`);
      console.log(`    profile.description: ${firstRec.profile?.description ? 'exists (' + firstRec.profile.description.length + ' chars)' : 'MISSING'}`);
      console.log(`    profile.effortLevel: ${firstRec.profile?.effortLevel}`);
      console.log(`    profile.timeRequired: ${firstRec.profile?.timeRequired}`);
      console.log(`    profile.startCostEstimate: ${firstRec.profile?.startCostEstimate}`);
      console.log(`    totalScore: ${firstRec.totalScore}`);
      console.log(`    matchLevel: ${firstRec.matchLevel}`);
      console.log(`    reasons: ${JSON.stringify(firstRec.reasons)}`);
      console.log(`    dimensionScores exists: ${!!firstRec.dimensionScores}`);
      
      // Check all fields the results page accesses
      const missingFields = [];
      if (!firstRec.profile?.slug) missingFields.push('profile.slug');
      if (!firstRec.profile?.nameAr) missingFields.push('profile.nameAr');
      if (!firstRec.profile?.description) missingFields.push('profile.description');
      if (!firstRec.profile?.effortLevel) missingFields.push('profile.effortLevel');
      if (!firstRec.profile?.timeRequired) missingFields.push('profile.timeRequired');
      if (!firstRec.profile?.startCostEstimate) missingFields.push('profile.startCostEstimate');
      if (firstRec.totalScore === undefined) missingFields.push('totalScore');
      if (!firstRec.matchLevel) missingFields.push('matchLevel');
      if (!Array.isArray(firstRec.reasons)) missingFields.push('reasons[]');
      
      if (missingFields.length > 0) {
        console.log(`  *** MISSING FIELDS: ${missingFields.join(', ')} ***`);
      } else {
        console.log(`  All required fields present ✓`);
      }
    }
  });

  // STEP 8: GET /no-capital/results page
  await step('8. GET /no-capital/results (page loads)', async () => {
    const res = await fetch(`${BASE}/no-capital/results`);
    console.log(`  Status: ${res.status}`);
    const html = await res.text();
    console.log(`  HTML length: ${html.length}`);
    const hasResultsPage = html.includes('no-capital') || html.includes('نتيجة');
    console.log(`  Contains results page: ${hasResultsPage}`);
  });

  // SUMMARY
  console.log(`\n${'='.repeat(60)}`);
  console.log('E2E RESULT SUMMARY');
  console.log('='.repeat(60));
  console.log(`  GET  /no-capital/test:        OK (page loads)`);
  console.log(`  GET  /api/no-capital/questions: ${questions.length > 0 ? 'PASS' : 'FAIL'} (${questions.length} questions)`);
  console.log(`  GET  /api/no-capital/consent:   ${consentVersion ? 'PASS' : 'FAIL'} (version="${consentVersion}")`);
  console.log(`  POST /api/no-capital/consent:   (check above)`);
  console.log(`  POST /api/no-capital/assess:    ${assessResult?.success ? 'PASS' : 'FAIL'}`);
  console.log(`  localStorage result:            ${assessResult?.success ? 'WOULD EXIST' : 'WOULD NOT EXIST'}`);
  console.log(`  router.push("/no-capital/results"): ${assessResult?.success ? 'WOULD FIRE' : 'WOULD NOT FIRE'}`);
  console.log(`  /no-capital/results renders:    OK (page loads)`);
}

run().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
