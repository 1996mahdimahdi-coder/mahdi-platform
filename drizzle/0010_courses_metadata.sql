ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "sort_order" integer NOT NULL DEFAULT 0;
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "featured" boolean NOT NULL DEFAULT false;
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "recommended" boolean NOT NULL DEFAULT false;
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "content_year" integer NOT NULL DEFAULT 2026;
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "content_source" text NOT NULL DEFAULT 'dz';
ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "channel_name" text;
