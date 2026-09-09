import "./rateLimitTestEnv";
import { before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { pool } from "@/db";
import {
  RATE_LIMITS,
  checkRateLimit,
  clientIpKey,
  rateLimitExceededResponse,
} from "@/lib/rateLimit";

// ============================================================================
// F9-2 — /api/push/register rate limiting.
//
// The route now enforces RATE_LIMITS.pushRegister: a per-user hard gate
// (30 / 15 min) plus a per-IP defense-in-depth bucket (60 / 15 min) via
// clientIpKey. Both reuse the existing PostgreSQL fixed-window limiter; every
// breach is already surfaced to F7 by checkRateLimit itself
// (logSecurity("rate_limit.exceeded", flood-suppressed)), so no new logging
// exists in the route.
//
// Run: npx tsx src/lib/pushRegisterRateLimit.test.ts
// ============================================================================

const TEST_KEY_PREFIX = "test:push-register:";

function randomSuffix() {
  return `${TEST_KEY_PREFIX}${randomBytes(8).toString("hex")}`;
}

function request(ip: string): Request {
  return new Request("https://nabda.test/api/push/register", {
    headers: { "x-forwarded-for": ip },
  });
}

function testUserId() {
  return 900_000 + Math.floor(Math.random() * 1_000_000);
}

let dbReady = false;

before(async () => {
  try {
    await pool.query("SELECT 1 FROM rate_limits LIMIT 1");
    dbReady = true;
  } catch {
    dbReady = false;
  }
});

async function deleteTestKeys(keys: string[]) {
  for (const key of keys) {
    try {
      await pool.query("DELETE FROM rate_limits WHERE key = $1", [key]);
    } catch {
      // best-effort cleanup
    }
  }
}

describe("F9-2 — pushRegister rate-limit config", () => {
  it("defines user bucket 30/15min and IP bucket 60/15min", () => {
    assert.equal(RATE_LIMITS.pushRegister.user.limit, 30);
    assert.equal(RATE_LIMITS.pushRegister.user.windowSeconds, 15 * 60);
    assert.equal(RATE_LIMITS.pushRegister.ip.limit, 60);
    assert.equal(RATE_LIMITS.pushRegister.ip.windowSeconds, 15 * 60);
  });

  it("IP keys are pseudonymized (never the raw IP)", () => {
    const key = clientIpKey(request("1.2.3.4"), "pushRegister");
    assert.ok(key.startsWith("pushRegister:ip:"));
    assert.ok(!key.includes("1.2.3.4"), "raw IP must not appear in the key");
  });
});

describe("F9-2 — pushRegister user bucket", () => {
  it("requests below the user limit are allowed", async (t) => {
    if (!dbReady) { t.skip("rate_limits table or DB unreachable"); return; }
    const userId = testUserId();
    const keys: string[] = [];
    for (let i = 0; i < 3; i++) {
      const r = await checkRateLimit({
        key: `push:user:${userId}`,
        limit: RATE_LIMITS.pushRegister.user.limit,
        windowSeconds: RATE_LIMITS.pushRegister.user.windowSeconds,
      });
      assert.equal(r.allowed, true);
    }
    keys.push(`push:user:${userId}`);
    await deleteTestKeys(keys);
  });

  it("exceeding the user limit returns allowed:false (429 contract)", async (t) => {
    if (!dbReady) { t.skip("rate_limits table or DB unreachable"); return; }
    const userId = testUserId();
    const key = `push:user:${userId}`;
    const results: boolean[] = [];
    for (let i = 0; i < RATE_LIMITS.pushRegister.user.limit + 2; i++) {
      const r = await checkRateLimit({
        key,
        limit: RATE_LIMITS.pushRegister.user.limit,
        windowSeconds: RATE_LIMITS.pushRegister.user.windowSeconds,
      });
      results.push(r.allowed);
      if (!r.allowed) {
        const res = rateLimitExceededResponse(r);
        assert.equal(res.status, 429);
        assert.equal(res.headers.get("Retry-After"), String(r.retryAfterSeconds));
        break;
      }
    }
    assert.ok(results.some((v) => v === false), "must eventually be limited");
    assert.equal(results.filter((v) => v === true).length, RATE_LIMITS.pushRegister.user.limit);
    await deleteTestKeys([key]);
  });

  it("different users do not share the user bucket", async (t) => {
    if (!dbReady) { t.skip("rate_limits table or DB unreachable"); return; }
    const userA = testUserId();
    const userB = testUserId();
    const keyA = `push:user:${userA}`;
    const keyB = `push:user:${userB}`;
    for (let i = 0; i < RATE_LIMITS.pushRegister.user.limit + 1; i++) {
      await checkRateLimit({
        key: keyA,
        limit: RATE_LIMITS.pushRegister.user.limit,
        windowSeconds: RATE_LIMITS.pushRegister.user.windowSeconds,
      });
    }
    const blockedA = await checkRateLimit({
      key: keyA,
      limit: RATE_LIMITS.pushRegister.user.limit,
      windowSeconds: RATE_LIMITS.pushRegister.user.windowSeconds,
    });
    assert.equal(blockedA.allowed, false, "user A exhausted its bucket");
    const allowedB = await checkRateLimit({
      key: keyB,
      limit: RATE_LIMITS.pushRegister.user.limit,
      windowSeconds: RATE_LIMITS.pushRegister.user.windowSeconds,
    });
    assert.equal(allowedB.allowed, true, "user B must be isolated");
    await deleteTestKeys([keyA, keyB]);
  });
});

describe("F9-2 — pushRegister IP bucket", () => {
  it("different IPs are isolated; exceeding one IP blocks only that IP", async (t) => {
    if (!dbReady) { t.skip("rate_limits table or DB unreachable"); return; }
    const ipA = "198.51.100.11";
    const ipB = "198.51.100.22";
    const keyA = clientIpKey(request(ipA), "pushRegister");
    const keyB = clientIpKey(request(ipB), "pushRegister");
    assert.notEqual(keyA, keyB, "different IPs must map to different buckets");
    for (let i = 0; i < RATE_LIMITS.pushRegister.ip.limit + 1; i++) {
      await checkRateLimit({
        key: clientIpKey(request(ipA), "pushRegister"),
        limit: RATE_LIMITS.pushRegister.ip.limit,
        windowSeconds: RATE_LIMITS.pushRegister.ip.windowSeconds,
      });
    }
    const blockedA = await checkRateLimit({
      key: keyA,
      limit: RATE_LIMITS.pushRegister.ip.limit,
      windowSeconds: RATE_LIMITS.pushRegister.ip.windowSeconds,
    });
    assert.equal(blockedA.allowed, false, "IP A exhausted its bucket");
    const allowedB = await checkRateLimit({
      key: keyB,
      limit: RATE_LIMITS.pushRegister.ip.limit,
      windowSeconds: RATE_LIMITS.pushRegister.ip.windowSeconds,
    });
    assert.equal(allowedB.allowed, true, "IP B must be isolated");
    await deleteTestKeys([keyA, keyB]);
  });

  it("breach counter persists (same infrastructure as F7 flood suppression)", async (t) => {
    if (!dbReady) { t.skip("rate_limits table or DB unreachable"); return; }
    const key = `${randomSuffix()}:persist`;
    for (let i = 0; i < RATE_LIMITS.pushRegister.user.limit + 1; i++) {
      await checkRateLimit({
        key,
        limit: RATE_LIMITS.pushRegister.user.limit,
        windowSeconds: RATE_LIMITS.pushRegister.user.windowSeconds,
      });
    }
    const { rows } = await pool.query<{ key: string; count: number }>(
      "SELECT key, count FROM rate_limits WHERE key = $1", [key]);
    assert.equal(rows.length, 1, "over-limit bucket row must persist");
    assert.ok(rows[0].count > RATE_LIMITS.pushRegister.user.limit);
    const again = await checkRateLimit({
      key,
      limit: RATE_LIMITS.pushRegister.user.limit,
      windowSeconds: RATE_LIMITS.pushRegister.user.windowSeconds,
    });
    assert.equal(again.allowed, false, "repeated breach stays blocked (window-bound)");
    await deleteTestKeys([key]);
  });
});