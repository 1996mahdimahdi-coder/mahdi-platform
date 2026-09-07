import {
  TELEGRAM_CHANNEL_URL,
  WHATSAPP_CHANNEL_URL,
  WHATSAPP_CONTACT_NUMBER,
} from "@/lib/contactChannels";

export const HOME_URL = "https://nabda-dz.vercel.app/";

export const CONTACT_LINKS = {
  facebook: "https://web.facebook.com/profile.php?id=61593142754403",
  instagram: "https://www.instagram.com/nabda_2026/",
  telegram: TELEGRAM_CHANNEL_URL,
  whatsappChannel: WHATSAPP_CHANNEL_URL,
  whatsappContact: WHATSAPP_CONTACT_NUMBER,
  email: "nabda2026@gmail.com",
} as const;

export function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.WELCOME_EMAIL_FROM;
  return {
    apiKey,
    from,
    enabled: Boolean(apiKey && from),
  };
}