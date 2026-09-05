// ============================================================================
// Public sanitizer for classic `projects` rows (ADMIN-ONLY data protection).
//
// Paid / advisory intelligence lives in legacy advisory columns (advantages,
// risks, disadvantages, launchPlan, legalNotes, equipment, pricingMethod,
// profitFormula, breakEvenFormula, competitionLevel, targetArea) and in the
// new `study` JSONB paid-study draft. None of it may ever reach the public
// segments of the site (pages, listing API, detail API, free PDF).
//
// Free visitors keep the factual profile + free calculators, including
// minCapital (needed by the free profit/capital tools) — but never
// recommended/max capital as ready numbers.
// ============================================================================

import type { getSession } from "@/lib/auth";

type ProjectRow = {
  id: number;
  projectId: string;
  projectName: string;
  category: string;
  description: string;
  minCapital: number;
  riskLevel: string;
  homeBased: boolean;
  onlinePossible: boolean;
  transportRequired: boolean;
  skillsRequired: string[];
  timeRequired: string;
  difficulty: string;
  scalability: string;
  seasonality: string;
  workLocation: string;
  skillLevel: string;
  legalStatus: string;
  initialStock: number;
  fixedCosts: number;
  variableCostsPercent: number;
  source: string | null;
  lastUpdated: Date | null;
};

const PAID_FIELDS = [
  "recommendedCapital",
  "maxCapital",
  "competitionLevel",
  "targetArea",
  "equipment",
  "pricingMethod",
  "profitFormula",
  "breakEvenFormula",
  "risks",
  "advantages",
  "disadvantages",
  "launchPlan",
  "legalNotes",
  "study",
] as const;

/** Returns a free-visitor safe projection. Adopts the full field name set. */
export function publicProjectShape(row: ProjectRow) {
  return {
    id: row.id,
    projectId: row.projectId,
    projectName: row.projectName,
    category: row.category,
    description: row.description,
    minCapital: row.minCapital,
    riskLevel: row.riskLevel,
    homeBased: row.homeBased,
    onlinePossible: row.onlinePossible,
    transportRequired: row.transportRequired,
    skillsRequired: row.skillsRequired,
    timeRequired: row.timeRequired,
    difficulty: row.difficulty,
    scalability: row.scalability,
    seasonality: row.seasonality,
    workLocation: row.workLocation,
    skillLevel: row.skillLevel,
    legalStatus: row.legalStatus,
    initialStock: row.initialStock,
    fixedCosts: row.fixedCosts,
    variableCostsPercent: row.variableCostsPercent,
    source: row.source,
    lastUpdated: row.lastUpdated,
  };
}

/** Drops every paid/advisory field from an arbitrary JS object (defense in depth). */
export function stripPaidFields<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if ((PAID_FIELDS as readonly string[]).includes(k)) continue;
    out[k] = v;
  }
  return out as Partial<T>;
}

export type SessionLike = NonNullable<Awaited<ReturnType<typeof getSession>>> | null;

/** True when the caller is an authenticated admin (full row permitted). */
export function isAdminView(session: SessionLike): boolean {
  return session?.role === "admin";
}

/**
 * Picks the right projection for a GET: full row for authenticated admins,
 * sanitized shape for everyone else.
 */
export function projectForResponse(
  row: ProjectRow,
  session: SessionLike
): ProjectRow | ReturnType<typeof publicProjectShape> {
  return isAdminView(session) ? row : publicProjectShape(row);
}