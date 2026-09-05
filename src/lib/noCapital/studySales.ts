// Phase 4.1 — Paid Study sales helpers (read-only metadata; never study content).
//
// Goal: expose a uniform "buy the study via Telegram" entry point WITHOUT ever
// revealing the study content. The full study is stored as `noCapitalProjects.study`
// (jsonb) and remains ADMIN-ONLY. This module only answers three booleans/price:
//   * hasPaidStudy      -> does the project carry a study at all?
//   * studyAvailable    -> is it sellable right now? (status === "approved" only)
//   * priceDzd          -> the uniform sale price in DZD
//
// Draft-safety is inherited from studyValidation.shouldRedactStudy: any study that
// is not "approved" is treated as redacted (not sellable). draft/review never surface
// as a purchasable study.

import type { PaidStudy } from "./types";
import { shouldRedactStudy } from "./studyValidation";

// Uniform price for the 5 no-capital paid studies (Phase 4.1).
export const PAID_STUDY_PRICE_DZD = 490;

// TEMP: global kill-switch that hides/suspends selling the paid studies in the
// PUBLIC UI until their PDFs are manually reviewed and approved (Admin keeps
// working independently of this switch). DB data and all study/PDF code are
// untouched; flip this back to `true` to resume sales.
export const PAID_STUDY_SALES_ENABLED = false;

// Telegram contact used for manual purchase + delivery (same handle as the library).
export const PAID_STUDY_TELEGRAM_HANDLE = "NABDA2026";
export const PAID_STUDY_TELEGRAM_URL = `https://t.me/${PAID_STUDY_TELEGRAM_HANDLE}`;

export type StudySaleInfo = {
  hasPaidStudy: boolean;
  studyAvailable: boolean;
  priceDzd: number;
};

/**
 * Returns the public sale metadata for a study, never the study content.
 * `studyAvailable` is true ONLY when the study exists and its status is "approved".
 * A `draft` or `review` study returns studyAvailable = false.
 */
export function getStudySaleInfo(study: PaidStudy | null | undefined): StudySaleInfo {
  const hasPaidStudy = study != null;
  const studyAvailable = hasPaidStudy && PAID_STUDY_SALES_ENABLED && !shouldRedactStudy(study);
  return {
    hasPaidStudy,
    studyAvailable,
    priceDzd: PAID_STUDY_PRICE_DZD,
  };
}

/**
 * Builds the Telegram deep-link that pre-fills a purchase request message.
 * Only used for Approved studies; callers should gate on studyAvailable first.
 */
export function buildStudyPurchaseUrl(projectNameAr: string | null | undefined, slug: string | null | undefined): string {
  const suffix = slug ? ` (${slug})` : "";
  const text = `السلام عليكم، أريد شراء الدراسة التفصيلية للمشروع: ${projectNameAr ?? ""}${suffix} بسعر ${PAID_STUDY_PRICE_DZD} دج.`;
  return `${PAID_STUDY_TELEGRAM_URL}?text=${encodeURIComponent(text)}`;
}
