// Central source of truth for NABDA public contact / community channels.
// Every link and number used across pages, emails and sale helpers must come
// from this module so values never drift across files.

// Official community channel on Telegram.
export const TELEGRAM_CHANNEL_URL = "https://t.me/NABDA2026";

// Official community channel on WhatsApp (content / weekly projects).
export const WHATSAPP_CHANNEL_URL =
  "https://whatsapp.com/channel/0029VbDQxQv2975IV0d4RK21";

// Official WhatsApp contact number (sales / study / book requests).
export const WHATSAPP_CONTACT_NUMBER = "0673945562";

// Algerian numbers are local (0673945562) -> international (+213673945562).
// wa.me requires the full international number without '+' or spaces.
export const WHATSAPP_CONTACT_LINK = `https://wa.me/213${WHATSAPP_CONTACT_NUMBER.slice(1)}`;

/**
 * Builds a WhatsApp chat deep-link that pre-fills `message` for the NABDA
 * contact number. The message is URL-encoded; the number is never used as a
 * channel link.
 */
export function buildWhatsAppContactUrl(message: string): string {
  return `${WHATSAPP_CONTACT_LINK}?text=${encodeURIComponent(message)}`;
}