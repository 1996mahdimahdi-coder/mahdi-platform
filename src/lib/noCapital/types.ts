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
