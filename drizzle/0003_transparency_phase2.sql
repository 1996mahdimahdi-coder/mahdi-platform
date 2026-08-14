ALTER TABLE "data_sources" ADD COLUMN "document_title" text;--> statement-breakpoint
ALTER TABLE "data_sources" ADD COLUMN "document_year" integer;--> statement-breakpoint
ALTER TABLE "data_sources" ADD COLUMN "document_type" text;--> statement-breakpoint
ALTER TABLE "data_sources" ADD COLUMN "accessed_at" timestamp;--> statement-breakpoint
ALTER TABLE "data_sources" ADD COLUMN "published" boolean DEFAULT false NOT NULL;