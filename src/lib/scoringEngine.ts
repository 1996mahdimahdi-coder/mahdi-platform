export interface UserAssessmentInput {
  capital: number;
  workspace: string; // من المنزل, محل أملكه, محل بالإيجار, أونلاين, متنقل, لا أعرف
  wilayaId?: number;
  wilayaName?: string;
  communeName?: string;
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
  let locationScore = Math.round(weights.locationWeight * 0.85); // base
  if (project.targetArea === "جميع المناطق") {
    locationScore = weights.locationWeight;
    reasons.push("المشروع قابل للتطبيق في أي ولاية أو بلدية بالجزائر.");
  } else if (user.wilayaName) {
    locationScore = weights.locationWeight;
  }

  // 5. Risk Match Score (max riskWeight e.g. 10)
  let riskScore = 0;
  const userRisk = user.riskLevel || "متوسط";
  const projRisk = project.riskLevel;

  if (userRisk === projRisk || (userRisk === "مرتفع")) {
    riskScore = weights.riskWeight;
    reasons.push(`مستوى مخاطرة المشروع (${projRisk}) متناسب مع قدرتك على تحمل المخاطر.`);
  } else if (userRisk === "منخفض" && projRisk === "متوسطة") {
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
