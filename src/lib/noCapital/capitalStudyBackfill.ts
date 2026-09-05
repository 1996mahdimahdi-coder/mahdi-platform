// ============================================================================
// Capital-project Paid Study backfill (ADMIN-ONLY, one-way, non-destructive).
//
// Transforms the existing legacy advisory columns of the classic `projects`
// table into a PaidStudy draft (status "draft", meta.studyKind = "capital").
// The legacy columns are NOT modified or dropped — they remain the source of
// truth until the migration is fully verified in production.
//
// Content rule: only existing data is transferred. No new content is invented.
// The few structural additions are limited to transport labels / enum buckets
// (e.g. a pricing `model` value + `.note` carrying the original text). Any such
// construction is meant to be curated by an admin before the study is approved.
// ============================================================================

import type {
  PaidStudy,
  StudyPlanWeek,
  StudyPricingModel,
} from "@/lib/noCapital/types";
import { emptyPaidStudyDraft, validateStudy } from "@/lib/noCapital/studyValidation";

/** Minimal projection of the classic `projects` row required by the backfill. */
export type LegacyProjectStudySource = {
  projectId: string;
  projectName: string;
  description: string;
  minCapital: number;
  recommendedCapital: number;
  maxCapital: number;
  skillsRequired: string[];
  equipment: { item: string; cost: number }[];
  pricingMethod: string | null;
  profitFormula: string | null;
  breakEvenFormula: string | null;
  risks: string[];
  advantages: string[];
  disadvantages: string[];
  launchPlan: { week: string; title: string; tasks: string[] }[];
  legalNotes: string | null;
  competitionLevel: string | null;
  targetArea: string | null;
  source: string | null;
};

const LOW_INTENSITY = ["منخفضة", "منخفض", "قليلة", "ضئيلة"];
const HIGH_INTENSITY = ["مرتفعة", "مرتفع", "عالية", "شديدة"];

function mapIntensity(text: string | null | undefined): "low" | "medium" | "high" {
  if (!text) return "medium";
  const t = text.trim();
  if (LOW_INTENSITY.includes(t)) return "low";
  if (HIGH_INTENSITY.includes(t)) return "high";
  return "medium";
}

function joinText(...parts: (string | null | undefined)[]): string {
  return parts.filter((p): p is string => Boolean(p && p.trim())).join(" — ");
}

/**
 * Builds a PaidStudy draft for a capital project by transferring ONLY existing
 * legacy data. Never invents content; structural fields get transport defaults
 * that an admin curates before approving.
 */
export function buildCapitalPaidStudyDraft(src: LegacyProjectStudySource): PaidStudy {
  const draft = emptyPaidStudyDraft();

  const study: PaidStudy = {
    ...draft,
    status: "draft",
    summary: {
      overview: (src.description ?? "").slice(0, 4000),
    },
    idealClients:
      src.targetArea && src.targetArea.trim()
        ? [{ persona: src.targetArea.trim(), notes: "المنطقة المستهدفة" }]
        : [],
    skills: {
      minimum: Array.isArray(src.skillsRequired) ? src.skillsRequired.slice() : [],
      advanced: [],
    },
    equipment: (Array.isArray(src.equipment) ? src.equipment : []).map((e) => ({
      item: e.item ?? "",
      tier: "pro" as const,
      sourceStatus: "BENCHMARK" as const,
      cost: typeof e.cost === "number" && Number.isFinite(e.cost) ? e.cost : undefined,
    })),
    pricing:
      src.pricingMethod && src.pricingMethod.trim()
        ? [
            {
              model: "package" as StudyPricingModel,
              dzPriceStatus: "BENCHMARK" as const,
              note: src.pricingMethod.trim(),
            },
          ]
        : [],
    profitModel: {
      notes: joinText(src.profitFormula ? `معادلة الربح: ${src.profitFormula}` : null, src.breakEvenFormula ? `نقطة التعادل: ${src.breakEvenFormula}` : null) || undefined,
    },
    marketCompetition:
      src.competitionLevel && src.competitionLevel.trim()
        ? [
            {
              segment: "منافسة القطاع",
              intensity: mapIntensity(src.competitionLevel),
              notes: src.competitionLevel.trim(),
            },
          ]
        : [],
    commonMistakes: (Array.isArray(src.disadvantages) ? src.disadvantages : []).map((d) => ({ mistake: d })),
    redFlags: (Array.isArray(src.risks) ? src.risks : []).map((r) => ({ flag: r })),
    plan30Days: (Array.isArray(src.launchPlan) ? src.launchPlan : []).slice(0, 4).map((lp, idx) => ({
      week: (idx + 1) as StudyPlanWeek,
      tasks: [...(lp.title && lp.title.trim() ? [lp.title.trim()] : []), ...(lp.tasks ?? [])],
    })),
    legalDz: {
      needsValidation: true,
      notes: src.legalNotes ?? undefined,
    },
    caseStudy: { scenario: "", isSample: true },
    sources:
      src.source && src.source.trim()
        ? [{ title: src.source.trim(), sourceType: "REFERENCE" as const }]
        : [],
    meta: { studyKind: "capital" },
    startupCapital: {
      min: src.minCapital ?? 0,
      recommended: src.recommendedCapital ?? 0,
      max: src.maxCapital ?? 0,
    },
    strengths: Array.isArray(src.advantages) && src.advantages.length > 0 ? src.advantages.slice() : undefined,
  };

  return study;
}

/** Returns human-readable validation errors (empty array === structurally valid). */
export function validateCapitalStudyDraft(study: PaidStudy): string[] {
  return validateStudy(study);
}

const REQUIRED_KEYS = [
  "summary",
  "idealClients",
  "skills",
  "equipment",
  "pricing",
  "profitModel",
  "businessModel",
  "firstClientAcquisition",
  "workflow",
  "marketCompetition",
  "commonMistakes",
  "redFlags",
  "marketing",
  "plan30Days",
  "growthPath",
  "legalDz",
  "caseStudy",
  "sources",
  "meta",
] as const;

/** True when all 19 paid-study sections are present (same contract as the PDF). */
export function hasAllStudySections(study: PaidStudy): boolean {
  return REQUIRED_KEYS.every((k) => Object.prototype.hasOwnProperty.call(study, k));
}