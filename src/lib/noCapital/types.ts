// Shared types for the NABDA growth architecture:
// no-capital path, recommendation engine, plans, courses, content, hooks,
// videos and the legal consent gate. Pure types only — no runtime imports.

export type NoCapitalOption = {
  value: string;
  label: string;
  desc?: string;
  icon?: string;
  tags?: string[];
};

export type NoCapitalQuestion = {
  id?: number;
  questionKey: string;
  type: "single" | "multi" | "text";
  title: string;
  subtitle?: string;
  required: boolean;
  order: number;
  active?: boolean;
  options: NoCapitalOption[];
};

export type NoCapitalAnswer = string | string[];

export type NoCapitalAnswers = Record<string, NoCapitalAnswer>;

export type NoCapitalProfile = {
  id?: number;
  slug: string;
  nameAr: string;
  nameFr?: string;
  description: string;
  categoryId?: number | null;
  domainId?: number | null;
  categorySlug?: string | null;
  domainSlug?: string | null;
  effortLevel: string; // منخفض, متوسط, مرتفع
  timeRequired: string;
  skillsRequired: string[];
  toolsNeeded: string[];
  startCostEstimate: string;
  startCostType?: "zero_tools_existing" | "low_capital" | "capital";
  tags: string[];
  risks: string[];
  advantages: string[];
  disadvantages: string[];
  steps: { title: string; detail: string }[];
  legalNotes?: string | null;
};

// ============================================================================
// Paid Study — the paid "study" that will be sold/delivered for a no-capital
// project (Phase 4). In Phase 3 this is an ADMIN-ONLY data structure stored as
// jsonb on noCapitalProjects.study. It is deliberately NOT exposed through any
// public page, public API, search, sitemap, plan route, or the free PDF.
//
// Draft-safety rule: any study must start as status "draft" and must only be
// considered deliverable once status === "approved". The public layer is
// responsible for never reading this field.
// ============================================================================

export type StudyStatus = "draft" | "review" | "approved";

export type StudySourceStatus =
  | "VERIFIED"
  | "BENCHMARK"
  | "SUGGESTED"
  | "NEEDS_VALIDATION";

export type StudyPricingModel =
  | "per_word"
  | "per_minute"
  | "per_project"
  | "monthly_retainer"
  | "package";

export type StudyDifficulty = "low" | "medium" | "high";

export type StudyEquipmentTier = "free" | "pro";

export type StudyPlanWeek = 1 | 2 | 3 | 4;

export type StudyIdealClient = {
  persona: string;
  orgType?: string;
  platform?: string;
  dzEligible?: boolean;
  notes?: string;
};

export type StudyEquipment = {
  item: string;
  tier: StudyEquipmentTier;
  purpose?: string;
  source?: string;
  sourceStatus: StudySourceStatus;
  /** Estimated acquisition cost in DZD — used by capital projects. */
  cost?: number;
};

export type StudyPricing = {
  model: StudyPricingModel;
  globalMinUsd?: number;
  globalMaxUsd?: number;
  dzSuggestedDzd?: number;
  dzPriceStatus: StudySourceStatus;
  source?: string;
  note?: string;
};

export type StudyProfitModel = {
  priceAnchor?: string;
  hoursPerUnit?: number;
  grossPerHour?: number;
  breakEvenUnits?: number;
  notes?: string;
};

export type StudyBusinessModel = {
  offerModel?: string;
  valueProposition?: string;
  repeatClientStrategy?: string;
};

export type StudyClientAcquisition = {
  channel: string;
  difficulty?: StudyDifficulty;
  outreachTargetCount?: number;
  messageScript?: string;
  followUpScript?: string;
};

export type StudyWorkflowStep = {
  stage: string;
  detail: string;
  deliverable?: string;
};

export type StudyCompetition = {
  segment: string;
  intensity?: StudyDifficulty;
  positioning?: string;
  notes?: string;
};

export type StudyMistake = {
  mistake: string;
  prevention?: string;
};

export type StudyRedFlag = {
  flag: string;
  why?: string;
  protection?: string;
};

export type StudyMarketing = {
  channels: string[];
  contentTypes: string[];
  cta?: string;
  kpis: string[];
};

export type StudyPlanWeekBlock = {
  week: StudyPlanWeek;
  tasks: string[];
  outreach?: string[];
  content?: string[];
  kpis?: string[];
};

export type StudyGrowthStep = {
  from: string;
  to: string;
  tactic: string;
};

export type StudyLegalDz = {
  autoEntrepreneur?: string;
  ifu?: string;
  casnos?: string;
  tva?: string;
  crypto?: string;
  notes?: string;
  needsValidation: boolean;
};

export type StudyCaseStudy = {
  scenario: string;
  inputs?: string[];
  outcome?: string;
  isSample: true;
};

export type StudySource = {
  title: string;
  url?: string;
  sourceType: "OFFICIAL" | "BENCHMARK" | "REFERENCE";
  verifiedAt?: string;
  notes?: string;
};

export type PaidStudyMeta = {
  paidValueScore?: number;
  lastVerified?: string;
  researchVersion?: string;
  /** Discriminator: which product family owns this study. Defaults to "no_capital". */
  studyKind?: "no_capital" | "capital";
};

/** Recommended capital bands for a capital project (from legacy min/rec/max). */
export type StudyStartupCapital = {
  min: number;
  recommended: number;
  max: number;
};

/** Optional market-test strategy for capital projects (curated in Admin). */
export type StudyMarketTestPlan = {
  steps: string[];
  channels?: string[];
  kpis?: string[];
};

export type PaidStudy = {
  version: number;
  status: StudyStatus;
  summary: {
    overview: string;
  };
  idealClients: StudyIdealClient[];
  skills: {
    minimum: string[];
    advanced: string[];
  };
  equipment: StudyEquipment[];
  pricing: StudyPricing[];
  profitModel: StudyProfitModel;
  businessModel: StudyBusinessModel;
  firstClientAcquisition: StudyClientAcquisition[];
  workflow: StudyWorkflowStep[];
  marketCompetition: StudyCompetition[];
  commonMistakes: StudyMistake[];
  redFlags: StudyRedFlag[];
  marketing: StudyMarketing;
  plan30Days: StudyPlanWeekBlock[];
  growthPath: StudyGrowthStep[];
  legalDz: StudyLegalDz;
  caseStudy: StudyCaseStudy;
  sources: StudySource[];
  meta: PaidStudyMeta;
  // --- Optional capital-project extensions (backfilled from legacy columns) ---
  /** Minimum / recommended / maximum startup capital in DZD. */
  startupCapital?: StudyStartupCapital;
  /** Project strengths (from legacy advantages column). */
  strengths?: string[];
  /** Specific pre-launch market-test strategy for this project. */
  marketTestPlan?: StudyMarketTestPlan;
};

export type NoCapitalDimensionScores = {
  mode: number;
  effort: number;
  skills: number;
  tools: number;
  startability: number;
};

export type NoCapitalRecommendation = {
  profile: NoCapitalProfile;
  totalScore: number;
  dimensionScores: NoCapitalDimensionScores;
  reasons: string[];
  matchLevel: "high" | "medium" | "low";
};

// Slim version persisted into no_capital_test_results
export type NoCapitalRecommendationSummary = {
  slug: string;
  nameAr: string;
  totalScore: number;
  matchLevel: "high" | "medium" | "low";
  reasons: string[];
};

export type ExecutionPhase = {
  month: number; // 1..3
  week?: string;
  title: string;
  tasks: string[];
  kpis?: string[];
};

export type ConsentVersion = {
  id?: number;
  version: string;
  title: string;
  text: string;
  required: boolean;
  active?: boolean;
};

export type ConsentRecordPayload = {
  sessionId: string;
  versionId?: number;
  version?: string;
  purpose: "assessment" | "no-capital" | "plan";
};

export type NoCapitalRecommendationRule = {
  id: number;
  questionKey: string;
  optionValue: string;
  tag: string;
  weight: number;
  note?: string | null;
  active: boolean;
};

export type CategoryItem = {
  id?: number;
  parentId?: number | null;
  slug: string;
  nameAr: string;
  nameFr: string;
  type: "domain" | "category";
  icon?: string;
  description?: string;
  sortOrder?: number;
  active?: boolean;
};

export type CourseItem = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  description?: string;
  categoryId: number | null;
  level: string;
  durationMinutes: number;
  lessonsCount: number;
  sortOrder: number;
  featured: boolean;
  recommended: boolean;
  contentYear: number;
  contentSource: string;
  channelName?: string;
  coverImage?: string;
  published: boolean;
};

export type CourseLessonItem = {
  id: number;
  title: string;
  summary?: string;
  content?: string;
  order: number;
  durationMinutes: number;
  videoUrl?: string;
};

export type LibraryBookItem = {
  id: number;
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  description?: string;
  coverImage?: string;
  whatYouLearn: string[];
  outline: string[];
  priceDzd: number;
  published: boolean;
};

export type ExecutionPlanItem = {
  id: number;
  slug: string;
  title: string;
  subtitle?: string;
  durationDays: number;
  objective?: string;
  phases: ExecutionPhase[];
  kpis: string[];
};

export type FirstOrderPlanItem = {
  id: number;
  slug: string;
  title: string;
  targetAudience?: string;
  valueProposition?: string;
  channels: { channel: string; effort: string; notes: string }[];
  outreachSteps: string[];
  scriptText?: string;
  successMetrics: string[];
};

export type MarketingPlanItem = {
  id: number;
  slug: string;
  title: string;
  budgetLevel: "low" | "medium" | "high";
  goals: string[];
  channels: { channel: string; priority: string; cost: string; effort: string; notes: string }[];
  timelineWeeks: { week: string; focus: string; tasks: string[] }[];
};
