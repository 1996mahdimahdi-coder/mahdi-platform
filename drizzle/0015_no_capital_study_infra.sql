-- ============================================================================
-- 0015 — No-Capital Paid-Study Infrastructure (LOCAL application)
--
-- Objective: enable the no_capital_projects table (with its `study` JSONB
-- column) and its direct dependencies on the LOCAL database only, matching
-- src/db/schema.ts exactly.
--
-- Context:
--   * Migration 0004 (an older snapshot) does NOT contain the `study` column.
--   * The `study` column + `start_cost_type` exist only in schema.ts.
--   * The local DB has NONE of the NABDA growth tables.
--   * drizzle-kit push is interactive-blocked in non-TTY and the project's
--     empirical workflow is controlled SQL application.
--
-- This file is IDEMPOTENT (every statement is IF NOT EXISTS) and purely
-- additive — it never drops or alters existing tables.
-- It confines scope to the tables required by no_capital_projects and the
-- plan tables that hold FOREIGN KEYs to it:
--   * categories                 (FK target for category_id / domain_id)
--   * no_capital_projects        (primary; holds `study` JSONB)
--   * execution_plans            (FK -> no_capital_projects)
--   * first_order_plans          (FK -> no_capital_projects)
--   * marketing_plans            (FK -> no_capital_projects)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- categories (prerequisite FK target)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "public"."categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"parent_id" integer,
	"slug" text NOT NULL,
	"name_ar" text NOT NULL,
	"name_fr" text NOT NULL,
	"type" text DEFAULT 'category' NOT NULL,
	"icon" text,
	"description" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);

-- ----------------------------------------------------------------------------
-- no_capital_projects (primary table, includes `study` JSONB)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "public"."no_capital_projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name_ar" text NOT NULL,
	"name_fr" text,
	"category_id" integer,
	"domain_id" integer,
	"description" text NOT NULL,
	"effort_level" text DEFAULT 'متوسط' NOT NULL,
	"time_required" text DEFAULT '2-4 ساعات' NOT NULL,
	"skills_required" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"tools_needed" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"start_cost_estimate" text DEFAULT '0 دج' NOT NULL,
	"start_cost_type" text DEFAULT 'zero_tools_existing' NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"risks" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"advantages" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"disadvantages" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"steps" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"legal_notes" text,
	"source" text DEFAULT 'دراسة ميدانية وسوق جزائري 2025',
	"active" boolean DEFAULT true NOT NULL,
	"study" jsonb DEFAULT NULL,
	"last_updated" timestamp DEFAULT now(),
	CONSTRAINT "no_capital_projects_slug_unique" UNIQUE("slug")
);

-- ----------------------------------------------------------------------------
-- execution_plans (FK -> no_capital_projects)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "public"."execution_plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"domain_id" integer,
	"no_capital_project_id" integer,
	"duration_days" integer DEFAULT 90 NOT NULL,
	"objective" text,
	"phases" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"kpis" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"version" text DEFAULT '1.0' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "execution_plans_slug_unique" UNIQUE("slug")
);

-- ----------------------------------------------------------------------------
-- first_order_plans (FK -> no_capital_projects)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "public"."first_order_plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"domain_id" integer,
	"no_capital_project_id" integer,
	"target_audience" text,
	"value_proposition" text,
	"channels" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"outreach_steps" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"script_text" text,
	"success_metrics" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "first_order_plans_slug_unique" UNIQUE("slug")
);

-- ----------------------------------------------------------------------------
-- marketing_plans (FK -> no_capital_projects)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "public"."marketing_plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"domain_id" integer,
	"no_capital_project_id" integer,
	"budget_level" text DEFAULT 'low' NOT NULL,
	"goals" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"channels" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"timeline_weeks" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "marketing_plans_slug_unique" UNIQUE("slug")
);

-- ----------------------------------------------------------------------------
-- Foreign key constraints (idempotent via DO blocks)
-- ----------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'no_capital_projects_category_id_categories_id_fk') THEN
    ALTER TABLE "public"."no_capital_projects"
      ADD CONSTRAINT "no_capital_projects_category_id_categories_id_fk"
      FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'no_capital_projects_domain_id_categories_id_fk') THEN
    ALTER TABLE "public"."no_capital_projects"
      ADD CONSTRAINT "no_capital_projects_domain_id_categories_id_fk"
      FOREIGN KEY ("domain_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'execution_plans_domain_id_categories_id_fk') THEN
    ALTER TABLE "public"."execution_plans"
      ADD CONSTRAINT "execution_plans_domain_id_categories_id_fk"
      FOREIGN KEY ("domain_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'execution_plans_no_capital_project_id_no_capital_projects_id_fk') THEN
    ALTER TABLE "public"."execution_plans"
      ADD CONSTRAINT "execution_plans_no_capital_project_id_no_capital_projects_id_fk"
      FOREIGN KEY ("no_capital_project_id") REFERENCES "public"."no_capital_projects"("id") ON DELETE set null ON UPDATE no action;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'first_order_plans_domain_id_categories_id_fk') THEN
    ALTER TABLE "public"."first_order_plans"
      ADD CONSTRAINT "first_order_plans_domain_id_categories_id_fk"
      FOREIGN KEY ("domain_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'first_order_plans_no_capital_project_id_no_capital_projects_id_fk') THEN
    ALTER TABLE "public"."first_order_plans"
      ADD CONSTRAINT "first_order_plans_no_capital_project_id_no_capital_projects_id_fk"
      FOREIGN KEY ("no_capital_project_id") REFERENCES "public"."no_capital_projects"("id") ON DELETE set null ON UPDATE no action;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'marketing_plans_domain_id_categories_id_fk') THEN
    ALTER TABLE "public"."marketing_plans"
      ADD CONSTRAINT "marketing_plans_domain_id_categories_id_fk"
      FOREIGN KEY ("domain_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'marketing_plans_no_capital_project_id_no_capital_projects_id_fk') THEN
    ALTER TABLE "public"."marketing_plans"
      ADD CONSTRAINT "marketing_plans_no_capital_project_id_no_capital_projects_id_fk"
      FOREIGN KEY ("no_capital_project_id") REFERENCES "public"."no_capital_projects"("id") ON DELETE set null ON UPDATE no action;
  END IF;
END $$;

-- ----------------------------------------------------------------------------
-- Indexes (idempotent)
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS "idx_nocap_projects_category" ON "public"."no_capital_projects" USING btree ("category_id");
CREATE INDEX IF NOT EXISTS "idx_nocap_projects_domain" ON "public"."no_capital_projects" USING btree ("domain_id");
CREATE INDEX IF NOT EXISTS "idx_nocap_projects_active" ON "public"."no_capital_projects" USING btree ("active");
CREATE INDEX IF NOT EXISTS "idx_exec_plans_domain" ON "public"."execution_plans" USING btree ("domain_id");
CREATE INDEX IF NOT EXISTS "idx_exec_plans_project" ON "public"."execution_plans" USING btree ("no_capital_project_id");
CREATE INDEX IF NOT EXISTS "idx_first_order_domain" ON "public"."first_order_plans" USING btree ("domain_id");
CREATE INDEX IF NOT EXISTS "idx_first_order_project" ON "public"."first_order_plans" USING btree ("no_capital_project_id");
CREATE INDEX IF NOT EXISTS "idx_marketing_domain" ON "public"."marketing_plans" USING btree ("domain_id");
CREATE INDEX IF NOT EXISTS "idx_marketing_project" ON "public"."marketing_plans" USING btree ("no_capital_project_id");