import "../rateLimitTestEnv";
import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { pool } from "@/db";
import { checkRateLimit, rateLimitExceededResponse } from "@/lib/rateLimit";
import {
  AI_CHAT_GLOBAL_DAILY_DEFAULT,
  AI_CHAT_GLOBAL_DAILY_KEY,
  AI_CHAT_GLOBAL_DAILY_WINDOW_SECONDS,
  aiChatGlobalDailyLimit,
  checkAiChatGlobalDailyBudget,
} from "@/lib/ai/chatBudget";
import { AI_RATE_LIMITS } from "@/lib/ai/types";

// ============================================================================
// F9-6 — /api/ai/chat global daily budget (ai:chat:global:daily).
//
// Uses the existing checkRateLimit infrastructure (fixed-window PostgreSQL
// counters, fail-open, F7 rate_limit.exceeded) — no new mechanism. Per-user
// limits (AI_RATE_LIMITS) are asserted unchanged.
//
// Run: npx tsx src/lib/ai/chatBudget.test.ts
// ============================================================================

let dbReady = false;
let startEventId = 0;

const LIVE_ENV = process.env.AI_CHAT_GLOBAL_DAILY_LIMIT;

before(async () => {
  try {
    const { rows } = await pool.query(
      "SELECT COALESCE(MAX(id),0)::int AS id FROM security_events"
    );
    startEventId = Number(rows[0].id);
    dbReady = true;
  } catch {
    dbReady = false;
  }
});

after(async () => {
  process.env.AI_CHAT_GLOBAL_DAILY_LIMIT = LIVE_ENV;
  if (!dbReady) return;
  try {
    await pool.query("DELETE FROM rate_limits WHERE key = $1", [
      AI_CHAT_GLOBAL_DAILY_KEY,
    ]);
    await pool.query("DELETE FROM security_events WHERE id > $1", [
      startEventId,
    ]);
  } catch {
    // best-effort cleanup
  }
});

function setEnv(raw: string | undefined) {
  if (raw === undefined) delete process.env.AI_CHAT_GLOBAL_DAILY_LIMIT;
  else process.env.AI_CHAT_GLOBAL_DAILY_LIMIT = raw;
}

describe("F9-6 — global AI chat budget (config)", () => {
  it("uses the required fixed global key", () => {
    assert.equal(AI_CHAT_GLOBAL_DAILY_KEY, "ai:chat:global:daily");
  });

  it("defaults to 5000 requests per day", () => {
    setEnv(undefined);
    assert.equal(aiChatGlobalDailyLimit(), 5000);
    assert.equal(AI_CHAT_GLOBAL_DAILY_DEFAULT, 5000);
    assert.equal(AI_CHAT_GLOBAL_DAILY_WINDOW_SECONDS, 24 * 60 * 60);
  });

  it("honors the AI_CHAT_GLOBAL_DAILY_LIMIT env override", () => {
    setEnv("7");
    assert.equal(aiChatGlobalDailyLimit(), 7);
  });

  it("falls back to the default for invalid overrides", () => {
    for (const bad of ["abc", "0", "-3", "   ", "1.5", "999999999999999999"]) {
      setEnv(bad);
      assert.equal(aiChatGlobalDailyLimit(), AI_CHAT_GLOBAL_DAILY_DEFAULT, `override=${bad}`);
    }
  });

  it("per-user limits remain unchanged and isolated from the global key", () => {
    assert.deepEqual(AI_RATE_LIMITS.daily, { limit: 30, windowSeconds: 24 * 60 * 60 });
    assert.deepEqual(AI_RATE_LIMITS.perMinute, { limit: 10, windowSeconds: 60 });
    assert.notEqual(AI_RATE_LIMITS.daily.limit, 5000);
    assert.ok(!AI_CHAT_GLOBAL_DAILY_KEY.includes(":user:"), "global key must not be per-user");
  });
});

describe("F9-6 — global AI chat budget (behavior, real DB)", () => {
  it("allows requests below the global limit", async (t) => {
    if (!dbReady) { t.skip("rate_limits table or DB unreachable"); return; }
    setEnv(undefined);
    const r = await checkAiChatGlobalDailyBudget();
    assert.equal(r.allowed, true, "first request within a fresh window must be allowed");
    const { rows } = await pool.query<{ count: number }>(
      "SELECT count FROM rate_limits WHERE key = $1",
      [AI_CHAT_GLOBAL_DAILY_KEY]
    );
    assert.equal(Number(rows[0]?.count ?? 0), 1, "counter must record exactly one request");
  });

  it("shares one bucket across all users (fixed key, no per-user component)", async (t) => {
    if (!dbReady) { t.skip("rate_limits table or DB unreachable"); return; }
    setEnv(undefined);
    const before = (await pool.query<{ count: number }>(
      "SELECT count FROM rate_limits WHERE key = $1",
      [AI_CHAT_GLOBAL_DAILY_KEY]
    )).rows[0]?.count ?? 0;
    await checkRateLimit({
      key: AI_CHAT_GLOBAL_DAILY_KEY,
      limit: aiChatGlobalDailyLimit(),
      windowSeconds: AI_CHAT_GLOBAL_DAILY_WINDOW_SECONDS,
    });
    await checkRateLimit({
      key: AI_CHAT_GLOBAL_DAILY_KEY,
      limit: aiChatGlobalDailyLimit(),
      windowSeconds: AI_CHAT_GLOBAL_DAILY_WINDOW_SECONDS,
    });
    const after = await pool.query<{ count: number }>(
      "SELECT count FROM rate_limits WHERE key = $1",
      [AI_CHAT_GLOBAL_DAILY_KEY]
    );
    assert.equal(Number(after.rows[0]?.count ?? 0), Number(before ?? 0) + 2, "two requests share the single global bucket");
  });

  it("returns the existing 429 contract once the global limit is exceeded and logs F7", async (t) => {
    if (!dbReady) { t.skip("rate_limits table or DB unreachable"); return; }
    setEnv("3");
    await pool.query("DELETE FROM rate_limits WHERE key = $1", [
      AI_CHAT_GLOBAL_DAILY_KEY,
    ]);
    let exhausted: Extract<Awaited<ReturnType<typeof checkAiChatGlobalDailyBudget>>, { allowed: false }> | null = null;
    for (let i = 0; i < 4; i++) {
      const r = await checkAiChatGlobalDailyBudget();
      if (!r.allowed) exhausted = r;
    }
    assert.ok(exhausted, "4th request within 3/24h-budget must be denied");
    const res = rateLimitExceededResponse(exhausted);
    assert.equal(res.status, 429);
    assert.ok(Number(res.headers.get("Retry-After")) > 0, "Retry-After must be set");
    assert.equal(res.headers.get("X-RateLimit-Limit"), "3");
    assert.equal(res.headers.get("Cache-Control"), "private, no-store");

    const { rows } = await pool.query<{ event: string; severity: string }>(
      "SELECT event, severity FROM security_events WHERE id > $1 AND event = 'rate_limit.exceeded' ORDER BY id DESC",
      [startEventId]
    );
    assert.ok(rows.length >= 1, "F7 rate_limit.exceeded must be emitted via checkRateLimit");
    assert.equal(rows[0].severity, "warn");
  });
});