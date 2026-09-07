import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  evaluateProjectScoreV2,
  classifyV2Score,
  rankProjectsV2,
  V2_WEIGHTS,
  V2_WEIGHT_SUM,
  type UserAssessmentInput,
  type ProjectData,
} from "./scoringEngine";

const baseProject = (): ProjectData => ({
  id: 1,
  projectId: "t1",
  projectName: "مشروع اختبار",
  category: "خدمات",
  description: "للاختبار",
  minCapital: 40000,
  recommendedCapital: 100000,
  maxCapital: 200000,
  riskLevel: "منخفض",
  requiresShop: false,
  homeBased: true,
  onlinePossible: true,
  transportRequired: false,
  skillsRequired: ["البيع"],
  timeRequired: "دوام جزئي",
  difficulty: "متوسط",
  scalability: "مرتفعة",
  seasonality: "طوال السنة",
  competitionLevel: "منخفضة جداً",
  targetArea: "جميع المناطق",
  equipment: [],
  initialStock: 10000,
  fixedCosts: 0,
  variableCostsPercent: 20,
  pricingMethod: "هامش",
  profitFormula: "ث",
  breakEvenFormula: "ث",
  risks: [],
  advantages: [],
  disadvantages: [],
  launchPlan: [],
  skillLevel: "بدون مهارة",
  legalStatus: "غير مقنن",
});

const baseUser = (): UserAssessmentInput => ({
  capital: 120000,
  workspace: "من المنزل",
  availableHours: "دوام كامل",
  skills: ["البيع"],
  riskLevel: "منخفض",
  transport: "سيارة",
  objective: "مشروع رئيسي",
});

describe("V2 weights", () => {
  it("weights sum to exactly 100", () => {
    assert.equal(V2_WEIGHT_SUM, 100);
    const fin = V2_WEIGHTS.financial;
    assert.equal(fin.capitalFit + fin.fixedCost + fin.variableCost, fin.total);
  });
});

describe("classifyV2Score boundaries", () => {
  it("maps 0 → مخاطرة مرتفعة", () => assert.equal(classifyV2Score(0), "مخاطرة مرتفعة"));
  it("maps 49 → مخاطرة مرتفعة", () => assert.equal(classifyV2Score(49), "مخاطرة مرتفعة"));
  it("maps 50 → يحتاج دراسة", () => assert.equal(classifyV2Score(50), "يحتاج دراسة"));
  it("maps 59 → يحتاج دراسة", () => assert.equal(classifyV2Score(59), "يحتاج دراسة"));
  it("maps 60 → متوسط", () => assert.equal(classifyV2Score(60), "متوسط"));
  it("maps 69 → متوسط", () => assert.equal(classifyV2Score(69), "متوسط"));
  it("maps 70 → جيد", () => assert.equal(classifyV2Score(70), "جيد"));
  it("maps 79 → جيد", () => assert.equal(classifyV2Score(79), "جيد"));
  it("maps 80 → قوي", () => assert.equal(classifyV2Score(80), "قوي"));
  it("maps 89 → قوي", () => assert.equal(classifyV2Score(89), "قوي"));
  it("maps 90 → ممتاز", () => assert.equal(classifyV2Score(90), "ممتاز"));
  it("maps 100 → ممتاز", () => assert.equal(classifyV2Score(100), "ممتاز"));
  it("clamps out-of-range inputs", () => {
    assert.equal(classifyV2Score(-5), "مخاطرة مرتفعة");
    assert.equal(classifyV2Score(5000), "ممتاز");
  });
});

describe("evaluateProjectScoreV2 — perfect alignment hits 100", () => {
  it("full data + perfect match → totalScore 100 ممتاز", () => {
    const r = evaluateProjectScoreV2(baseUser(), baseProject());
    assert.equal(r.totalScore, 100);
    assert.equal(r.recommendation, "ممتاز");
    assert.equal(r.financialScore, 30);
  });
});

describe("financial — capital fit", () => {
  it("capital below min → capitalFit sub-score strictly less than 8 (0.5·min point)", () => {
    const u = { ...baseUser(), capital: 20000 };
    const r = evaluateProjectScoreV2(u, baseProject());
    assert.ok(
      r.dimensionBreakdown.financial.capitalFit.score < 8,
      `got ${r.dimensionBreakdown.financial.capitalFit.score}`
    );
  });

  it("capital == min → capitalFit sub-score 8", () => {
    const u = { ...baseUser(), capital: 40000 };
    const r = evaluateProjectScoreV2(u, baseProject());
    assert.equal(r.dimensionBreakdown.financial.capitalFit.score, 8);
  });

  it("capital == recommended → capitalFit sub-score 16", () => {
    const u = { ...baseUser(), capital: 100000 };
    const r = evaluateProjectScoreV2(u, baseProject());
    assert.equal(r.dimensionBreakdown.financial.capitalFit.score, 16);
  });

  it("capital at 2×recommended → still 16 (no penalty until >200%)", () => {
    const u = { ...baseUser(), capital: 200000 };
    const r = evaluateProjectScoreV2(u, baseProject());
    assert.equal(r.dimensionBreakdown.financial.capitalFit.score, 16);
  });

  it("capital above 2×recommended → penalized below 16 but never below floor", () => {
    const u = { ...baseUser(), capital: 1000000 };
    const r = evaluateProjectScoreV2(u, baseProject());
    const sub = r.dimensionBreakdown.financial.capitalFit.score;
    assert.ok(sub < 16, `expected < 16, got ${sub}`);
    assert.ok(sub >= 13, `expected >= floor 13, got ${sub}`);
  });

  it("capital monotonic non-decreasing from 0 → 2×recommended", () => {
    const project = baseProject();
    let prev = -1;
    for (const cap of [20000, 40000, 60000, 100000, 150000, 200000]) {
      const r = evaluateProjectScoreV2({ ...baseUser(), capital: cap }, project);
      const sub = r.dimensionBreakdown.financial.capitalFit.score;
      assert.ok(sub >= prev, `capital ${cap} broke monotonicity: ${prev} -> ${sub}`);
      prev = sub;
    }
  });
});

describe("financial — fixed & variable cost monotonicity", () => {
  it("higher fixedCosts never increase fixedCost sub-score", () => {
    const project = baseProject();
    let prev = 9;
    for (const f of [0, 10000, 20000, 50000]) {
      const r = evaluateProjectScoreV2(baseUser(), { ...project, fixedCosts: f });
      const sub = r.dimensionBreakdown.financial.fixedCost.score;
      assert.ok(sub <= prev, `fixedCosts ${f}: ${prev} -> ${sub}`);
      prev = sub;
    }
  });

  it("higher variableCostsPercent never increase variableCost sub-score", () => {
    const project = baseProject();
    let prev = 7;
    for (const v of [20, 35, 50, 80]) {
      const r = evaluateProjectScoreV2(baseUser(), { ...project, variableCostsPercent: v });
      const sub = r.dimensionBreakdown.financial.variableCost.score;
      assert.ok(sub <= prev, `variableCosts ${v}: ${prev} -> ${sub}`);
      prev = sub;
    }
  });
});

describe("risk — tolerance never boosts a risky project", () => {
  const highRiskProject = (): ProjectData => ({ ...baseProject(), riskLevel: "مرتفع" });

  it("high-risk project stays capped at 4 on projectRisk (8×0.5) for any user risk", () => {
    for (const riskLevel of ["منخفض", "متوسط", "مرتفع"]) {
      const r = evaluateProjectScoreV2({ ...baseUser(), riskLevel }, highRiskProject());
      assert.equal(r.dimensionBreakdown.risk.projectRisk.score, 4);
    }
  });

  it("higher user risk never raises total risk dimension on the same project", () => {
    const project = highRiskProject();
    const scores = [];
    for (const riskLevel of ["منخفض", "متوسط", "مرتفع"]) {
      const r = evaluateProjectScoreV2({ ...baseUser(), riskLevel }, project);
      scores.push(r.riskScore);
    }
    const [low, mid, high] = scores;
    assert.ok(high <= mid && mid <= low, `got ${scores.join(",")}`);
  });

  it("low-risk project + high-risk user is penalized (not rewarded)", () => {
    const low = evaluateProjectScoreV2({ ...baseUser(), riskLevel: "منخفض" }, baseProject());
    const high = evaluateProjectScoreV2({ ...baseUser(), riskLevel: "مرتفع" }, baseProject());
    assert.ok(
      high.riskScore < low.riskScore,
      `expected reduction, got ${low.riskScore} vs ${high.riskScore}`
    );
  });
});

describe("skills — canonical exact matching, no substring false-positives", () => {
  it("alias cross-match works (المبيعات ↔ بيع)", () => {
    const u = { ...baseUser(), skills: ["المبيعات"] };
    const r = evaluateProjectScoreV2(u, baseProject());
    assert.equal(r.dimensionBreakdown.personal.skills.score, 7);
  });

  it("wrong skill never false-positives via substring", () => {
    const project = { ...baseProject(), skillsRequired: ["التصميم"] };
    const u = { ...baseUser(), skills: ["الزراعة"] };
    const r = evaluateProjectScoreV2(u, project);
    assert.equal(r.dimensionBreakdown.personal.skills.score, 0);
  });

  it("partial coverage → proportional score", () => {
    const project = { ...baseProject(), skillsRequired: ["البيع", "التسويق", "التصميم"] };
    const u = { ...baseUser(), skills: ["البيع"] };
    const r = evaluateProjectScoreV2(u, project);
    assert.ok(
      r.dimensionBreakdown.personal.skills.score < 7,
      `expected partial, got ${r.dimensionBreakdown.personal.skills.score}`
    );
  });

  it("no skills listed on project → skills scores full marks", () => {
    const project = { ...baseProject(), skillsRequired: [] };
    const r = evaluateProjectScoreV2(baseUser(), project);
    assert.equal(r.dimensionBreakdown.personal.skills.score, 7);
  });
});

describe("missing data — never full marks, confidence reflects gaps", () => {
  it("missing variableCostsPercent caps financial below 30 while still confidence high", () => {
    const project = { ...baseProject(), variableCostsPercent: null as unknown as number };
    const r = evaluateProjectScoreV2(baseUser(), project);
    assert.ok(r.financialScore < 30, `got ${r.financialScore}`);
    assert.ok(r.confidenceValue < 1, "confidence should drop below 1");
    assert.equal(r.confidence, "high");
  });

  it("many missing fields → confidence drops below 0.92", () => {
    const project = {
      ...baseProject(),
      minCapital: null as unknown as number,
      recommendedCapital: null as unknown as number,
      fixedCosts: null as unknown as number,
      variableCostsPercent: null as unknown as number,
      seasonality: "",
      competitionLevel: "",
      scalability: "",
      targetArea: "",
    };
    const r = evaluateProjectScoreV2(baseUser(), project);
    assert.ok(["high", "medium", "low"].includes(r.confidence));
    assert.ok(r.confidenceValue < 0.92, `got ${r.confidenceValue}`);
  });

  it("fully present data → high confidence", () => {
    const r = evaluateProjectScoreV2(baseUser(), baseProject());
    assert.equal(r.confidence, "high");
    assert.ok(r.confidenceValue >= 0.85);
  });

  it("confidence value never exceeds 1", () => {
    const r = evaluateProjectScoreV2(baseUser(), baseProject());
    assert.ok(r.confidenceValue <= 1);
  });
});

describe("workspace — exact fit gives full 7, mismatch penalizes", () => {
  it("home-based + من المنزل → 7", () => {
    const r = evaluateProjectScoreV2(baseUser(), baseProject());
    assert.equal(r.dimensionBreakdown.execution.workspace.score, 7);
  });

  it("requiresShop project + من المنزل → hard mismatch 0.4 → 2", () => {
    const project = { ...baseProject(), requiresShop: true, homeBased: false, onlinePossible: false };
    const u = { ...baseUser(), workspace: "من المنزل" };
    const r = evaluateProjectScoreV2(u, project);
    assert.ok(
      r.dimensionBreakdown.execution.workspace.score <= 3,
      `got ${r.dimensionBreakdown.execution.workspace.score}`
    );
  });

  it("shop project + محل أملكه → 7", () => {
    const project = { ...baseProject(), requiresShop: true, homeBased: false, onlinePossible: false };
    const u = { ...baseUser(), workspace: "محل أملكه" };
    const r = evaluateProjectScoreV2(u, project);
    assert.equal(r.dimensionBreakdown.execution.workspace.score, 7);
  });

  it("transportRequired + no vehicle → limited penalty floor 0.3", () => {
    const project = {
      ...baseProject(),
      homeBased: false,
      onlinePossible: false,
      transportRequired: true,
    };
    const u = { ...baseUser(), workspace: "متنقل", transport: "لا أملك وسيلة نقل" };
    const r = evaluateProjectScoreV2(u, project);
    assert.ok(r.dimensionBreakdown.execution.workspace.score >= 2);
  });
});

describe("hours — full-time projects demand full-time availability", () => {
  it("full-time project + دوام كامل → 8", () => {
    const project = { ...baseProject(), timeRequired: "دوام كامل" };
    const r = evaluateProjectScoreV2(baseUser(), project);
    assert.equal(r.dimensionBreakdown.execution.hours.score, 8);
  });

  it("full-time project + 2–4 ساعات → proportional penalty below 8", () => {
    const project = { ...baseProject(), timeRequired: "دوام كامل" };
    const u = { ...baseUser(), availableHours: "2–4 ساعات" };
    const r = evaluateProjectScoreV2(u, project);
    assert.ok(
      r.dimensionBreakdown.execution.hours.score < 8,
      `got ${r.dimensionBreakdown.execution.hours.score}`
    );
  });

  it("part-time project + دوام كامل → full 8, no free bonus needed", () => {
    const r = evaluateProjectScoreV2(baseUser(), baseProject());
    assert.equal(r.dimensionBreakdown.execution.hours.score, 8);
  });
});

describe("total clamp & ranking", () => {
  it("totalScore always within 0..100", () => {
    const r = evaluateProjectScoreV2(
      { ...baseUser(), capital: 1e12, skills: [] },
      { ...baseProject(), competitionLevel: "مرتفعة", scalability: "منخفضة" }
    );
    assert.ok(r.totalScore >= 0 && r.totalScore <= 100, `got ${r.totalScore}`);
  });

  it("rankProjectsV2 sorts descending", () => {
    const p1 = baseProject();
    const p2 = { ...baseProject(), id: 2, projectId: "t2", projectName: "مشروع أضعف", targetArea: "بلديات صحراوية" };
    const ranked = rankProjectsV2(baseUser(), [p2, p1]);
    assert.ok(ranked[0].totalScore >= ranked[1].totalScore);
  });
});