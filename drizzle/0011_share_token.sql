ALTER TABLE "analysis_results" ADD COLUMN IF NOT EXISTS "share_token" text;
ALTER TABLE "analysis_results" ADD CONSTRAINT "analysis_results_share_token_unique" UNIQUE ("share_token");
