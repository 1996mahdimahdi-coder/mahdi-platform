import assert from "node:assert/strict";
import {
  emptyPaidStudyDraft,
  validateStudy,
  draftSafetyError,
  shouldRedactStudy,
} from "@/lib/noCapital/studyValidation";
import type { PaidStudy } from "@/lib/noCapital/types";

const t = (name: string, fn: () => void) => {
  try {
    fn();
    console.log(`  ok - ${name}`);
  } catch (err) {
    console.error(`  FAIL - ${name}`);
    throw err;
  }
};

let passed = 0;
const total = () => {
  passed += 1;
};
const summarize = () => console.log(`\n${passed} checks passed.`);

function validStudy(): PaidStudy {
  const draft = emptyPaidStudyDraft();
  return {
    ...draft,
    summary: { overview: "دراسة احترافية لكتابة المحتوى" },
    idealClients: [{ persona: "شركة ناشئة", orgType: "startup", platform: "Instagram", notes: "" }],
    skills: { minimum: ["كتابة"], advanced: ["SEO"] },
    equipment: [{ item: "حاسوب", tier: "pro", purpose: "", sourceStatus: "VERIFIED" }],
    pricing: [{ model: "per_project", globalMinUsd: 50, globalMaxUsd: 500, dzSuggestedDzd: 5000, source: "", note: "", dzPriceStatus: "NEEDS_VALIDATION" }],
    profitModel: { priceAnchor: "5000", hoursPerUnit: 4, grossPerHour: 1250, breakEvenUnits: 2, notes: "" },
    businessModel: { offerModel: "حزمة", valueProposition: "", repeatClientStrategy: "" },
    firstClientAcquisition: [{ channel: "LinkedIn", difficulty: "medium", outreachTargetCount: 3, messageScript: "", followUpScript: "" }],
    workflow: [{ stage: "استقبال الطلب", deliverable: "", detail: "استلام تفاصيل المشروع" }],
    marketCompetition: [{ segment: "كتّاب", intensity: "high", positioning: "", notes: "" }],
    commonMistakes: [{ mistake: "سعر منخفض جداً", prevention: "" }],
    redFlags: [{ flag: "عدم دفع مقدّم", why: "", protection: "" }],
    marketing: { channels: ["Instagram"], contentTypes: ["Reels"], kpis: ["مشاهدات"], cta: "" },
    plan30Days: [{ week: 1, tasks: ["تجهيز محفظة"], outreach: [], content: [], kpis: [] }],
    growthPath: [{ from: "مبتدئ", to: "متوسط", tactic: "تسعير أعلى" }],
    legalDz: { autoEntrepreneur: "", ifu: "", casnos: "", tva: "", crypto: "", notes: "", needsValidation: true },
    caseStudy: { scenario: "عميل طلب 5 مقالات", inputs: [], outcome: "", isSample: true },
    sources: [{ title: "مصدر", sourceType: "REFERENCE", url: "", notes: "" }],
    meta: { paidValueScore: 8, lastVerified: "", researchVersion: "" },
  };
}

console.log("validateStudy — valid study:");
t("valid study yields zero errors", () => {
  assert.deepEqual(validateStudy(validStudy()), []);
});

console.log("validateStudy — invalid cases:");
t("rejects bad status", () => {
  const s = validStudy();
  (s as { status: string }).status = "published";
  assert.ok(validateStudy(s).some((e) => e.includes("status")));
});

t("rejects week out of range", () => {
  const s = validStudy();
  s.plan30Days[0]!.week = 5 as never;
  assert.ok(validateStudy(s).some((e) => e.includes("week")));
});

t("rejects paidValueScore out of 0-10", () => {
  const s = validStudy();
  s.meta = { ...s.meta, paidValueScore: 11 };
  assert.ok(validateStudy(s).some((e) => e.includes("paidValueScore")));
});

t("rejects bad pricing model", () => {
  const s = validStudy();
  s.pricing[0]!.model = "hourly" as never;
  assert.ok(validateStudy(s).some((e) => e.includes("model")));
});

t("rejects bad source status", () => {
  const s = validStudy();
  s.equipment[0]!.sourceStatus = "MADE_UP" as never;
  assert.ok(validateStudy(s).some((e) => e.includes("sourceStatus")));
});

t("rejects bad equipment tier", () => {
  const s = validStudy();
  s.equipment[0]!.tier = "gold" as never;
  assert.ok(validateStudy(s).some((e) => e.includes("tier")));
});

t("rejects missing legalDz.needsValidation boolean", () => {
  const s = validStudy();
  (s.legalDz as { needsValidation: unknown }).needsValidation = "yes" as never;
  assert.ok(validateStudy(s).some((e) => e.includes("needsValidation")));
});

t("rejects caseStudy.isSample !== true", () => {
  const s = validStudy();
  s.caseStudy = { ...s.caseStudy, isSample: false as unknown as true };
  assert.ok(validateStudy(s).some((e) => e.includes("isSample")));
});

t("rejects negative number", () => {
  const s = validStudy();
  s.profitModel.breakEvenUnits = -1;
  assert.ok(validateStudy(s).some((e) => e.includes("breakEvenUnits")));
});

t("rejects non-object study", () => {
  assert.ok(validateStudy(null).length > 0);
});

t("emptyPaidStudyDraft passes validation", () => {
  assert.deepEqual(validateStudy(emptyPaidStudyDraft()), []);
});

console.log("draft safety:");
t("draftSafetyError blocks non-approved", () => {
  assert.notEqual(draftSafetyError(emptyPaidStudyDraft()), null);
});

t("draftSafetyError allows approved", () => {
  const s = validStudy();
  s.status = "approved";
  assert.equal(draftSafetyError(s), null);
});

t("draftSafetyError allows null (no study)", () => {
  assert.equal(draftSafetyError(null), null);
});

t("shouldRedactStudy redacts non-approved", () => {
  assert.equal(shouldRedactStudy(validStudy()), true);
});

t("shouldRedactStudy does not redact approved", () => {
  const s = validStudy();
  s.status = "approved";
  assert.equal(shouldRedactStudy(s), false);
});

t("shouldRedactStudy false when no study", () => {
  assert.equal(shouldRedactStudy(null), false);
});

summarize();