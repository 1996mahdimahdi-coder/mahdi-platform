import "./rateLimitTestEnv";
import { after, describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { randomBytes } from "node:crypto";
import { pool } from "@/db";
import {
  ASSESS_AUTHENTICATED_GLOBAL_KEY,
  ASSESS_AUTHENTICATED_GLOBAL_LIMIT,
  ASSESS_AUTHENTICATED_GLOBAL_WINDOW_SECONDS,
  NO_CAPITAL_ASSESS_GLOBAL_KEY,
  RATE_LIMITS,
  checkRateLimit,
  rateLimitExceededResponse,
} from "@/lib/rateLimit";

// ============================================================================
// F12-1 — global DAILY budget for AUTHENTICATED /api/assess.
//
// The authenticated path previously had only a per-user 10/15min bucket, so an
// attacker rotating accounts could push unbounded OpenAI spend. This adds a
// static 24h bucket (assess:global:authenticated, 5000/day) reusing the
// existing checkRateLimit/rate_limits infrastructure — mirroring the AI-chat
// daily budget. Config tests are pure; the route-level assertions are
// structural (guard placed in the session branch and BEFORE any consent / DB /
// scoring / AI work); the PostgreSQL blocks exercise the real counter.
// ============================================================================

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "../..");

const TEST_KEY_PREFIX = "test:assess-authed-global:";

function randomKey() {
  return `${TEST_KEY_PREFIX}${randomBytes(8).toString("hex")}`;
}

async function dbAvailable(): Promise<boolean> {
  try {
    await pool.query("SELECT 1");
    return true;
  } catch {
    return false;
  }
}

async function deleteTestKeys(keys: string[]) {
  for (const key of keys) {
    try {
      await pool.query("DELETE FROM rate_limits WHERE key = $1", [key]);
    } catch {
      // best-effort cleanup; the guarded tests already skipped on no DB
    }
  }
}

describe("F12-1 — global authenticated assess budget (config)", () => {
  it("defines a 5000-request / 24h static budget", () => {
    assert.equal(ASSESS_AUTHENTICATED_GLOBAL_LIMIT, 5000);
    assert.equal(ASSESS_AUTHENTICATED_GLOBAL_WINDOW_SECONDS, 24 * 60 * 60);
  });

  it("uses a fixed key that cannot be spread by request/account rotation", () => {
    assert.equal(ASSESS_AUTHENTICATED_GLOBAL_KEY, "assess:global:authenticated");
    assert.ok(ASSESS_AUTHENTICATED_GLOBAL_KEY.startsWith("assess:global:"));
    // Key must not carry user / IP / header / body data.
    assert.ok(!ASSESS_AUTHENTICATED_GLOBAL_KEY.includes("user:"));
    assert.ok(!ASSESS_AUTHENTICATED_GLOBAL_KEY.includes("ip:"));
    assert.ok(!ASSESS_AUTHENTICATED_GLOBAL_KEY.includes("{{"));
  });

  it("keeps the global key independent of other fixed global buckets", () => {
    assert.notEqual(
      ASSESS_AUTHENTICATED_GLOBAL_KEY,
      NO_CAPITAL_ASSESS_GLOBAL_KEY
    );
    assert.ok(!ASSESS_AUTHENTICATED_GLOBAL_KEY.includes("no-capital"));
    assert.ok(!ASSESS_AUTHENTICATED_GLOBAL_KEY.includes("anonymous"));
    assert.equal(RATE_LIMITS.assess.anonymous.limit, 5);
  });

  it("leaves the existing per-user authenticated limit intact", () => {
    assert.equal(RATE_LIMITS.assess.user.limit, 10);
    assert.equal(RATE_LIMITS.assess.user.windowSeconds, 15 * 60);
  });

  it("fits the F4 retention contract (48h retention >> 24h window)", () => {
    assert.ok(ASSESS_AUTHENTICATED_GLOBAL_WINDOW_SECONDS <= 48 * 60 * 60);
  });
});

describe("F12-1 — route integration (structural)", () => {
  it("checks the global budget in the session branch before AI/scoring work", async () => {
    const src = await readFile(
      join(repoRoot, "src/app/api/assess/route.ts"),
      "utf8"
    );

    assert.ok(src.includes("ASSESS_AUTHENTICATED_GLOBAL_KEY"));
    assert.ok(src.includes("ASSESS_AUTHENTICATED_GLOBAL_LIMIT"));

    // Reference the body usages, not the imports (which precede every check).
    const globalAt = src.indexOf("key: ASSESS_AUTHENTICATED_GLOBAL_KEY");
    const rankAt = src.indexOf("const ranked = rankProjectsV2");
    const explainAt = src.indexOf("await generateAnalysisExplanation");
    const dbProjectsAt = src.indexOf("let dbProjects = await db");
    const consentAt = src.indexOf("const consentVersion");

    assert.ok(globalAt !== -1 && rankAt !== -1 && explainAt !== -1);
    // Global rejection must happen before consent / scoring / AI / DB work.
    assert.ok(globalAt < consentAt, "checked before consent load");
    assert.ok(globalAt < dbProjectsAt, "checked before project load");
    assert.ok(globalAt < rankAt, "checked before scoring");
    assert.ok(globalAt < explainAt, "checked before the OpenAI call");
  });

  it("is placed inside the authenticated branch (after the per-user check)", async () => {
    const src = await readFile(
      join(repoRoot, "src/app/api/assess/route.ts"),
      "utf8"
    );

    const userKeyAt = src.indexOf("`assess:user:${session.userId}`");
    const globalAt = src.indexOf("key: ASSESS_AUTHENTICATED_GLOBAL_KEY");
    const anonBranchAt = src.indexOf(
      "const anonLimit = RATE_LIMITS.assess.anonymous"
    );
    assert.ok(userKeyAt !== -1 && globalAt !== -1 && anonBranchAt !== -1);
    assert.ok(globalAt > userKeyAt, "global check follows the per-user check");
    // The authenticated global check must precede the anonymous per-IP branch
    // (the anonymous CPS path is handled later, inside the else branch).
    assert.ok(globalAt < anonBranchAt, "global check precedes the anon branch");
    assert.ok(src.includes("} else {"), "anonymous else branch still present");
  });
});

describe("F12-1 — 429 response shape (reused helper)", () => {
  it("returns 429 with Retry-After and no PII", async () => {
    const res = rateLimitExceededResponse({
      allowed: false,
      limit: ASSESS_AUTHENTICATED_GLOBAL_LIMIT,
      windowSeconds: ASSESS_AUTHENTICATED_GLOBAL_WINDOW_SECONDS,
      retryAfterSeconds: 300,
    });

    assert.equal(res.status, 429);
    assert.equal(res.headers.get("Retry-After"), "300");
    assert.equal(res.headers.get("X-RateLimit-Limit"), "5000");
    assert.equal(res.headers.get("Cache-Control"), "private, no-store");

    const body = await res.json();
    assert.equal(body.success, false);
    assert.equal(typeof body.error, "string");
    assert.ok(!JSON.stringify(body).includes("assess:global:authenticated"));
  });
});

describe("F12-1 — PostgreSQL counter (integration)", () => {
  after(() => {
    void pool.end().catch(() => undefined);
  });

  it("under limit succeeds", async (t) => {
    if (!(await dbAvailable())) {
      t.skip("PostgreSQL unavailable");
      return;
    }

    const key = randomKey();

    try {
      const r = await checkRateLimit({ key, limit: 2, windowSeconds: 60 });
      assert.equal(r.allowed, true);
    } finally {
      await deleteTestKeys([key]);
    }
  });

  it("exhaustion → 429 semantics, with no expensive work afterwards", async (t) => {
    if (!(await dbAvailable())) {
      t.skip("PostgreSQL unavailable");
      return;
    }

    const key = randomKey();
    const ops = { limit: 2, windowSeconds: 60 };
    const expensive: string[] = [];

    try {
      const attempt = async () => {
        const check = await checkRateLimit({ key, ...ops });
        if (!check.allowed) return 429;
        expensive.push("expensive");
        return 200;
      };

      assert.equal(await attempt(), 200);
      assert.equal(await attempt(), 200);
      assert.equal(await attempt(), 429);
      assert.deepEqual(expensive, ["expensive", "expensive"]);
    } finally {
      await deleteTestKeys([key]);
    }
  });

  it("static key is shared across different users/IPs (one shared bucket)", async (t) => {
    if (!(await dbAvailable())) {
      t.skip("PostgreSQL unavailable");
      return;
    }

    const key = randomKey();
    // Simulates N distinct authenticated users hitting the SAME static key;
    // the first-entry wins and the counter is shared, not per-caller.
    const callers = Array.from(
      { length: 25 },
      () =>
        () =>
          checkRateLimit({ key, limit: 10, windowSeconds: 60 })
    );

    try {
      const results = await Promise.all(callers.map((c) => c()));
      const allowed = results.filter((r) => r.allowed);
      const denied = results.filter(
        (r): r is Extract<typeof r, { allowed: false }> => !r.allowed
      );

      assert.equal(allowed.length, 10);
      assert.equal(denied.length, 15);
    } finally {
      await deleteTestKeys([key]);
    }
  });
});
