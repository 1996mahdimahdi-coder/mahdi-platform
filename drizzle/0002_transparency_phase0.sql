CREATE TABLE "data_sources" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"institution" text NOT NULL,
	"source_type" text NOT NULL,
	"url" text,
	"category" text NOT NULL,
	"confidence_grade" text DEFAULT 'U' NOT NULL,
	"notes" text,
	"last_verified_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wilaya_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"wilaya_id" integer NOT NULL,
	"population" integer,
	"population_source_id" integer,
	"population_year" integer,
	"population_confidence" text,
	"area_km2" numeric(12, 2),
	"area_source_id" integer,
	"area_year" integer,
	"area_confidence" text,
	"density" numeric(12, 2),
	"density_type" text DEFAULT 'calculated',
	"last_verified_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "wilaya_stats_wilaya_id_unique" UNIQUE("wilaya_id")
);
--> statement-breakpoint
ALTER TABLE "commune_stats" ADD COLUMN "population_confidence" text;--> statement-breakpoint
ALTER TABLE "commune_stats" ADD COLUMN "population_source_id" integer;--> statement-breakpoint
ALTER TABLE "commune_stats" ADD COLUMN "area_confidence" text;--> statement-breakpoint
ALTER TABLE "commune_stats" ADD COLUMN "area_source_id" integer;--> statement-breakpoint
ALTER TABLE "wilaya_stats" ADD CONSTRAINT "wilaya_stats_wilaya_id_wilayas_id_fk" FOREIGN KEY ("wilaya_id") REFERENCES "public"."wilayas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wilaya_stats" ADD CONSTRAINT "wilaya_stats_population_source_id_data_sources_id_fk" FOREIGN KEY ("population_source_id") REFERENCES "public"."data_sources"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wilaya_stats" ADD CONSTRAINT "wilaya_stats_area_source_id_data_sources_id_fk" FOREIGN KEY ("area_source_id") REFERENCES "public"."data_sources"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commune_stats" ADD CONSTRAINT "commune_stats_population_source_id_data_sources_id_fk" FOREIGN KEY ("population_source_id") REFERENCES "public"."data_sources"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commune_stats" ADD CONSTRAINT "commune_stats_area_source_id_data_sources_id_fk" FOREIGN KEY ("area_source_id") REFERENCES "public"."data_sources"("id") ON DELETE set null ON UPDATE no action;