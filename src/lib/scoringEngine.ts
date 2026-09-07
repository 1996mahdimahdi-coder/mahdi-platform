export interface UserAssessmentInput {
  capital: number;
  workspace: string; // من المنزل, محل أملكه, محل بالإيجار, أونلاين, متنقل, لا أعرف
  wilayaId?: number;
  communeId?: number;
  wilayaName?: string;
  communeName?: string;
  areaType?: string; // urban, rural, coastal, desert — fetched from wilayas table
  availableHours: string; // أقل من ساعتين يوميًا, 2–4 ساعات, 4–6 ساعات, أكثر من 6 ساعات, دوام كامل
  skills: string[];
  preferredMode?: string; // بيع منتجات, تقديم خدمات, مشروع أونلاين, مشروع محلي, مشروع من المنزل, مشروع يحتاج محل, لا أعرف
  riskLevel: string; // منخفض, متوسط, مرتفع
  transport: string; // سيارة, دراجة نارية, نقل عمومي, لا أملك وسيلة نقل
  existingIncome?: string; // نعم, لا
  objective?: string; // دخل إضافي, مشروع رئيسي, ترك الوظيفة مستقبلًا, مشروع صغير قابل للتوسع, لا أعرف
}

export interface ProjectData {
  id: number;
  projectId: string;
  projectName: string;
  category: string;
  description: string;
  minCapital: number;
  recommendedCapital: number;
  maxCapital: number;
  riskLevel: string;
  requiresShop: boolean;
  homeBased: boolean;
  onlinePossible: boolean;
  transportRequired: boolean;
  skillsRequired: string[];
  timeRequired: string;
  difficulty: string;
  scalability: string;
  seasonality: string;
  competitionLevel: string;
  targetArea: string;
  equipment: { item: string; cost: number }[];
  initialStock: number;
  fixedCosts: number;
  variableCostsPercent: number;
  pricingMethod: string;
  profitFormula: string;
  breakEvenFormula: string;
  risks: string[];
  advantages: string[];
  disadvantages: string[];
  launchPlan: { week: string; title: string; tasks: string[] }[];
  legalNotes?: string | null;
  source?: string | null;
  workLocation?: string | null;
  skillLevel?: string | null;
  legalStatus?: string | null;
}

export interface ScoringWeightsConfig {
  financialWeight: number; // 25
  personalWeight: number;  // 15
  workspaceWeight: number; // 10
  locationWeight: number;  // 15
  riskWeight: number;       // 10
  startabilityWeight: number; // 10
  scalabilityWeight: number;  // 10
  timeWeight: number;       // 5
}

export const DEFAULT_WEIGHTS: ScoringWeightsConfig = {
  financialWeight: 25,
  personalWeight: 15,
  workspaceWeight: 10,
  locationWeight: 15,
  riskWeight: 10,
  startabilityWeight: 10,
  scalabilityWeight: 10,
  timeWeight: 5,
};

export const normalizeRiskLevel = (level: string): string => {
  switch (level) {
    case "منخفض":
    case "منخفضة":
      return "منخفض";
    case "متوسط":
    case "متوسطة":
      return "متوسط";
    case "مرتفع":
    case "مرتفعة":
      return "مرتفع";
    default:
      return level;
  }
};

export interface ScoredProjectResult {
  project: ProjectData;
  totalScore: number;
  financialScore: number;
  personalScore: number;
  workspaceScore: number;
  locationScore: number;
  riskScore: number;
  startabilityScore: number;
  scalabilityScore: number;
  timeScore: number;
  recommendation: "🟢 مناسب جدًا" | "🟡 مناسب مع شروط" | "🟠 يحتاج دراسة إضافية" | "🔴 غير مناسب حاليًا";
  statusClass: string;
  reasons: string[];
}

export function evaluateProjectScore(
  user: UserAssessmentInput,
  project: ProjectData,
  weights: ScoringWeightsConfig = DEFAULT_WEIGHTS
): ScoredProjectResult {
  const reasons: string[] = [];

  // 1. Financial Score (max financialWeight e.g. 25)
  let financialScore = 0;
  const userCap = user.capital || 0;
  if (userCap >= project.recommendedCapital && userCap <= project.maxCapital) {
    financialScore = weights.financialWeight;
    reasons.push(`رأس مالك (${userCap.toLocaleString()} دج) ممتاز ومثال للتأسيس الراحي لهذا المشروع.`);
  } else if (userCap >= project.minCapital && userCap < project.recommendedCapital) {
    financialScore = Math.round(weights.financialWeight * 0.8);
    reasons.push(`رأس مالك يكفي للبداية المحافظة، ويمكنك البدء بحجم تجريبي خفيف.`);
  } else if (userCap > project.maxCapital) {
    financialScore = Math.round(weights.financialWeight * 0.85);
    reasons.push(`رأس مالك يفوق الحد الأعلى لهذا المشروع المصغر، مما يعطيك إمكانية توسع سريعة.`);
  } else if (userCap < project.minCapital) {
    const ratio = userCap / project.minCapital;
    financialScore = Math.max(0, Math.round(weights.financialWeight * ratio * 0.6));
    reasons.push(`رأس مالك الحالي أقل من أدنى مبلغ موصى به (${project.minCapital.toLocaleString()} دج).`);
  }

  // 2. Personal / Skills Score (max personalWeight e.g. 15)
  let personalScore = 0;
  const reqSkills = project.skillsRequired || [];
  const userSkills = user.skills || [];
  const noExperience = userSkills.includes("لا أملك خبرة محددة") || userSkills.length === 0;

  if (noExperience) {
    if (project.difficulty === "سهل") {
      personalScore = Math.round(weights.personalWeight * 0.75);
      reasons.push("المشروع سهل الاستيعاب ولا يتطلب خبرات تقنية مسبقة معقدة.");
    } else {
      personalScore = Math.round(weights.personalWeight * 0.4);
      reasons.push("يتطلب المشروع مهارات تقنية ستسحتاج لتعلمها أولاً.");
    }
  } else {
    const matches = reqSkills.filter((sk) =>
      userSkills.some((us) => us.includes(sk) || sk.includes(us))
    );
    if (reqSkills.length > 0) {
      const matchRatio = matches.length / reqSkills.length;
      personalScore = Math.round(weights.personalWeight * Math.min(1, matchRatio + 0.3));
      if (matches.length > 0) {
        reasons.push(`خبرتك في (${matches.join("، ")}) تتوافق بشكل مباشر مع متطلبات التشغيل.`);
      }
    } else {
      personalScore = weights.personalWeight;
    }
  }

  // 3. Workspace Score (max workspaceWeight e.g. 10)
  let workspaceScore = 0;
  const ws = user.workspace || "لا أعرف";
  if (ws === "من المنزل" && project.homeBased) {
    workspaceScore = weights.workspaceWeight;
    reasons.push("يمكنك البدء مباشرة من المنزل بدون تكاليف إيجار.");
  } else if (ws === "أونلاين" && project.onlinePossible) {
    workspaceScore = weights.workspaceWeight;
    reasons.push("يتطابق تمامًا مع صيغة العمل الإلكتروني عبر الإنترنت.");
  } else if ((ws === "محل أملكه" || ws === "محل بالإيجار") && project.requiresShop) {
    workspaceScore = weights.workspaceWeight;
    reasons.push("توفر المحل التجاري يمنح هذا المشروع ميزة تنافسية واستقطابًا عاليًا.");
  } else if (ws === "متنقل" && project.transportRequired) {
    workspaceScore = weights.workspaceWeight;
    reasons.push("طبيعة العمل المتنقل تخدم التوزيع المباشر للخدمة.");
  } else if (ws === "من المنزل" && project.requiresShop) {
    workspaceScore = Math.round(weights.workspaceWeight * 0.3);
    reasons.push("المشروع يحتاج في الأصل لمحل، لكن يمكن تجربته مصغرًا أولاً.");
  } else {
    workspaceScore = Math.round(weights.workspaceWeight * 0.7);
  }

  // 4. Location Score (max locationWeight e.g. 15)
  let locationScore = weights.locationWeight; // default: full marks

  if (project.onlinePossible) {
    // Online projects are location-agnostic
    locationScore = weights.locationWeight;
    reasons.push("المشروع يتميز عبر الإنترنت ولا يعتمد على الموقع الجغرافي.");
  } else if (project.targetArea === "جميع المناطق") {
    locationScore = weights.locationWeight;
    reasons.push("المشروع قابل للتطبيق في أي ولاية أو بلدية بالجزائر.");
  } else if (project.targetArea === "مدن كبيرة") {
    const area = user.areaType;
    if (!area) {
      // Missing data: safe fallback, no penalty
      locationScore = weights.locationWeight;
    } else if (area === "urban") {
      locationScore = weights.locationWeight;
      reasons.push("مشروع مدن كبيرة يتوافق مع موقعك الحضري.");
    } else if (area === "coastal" || area === "rural") {
      locationScore = Math.round(weights.locationWeight * 0.67);
      reasons.push("مشروع مدن كبيرة لكن موقعك ساحلي/ريفي قد يقلل من توفر السوق المستهدف.");
    } else {
      // desert
      locationScore = Math.round(weights.locationWeight * 0.47);
      reasons.push("مشروع مدن كبيرة في منطقة صحراوية — توفر السوق المستهدف محدود.");
    }
  } else if (project.targetArea === "بلديات صحراوية") {
    const area = user.areaType;
    if (!area) {
      locationScore = weights.locationWeight;
    } else if (area === "desert") {
      locationScore = weights.locationWeight;
      reasons.push("مشروع مخصص للمناطق الصحراوية يتوافق مع موقعك.");
    } else {
      locationScore = Math.round(weights.locationWeight * 0.4);
      reasons.push("مشروع مخصص للمناطق الصحراوية لكن موقعك خارج النطاق الموصى به.");
    }
  } else {
    // Unknown targetArea: safe fallback, no penalty
    locationScore = weights.locationWeight;
  }

  // 5. Risk Match Score (max riskWeight e.g. 10)
  let riskScore = 0;
  const userRisk = normalizeRiskLevel(user.riskLevel || "متوسط");
  const projRisk = normalizeRiskLevel(project.riskLevel);

  if (userRisk === projRisk || userRisk === "مرتفع") {
    riskScore = weights.riskWeight;
    reasons.push(`مستوى مخاطرة المشروع (${project.riskLevel}) متناسب مع قدرتك على تحمل المخاطر.`);
  } else if (userRisk === "منخفض" && projRisk === "متوسط") {
    riskScore = Math.round(weights.riskWeight * 0.7);
  } else if (userRisk === "منخفض" && projRisk === "مرتفع") {
    riskScore = Math.round(weights.riskWeight * 0.3);
    reasons.push("المشروع يحمل نسبة مخاطرة عالية مقارنة بفضلك للمخاطرة المنخفضة.");
  } else {
    riskScore = Math.round(weights.riskWeight * 0.8);
  }

  // 6. Startability Score (max startabilityWeight e.g. 10)
  let startabilityScore = 0;
  if (project.difficulty === "سهل") {
    startabilityScore = weights.startabilityWeight;
  } else if (project.difficulty === "متوسط") {
    startabilityScore = Math.round(weights.startabilityWeight * 0.75);
  } else {
    startabilityScore = Math.round(weights.startabilityWeight * 0.5);
  }

  // 7. Scalability Score (max scalabilityWeight e.g. 10)
  let scalabilityScore = 0;
  if (project.scalability === "مرتفعة") {
    scalabilityScore = weights.scalabilityWeight;
  } else if (project.scalability === "متوسطة") {
    scalabilityScore = Math.round(weights.scalabilityWeight * 0.7);
  } else {
    scalabilityScore = Math.round(weights.scalabilityWeight * 0.4);
  }

  // 8. Time Score (max timeWeight e.g. 5)
  let timeScore = 0;
  const availHours = user.availableHours || "2–4 ساعات";
  if (availHours.includes("دوام كامل") || availHours.includes("أكثر من 6")) {
    timeScore = weights.timeWeight;
  } else if (availHours.includes("4–6") || availHours.includes("2–4")) {
    timeScore = project.timeRequired.includes("دوام كامل")
      ? Math.round(weights.timeWeight * 0.6)
      : weights.timeWeight;
  } else {
    timeScore = Math.round(weights.timeWeight * 0.5);
  }

  // Calculate Total
  const totalScore = Math.min(
    100,
    financialScore +
      personalScore +
      workspaceScore +
      locationScore +
      riskScore +
      startabilityScore +
      scalabilityScore +
      timeScore
  );

  let recommendation: "🟢 مناسب جدًا" | "🟡 مناسب مع شروط" | "🟠 يحتاج دراسة إضافية" | "🔴 غير مناسب حاليًا";
  let statusClass = "";

  if (totalScore >= 80) {
    recommendation = "🟢 مناسب جدًا";
    statusClass = "bg-indigo-100 text-indigo-800 border-indigo-300";
  } else if (totalScore >= 60) {
    recommendation = "🟡 مناسب مع شروط";
    statusClass = "bg-amber-100 text-amber-800 border-amber-300";
  } else if (totalScore >= 40) {
    recommendation = "🟠 يحتاج دراسة إضافية";
    statusClass = "bg-orange-100 text-orange-800 border-orange-300";
  } else {
    recommendation = "🔴 غير مناسب حاليًا";
    statusClass = "bg-rose-100 text-rose-800 border-rose-300";
  }

  return {
    project,
    totalScore,
    financialScore,
    personalScore,
    workspaceScore,
    locationScore,
    riskScore,
    startabilityScore,
    scalabilityScore,
    timeScore,
    recommendation,
    statusClass,
    reasons,
  };
}

export function rankProjects(
  user: UserAssessmentInput,
  allProjects: ProjectData[],
  weights: ScoringWeightsConfig = DEFAULT_WEIGHTS
): ScoredProjectResult[] {
  const scored = allProjects.map((proj) => evaluateProjectScore(user, proj, weights));
  scored.sort((a, b) => b.totalScore - a.totalScore);
  return scored;
}

// ============================================================
// V2 — Realistic Project Score
// Deterministic, data-driven 0–100 score. Approved weights sum to 100:
//   Financial 30 (CapitalFit 16 + FixedCost 8 + VariableCost 6)
//   Execution 20 (Hours 8 + Workspace/Logistics 7 + Complexity 5)
//   Market    15 (Competition 10 + Seasonality 5)
//   Risk      15 (projectRisk 8 × tolFit + userRiskTolerance 2 + regulatory 5)
//   Personal  10 (Skills 7 + Objective 3)
//   Location   5
//   Scalability 5
// ============================================================

export const V2_WEIGHTS = {
  financial: {
    total: 30,
    capitalFit: 16,
    fixedCost: 8,
    variableCost: 6,
  },
  execution: {
    total: 20,
    hours: 8,
    workspace: 7,
    complexity: 5,
  },
  market: {
    total: 15,
    competition: 10,
    seasonality: 5,
  },
  risk: {
    total: 15,
    projectRisk: 8,
    userTolerance: 2,
    regulatory: 5,
  },
  personal: {
    total: 10,
    skills: 7,
    objective: 3,
  },
  location: 5,
  scalability: 5,
} as const;

export const V2_WEIGHT_SUM =
  V2_WEIGHTS.financial.total +
  V2_WEIGHTS.execution.total +
  V2_WEIGHTS.market.total +
  V2_WEIGHTS.risk.total +
  V2_WEIGHTS.personal.total +
  V2_WEIGHTS.location +
  V2_WEIGHTS.scalability;

export type V2Confidence = "high" | "medium" | "low";

export interface V2DimensionScore {
  score: number;
  max: number;
  completeness: number;
}

export interface V2SubDetail {
  score: number;
  max: number;
}

export interface V2Breakdown {
  financial: V2DimensionScore & {
    capitalFit: V2SubDetail;
    fixedCost: V2SubDetail;
    variableCost: V2SubDetail;
  };
  execution: V2DimensionScore & {
    hours: V2SubDetail;
    workspace: V2SubDetail;
    complexity: V2SubDetail;
  };
  market: V2DimensionScore & {
    competition: V2SubDetail;
    seasonality: V2SubDetail;
  };
  risk: V2DimensionScore & {
    projectRisk: V2SubDetail;
    userTolerance: V2SubDetail;
    regulatory: V2SubDetail;
  };
  personal: V2DimensionScore & {
    skills: V2SubDetail;
    objective: V2SubDetail;
  };
  location: V2DimensionScore;
  scalability: V2DimensionScore;
}

export interface V2ScoredProjectResult {
  project: ProjectData;
  totalScore: number;
  recommendation: string;
  statusClass: string;
  confidence: V2Confidence;
  confidenceValue: number;
  dimensionBreakdown: V2Breakdown;
  reasons: string[];
  financialScore: number;
  personalScore: number;
  workspaceScore: number;
  locationScore: number;
  riskScore: number;
  startabilityScore: number;
  scalabilityScore: number;
  timeScore: number;
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const isPresentNumber = (v: unknown): boolean =>
  typeof v === "number" && Number.isFinite(v);

const isPresentString = (v: unknown): boolean =>
  typeof v === "string" && v.trim().length > 0;

const missingScale = (completeness: number): number =>
  0.55 + 0.45 * clamp01(completeness);

const RISK_FACTOR: Record<string, number> = {
  منخفض: 1,
  متوسط: 0.75,
  مرتفع: 0.5,
};

const SKILL_LEVEL_FACTOR: Record<string, number> = {
  "بدون مهارة": 1,
  بسيطة: 0.85,
  متوسطة: 0.65,
  احترافية: 0.5,
  "شهادة/تأهيل مطلوب": 0.5,
};

const COMPETITION_FACTOR: Record<string, number> = {
  "منخفضة جداً": 1,
  منخفضة: 0.9,
  متوسطة: 0.6,
  مرتفعة: 0.35,
};

const SCALABILITY_FACTOR: Record<string, number> = {
  مرتفعة: 1,
  متوسطة: 0.7,
  منخفضة: 0.4,
};

const LEGAL_FACTOR: Record<string, number> = {
  "غير مقنن": 1,
  "سجل تجاري": 0.9,
  "شروط صحية": 0.75,
  "ترخيص/اعتماد": 0.7,
};

const OBJECTIVE_FACTOR: Record<string, number> = {
  "مشروع رئيسي": 1,
  "ترك الوظيفة مستقبلًا": 1,
  "مشروع صغير قابل للتوسع": 0.8,
  "دخل إضافي": 0.6,
  "لا أعرف": 0.5,
};

const HOURS_FACTOR: Record<string, number> = {
  "أقل من ساعتين يوميًا": 0.4,
  "2–4 ساعات": 0.55,
  "4–6 ساعات": 0.7,
  "أكثر من 6 ساعات": 0.85,
  "دوام كامل": 1,
};

const SKILL_ALIASES: Record<string, string[]> = {
  "البيع": ["البيع", "المبيعات", "بيع", "مبيعات", "sales", "trading"],
  "التسويق": ["التسويق", "تسويق", "marketing", "digital marketing", "ترويج"],
  "البرمجة": ["البرمجة", "برمجة", "programming", "تطوير", "development", "coding"],
  "التصميم": ["التصميم", "تصميم", "design", "graphic", "غرافيك"],
  "التصوير": ["التصوير", "تصوير", "photography", "فيديو", "video"],
  "التعليم": ["التعليم", "تعليم", "تدريس", "teaching", "education", "دروس"],
  "الحرف": ["الحرف", "حرف", "handicraft", "أشغال يدوية", "crafts"],
  "الزراعة": ["الزراعة", "زراعة", "agriculture", "فلاحة", "فارم"],
  "السيارات": ["السيارات", "سيارات", "auto", "automobile", "automotive"],
  "الطبخ": ["الطبخ", "طبخ", "cooking", "cuisine", "مطبخ"],
  "الملابس": ["الملابس", "ملابس", "clothing", "fashion", "أزياء"],
  "الهواتف والإلكترونيات": ["الهواتف والإلكترونيات", "هواتف", "إلكترونيات", "electronics", "phones"],
  "صناعة المحتوى": ["صناعة المحتوى", "محتوى", "content", "صانع محتوى", "content creation"],
  "الخدمات المنزلية": ["الخدمات المنزلية", "خدمات منزلية", "home services", "تنظيف"],
};

const canonicalSkill = (raw: string): string => {
  const s = raw.trim().toLowerCase();
  for (const [canon, aliases] of Object.entries(SKILL_ALIASES)) {
    const canonKey = canon.toLowerCase();
    if (s === canonKey || aliases.some((a) => a.toLowerCase() === s)) {
      return canonKey;
    }
  }
  return s;
};

const V2_RECOMMENDATION_LABELS = [
  { min: 90, label: "ممتاز" },
  { min: 80, label: "قوي" },
  { min: 70, label: "جيد" },
  { min: 60, label: "متوسط" },
  { min: 50, label: "يحتاج دراسة" },
  { min: 0, label: "مخاطرة مرتفعة" },
] as const;

export function classifyV2Score(totalScore: number): string {
  const s = Math.max(0, Math.min(100, Math.round(totalScore)));
  for (const band of V2_RECOMMENDATION_LABELS) {
    if (s >= band.min) return band.label;
  }
  return "مخاطرة مرتفعة";
}

export function v2ConfidenceLabel(confidenceValue: number): V2Confidence {
  if (confidenceValue >= 0.85) return "high";
  if (confidenceValue >= 0.6) return "medium";
  return "low";
}

export function evaluateProjectScoreV2(
  user: UserAssessmentInput,
  project: ProjectData
): V2ScoredProjectResult {
  const reasons: string[] = [];

  // ------------------------------------------------------------
  // Financial (30)
  // ------------------------------------------------------------
  const minCapital = isPresentNumber(project.minCapital)
    ? project.minCapital
    : 0;
  const recommendedCapital = isPresentNumber(project.recommendedCapital)
    ? project.recommendedCapital
    : 0;

  let capitalFactor = 0.5;
  if (recommendedCapital > 0) {
    const ratioCap = user.capital / recommendedCapital;
    const minRatio =
      minCapital > 0 ? minCapital / recommendedCapital : 1;
    if (ratioCap < minRatio) {
      capitalFactor = 0.5 * (user.capital / Math.max(minCapital, 1));
    } else if (user.capital <= recommendedCapital) {
      const lower = Math.max(minCapital, 0.01);
      const spread = recommendedCapital - lower;
      if (spread <= 0) {
        capitalFactor = 1;
      } else {
        capitalFactor =
          0.5 +
          0.5 * ((user.capital - lower) / spread);
      }
    } else if (ratioCap <= 2) {
      capitalFactor = 1;
    } else {
      capitalFactor = Math.max(0.85, 1 - 0.025 * (ratioCap - 2));
    }
    capitalFactor = clamp01(capitalFactor);
  }

  let fixedCostFactor = 0.5;
  if (isPresentNumber(project.fixedCosts) && recommendedCapital > 0) {
    const burden = project.fixedCosts / recommendedCapital;
    fixedCostFactor = Math.max(0.4, Math.min(1, 1 - 2.5 * burden));
  }

  let variableCostFactor = 0.5;
  if (isPresentNumber(project.variableCostsPercent)) {
    const v = project.variableCostsPercent;
    variableCostFactor = Math.max(
      0.6,
      Math.min(1, 1 - Math.max(0, v - 30) * 0.02)
    );
  }

  const financialRaw =
    V2_WEIGHTS.financial.capitalFit * capitalFactor +
    V2_WEIGHTS.financial.fixedCost * fixedCostFactor +
    V2_WEIGHTS.financial.variableCost * variableCostFactor;

  const financialCompleteness = [
    isPresentNumber(project.minCapital),
    isPresentNumber(project.recommendedCapital),
    isPresentNumber(project.fixedCosts),
    isPresentNumber(project.variableCostsPercent),
  ].filter(Boolean).length;

  const financial =
    financialRaw * missingScale(financialCompleteness / 4);

  if (capitalFactor >= 1) {
    reasons.push(
      `رأس مالك (${user.capital.toLocaleString()} دج) يغطي رأس المال الموصى به لهذا المشروع.`
    );
  } else if (capitalFactor >= 0.5) {
    reasons.push(
      "رأس مالك يسمح بانطلاقة متحفظة قريبة من الحد الأدنى الموصى به."
    );
  } else {
    reasons.push(
      `رأس مالك الحالي أقل من الحد الأدنى الموصى به (${minCapital.toLocaleString()} دج) — فكر في تأجيل الإطلاق أو البحث عن تمويل إضافي.`
    );
  }

  if (
    isPresentNumber(project.fixedCosts) &&
    recommendedCapital > 0 &&
    project.fixedCosts / recommendedCapital > 0.06
  ) {
    reasons.push(
      "الأعباء الثابتة الشهرية مرتفعة مقارنة برأس المال — احسب نقطة التعادل بدقة."
    );
  }

  if (
    isPresentNumber(project.variableCostsPercent) &&
    project.variableCostsPercent > 35
  ) {
    reasons.push(
      `نسبة التكاليف المتغيرة (${project.variableCostsPercent}%) مرتفعة — حافظ على هوامش ربح سليمة.`
    );
  }

  // ------------------------------------------------------------
  // Execution (20) — Hours + Workspace/Logistics + Complexity
  // ------------------------------------------------------------
  const userHours =
    HOURS_FACTOR[user.availableHours || ""] ?? 0.55;
  const projectFullTime = project.timeRequired.includes("دوام كامل");

  const hoursFactor = clamp01(
    userHours / (projectFullTime ? 0.85 : 1)
  );
  const hoursScore =
    (V2_WEIGHTS.execution.hours * Math.round(hoursFactor * 100)) /
    100;

  if (
    projectFullTime &&
    hoursFactor < 0.999
  ) {
    reasons.push(
      "هذا المشروع يتطلب وقتًا شبه كامل — تأكد أن وقتك المتاح يكفي فعليًا."
    );
  }

  const ws = user.workspace || "لا أعرف";
  let workspaceFactor: number;
  if (ws === "من المنزل" && project.homeBased) {
    workspaceFactor = 1;
  } else if (ws === "أونلاين" && project.onlinePossible) {
    workspaceFactor = 1;
  } else if (
    (ws === "محل أملكه" || ws === "محل بالإيجار") &&
    project.requiresShop
  ) {
    workspaceFactor = 1;
  } else if (ws === "متنقل" && project.transportRequired) {
    workspaceFactor = 1;
  } else if (ws === "من المنزل" && project.requiresShop) {
    workspaceFactor = 0.4;
  } else if (ws === "لا أعرف") {
    workspaceFactor = 0.5;
  } else {
    workspaceFactor = 0.3;
  }

  if (
    project.transportRequired &&
    user.transport === "لا أملك وسيلة نقل"
  ) {
    workspaceFactor = Math.max(0.3, workspaceFactor * 0.6);
  }

  const workspaceScore =
    V2_WEIGHTS.execution.workspace * clamp01(workspaceFactor);

  if (workspaceFactor >= 1) {
    reasons.push(
      `صيغة العمل (${ws}) تناسب نمط تشغيل هذا المشروع بشكل مباشر.`
    );
  } else if (workspaceFactor <= 0.4) {
    reasons.push(
      `صيغة العمل (${ws}) لا تتطابق مع متطلبات التشغيل — قد تحتاج إلى محل أو وسيلة نقل.`
    );
  }

  const complexityFactor =
    SKILL_LEVEL_FACTOR[project.skillLevel || ""] ?? 0.65;
  const complexityScore =
    V2_WEIGHTS.execution.complexity * complexityFactor;

  const executionRaw = hoursScore + workspaceScore + complexityScore;
  const executionCompleteness = [
    isPresentString(project.timeRequired),
    isPresentString(project.skillLevel),
  ].filter(Boolean).length;

  const execution =
    executionRaw * missingScale(executionCompleteness / 2);

  // ------------------------------------------------------------
  // Market (15) — Competition + Seasonality
  // ------------------------------------------------------------
  const competitionFactor =
    COMPETITION_FACTOR[project.competitionLevel || ""] ?? 0.6;
  const competitionScore =
    V2_WEIGHTS.market.competition * competitionFactor;

  if (competitionFactor >= 0.9) {
    reasons.push("مستوى المنافسة في هذا المجال منخفض نسبيًا — فرصة جيدة.");
  } else if (competitionFactor <= 0.35) {
    reasons.push("منافسة هذه السوق مرتفعة — خطط للتمييز والتسويق المباشر.");
  }

  const seasonalityTrimmed = (project.seasonality || "").trim();
  const seasonalityAllYear =
    seasonalityTrimmed.startsWith("طوال السنة");
  const seasonalityFactor = seasonalityAllYear ? 1 : 0.7;
  const seasonalityScore =
    V2_WEIGHTS.market.seasonality * seasonalityFactor;

  if (seasonalityAllYear) {
    reasons.push("نشاط هذا المشروع مستمر طوال السنة — المصدر منتظم.");
  } else if (isPresentString(project.seasonality)) {
    reasons.push(
      "نشاط هذا المشروع موسمي — نظّم السيولة حول المواسم المرتفعة."
    );
  }

  const marketRaw = competitionScore + seasonalityScore;
  const marketCompleteness = [
    isPresentString(project.competitionLevel),
    isPresentString(project.seasonality),
  ].filter(Boolean).length;

  const market =
    marketRaw * missingScale(marketCompleteness / 2);

  // ------------------------------------------------------------
  // Risk (15) — projectRisk 8 × tolFit + regulatory 5
  // ------------------------------------------------------------
  const projRiskKey = normalizeRiskLevel(project.riskLevel || "متوسط");
  const userRiskKey = normalizeRiskLevel(user.riskLevel || "متوسط");
  const projRiskFactor = RISK_FACTOR[projRiskKey] ?? 0.75;
  const userRiskFactor = RISK_FACTOR[userRiskKey] ?? 0.75;

  const tolFit = Math.min(
    1,
    projRiskFactor > 0
      ? Math.min(1, userRiskFactor / projRiskFactor)
      : 0
  );

  const projectRiskScore =
    V2_WEIGHTS.risk.projectRisk * projRiskFactor * tolFit;

  const riskCompleteness = [
    isPresentString(project.riskLevel),
    isPresentString(user.riskLevel || ""),
  ].filter(Boolean).length;

  const riskScaled =
    projectRiskScore * missingScale(riskCompleteness / 2);

  const userToleranceScore = V2_WEIGHTS.risk.userTolerance * tolFit;

  const regulatoryFactor =
    LEGAL_FACTOR[project.legalStatus || ""] ?? 0.85;
  const regulatoryScore =
    V2_WEIGHTS.risk.regulatory * regulatoryFactor;

  const risk = riskScaled + userToleranceScore + regulatoryScore;

  if (userRiskKey === projRiskKey) {
    reasons.push(
      `مستوى تحملك للمخاطر (${project.riskLevel}) يتوافق مع مخاطرة المشروع.`
    );
  } else if (userRiskKey === "منخفض" && projRiskKey === "مرتفع") {
    reasons.push(
      "المشروع يحمل مخاطرة أعلى من تحملك المتدني — أدرج وسائد أمان مالية."
    );
  }

  const regulated =
    project.legalStatus === "سجل تجاري" ||
    project.legalStatus === "شروط صحية" ||
    project.legalStatus === "ترخيص/اعتماد";
  if (regulated) {
    reasons.push(
      `يتطلب المشروع ${project.legalStatus} — جهّز الإجراءات القانونية مسبقًا.`
    );
  } else if (project.legalStatus === "غير مقنن") {
    reasons.push(
      "المشروع لا يتطلب ترخيصًا معقدًا حاليًا — انطلاقة قانونية سهلة."
    );
  }

  // ------------------------------------------------------------
  // Personal (10) — Skills + Objective
  // ------------------------------------------------------------
  const reqSkills = project.skillsRequired || [];
  const userSkillCanon = (user.skills || []).map(canonicalSkill);

  let skillsRatio: number;
  if (reqSkills.length === 0) {
    skillsRatio = 1;
  } else {
    const matched = reqSkills.filter((sk) =>
      userSkillCanon.includes(canonicalSkill(sk))
    );
    skillsRatio = matched.length / reqSkills.length;
    if (matched.length > 0) {
      reasons.push(
        `خبرتك في (${matched.join("، ")}) تغطي المهارات المطلوبة لهذا المشروع.`
      );
    } else if (reqSkills.length > 0) {
      reasons.push(
        "لا تغطي خبراتك الحالية المهارات المطلوبة — خطط لمسار تعلم قصير."
      );
    }
  }

  const skillsScore = V2_WEIGHTS.personal.skills * skillsRatio;

  const objectiveFactor =
    OBJECTIVE_FACTOR[user.objective || ""] ?? 0.5;
  const objectiveScore =
    V2_WEIGHTS.personal.objective * objectiveFactor;

  if (user.objective === "ترك الوظيفة مستقبلًا") {
    reasons.push(
      "هدفك (ترك الوظيفة لاحقًا) يستدعي التدرج من دخل إضافي لعمل رئيسي."
    );
  }

  const personalRaw = skillsScore + objectiveScore;
  const personalCompleteness = [
    reqSkills.length > 0,
    isPresentString(user.objective || ""),
  ].filter(Boolean).length;

  const personal =
    personalRaw * missingScale(personalCompleteness / 2);

  // ------------------------------------------------------------
  // Location (5)
  // ------------------------------------------------------------
  const locationCompleteness = isPresentString(project.targetArea)
  ? 1
  : 0;

  let locationFactor: number;
  if (
    project.onlinePossible ||
    project.targetArea === "جميع المناطق"
  ) {
    locationFactor = 1;
  } else if (!isPresentString(user.areaType || "")) {
    locationFactor = 0.6;
  } else if (
    project.targetArea === "مدن كبيرة" &&
    user.areaType === "urban"
  ) {
    locationFactor = 1;
  } else if (
    project.targetArea === "بلديات صحراوية" &&
    user.areaType === "desert"
  ) {
    locationFactor = 1;
  } else if (project.targetArea === "بلديات صحراوية") {
    locationFactor = 0.3;
  } else if (project.targetArea === "مدن كبيرة") {
    locationFactor = 0.5;
  } else if (!isPresentString(project.targetArea)) {
    locationFactor = 0.6;
  } else {
    locationFactor = 0.5;
  }

  const location =
    V2_WEIGHTS.location * clamp01(locationFactor) *
    missingScale(locationCompleteness);

  if (
    project.onlinePossible ||
    project.targetArea === "جميع المناطق"
  ) {
    reasons.push("المشروع لا يرتبط بموقع جغرافي محدد — مرونة كاملة.");
  } else if (
    locationFactor >= 1 &&
    isPresentString(project.targetArea)
  ) {
    reasons.push(`منطقتك مناسبة لسوق هذا المشروع (${project.targetArea}).`);
  }

  // ------------------------------------------------------------
  // Scalability (5)
  // ------------------------------------------------------------
  const scalabilityFactor =
    SCALABILITY_FACTOR[project.scalability || ""] ?? 0.7;
  const scalabilityCompleteness = [
    isPresentString(project.scalability),
  ].filter(Boolean).length;

  const scalability =
    V2_WEIGHTS.scalability * scalabilityFactor *
    missingScale(scalabilityCompleteness);

  if (project.scalability === "مرتفعة") {
    reasons.push("المشروع قابل للتوسع لاحقًا — مناسب للنمو التدريجي.");
  }

  // ------------------------------------------------------------
  // Total
  // ------------------------------------------------------------
  const rawTotal =
    financial +
    execution +
    market +
    risk +
    personal +
    location +
    scalability;

  const clampedRaw = Math.max(0, Math.min(100, rawTotal));
  const totalScore = Math.max(0, Math.min(100, Math.round(clampedRaw)));

  const recommendation = classifyV2Score(totalScore);

  let statusClass: string;
  if (totalScore >= 80) {
    statusClass = "bg-indigo-100 text-indigo-800 border-indigo-300";
  } else if (totalScore >= 70) {
    statusClass = "bg-sky-100 text-sky-800 border-sky-300";
  } else if (totalScore >= 60) {
    statusClass = "bg-amber-100 text-amber-800 border-amber-300";
  } else if (totalScore >= 50) {
    statusClass = "bg-orange-100 text-orange-800 border-orange-300";
  } else {
    statusClass = "bg-rose-100 text-rose-800 border-rose-300";
  }

  const dimensionCompletenesses = [
    financialCompleteness / 4,
    executionCompleteness / 2,
    marketCompleteness / 2,
    riskCompleteness / 2,
    personalCompleteness / 2,
    locationCompleteness,
    scalabilityCompleteness,
  ];

  const confidenceValue =
    (dimensionCompletenesses[0] * V2_WEIGHTS.financial.total +
      dimensionCompletenesses[1] * V2_WEIGHTS.execution.total +
      dimensionCompletenesses[2] * V2_WEIGHTS.market.total +
      dimensionCompletenesses[3] * V2_WEIGHTS.risk.total +
      dimensionCompletenesses[4] * V2_WEIGHTS.personal.total +
      dimensionCompletenesses[5] * V2_WEIGHTS.location +
      dimensionCompletenesses[6] * V2_WEIGHTS.scalability) /
    V2_WEIGHT_SUM;

  const dimensionBreakdown: V2Breakdown = {
    financial: {
      score: Math.round(financial),
      max: V2_WEIGHTS.financial.total,
      completeness: financialCompleteness / 4,
      capitalFit: {
        score: Math.round(
          V2_WEIGHTS.financial.capitalFit * capitalFactor
        ),
        max: V2_WEIGHTS.financial.capitalFit,
      },
      fixedCost: {
        score: Math.round(
          V2_WEIGHTS.financial.fixedCost * fixedCostFactor
        ),
        max: V2_WEIGHTS.financial.fixedCost,
      },
      variableCost: {
        score: Math.round(
          V2_WEIGHTS.financial.variableCost * variableCostFactor
        ),
        max: V2_WEIGHTS.financial.variableCost,
      },
    },
    execution: {
      score: Math.round(execution),
      max: V2_WEIGHTS.execution.total,
      completeness: executionCompleteness / 2,
      hours: { score: Math.round(hoursScore), max: V2_WEIGHTS.execution.hours },
      workspace: {
        score: Math.round(workspaceScore),
        max: V2_WEIGHTS.execution.workspace,
      },
      complexity: {
        score: Math.round(complexityScore),
        max: V2_WEIGHTS.execution.complexity,
      },
    },
    market: {
      score: Math.round(market),
      max: V2_WEIGHTS.market.total,
      completeness: marketCompleteness / 2,
      competition: {
        score: Math.round(competitionScore),
        max: V2_WEIGHTS.market.competition,
      },
      seasonality: {
        score: Math.round(seasonalityScore),
        max: V2_WEIGHTS.market.seasonality,
      },
    },
    risk: {
      score: Math.round(risk),
      max: V2_WEIGHTS.risk.total,
      completeness: riskCompleteness / 2,
      projectRisk: {
        score: Math.round(projectRiskScore),
        max: V2_WEIGHTS.risk.projectRisk,
      },
      userTolerance: {
        score: Math.round(userToleranceScore),
        max: V2_WEIGHTS.risk.userTolerance,
      },
      regulatory: {
        score: Math.round(regulatoryScore),
        max: V2_WEIGHTS.risk.regulatory,
      },
    },
    personal: {
      score: Math.round(personal),
      max: V2_WEIGHTS.personal.total,
      completeness: personalCompleteness / 2,
      skills: {
        score: Math.round(skillsScore),
        max: V2_WEIGHTS.personal.skills,
      },
      objective: {
        score: Math.round(objectiveScore),
        max: V2_WEIGHTS.personal.objective,
      },
    },
    location: {
      score: Math.round(location),
      max: V2_WEIGHTS.location,
      completeness: locationCompleteness,
    },
    scalability: {
      score: Math.round(scalability),
      max: V2_WEIGHTS.scalability,
      completeness: scalabilityCompleteness,
    },
  };

  return {
    project,
    totalScore,
    recommendation,
    statusClass,
    confidence: v2ConfidenceLabel(confidenceValue),
    confidenceValue: Math.round(confidenceValue * 1000) / 1000,
    dimensionBreakdown,
    reasons,
    financialScore: Math.round(financial),
    personalScore: Math.round(personal),
    workspaceScore: Math.round(workspaceScore),
    locationScore: Math.round(location),
    riskScore: Math.round(risk),
    startabilityScore: Math.round(complexityScore),
    scalabilityScore: Math.round(scalability),
    timeScore: Math.round(hoursScore),
  };
}

export function rankProjectsV2(
  user: UserAssessmentInput,
  allProjects: ProjectData[]
): V2ScoredProjectResult[] {
  const scored = allProjects.map((proj) =>
    evaluateProjectScoreV2(user, proj)
  );
  scored.sort((a, b) => b.totalScore - a.totalScore);
  return scored;
}
