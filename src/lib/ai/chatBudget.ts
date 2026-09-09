import { checkRateLimit } from "@/lib/rateLimit";
import type { RateLimitResult } from "@/lib/rateLimit";

// F9-6 — global daily budget for /api/ai/chat. Applies on top of the existing
// per-user limits (AI_RATE_LIMITS in types.ts) using the SAME PostgreSQL
// fixed-window infrastructure (checkRateLimit / rate_limits). Fail-open and F7
// logging are inherited from checkRateLimit; no new mechanism is introduced.

export const AI_CHAT_GLOBAL_DAILY_KEY = "ai:chat:global:daily";
export const AI_CHAT_GLOBAL_DAILY_DEFAULT = 5000;
export const AI_CHAT_GLOBAL_DAILY_WINDOW_SECONDS = 24 * 60 * 60;

// Env override is read at CALL time so it is live-configurable and testable.
// Strict positive integer only; anything else ("" / "1.5" / "7abc" / "-3" /
// non-safe integers) falls back to the default.
export function aiChatGlobalDailyLimit(): number {
  const raw = (process.env.AI_CHAT_GLOBAL_DAILY_LIMIT ?? "").trim();
  if (!/^\d+$/.test(raw)) return AI_CHAT_GLOBAL_DAILY_DEFAULT;
  const n = Number(raw);
  return Number.isSafeInteger(n) && n > 0 ? n : AI_CHAT_GLOBAL_DAILY_DEFAULT;
}

export async function checkAiChatGlobalDailyBudget(): Promise<RateLimitResult> {
  return checkRateLimit({
    key: AI_CHAT_GLOBAL_DAILY_KEY,
    limit: aiChatGlobalDailyLimit(),
    windowSeconds: AI_CHAT_GLOBAL_DAILY_WINDOW_SECONDS,
  });
}