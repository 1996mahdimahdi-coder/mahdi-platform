CREATE TABLE "analysis_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"session_id" text,
	"user_capital" integer NOT NULL,
	"test_answers" jsonb NOT NULL,
	"top_projects" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"content" text NOT NULL,
	"category" text NOT NULL,
	"capital_range" text,
	"read_time" text DEFAULT '5 دقائق',
	"image" text,
	"infographic" text,
	"sources" text,
	"financial_data" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "communes" (
	"id" serial PRIMARY KEY NOT NULL,
	"wilaya_id" integer NOT NULL,
	"name_ar" text NOT NULL,
	"name_fr" text NOT NULL,
	"population_density" text DEFAULT 'medium'
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"project_name" text NOT NULL,
	"category" text NOT NULL,
	"description" text NOT NULL,
	"min_capital" integer NOT NULL,
	"recommended_capital" integer NOT NULL,
	"max_capital" integer NOT NULL,
	"risk_level" text NOT NULL,
	"requires_shop" boolean DEFAULT false NOT NULL,
	"home_based" boolean DEFAULT true NOT NULL,
	"online_possible" boolean DEFAULT true NOT NULL,
	"transport_required" boolean DEFAULT false NOT NULL,
	"skills_required" jsonb NOT NULL,
	"time_required" text NOT NULL,
	"difficulty" text DEFAULT 'سهل' NOT NULL,
	"scalability" text DEFAULT 'مرتفعة' NOT NULL,
	"seasonality" text DEFAULT 'طوال السنة' NOT NULL,
	"competition_level" text DEFAULT 'متوسطة' NOT NULL,
	"target_area" text DEFAULT 'جميع المناطق' NOT NULL,
	"equipment" jsonb NOT NULL,
	"initial_stock" integer DEFAULT 0 NOT NULL,
	"fixed_costs" integer DEFAULT 0 NOT NULL,
	"variable_costs_percent" integer DEFAULT 10 NOT NULL,
	"pricing_method" text DEFAULT 'هامش ربح ثابت' NOT NULL,
	"profit_formula" text DEFAULT 'الإيرادات - التكاليف' NOT NULL,
	"break_even_formula" text DEFAULT 'التكاليف الثابتة / هامش الربح للوحدة' NOT NULL,
	"risks" jsonb NOT NULL,
	"advantages" jsonb NOT NULL,
	"disadvantages" jsonb NOT NULL,
	"launch_plan" jsonb NOT NULL,
	"legal_notes" text DEFAULT 'لا يقتضي إجراءات معقدة في البداية التجريبية',
	"source" text DEFAULT 'دراسة ميدانية وسوق جزائري 2025',
	"last_updated" timestamp DEFAULT now(),
	CONSTRAINT "projects_project_id_unique" UNIQUE("project_id")
);
--> statement-breakpoint
CREATE TABLE "scoring_weights" (
	"id" serial PRIMARY KEY NOT NULL,
	"financial_weight" integer DEFAULT 25 NOT NULL,
	"personal_weight" integer DEFAULT 15 NOT NULL,
	"workspace_weight" integer DEFAULT 10 NOT NULL,
	"location_weight" integer DEFAULT 15 NOT NULL,
	"risk_weight" integer DEFAULT 10 NOT NULL,
	"startability_weight" integer DEFAULT 10 NOT NULL,
	"scalability_weight" integer DEFAULT 10 NOT NULL,
	"time_weight" integer DEFAULT 5 NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"capital" integer NOT NULL,
	"wilaya_id" integer,
	"commune_id" integer,
	"workspace" text,
	"available_hours" text,
	"skills" jsonb,
	"risk_level" text,
	"transport" text,
	"existing_income" text,
	"objective" text,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" text DEFAULT 'user' NOT NULL,
	"phone" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification_sources" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"source_url" text NOT NULL,
	"category" text NOT NULL,
	"notes" text,
	"last_verified" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "visitor_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"age" integer NOT NULL,
	"wilaya_id" integer NOT NULL,
	"wilaya_name" text NOT NULL,
	"phone" text,
	"email" text,
	"session_token" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "visitor_profiles_session_token_unique" UNIQUE("session_token")
);
--> statement-breakpoint
CREATE TABLE "wilayas" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name_ar" text NOT NULL,
	"name_fr" text NOT NULL,
	"area_type" text DEFAULT 'urban' NOT NULL,
	CONSTRAINT "wilayas_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "analysis_results" ADD CONSTRAINT "analysis_results_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "communes" ADD CONSTRAINT "communes_wilaya_id_wilayas_id_fk" FOREIGN KEY ("wilaya_id") REFERENCES "public"."wilayas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "visitor_profiles" ADD CONSTRAINT "visitor_profiles_wilaya_id_wilayas_id_fk" FOREIGN KEY ("wilaya_id") REFERENCES "public"."wilayas"("id") ON DELETE restrict ON UPDATE no action;