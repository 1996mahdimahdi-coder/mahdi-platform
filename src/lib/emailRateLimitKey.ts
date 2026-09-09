import { createHmac } from "node:crypto";

const RATE_LIMIT_KEY_SECRET =
  process.env.AUTH_SECRET || "nabda-rate-limit-key-fallback";

function pseudonymizeRateLimitValue(value: string): string {
  return createHmac("sha256", RATE_LIMIT_KEY_SECRET)
    .update(value)
    .digest("hex")
    .slice(0, 32);
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function emailRateLimitKey(
  scope: string,
  email: string
): string {
  return `${scope}:email:${pseudonymizeRateLimitValue(normalizeEmail(email))}`;
}