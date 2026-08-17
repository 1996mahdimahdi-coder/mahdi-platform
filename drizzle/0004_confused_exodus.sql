CREATE TABLE "categories" (
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
--> statement-breakpoint
CREATE TABLE "consent_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"consent_version_id" integer,
	"purpose" text DEFAULT 'assessment' NOT NULL,
	"signed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "consent_versions" (
	"id" serial PRIMARY KEY NOT NULL,
	"version" text NOT NULL,
	"title" text NOT NULL,
	"text" text NOT NULL,
	"required" boolean DEFAULT true NOT NULL,
	"active" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "consent_versions_version_unique" UNIQUE("version")
);
--> statement-breakpoint
CREATE TABLE "content_ideas" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"category_id" integer,
	"content_type" text DEFAULT 'idea' NOT NULL,
	"platform" text,
	"niche" text,
	"angle" text,
	"outline" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"cta" text,
	"published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_publishing_plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"platform" text NOT NULL,
	"cadence" text,
	"best_times" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"tips" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "content_publishing_plans_platform_unique" UNIQUE("platform")
);
--> statement-breakpoint
CREATE TABLE "content_scripts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content_type" text DEFAULT 'reel' NOT NULL,
	"platform" text,
	"hook" text,
	"format" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"cta" text,
	"duration_seconds" integer DEFAULT 30 NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name_ar" text NOT NULL,
	"description" text,
	"best_practices" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"example" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "content_types_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "course_lessons" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer NOT NULL,
	"title" text NOT NULL,
	"summary" text,
	"content" text,
	"order" integer DEFAULT 0 NOT NULL,
	"duration_minutes" integer DEFAULT 5 NOT NULL,
	"video_url" text,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"description" text,
	"category_id" integer,
	"level" text DEFAULT 'مبتدئ' NOT NULL,
	"duration_minutes" integer DEFAULT 30 NOT NULL,
	"lessons_count" integer DEFAULT 0 NOT NULL,
	"cover_image" text,
	"published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "courses_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "execution_plans" (
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
--> statement-breakpoint
CREATE TABLE "first_order_plans" (
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
--> statement-breakpoint
CREATE TABLE "hook_library" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"hook_text" text NOT NULL,
	"type" text DEFAULT 'question' NOT NULL,
	"niche" text,
	"category_id" integer,
	"usage_context" text,
	"strength" text DEFAULT 'medium' NOT NULL,
	"example" text,
	"published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "marketing_plans" (
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
--> statement-breakpoint
CREATE TABLE "no_capital_projects" (
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
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"risks" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"advantages" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"disadvantages" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"steps" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"legal_notes" text,
	"source" text DEFAULT 'دراسة ميدانية وسوق جزائري 2025',
	"active" boolean DEFAULT true NOT NULL,
	"last_updated" timestamp DEFAULT now(),
	CONSTRAINT "no_capital_projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "no_capital_questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"question_key" text NOT NULL,
	"type" text DEFAULT 'single' NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"required" boolean DEFAULT true NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"options" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "no_capital_questions_question_key_unique" UNIQUE("question_key")
);
--> statement-breakpoint
CREATE TABLE "no_capital_recommendation_rules" (
	"id" serial PRIMARY KEY NOT NULL,
	"question_key" text NOT NULL,
	"option_value" text NOT NULL,
	"tag" text NOT NULL,
	"weight" integer DEFAULT 1 NOT NULL,
	"note" text,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "uq_rules_question_option_tag" UNIQUE("question_key","option_value","tag")
);
--> statement-breakpoint
CREATE TABLE "no_capital_test_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"answers" jsonb NOT NULL,
	"recommendations" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "videos" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"video_url" text,
	"embed_url" text,
	"duration_seconds" integer DEFAULT 0 NOT NULL,
	"category_id" integer,
	"description" text,
	"thumbnail_url" text,
	"transcript" text,
	"published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "videos_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "consent_records" ADD CONSTRAINT "consent_records_consent_version_id_consent_versions_id_fk" FOREIGN KEY ("consent_version_id") REFERENCES "public"."consent_versions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_ideas" ADD CONSTRAINT "content_ideas_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_lessons" ADD CONSTRAINT "course_lessons_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_plans" ADD CONSTRAINT "execution_plans_domain_id_categories_id_fk" FOREIGN KEY ("domain_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "execution_plans" ADD CONSTRAINT "execution_plans_no_capital_project_id_no_capital_projects_id_fk" FOREIGN KEY ("no_capital_project_id") REFERENCES "public"."no_capital_projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "first_order_plans" ADD CONSTRAINT "first_order_plans_domain_id_categories_id_fk" FOREIGN KEY ("domain_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "first_order_plans" ADD CONSTRAINT "first_order_plans_no_capital_project_id_no_capital_projects_id_fk" FOREIGN KEY ("no_capital_project_id") REFERENCES "public"."no_capital_projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hook_library" ADD CONSTRAINT "hook_library_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketing_plans" ADD CONSTRAINT "marketing_plans_domain_id_categories_id_fk" FOREIGN KEY ("domain_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketing_plans" ADD CONSTRAINT "marketing_plans_no_capital_project_id_no_capital_projects_id_fk" FOREIGN KEY ("no_capital_project_id") REFERENCES "public"."no_capital_projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "no_capital_projects" ADD CONSTRAINT "no_capital_projects_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "no_capital_projects" ADD CONSTRAINT "no_capital_projects_domain_id_categories_id_fk" FOREIGN KEY ("domain_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "videos" ADD CONSTRAINT "videos_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_consent_records_session" ON "consent_records" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "idx_consent_records_version" ON "consent_records" USING btree ("consent_version_id");--> statement-breakpoint
CREATE INDEX "idx_content_ideas_category" ON "content_ideas" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "idx_publishing_plans_active" ON "content_publishing_plans" USING btree ("active");--> statement-breakpoint
CREATE INDEX "idx_course_lessons_course" ON "course_lessons" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX "idx_courses_category" ON "courses" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "idx_exec_plans_domain" ON "execution_plans" USING btree ("domain_id");--> statement-breakpoint
CREATE INDEX "idx_exec_plans_project" ON "execution_plans" USING btree ("no_capital_project_id");--> statement-breakpoint
CREATE INDEX "idx_first_order_domain" ON "first_order_plans" USING btree ("domain_id");--> statement-breakpoint
CREATE INDEX "idx_first_order_project" ON "first_order_plans" USING btree ("no_capital_project_id");--> statement-breakpoint
CREATE INDEX "idx_hooks_category" ON "hook_library" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "idx_marketing_domain" ON "marketing_plans" USING btree ("domain_id");--> statement-breakpoint
CREATE INDEX "idx_marketing_project" ON "marketing_plans" USING btree ("no_capital_project_id");--> statement-breakpoint
CREATE INDEX "idx_nocap_projects_category" ON "no_capital_projects" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "idx_nocap_projects_domain" ON "no_capital_projects" USING btree ("domain_id");--> statement-breakpoint
CREATE INDEX "idx_nocap_projects_active" ON "no_capital_projects" USING btree ("active");--> statement-breakpoint
CREATE INDEX "idx_nocap_questions_active" ON "no_capital_questions" USING btree ("active");--> statement-breakpoint
CREATE INDEX "idx_nocap_test_session" ON "no_capital_test_results" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "idx_videos_category" ON "videos" USING btree ("category_id");