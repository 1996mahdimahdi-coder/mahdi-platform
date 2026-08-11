import { pgTable, text, timestamp, boolean, integer, jsonb, serial } from "drizzle-orm/pg-core";

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
  category: text("category").notNull(), // تجارة, خدمات, أونلاين, زراعة, صناعة تقليدية, تعليم, الخ
  description: text("description").notNull(),
  
  minCapital: integer("min_capital").notNull(), // e.g. 30000
  recommendedCapital: integer("recommended_capital").notNull(), // e.g. 100000
  maxCapital: integer("max_capital").notNull(), // e.g. 300000
  
  riskLevel: text("risk_level").notNull(), // منخفض, متوسط, مرتفع
  requiresShop: boolean("requires_shop").notNull().default(false),
  homeBased: boolean("home_based").notNull().default(true),
  onlinePossible: boolean("online_possible").notNull().default(true),
  transportRequired: boolean("transport_required").notNull().default(false),
  
  skillsRequired: jsonb("skills_required").$type<string[]>().notNull(), // array of skills e.g. ["البيع", "التسويق"]
  timeRequired: text("time_required").notNull(), // "أقل من ساعتين", "2-4 ساعات", "دوام كامل"
  difficulty: text("difficulty").notNull().default("سهل"), // سهل, متوسط, صعبة
  scalability: text("scalability").notNull().default("مرتفعة"), // منخفضة, متوسطة, مرتفعة
  seasonality: text("seasonality").notNull().default("طوال السنة"), // طوال السنة, صيفي, رمضاني, الخ
  competitionLevel: text("competition_level").notNull().default("متوسطة"), // منخفضة, متوسطة, مرتفعة
  targetArea: text("target_area").notNull().default("جميع المناطق"), // جميع المناطق, مدن كبيرة, بلديات صغيرة, الخ
  
  equipment: jsonb("equipment").$type<{ item: string; cost: number }[]>().notNull(),
  initialStock: integer("initial_stock").notNull().default(0),
  fixedCosts: integer("fixed_costs").notNull().default(0),
  variableCostsPercent: integer("variable_costs_percent").notNull().default(10),
  
  pricingMethod: text("pricing_method").notNull().default("هامش ربح ثابت"),
  profitFormula: text("profit_formula").notNull().default("الإيرادات - التكاليف"),
  breakEvenFormula: text("break_even_formula").notNull().default("التكاليف الثابتة / هامش الربح للوحدة"),
  
  risks: jsonb("risks").$type<string[]>().notNull(),
  advantages: jsonb("advantages").$type<string[]>().notNull(),
  disadvantages: jsonb("disadvantages").$type<string[]>().notNull(),
  
  launchPlan: jsonb("launch_plan").$type<{ week: string; title: string; tasks: string[] }[]>().notNull(),
  legalNotes: text("legal_notes").default("لا يقتضي إجراءات معقدة في البداية التجريبية"),
  
  source: text("source").default("دراسة ميدانية وسوق جزائري 2025"),
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
  category: text("category").notNull(), // قوانين, سجلي تجاري, أسعار, دراسة
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
  category: text("category").notNull(), // نصائح, دراسات رأس المال, مشاريع منزلية
  capitalRange: text("capital_range"),
  readTime: text("read_time").default("5 دقائق"),
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
