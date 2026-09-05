// ============================================================================
// Backfill runner: transfers legacy advisory columns of classic `projects`
// into projects.study (PaidStudy draft, meta.studyKind="capital").
//
// SAFETY:
//   * Targets ONLY rows where study IS NULL (idempotent).
//   * Never deletes or modifies legacy columns.
//   * Validates each generated study before persisting; invalid rows are
//     skipped with a logged error.
//   * Dry run: BACKFILL_DRY_RUN=1 prints a report without writing.
//
// Run from repo root:
//   npx tsx src/db/backfillCapitalStudies.ts            # real run
//   BACKFILL_DRY_RUN=1 npx tsx src/db/backfillCapitalStudies.ts
//
// It reads PRODUCTION_DATABASE_URL from .env.production.local (falls back to
// .env.local DATABASE_URL) so it always targets the real data store.
// ============================================================================

import { config as loadEnv } from "dotenv";
import { join } from "node:path";
import { existsSync } from "node:fs";

async function main() {
  const envCandidates = [".env.production.local", ".env.local"];
  let loaded = false;
  for (const name of envCandidates) {
    if (!existsSync(join(process.cwd(), name))) continue;
    loadEnv({ path: join(process.cwd(), name) });
    loaded = true;
    break;
  }
  if (!loaded) throw new Error("No .env file found.");

  const url = process.env.PRODUCTION_DATABASE_URL ?? process.env.DATABASE_URL;
  if (!url) throw new Error("No DATABASE_URL found in environment files.");
  process.env.DATABASE_URL = url;

  const [{ db }, { projects }, { eq }, backfillModule] = await Promise.all([
    import("@/db"),
    import("@/db/schema"),
    import("drizzle-orm"),
    import("@/lib/noCapital/capitalStudyBackfill"),
  ]);

  const { buildCapitalPaidStudyDraft, validateCapitalStudyDraft, hasAllStudySections } = backfillModule;

  const DRY_RUN = process.env.BACKFILL_DRY_RUN === "1";

  const rows = await db.select().from(projects).orderBy(projects.id);
  const targets = rows.filter((r) => r.study == null);

  const results = {
    totalProjects: rows.length,
    targetRows: targets.length,
    backfilled: 0,
    skipped: 0,
    invalidRows: [] as { projectId: string; errors: string[] }[],
    sectionIncomplete: [] as string[],
  };

  for (const row of targets) {
    const draft = buildCapitalPaidStudyDraft({
      projectId: row.projectId,
      projectName: row.projectName,
      description: row.description,
      minCapital: row.minCapital,
      recommendedCapital: row.recommendedCapital,
      maxCapital: row.maxCapital,
      skillsRequired: row.skillsRequired,
      equipment: row.equipment,
      pricingMethod: row.pricingMethod,
      profitFormula: row.profitFormula,
      breakEvenFormula: row.breakEvenFormula,
      risks: row.risks,
      advantages: row.advantages,
      disadvantages: row.disadvantages,
      launchPlan: row.launchPlan,
      legalNotes: row.legalNotes,
      competitionLevel: row.competitionLevel,
      targetArea: row.targetArea,
      source: row.source,
    });

    const errors = validateCapitalStudyDraft(draft);
    if (errors.length > 0) {
      results.invalidRows.push({ projectId: row.projectId, errors });
      results.skipped += 1;
      console.warn(`SKIP ${row.projectId}: ${errors.join(" | ")}`);
      continue;
    }

    if (!hasAllStudySections(draft)) {
      results.sectionIncomplete.push(row.projectId);
      results.skipped += 1;
      console.warn(`SKIP ${row.projectId}: missing 19/19 sections`);
      continue;
    }

    if (!DRY_RUN) {
      await db
        .update(projects)
        .set({ study: draft, lastUpdated: new Date() })
        .where(eq(projects.id, row.id));
    }
    results.backfilled += 1;
  }

  console.log("\n=== Backfill report ===");
  console.log(JSON.stringify({ dryRun: DRY_RUN, ...results }, null, 2));

  if (results.invalidRows.length > 0) process.exitCode = 2;
}

main().catch((e) => {
  console.error("Backfill failed:", e);
  process.exit(1);
});