ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "work_location" text NOT NULL DEFAULT 'محل';
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "skill_level" text NOT NULL DEFAULT 'بسيطة';
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "legal_status" text NOT NULL DEFAULT 'غير مقنن';
