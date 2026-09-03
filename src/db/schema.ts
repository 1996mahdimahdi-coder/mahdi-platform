import { pgTable, serial, text, integer, timestamp, jsonb, numeric, boolean, bigint, index, unique } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import type {
  NoCapitalOption,
  NoCapitalAnswer,
  NoCapitalRecommendationSummary,
  ExecutionPhase,
} from "@/lib/noCapital/types";

// Wilayas table
export const wilayas = pgTable("wilayas", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(), // e.g. "01", "16", "31"
  nameAr: text("name_ar").notNull(),
  nameFr: text("name_fr").notNull(),
  areaType: text("area_type").notNull().default("urban"), // urban, rural, coastal, desert
});

// Communes table
export const communes = pgTable("communes", {
  id: serial("id").primaryKey(),
  wilayaId: integer("wilaya_id").notNull().references(() => wilayas.id, { onDelete: "cascade" }),
  nameAr: text("name_ar").notNull(),
  nameFr: text("name_fr").notNull(),
  populationDensity: text("population_density").default("medium"), // low, medium, high
});

// Projects database
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull().unique(), // slug identifier e.g. "phone-accessories"
  projectName: text("project_name").notNull(),
  category: text("category").notNull(), // طھط¬ط§ط±ط©, ط®ط¯ظ…ط§طھ, ط£ظˆظ†ظ„ط§ظٹظ†, ط²ط±ط§ط¹ط©, طµظ†ط§ط¹ط© طھظ‚ظ„ظٹط¯ظٹط©, طھط¹ظ„ظٹظ…, ط§ظ„ط®
  description: text("description").notNull(),
  
  minCapital: integer("min_capital").notNull(), // e.g. 30000
  recommendedCapital: integer("recommended_capital").notNull(), // e.g. 100000
  maxCapital: integer("max_capital").notNull(), // e.g. 300000
  
  riskLevel: text("risk_level").notNull(), // ظ…ظ†ط®ظپط¶, ظ…طھظˆط³ط·, ظ…ط±طھظپط¹
  requiresShop: boolean("requires_shop").notNull().default(false),
  homeBased: boolean("home_based").notNull().default(true),
  onlinePossible: boolean("online_possible").notNull().default(true),
  transportRequired: boolean("transport_required").notNull().default(false),
  
  skillsRequired: jsonb("skills_required").$type<string[]>().notNull(), // array of skills e.g. ["ط§ظ„ط¨ظٹط¹", "ط§ظ„طھط³ظˆظٹظ‚"]
  timeRequired: text("time_required").notNull(), // "ط£ظ‚ظ„ ظ…ظ† ط³ط§ط¹طھظٹظ†", "2-4 ط³ط§ط¹ط§طھ", "ط¯ظˆط§ظ… ظƒط§ظ…ظ„"
  difficulty: text("difficulty").notNull().default("ط³ظ‡ظ„"), // ط³ظ‡ظ„, ظ…طھظˆط³ط·, طµط¹ط¨ط©
  scalability: text("scalability").notNull().default("ظ…ط±طھظپط¹ط©"), // ظ…ظ†ط®ظپط¶ط©, ظ…طھظˆط³ط·ط©, ظ…ط±طھظپط¹ط©
  seasonality: text("seasonality").notNull().default("ط·ظˆط§ظ„ ط§ظ„ط³ظ†ط©"), // ط·ظˆط§ظ„ ط§ظ„ط³ظ†ط©, طµظٹظپظٹ, ط±ظ…ط¶ط§ظ†ظٹ, ط§ظ„ط®
  competitionLevel: text("competition_level").notNull().default("ظ…طھظˆط³ط·ط©"), // ظ…ظ†ط®ظپط¶ط©, ظ…طھظˆط³ط·ط©, ظ…ط±طھظپط¹ط©
  targetArea: text("target_area").notNull().default("ط¬ظ…ظٹط¹ ط§ظ„ظ…ظ†ط§ط·ظ‚"), // ط¬ظ…ظٹط¹ ط§ظ„ظ…ظ†ط§ط·ظ‚, ظ…ط¯ظ† ظƒط¨ظٹط±ط©, ط¨ظ„ط¯ظٹط§طھ طµط؛ظٹط±ط©, ط§ظ„ط®
  workLocation: text("work_location").notNull().default("محل"), // من المنزل, محل, ورشة, مكتب, متنقل, أونلاين
  skillLevel: text("skill_level").notNull().default("بسيطة"), // بدون مهارة, بسيطة, متوسطة, احترافية, شهادة/تأهيل مطلوب
  legalStatus: text("legal_status").notNull().default("غير مقنن"), // غير مقنن, سجل تجاري, ترخيص/اعتماد, مهنة منظمة, شروط صحية, شروط بيئية
  
  equipment: jsonb("equipment").$type<{ item: string; cost: number }[]>().notNull(),
  initialStock: integer("initial_stock").notNull().default(0),
  fixedCosts: integer("fixed_costs").notNull().default(0),
  variableCostsPercent: integer("variable_costs_percent").notNull().default(10),
  
  pricingMethod: text("pricing_method").notNull().default("ظ‡ط§ظ…ط´ ط±ط¨ط­ ط«ط§ط¨طھ"),
  profitFormula: text("profit_formula").notNull().default("ط§ظ„ط¥ظٹط±ط§ط¯ط§طھ - ط§ظ„طھظƒط§ظ„ظٹظپ"),
  breakEvenFormula: text("break_even_formula").notNull().default("ط§ظ„طھظƒط§ظ„ظٹظپ ط§ظ„ط«ط§ط¨طھط© / ظ‡ط§ظ…ط´ ط§ظ„ط±ط¨ط­ ظ„ظ„ظˆط­ط¯ط©"),
  
  risks: jsonb("risks").$type<string[]>().notNull(),
  advantages: jsonb("advantages").$type<string[]>().notNull(),
  disadvantages: jsonb("disadvantages").$type<string[]>().notNull(),
  
  launchPlan: jsonb("launch_plan").$type<{ week: string; title: string; tasks: string[] }[]>().notNull(),
  legalNotes: text("legal_notes").default("ظ„ط§ ظٹظ‚طھط¶ظٹ ط¥ط¬ط±ط§ط،ط§طھ ظ…ط¹ظ‚ط¯ط© ظپظٹ ط§ظ„ط¨ط¯ط§ظٹط© ط§ظ„طھط¬ط±ظٹط¨ظٹط©"),
  
  source: text("source").default("ط¯ط±ط§ط³ط© ظ…ظٹط¯ط§ظ†ظٹط© ظˆط³ظˆظ‚ ط¬ط²ط§ط¦ط±ظٹ 2025"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Scoring Weights table (Admin controlled)
export const scoringWeights = pgTable("scoring_weights", {
  id: serial("id").primaryKey(),
  financialWeight: integer("financial_weight").notNull().default(25),
  personalWeight: integer("personal_weight").notNull().default(15),
  workspaceWeight: integer("workspace_weight").notNull().default(10),
  locationWeight: integer("location_weight").notNull().default(15),
  riskWeight: integer("risk_weight").notNull().default(10),
  startabilityWeight: integer("startability_weight").notNull().default(10),
  scalabilityWeight: integer("scalability_weight").notNull().default(10),
  timeWeight: integer("time_weight").notNull().default(5),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User accounts
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("user"), // user, admin
  phone: text("phone"),
  tokenVersion: integer("token_version").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// User Profiles
export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  capital: integer("capital").notNull(),
  wilayaId: integer("wilaya_id"),
  communeId: integer("commune_id"),
  workspace: text("workspace"),
  availableHours: text("available_hours"),
  skills: jsonb("skills").$type<string[]>(),
  riskLevel: text("risk_level"),
  transport: text("transport"),
  existingIncome: text("existing_income"),
  objective: text("objective"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Saved Analysis Results / Assessments
export const analysisResults = pgTable("analysis_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
  sessionId: text("session_id"),
  shareToken: text("share_token").unique(),
  userCapital: integer("user_capital").notNull(),
  testAnswers: jsonb("test_answers").notNull(),
  topProjects: jsonb("top_projects").$type<{
    projectId: string;
    projectName: string;
    totalScore: number;
    financialScore: number;
    personalScore: number;
    workspaceScore: number;
    locationScore: number;
    riskScore: number;
    timeScore: number;
    recommendation: string;
    reasons: string[];
  }[]>().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Rate limiting counters (H1) — PostgreSQL fixed-window rate limiter.
// Rows are upserted atomically by src/lib/rateLimit.ts
// (`INSERT ... ON CONFLICT (key) DO UPDATE`). Each row tracks one
// namespaced key (e.g. "login:ip:1.2.3.4", "login:email:user@x.com")
// within a single fixed window whose start is stored in window_start.
export const rateLimits = pgTable("rate_limits", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  count: integer("count").notNull().default(0),
  windowStart: bigint("window_start", { mode: "number" }).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Verification sources for legal / financial facts
export const verificationSources = pgTable("verification_sources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  sourceUrl: text("source_url").notNull(),
  category: text("category").notNull(), // ظ‚ظˆط§ظ†ظٹظ†, ط³ط¬ظ„ظٹ طھط¬ط§ط±ظٹ, ط£ط³ط¹ط§ط±, ط¯ط±ط§ط³ط©
  notes: text("notes"),
  lastVerified: timestamp("last_verified").defaultNow(),
});

// Central registry of data sources (Phase 0 - Transparency & Credibility)
export const dataSources = pgTable("data_sources", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  institution: text("institution").notNull(),
  sourceType: text("source_type").notNull(), // official, institutional, secondary, estimated
  url: text("url"),
  category: text("category").notNull(), // population, area, economy, market, transport, projects, legal, other
  confidenceGrade: text("confidence_grade").notNull().default("U"), // A, B, C, D, U
  documentTitle: text("document_title"),
  documentYear: integer("document_year"),
  documentType: text("document_type"), // census, report, law, decree, dataset, portal, other
  accessedAt: timestamp("accessed_at"),
  published: boolean("published").notNull().default(false), // public visibility flag
  notes: text("notes"),
  lastVerifiedAt: timestamp("last_verified_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Blog Posts for SEO content
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(), // ظ†طµط§ط¦ط­, ط¯ط±ط§ط³ط§طھ ط±ط£ط³ ط§ظ„ظ…ط§ظ„, ظ…ط´ط§ط±ظٹط¹ ظ…ظ†ط²ظ„ظٹط©
  capitalRange: text("capital_range"),
  readTime: text("read_time").default("5 ط¯ظ‚ط§ط¦ظ‚"),
  image: text("image"),
  infographic: text("infographic"),
  sources: text("sources"), // JSON array of source citations
  financialData: text("financial_data"), // JSON object with verified financial figures
  createdAt: timestamp("created_at").defaultNow(),
});

// Visitor Profiles - Captured at first access for database building
export const visitorProfiles = pgTable("visitor_profiles", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  age: integer("age").notNull(),
  wilayaId: integer("wilaya_id").notNull().references(() => wilayas.id, { onDelete: "restrict" }),
  wilayaName: text("wilaya_name").notNull(),
  phone: text("phone"),
  email: text("email"),
  sessionToken: text("session_token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Commune Statistics - Local market and demographic data
export const communeStats = pgTable("commune_stats", {
  id: serial("id").primaryKey(),
  communeId: integer("commune_id").notNull().unique(),

  // Official / calculated demographic data
  population: integer("population"),
  populationSource: text("population_source"),
  populationYear: integer("population_year"),
  populationConfidence: text("population_confidence"), // A, B, C, D, U
  populationSourceId: integer("population_source_id").references(() => dataSources.id, { onDelete: "set null" }),

  areaKm2: numeric("area_km2", { precision: 12, scale: 2 }),
  areaSource: text("area_source"),
  areaYear: integer("area_year"),
  areaConfidence: text("area_confidence"), // A, B, C, D, U
  areaSourceId: integer("area_source_id").references(() => dataSources.id, { onDelete: "set null" }),

  density: numeric("density", { precision: 12, scale: 2 }),
  densityType: text("density_type").default("calculated"),

  // Administrative information
  dairaNameAr: text("daira_name_ar"),
  dairaNameFr: text("daira_name_fr"),
  dairaSource: text("daira_source"),

  wilayaId: integer("wilaya_id").notNull(),
  wilayaSource: text("wilaya_source"),

  // Commercial / market data
  merchantCount: integer("merchant_count"),
  merchantCountSource: text("merchant_count_source"),
  merchantCountYear: integer("merchant_count_year"),

  commercialActivities: jsonb("commercial_activities")
    .$type<{ activity: string; count?: number }[]>(),

  commercialActivitiesSource: text("commercial_activities_source"),

  // Analytical indicators — NOT official government statistics
  marketScore: integer("market_score").default(50),
  marketScoreMethod: text("market_score_method"),

  purchasingPowerScore: integer("purchasing_power_score").default(50),
  purchasingPowerMethod: text("purchasing_power_method"),

  competitionScore: integer("competition_score").default(50),
  competitionMethod: text("competition_method"),

  commercialActivityScore: integer("commercial_activity_score").default(50),
  commercialActivityMethod: text("commercial_activity_method"),

  overallScore: integer("overall_score"),
  overallScoreMethod: text("overall_score_method"),

  notes: text("notes"),

  lastVerifiedAt: timestamp("last_verified_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Wilaya-level demographic and area statistics (Phase 0 - Transparency & Credibility)
export const wilayaStats = pgTable("wilaya_stats", {
  id: serial("id").primaryKey(),
  wilayaId: integer("wilaya_id").notNull().unique().references(() => wilayas.id, { onDelete: "cascade" }),
  population: integer("population"),
  populationSourceId: integer("population_source_id").references(() => dataSources.id, { onDelete: "set null" }),
  populationYear: integer("population_year"),
  populationConfidence: text("population_confidence"), // A, B, C, D, U
  areaKm2: numeric("area_km2", { precision: 12, scale: 2 }),
  areaSourceId: integer("area_source_id").references(() => dataSources.id, { onDelete: "set null" }),
  areaYear: integer("area_year"),
  areaConfidence: text("area_confidence"), // A, B, C, D, U
  density: numeric("density", { precision: 12, scale: 2 }),
  densityType: text("density_type").default("calculated"), // calculated, official
  lastVerifiedAt: timestamp("last_verified_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================================================
// NABDA growth architecture — categories/domains, no-capital path, courses,
// content creation, hook library, videos and legal consent gate.
// NOTE: these tables are added to the schema but the corresponding migration
// is NOT applied to Production yet. API routes fall back to code defaults
// whenever a table does not exist (PostgreSQL error 42P01).
// ============================================================================

// Categories / Domains — hierarchical reference (domain → category)
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  parentId: integer("parent_id"), // NULL for top-level domains
  slug: text("slug").notNull().unique(),
  nameAr: text("name_ar").notNull(),
  nameFr: text("name_fr").notNull(),
  type: text("type").notNull().default("category"), // domain, category
  icon: text("icon"),
  description: text("description"),
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// No-capital test — flexible question bank (admin managed, defaults in code)
export const noCapitalQuestions = pgTable(
  "no_capital_questions",
  {
    id: serial("id").primaryKey(),
    questionKey: text("question_key").notNull().unique(),
    type: text("type").notNull().default("single"), // single, multi, text
    title: text("title").notNull(),
    subtitle: text("subtitle"),
    required: boolean("required").notNull().default(true),
    order: integer("order").notNull().default(0),
    options: jsonb("options")
      .$type<NoCapitalOption[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [index("idx_nocap_questions_active").on(t.active)],
);

// No-capital project profiles — table stays EMPTY until curated by the team.
export const noCapitalProjects = pgTable(
  "no_capital_projects",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    nameAr: text("name_ar").notNull(),
    nameFr: text("name_fr"),
    categoryId: integer("category_id").references(() => categories.id, { onDelete: "set null" }),
    domainId: integer("domain_id").references(() => categories.id, { onDelete: "set null" }),
    description: text("description").notNull(),
    effortLevel: text("effort_level").notNull().default("متوسط"), // منخفض, متوسط, مرتفع
    timeRequired: text("time_required").notNull().default("2-4 ساعات"),
    skillsRequired: jsonb("skills_required").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    toolsNeeded: jsonb("tools_needed").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    startCostEstimate: text("start_cost_estimate").notNull().default("0 دج"),
    startCostType: text("start_cost_type").notNull().default("zero_tools_existing"), // zero_tools_existing, low_capital, capital
    tags: jsonb("tags").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    risks: jsonb("risks").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    advantages: jsonb("advantages").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    disadvantages: jsonb("disadvantages").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    steps: jsonb("steps").$type<{ title: string; detail: string }[]>().notNull().default(sql`'[]'::jsonb`),
    legalNotes: text("legal_notes"),
    source: text("source").default("دراسة ميدانية وسوق جزائري 2025"),
    active: boolean("active").notNull().default(true),
    lastUpdated: timestamp("last_updated").defaultNow(),
  },
  (t) => [
    index("idx_nocap_projects_category").on(t.categoryId),
    index("idx_nocap_projects_domain").on(t.domainId),
    index("idx_nocap_projects_active").on(t.active),
  ],
);

// Recommendation rules — extra control over the no-capital matching engine
export const noCapitalRecommendationRules = pgTable(
  "no_capital_recommendation_rules",
  {
    id: serial("id").primaryKey(),
    questionKey: text("question_key").notNull(),
    optionValue: text("option_value").notNull(),
    tag: text("tag").notNull(),
    weight: integer("weight").notNull().default(1),
    note: text("note"),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [unique("uq_rules_question_option_tag").on(t.questionKey, t.optionValue, t.tag)],
);

// Anonymous no-capital test results (no personal data, only answers + output)
export const noCapitalTestResults = pgTable(
  "no_capital_test_results",
  {
    id: serial("id").primaryKey(),
    sessionId: text("session_id").notNull(),
    answers: jsonb("answers").$type<Record<string, NoCapitalAnswer>>().notNull(),
    recommendations: jsonb("recommendations")
      .$type<NoCapitalRecommendationSummary[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("idx_nocap_test_session").on(t.sessionId)],
);

// 90-day execution plans (3 months, weekly phases)
export const executionPlans = pgTable(
  "execution_plans",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    subtitle: text("subtitle"),
    domainId: integer("domain_id").references(() => categories.id, { onDelete: "set null" }),
    noCapitalProjectId: integer("no_capital_project_id").references(() => noCapitalProjects.id, { onDelete: "set null" }),
    durationDays: integer("duration_days").notNull().default(90),
    objective: text("objective"),
    phases: jsonb("phases")
      .$type<ExecutionPhase[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    kpis: jsonb("kpis").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    version: text("version").notNull().default("1.0"),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("idx_exec_plans_domain").on(t.domainId),
    index("idx_exec_plans_project").on(t.noCapitalProjectId),
  ],
);

// First customer / first order plans
export const firstOrderPlans = pgTable(
  "first_order_plans",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    domainId: integer("domain_id").references(() => categories.id, { onDelete: "set null" }),
    noCapitalProjectId: integer("no_capital_project_id").references(() => noCapitalProjects.id, { onDelete: "set null" }),
    targetAudience: text("target_audience"),
    valueProposition: text("value_proposition"),
    channels: jsonb("channels").$type<{ channel: string; effort: string; notes: string }[]>().notNull().default(sql`'[]'::jsonb`),
    outreachSteps: jsonb("outreach_steps").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    scriptText: text("script_text"),
    successMetrics: jsonb("success_metrics").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("idx_first_order_domain").on(t.domainId),
    index("idx_first_order_project").on(t.noCapitalProjectId),
  ],
);

// Marketing plans (budget-tagged channel mixes)
export const marketingPlans = pgTable(
  "marketing_plans",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    domainId: integer("domain_id").references(() => categories.id, { onDelete: "set null" }),
    noCapitalProjectId: integer("no_capital_project_id").references(() => noCapitalProjects.id, { onDelete: "set null" }),
    budgetLevel: text("budget_level").notNull().default("low"), // low, medium, high
    goals: jsonb("goals").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    channels: jsonb("channels")
      .$type<{ channel: string; priority: string; cost: string; effort: string; notes: string }[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    timelineWeeks: jsonb("timeline_weeks").$type<{ week: string; focus: string; tasks: string[] }[]>().notNull().default(sql`'[]'::jsonb`),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("idx_marketing_domain").on(t.domainId),
    index("idx_marketing_project").on(t.noCapitalProjectId),
  ],
);

// Free courses + lessons
export const courses = pgTable(
  "courses",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    description: text("description"),
    categoryId: integer("category_id").references(() => categories.id, { onDelete: "set null" }),
    level: text("level").notNull().default("مبتدئ"),
    durationMinutes: integer("duration_minutes").notNull().default(30),
    lessonsCount: integer("lessons_count").notNull().default(0),
    sortOrder: integer("sort_order").notNull().default(0),
    featured: boolean("featured").notNull().default(false),
    recommended: boolean("recommended").notNull().default(false),
    contentYear: integer("content_year").notNull().default(2026),
    contentSource: text("content_source").notNull().default("dz"),
    channelName: text("channel_name"),
    coverImage: text("cover_image"),
    published: boolean("published").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [index("idx_courses_category").on(t.categoryId)],
);

export const courseLessons = pgTable(
  "course_lessons",
  {
    id: serial("id").primaryKey(),
    courseId: integer("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    summary: text("summary"),
    content: text("content"),
    order: integer("order").notNull().default(0),
    durationMinutes: integer("duration_minutes").notNull().default(5),
    videoUrl: text("video_url"),
    published: boolean("published").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [index("idx_course_lessons_course").on(t.courseId)],
);

// Content creation — ideas, scripts, reference types and publishing plan
export const contentIdeas = pgTable(
  "content_ideas",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    categoryId: integer("category_id").references(() => categories.id, { onDelete: "set null" }),
    contentType: text("content_type").notNull().default("idea"), // idea, topic
    platform: text("platform"), // tiktok, instagram, youtube, facebook
    niche: text("niche"),
    angle: text("angle"),
    outline: jsonb("outline").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    cta: text("cta"),
    published: boolean("published").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("idx_content_ideas_category").on(t.categoryId)],
);

export const contentScripts = pgTable("content_scripts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  contentType: text("content_type").notNull().default("reel"), // reel, short, long
  platform: text("platform"),
  hook: text("hook"),
  format: jsonb("format").$type<{ section: string; duration: string; text: string }[]>().notNull().default(sql`'[]'::jsonb`),
  cta: text("cta"),
  durationSeconds: integer("duration_seconds").notNull().default(30),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contentTypes = pgTable("content_types", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  nameAr: text("name_ar").notNull(),
  description: text("description"),
  bestPractices: jsonb("best_practices").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  example: text("example"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contentPublishingPlans = pgTable(
  "content_publishing_plans",
  {
    id: serial("id").primaryKey(),
    platform: text("platform").notNull().unique(),
    cadence: text("cadence"),
    bestTimes: jsonb("best_times").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    tips: jsonb("tips").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [index("idx_publishing_plans_active").on(t.active)],
);

// 100+ hook library — table stays EMPTY until the content team curates it.
export const hookLibrary = pgTable(
  "hook_library",
  {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    hookText: text("hook_text").notNull(),
    type: text("type").notNull().default("question"), // question, number, curiosity, contrast, story
    niche: text("niche"),
    categoryId: integer("category_id").references(() => categories.id, { onDelete: "set null" }),
    usageContext: text("usage_context"),
    strength: text("strength").notNull().default("medium"), // low, medium, high
    example: text("example"),
    published: boolean("published").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [index("idx_hooks_category").on(t.categoryId)],
);

// Videos system
export const videos = pgTable(
  "videos",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    videoUrl: text("video_url"),
    embedUrl: text("embed_url"),
    durationSeconds: integer("duration_seconds").notNull().default(0),
    categoryId: integer("category_id").references(() => categories.id, { onDelete: "set null" }),
    description: text("description"),
    thumbnailUrl: text("thumbnail_url"),
    transcript: text("transcript"),
    published: boolean("published").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [index("idx_videos_category").on(t.categoryId)],
);

// Legal consent gate — versioned consent text + signed records
export const consentVersions = pgTable("consent_versions", {
  id: serial("id").primaryKey(),
  version: text("version").notNull().unique(),
  title: text("title").notNull(),
  text: text("text").notNull(),
  required: boolean("required").notNull().default(true),
  active: boolean("active").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const consentRecords = pgTable(
  "consent_records",
  {
    id: serial("id").primaryKey(),
    sessionId: text("session_id").notNull(),
    consentVersionId: integer("consent_version_id").references(() => consentVersions.id, { onDelete: "restrict" }),
    purpose: text("purpose").notNull().default("assessment"), // assessment, no-capital, plan
    signedAt: timestamp("signed_at").defaultNow().notNull(),
  },
  (t) => [
    index("idx_consent_records_session").on(t.sessionId),
    index("idx_consent_records_version").on(t.consentVersionId),
  ],
);

// ============================================================
// Domains — 25 top-level business domains (separate from categories)
// ============================================================
export const domains = pgTable("domains", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  nameAr: text("name_ar").notNull(),
  icon: text("icon").notNull().default("💼"),
  capitalLevel: text("capital_level").notNull().default("منخفض"),
  definition: text("definition"),
  requirements: text("requirements"),
  essentials: text("essentials"),
  secondary: text("secondary"),
  services: text("services"),
  regulated: boolean("regulated").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================================
// Device Tokens — FCM push notification tokens per user/device
// ============================================================
export const deviceTokens = pgTable("device_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  platform: text("platform").notNull().default("android"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================================
// Library — paid books & guides (PDF delivered manually via
// Telegram after payment confirmation). No PDF stored/exposed.
// ============================================================
export const libraryBooks = pgTable("library_books", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  category: text("category").notNull().default("عام"), // المجال
  shortDescription: text("short_description").notNull(),
  description: text("description"),
  coverImage: text("cover_image"),
  whatYouLearn: jsonb("what_you_learn").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  outline: jsonb("outline").$type<string[]>().notNull().default(sql`'[]'::jsonb`), // المحاور/المحتوى
  priceDzd: integer("price_dzd").notNull().default(0),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
