import { pgTable, serial, text, integer, timestamp, jsonb, numeric, boolean } from "drizzle-orm/pg-core";



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

// Verification sources for legal / financial facts
export const verificationSources = pgTable("verification_sources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  sourceUrl: text("source_url").notNull(),
  category: text("category").notNull(), // ظ‚ظˆط§ظ†ظٹظ†, ط³ط¬ظ„ظٹ طھط¬ط§ط±ظٹ, ط£ط³ط¹ط§ط±, ط¯ط±ط§ط³ط©
  notes: text("notes"),
  lastVerified: timestamp("last_verified").defaultNow(),
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

  areaKm2: numeric("area_km2", { precision: 12, scale: 2 }),
  areaSource: text("area_source"),
  areaYear: integer("area_year"),

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
