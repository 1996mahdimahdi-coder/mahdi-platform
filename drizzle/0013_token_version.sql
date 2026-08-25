-- Token Version for session revocation on logout.
-- Adding token_version column with DEFAULT 0 so all existing users
-- automatically get version 0 — no data loss, no breaking changes.
ALTER TABLE "users" ADD COLUMN "token_version" integer DEFAULT 0 NOT NULL;
