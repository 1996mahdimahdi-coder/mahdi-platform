// ============================================================================
// Capital-study migration integration + public-protection regression tests.
//
// Covers the Phase M pipeline for classic (capital) projects:
//   * backfill transform      -> buildCapitalPaidStudyDraft
//   * optional extended fields -> validateStudy (acceptance + rejection)
//   * public API sanitizers    -> publicProjectShape / stripPaidFields /
//                                 projectForResponse / isAdminView
//   * discoverability          -> 19/19 sections, no invented content
//   * buyer-facing assets      -> free PDF / results page / paid PDF guards
//   * sales metadata           -> getStudySaleInfo / buildStudyPurchaseUrl
//
// Run: npx tsx src/lib/noCapital/capitalStudyIntegration.test.ts
// ============================================================================

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  buildCapitalPaidStudyDraft,
  hasAllStudySections,
  validateCapitalStudyDraft,
  type LegacyProjectStudySource,
} from "@/lib/noCapital/capitalStudyBackfill";
import {
  emptyPaidStudyDraft,
  validateStudy,
  draftSafetyError,
} from "@/lib/noCapital/studyValidation";
import { buildStudyPdfBytes } from "@/lib/noCapital/studyPdf";
import {
  PAID_STUDY_PRICE_DZD,
  PAID_STUDY_SALES_ENABLED,
  PAID_STUDY_TELEGRAM_HANDLE,
  getStudySaleInfo,
  buildStudyPurchaseUrl,
} from "@/lib/noCapital/studySales";
import {
  publicProjectShape,
  stripPaidFields,
  projectForResponse,
  isAdminView,
} from "@/lib/projectPublicSanitizer";
import type { PaidStudy } from "@/lib/noCapital/types";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "../../..");

const t = (name: string, fn: () => void | Promise<void>) => {
  try {
    const r = fn();
    if (r instanceof Promise) {
      return r.then(
        () => console.log(`  ok - ${name}`),
        (e) => {
          console.error(`  FAIL - ${name}`);
          throw e;
        }
      );
    }
    console.log(`  ok - ${name}`);
  } catch (e) {
    console.error(`  FAIL - ${name}`);
    throw e;
  }
};

let finished = Promise.resolve();

const run = (name: string, fn: () => void | Promise<void>) => {
  finished = finished.then(() => {
    const outcome = t(name, fn);
    return outcome instanceof Promise ? outcome : Promise.resolve();
  });
};

function legacyProject(overrides: Partial<LegacyProjectStudySource> = {}): LegacyProjectStudySource {
  return {
    projectId: "le-01",
    projectName: "مقهى عائلي",
    description: "مقهى صغير في حي سكني.",
    minCapital: 500000,
    recommendedCapital: 1200000,
    maxCapital: 2500000,
    skillsRequired: ["إدارة", "حساب"],
    equipment: [
      { item: "آلة قهوة", cost: 450000 },
      { item: "طاولات", cost: 120000 },
    ],
    pricingMethod: "هامش ربح ثابت",
    profitFormula: "الإيرادات - التكاليف",
    breakEvenFormula: "التكاليف الثابتة / هامش الوحدة",
    risks: ["المنافسة في العطلة", "ارتفاع الكراء"],
    advantages: ["موقع حيوي", "طلب دائم"],
    disadvantages: ["تحتاج تأهيلاً", "موسمية صباحية"],
    launchPlan: [
      { week: "الأسبوع 1", title: "دراسة السوق", tasks: ["حصر المنافسين"] },
      { week: "الأسبوع 2", title: "التجهيز", tasks: ["شراء المعدات"] },
      { week: "الأسبوع 3", title: "التوظيف", tasks: ["تجنيد عاملين"] },
      { week: "الأسبوع 4", title: "الافتتاح", tasks: ["افتتاح تجريبي"] },
    ],
    legalNotes: "يلزم سجل تجاري وصحيفة نظيفة.",
    competitionLevel: "مرتفعة",
    targetArea: "حي وسط المدينة",
    source: "دراسة ميدانية وسوق جزائري 2025",
    ...overrides,
  };
}

function approvedStudy(): PaidStudy {
  const draft = buildCapitalPaidStudyDraft(legacyProject());
  const s: PaidStudy = { ...draft, status: "approved" };
  return s;
}

async function main() {
  finished = Promise.resolve();

  console.log("Backfill transform — buildCapitalPaidStudyDraft:");
  run("produces a structurally valid draft (validateStudy == [], 19/19 sections)", () => {
    const s = buildCapitalPaidStudyDraft(legacyProject());
    assert.deepEqual(validateCapitalStudyDraft(s), []);
    assert.equal(hasAllStudySections(s), true);
  });
  run("starts as draft with meta.studyKind = capital", () => {
    const s = buildCapitalPaidStudyDraft(legacyProject());
    assert.equal(s.status, "draft");
    assert.equal(s.meta.studyKind, "capital");
  });
  run("maps launchPlan -> plan30Days (first 4 weeks, tasks preserved)", () => {
    const s = buildCapitalPaidStudyDraft(legacyProject());
    assert.equal(s.plan30Days.length, 4);
    assert.deepEqual(s.plan30Days[0].tasks, ["دراسة السوق", "حصر المنافسين"]);
    assert.deepEqual(s.plan30Days.map((w) => w.week), [1, 2, 3, 4]);
  });
  run("maps risks -> redFlags", () => {
    const s = buildCapitalPaidStudyDraft(legacyProject());
    assert.deepEqual(s.redFlags.map((r) => r.flag), ["المنافسة في العطلة", "ارتفاع الكراء"]);
  });
  run("maps disadvantages -> commonMistakes", () => {
    const s = buildCapitalPaidStudyDraft(legacyProject());
    assert.deepEqual(s.commonMistakes.map((m) => m.mistake), ["تحتاج تأهيلاً", "موسمية صباحية"]);
  });
  run("maps advantages -> strengths (no invented content)", () => {
    const s = buildCapitalPaidStudyDraft(legacyProject());
    assert.deepEqual(s.strengths, ["موقع حيوي", "طلب دائم"]);
    assert.equal(s.marketTestPlan, undefined);
  });
  run("maps legalNotes -> legalDz.notes with needsValidation=true", () => {
    const s = buildCapitalPaidStudyDraft(legacyProject());
    assert.equal(s.legalDz.needsValidation, true);
    assert.equal(s.legalDz.notes, "يلزم سجل تجاري وصحيفة نظيفة.");
  });
  run("maps min/rec/max capital -> startupCapital", () => {
    const s = buildCapitalPaidStudyDraft(legacyProject());
    assert.deepEqual(s.startupCapital, { min: 500000, recommended: 1200000, max: 2500000 });
  });
  run("maps pricingMethod into pricing as package note, defaults skip when empty", () => {
    const s = buildCapitalPaidStudyDraft(legacyProject());
    assert.equal(s.pricing[0].model, "package");
    assert.equal(s.pricing[0].note, "هامش ربح ثابت");
    const empty = buildCapitalPaidStudyDraft({ ...legacyProject(), pricingMethod: null });
    assert.deepEqual(empty.pricing, []);
  });
  run("maps profitFormula + breakEvenFormula -> profitModel.notes", () => {
    const s = buildCapitalPaidStudyDraft(legacyProject());
    assert.equal(s.profitModel.notes?.includes("إيرادات") || s.profitModel.notes?.includes("الأيرادات"), true);
    assert.equal(s.profitModel.notes?.includes("نقطة التعادل"), true);
  });
  run("maps competitionLevel -> marketCompetition intensity/notes", () => {
    const s = buildCapitalPaidStudyDraft(legacyProject());
    assert.equal(s.marketCompetition[0].intensity, "high");
    assert.equal(s.marketCompetition[0].notes, "مرتفعة");
  });
  run("maps targetArea -> idealClients persona", () => {
    const s = buildCapitalPaidStudyDraft(legacyProject());
    assert.equal(s.idealClients[0].persona, "حي وسط المدينة");
  });
  run("maps equipment with cost into StudyEquipment.cost", () => {
    const s = buildCapitalPaidStudyDraft(legacyProject());
    assert.deepEqual(
      s.equipment.map((e) => ({ item: e.item, cost: e.cost })),
      [
        { item: "آلة قهوة", cost: 450000 },
        { item: "طاولات", cost: 120000 },
      ]
    );
  });
  run("sources populated from source when present, empty otherwise", () => {
    const s = buildCapitalPaidStudyDraft(legacyProject());
    assert.equal(s.sources.length, 1);
    assert.equal(s.sources[0].title, "دراسة ميدانية وسوق جزائري 2025");
    const empty = buildCapitalPaidStudyDraft({ ...legacyProject(), source: null });
    assert.deepEqual(empty.sources, []);
  });
  run("missing competition/targetArea degrade to empty arrays (no invention)", () => {
    const s = buildCapitalPaidStudyDraft({ ...legacyProject(), competitionLevel: null, targetArea: null });
    assert.deepEqual(s.marketCompetition, []);
    assert.deepEqual(s.idealClients, []);
  });

  console.log("validateStudy — optional capital extensions:");
  run("accepts startupCapital/strengths/marketTestPlan/equipment.cost/studyKind=capital", () => {
    const s = emptyPaidStudyDraft();
    Object.assign(s, {
      startupCapital: { min: 100, recommended: 200, max: 400 },
      strengths: ["ثقة السوق"],
      marketTestPlan: { steps: ["خطوة"], channels: ["Watsap"], kpis: ["مبيعات"] },
      meta: { ...s.meta, studyKind: "capital" as const },
    });
    s.equipment.push({ item: "حاسوب", tier: "pro", sourceStatus: "VERIFIED", cost: 1500 });
    assert.deepEqual(validateStudy(s), []);
  });
  run("still accepts a classic no-capital study without the new fields", () => {
    // The no-capital draft must keep validating unchanged.
    assert.deepEqual(validateStudy(emptyPaidStudyDraft()), []);
  });
  run("rejects malformed startupCapital", () => {
    const s = emptyPaidStudyDraft();
    (s as Record<string, unknown>).startupCapital = { min: "x", recommended: 200, max: null };
    assert.notEqual(validateStudy(s).length, 0);
  });
  run("rejects unknown studyKind", () => {
    const s = emptyPaidStudyDraft();
    (s.meta as Record<string, unknown>).studyKind = "superstudy";
    assert.notEqual(validateStudy(s).length, 0);
  });
  run("rejects negative equipment cost", () => {
    const s = emptyPaidStudyDraft();
    s.equipment.push({ item: "حاسوب", tier: "pro", sourceStatus: "VERIFIED", cost: -5 });
    assert.notEqual(validateStudy(s).length, 0);
  });
  run("rejects malformed marketTestPlan (non-array steps)", () => {
    const s = emptyPaidStudyDraft();
    (s as Record<string, unknown>).marketTestPlan = { steps: "خطوة" };
    assert.notEqual(validateStudy(s).length, 0);
  });

  console.log("Public protection — sanitizers:");
  const row = {
    id: 1,
    projectId: "le-01",
    projectName: "مقهى",
    category: "مطاعم",
    description: "مقهى عائلي.",
    minCapital: 500000,
    recommendedCapital: 1200000,
    maxCapital: 2500000,
    riskLevel: "متوسط",
    homeBased: false,
    onlinePossible: false,
    transportRequired: false,
    skillsRequired: ["إدارة"],
    timeRequired: "دوام كامل",
    difficulty: "متوسط",
    scalability: "متوسطة",
    seasonality: "طوال السنة",
    workLocation: "محل",
    skillLevel: "متوسطة",
    legalStatus: "سجل تجاري",
    initialStock: 20000,
    fixedCosts: 3000,
    variableCostsPercent: 10,
    source: "دراسة ميدانية",
    lastUpdated: new Date(),
    advantages: ["موقع حيوي"],
    risks: ["منافسة"],
    disadvantages: ["تأهيل"],
    launchPlan: [],
    legalNotes: "سجل تجاري",
    equipment: [],
    pricingMethod: "هامش",
    profitFormula: "-",
    breakEvenFormula: "-",
    competitionLevel: "مرتفعة",
    targetArea: "الوسط",
    study: { status: "draft" },
  };
  run("publicProjectShape strips every paid/advisory field", () => {
    const p = publicProjectShape(row);
    const banned = [
      "recommendedCapital",
      "maxCapital",
      "competitionLevel",
      "targetArea",
      "equipment",
      "pricingMethod",
      "profitFormula",
      "breakEvenFormula",
      "risks",
      "advantages",
      "disadvantages",
      "launchPlan",
      "legalNotes",
      "study",
    ];
    for (const key of banned) {
      assert.equal(key in p, false, `paid field leaked: ${key}`);
    }
  });
  run("publicProjectShape keeps free fields (minCapital, description, etc.)", () => {
    const p = publicProjectShape(row);
    assert.equal(p.minCapital, 500000);
    assert.equal(p.description, "مقهى عائلي.");
    assert.equal(p.projectName, "مقهى");
    assert.equal(p.riskLevel, "متوسط");
  });
  run("stripPaidFields removes paid keys from arbitrary objects", () => {
    const out = stripPaidFields({ recommendedCapital: 10, fixedCosts: 5, study: {}, description: "x" });
    assert.equal("recommendedCapital" in out, false);
    assert.equal("study" in out, false);
    assert.equal(out.fixedCosts, 5);
    assert.equal(out.description, "x");
  });
  run("projectForResponse returns sanitized shape for anonymous visitors", () => {
    const p = projectForResponse(row, null);
    assert.equal("recommendedCapital" in p, false);
    assert.equal("advantages" in p, false);
  });
  run("projectForResponse returns the full row for admins", () => {
    const session = {
      version: 1 as const,
      userId: 1,
      role: "admin",
      tokenVersion: 0,
      issuedAt: Date.now(),
      expiresAt: Date.now() + 60 * 60 * 24 * 1000,
    };
    const p = projectForResponse(row, session) as unknown as { recommendedCapital: number; study?: { status: string } };
    assert.equal(p.recommendedCapital, 1200000);
    assert.equal(p.study?.status, "draft");
  });
  run("isAdminView only for admins", () => {
    assert.equal(isAdminView(null), false);
    assert.equal(isAdminView({ version: 1, userId: 1, role: "user", tokenVersion: 0, issuedAt: 0, expiresAt: 1 }), false);
    assert.equal(isAdminView({ version: 1, userId: 1, role: "admin", tokenVersion: 0, issuedAt: 0, expiresAt: 1 }), true);
  });

  console.log("Public routes — no paid-field leakage in responses:");
  run("api/projects/[id]/route.ts uses projectForResponse", async () => {
    const src = await readFile(join(repoRoot, "src", "app", "api", "projects", "[id]", "route.ts"), "utf8");
    assert.match(src, /projectForResponse/);
    assert.doesNotMatch(src, /return NextResponse\.json\(\{ success: true, project \}\)/);
  });
  run("api/projects/route.ts (list) sanitizes GET payloads", async () => {
    const src = await readFile(join(repoRoot, "src", "app", "api", "projects", "route.ts"), "utf8");
    assert.match(src, /publicProjectShape|isAdminView/);
  });
  run("api/assess/route.ts top5Results mapping excludes recommended/max capital", async () => {
    const src = await readFile(join(repoRoot, "src", "app", "api", "assess", "route.ts"), "utf8");
    const start = src.indexOf("top5Results:");
    const end = src.indexOf("explanationText,", start);
    assert.ok(start !== -1, "top5Results: not found");
    assert.ok(end !== -1, "top5Results block end not found");
    const block = src.slice(start, end);
    assert.match(block, /top5\.map/);
    assert.doesNotMatch(block, /recommendedCapital/);
    assert.doesNotMatch(block, /maxCapital/);
  });

  console.log("Free PDF + results page — no paid fields:");
  run("ProjectPdfData interface no longer declares paid fields", async () => {
    const src = await readFile(join(repoRoot, "src", "lib", "pdfExport.ts"), "utf8");
    const start = src.indexOf("export interface ProjectPdfData");
    const end = src.indexOf("export interface ResultsPdfData", start);
    const block = src.slice(start, end);
    for (const k of ["recommendedCapital", "maxCapital", "competitionLevel", "targetArea", "advantages", "risks", "launchPlan"]) {
      assert.doesNotMatch(block, new RegExp(`\\b${k}\\b`));
    }
  });
  run("ResultsPdfData no longer carries recommendedCapital", async () => {
    const src = await readFile(join(repoRoot, "src", "lib", "pdfExport.ts"), "utf8");
    assert.doesNotMatch(src, /recommendedCapital/);
  });
  run("free projects/[id] page no longer renders paid content from the API", async () => {
    const src = await readFile(join(repoRoot, "src", "app", "projects", "[id]", "page.tsx"), "utf8");
    for (const needle of ["project.recommendedCapital", "project.maxCapital", "project.advantages", "project.risks", "project.launchPlan", "project.legalNotes", "project.competitionLevel", "project.targetArea"]) {
      assert.doesNotMatch(src, new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    }
  });
  run("results page no longer renders or forwards recommendedCapital", async () => {
    const src = await readFile(join(repoRoot, "src", "app", "results", "page.tsx"), "utf8");
    assert.doesNotMatch(src, /recommendedCapital/);
    assert.doesNotMatch(src, /رأس المال الموصى به/);
  });

  console.log("Paid PDF — draft safety + buyer-facing meta:");
  run("buildStudyPdfBytes refuses draft studies", async () => {
    const draft = buildCapitalPaidStudyDraft(legacyProject());
    assert.equal(validateStudy(draft).length, 0);
    assert.ok(draftSafetyError(draft));
    await assert.rejects(buildStudyPdfBytes(draft, { slug: "le-01" }));
  });
  run("buildStudyPdfBytes refuses review studies", async () => {
    const review: PaidStudy = { ...approvedStudy(), status: "review" };
    await assert.rejects(buildStudyPdfBytes(review, { slug: "le-01" }));
  });
  run("buildStudyPdfBytes builds bytes for an approved capital study", async () => {
    const ok = await buildStudyPdfBytes(approvedStudy(), { slug: "le-01", projectNameAr: "مقهى عائلي" });
    assert.ok(ok instanceof Uint8Array);
    assert.ok(ok.byteLength > 1000);
  });
  run("buyer PDF never renders the internal paidValueScore score", async () => {
    const src = await readFile(join(repoRoot, "src", "lib", "noCapital", "studyPdf.ts"), "utf8");
    assert.doesNotMatch(src, /قيمة المحتوى \(من 10\)/);
  });

  console.log("Sales metadata — 490 DZD / Telegram NABDA2026:");
  run("getStudySaleInfo handles capital approved/draft and kill-switch", () => {
    const approved = getStudySaleInfo(approvedStudy());
    assert.equal(approved.hasPaidStudy, true);
    assert.equal(approved.studyAvailable, PAID_STUDY_SALES_ENABLED);
    assert.equal(approved.studyAvailable, false); // kill-switch PAID_STUDY_SALES_ENABLED = false
    assert.equal(approved.priceDzd, PAID_STUDY_PRICE_DZD);

    const draftInfo = getStudySaleInfo(buildCapitalPaidStudyDraft(legacyProject()));
    assert.equal(draftInfo.hasPaidStudy, true);
    assert.equal(draftInfo.studyAvailable, false);

    const none = getStudySaleInfo(null);
    assert.equal(none.hasPaidStudy, false);
    assert.equal(none.studyAvailable, false);
    assert.equal(none.priceDzd, PAID_STUDY_PRICE_DZD);
  });
  run("buildStudyPurchaseUrl points at Telegram NABDA2026 with the 490 price", () => {
    const url = buildStudyPurchaseUrl("مقهى عائلي", "le-01");
    assert.ok(url.startsWith(`https://t.me/${PAID_STUDY_TELEGRAM_HANDLE}?text=`));
    assert.ok(decodeURIComponent(url).includes("490 دج"));
    assert.ok(decodeURIComponent(url).includes("مقهى عائلي"));
    assert.ok(decodeURIComponent(url).includes("le-01"));
  });

  await finished;
  console.log("\nAll capital-study integration checks passed.");
}

main().then(
  () => process.exit(0),
  (e) => {
    console.error(e);
    process.exit(1);
  }
);