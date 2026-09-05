-- ============================================================================
-- 0016 — projects.study (paid study, classic capital projects)
--
-- Reuses the exact same ADMIN-ONLY PaidStudy contract already used by
-- no_capital_projects.study (drizzle/0015_no_capital_study_infra.sql).
--
-- SAFETY:
--   * Purely additive: adds one nullable jsonb column.
--   * No legacy column is modified or dropped (advantages/risks/disadvantages/
--     launchPlan/legalNotes/equipment/pricingMethod/profitFormula/
--     breakEvenFormula/competitionLevel/targetArea/recommendedCapital/
--     maxCapital are retained until the migration to PaidStudy is fully
--     verified in production).
--   * Idempotent: ADD COLUMN IF NOT EXISTS can be run repeatedly.
--   * Existing rows are untouched and the new column defaults to NULL.
-- ============================================================================

ALTER TABLE "public"."projects" ADD COLUMN IF NOT EXISTS "study" jsonb DEFAULT NULL;