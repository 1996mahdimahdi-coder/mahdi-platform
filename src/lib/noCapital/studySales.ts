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
import {
  TELEGRAM_CHANNEL_URL,
  WHATSAPP_CONTACT_LINK,
} from "@/lib/contactChannels";

// Uniform price for the 5 no-capital paid studies (Phase 4.1).
export const PAID_STUDY_PRICE_DZD = 490;

// Paid-study sales are LIVE: ordering + delivery happen manually via Telegram
// (PAID_STUDY_TELEGRAM_URL -> t.me/NABDA2026) after payment confirmation.
// studyAvailable still requires an APPROVED study (draft/review never sellable).
export const PAID_STUDY_SALES_ENABLED = true;

// Telegram contact used for manual purchase + delivery (same handle as the library).
export const PAID_STUDY_TELEGRAM_HANDLE = "NABDA2026";
export const PAID_STUDY_TELEGRAM_URL = TELEGRAM_CHANNEL_URL;

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
 * Shared purchase-request text used by the Telegram and WhatsApp deep-links.
 * Includes the project name (and ID when present) plus an optional wilaya.
 */
function buildStudyPurchaseText(
  projectNameAr: string | null | undefined,
  slug: string | null | undefined,
  wilayaName?: string | null
): string {
  const suffix = slug ? ` (${slug})` : "";
  const wilaya = wilayaName ? ` في ولاية ${wilayaName}` : "";
  return `السلام عليكم، أريد شراء الدراسة التفصيلية للمشروع: ${projectNameAr ?? ""}${wilaya}${suffix} بسعر ${PAID_STUDY_PRICE_DZD} دج.`;
}

/**
 * Builds the Telegram deep-link that pre-fills a purchase request message.
 * Only used for Approved studies; callers should gate on studyAvailable first.
 */
export function buildStudyPurchaseUrl(projectNameAr: string | null | undefined, slug: string | null | undefined): string {
  return `${PAID_STUDY_TELEGRAM_URL}?text=${encodeURIComponent(buildStudyPurchaseText(projectNameAr, slug))}`;
}

/**
 * Builds the WhatsApp deep-link (chat with the NABDA contact number) that
 * pre-fills the same purchase request message. `wilayaName` is appended to
 * the message only when the caller has the project's wilaya available.
 */
export function buildWhatsAppStudyPurchaseUrl(
  projectNameAr: string | null | undefined,
  slug: string | null | undefined,
  wilayaName?: string | null
): string {
  return `${WHATSAPP_CONTACT_LINK}?text=${encodeURIComponent(buildStudyPurchaseText(projectNameAr, slug, wilayaName))}`;
}
