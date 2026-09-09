import "./rateLimitTestEnv";
import { after, describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { randomBytes } from "node:crypto";
import { pool } from "@/db";
import {
  RATE_LIMITS,
  checkRateLimit,
  clientIpKey,
} from "@/lib/rateLimit";

// ============================================================================
// F12-3 — /api/sources public read rate limiting.
//
// sources/route.ts was the last public DB-list endpoint without a guard
// (every sibling uses RATE_LIMITS.readList.ip). It now uses the same F5
// convention: clientIpKey(request, "read:list:sources"), guard placed AFTER
// query validation (invalid parameters keep their existing 400) and BEFORE the
// database read. CDN caching (s-maxage=300) and response shape are unchanged.
//
// Structure mirrors readRateLimit.test.ts: route-level checks are structural,
// counter semantics are exercised directly against the bucket shape.
// ============================================================================

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "../..");

const TEST_KEY_PREFIX = "test:sources-read:";

function randomKey() {
  return `${TEST_KEY_PREFIX}${randomBytes(8).toString("hex")}`;
}

function request(ip: string): Request {
  return new Request("https://nabda.test/api/_f12-3", {
    headers: { "x-forwarded-for": ip },
  });
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
      // best-effort cleanup
    }
  }
}

describe("F12-3 — config & key design", () => {
  it("uses the shared readList bucket (120 / 15min per IP)", () => {
    assert.equal(RATE_LIMITS.readList.ip.limit, 120);
    assert.equal(RATE_LIMITS.readList.ip.windowSeconds, 15 * 60);
  });

  it("maps one IP to one pseudo-namespaced per-endpoint bucket", () => {
    // F12-3 only requires ONE stable, namespaced per-endpoint bucket per source
    // IP. The exact identity encoding (raw-IP vs hashed) belongs to the broader
    // hygiene work, so the F12-A test stays agnostic to it and never depends
    // on uncommitted symbols — it passes on both the clean F12-A tree and the
    // working tree (where clientIpKey is pseudonymized by uncommitted work).
    const key = clientIpKey(request("198.51.100.45"), "read:list:sources");
    assert.ok(key.startsWith("read:list:sources:ip:"));
    // Same IP on the same endpoint always resolves to the same stable bucket.
    assert.equal(
      clientIpKey(request("198.51.100.45"), "read:list:sources"),
      key
    );
    // Different endpoints never share a bucket for the same IP.
    assert.notEqual(
      clientIpKey(request("198.51.100.45"), "read:list:projects"),
      key
    );
  });
});

describe("F12-3 — route order (structural)", () => {
  it("returns the existing 400 before the rate limit, and the rate limit before the DB read", async () => {
    const src = await readFile(
      join(repoRoot, "src/app/api/sources/route.ts"),
      "utf8"
    );

    const first400At = src.indexOf('{ status: 400 }');
    const checkAt = src.indexOf("const readCheck = await checkRateLimit");
    const dbReadAt = src.indexOf("from(dataSources)");

    assert.ok(first400At !== -1, "query validation 400s present");
    assert.ok(checkAt !== -1, "rate-limit guard present");
    assert.ok(dbReadAt !== -1, "database read present");
    assert.ok(src.includes('clientIpKey(request, "read:list:sources")'));
    assert.ok(src.includes("RATE_LIMITS.readList.ip"));

    assert.ok(first400At < checkAt, "validation 400 precedes the rate limit");
    assert.ok(checkAt < dbReadAt, "rate limit precedes the DB read");
  });

  it("keeps the CDN-cacheable response (s-maxage stays)", async () => {
    const src = await readFile(
      join(repoRoot, "src/app/api/sources/route.ts"),
      "utf8"
    );
    assert.ok(src.includes("s-maxage=300"));
    assert.ok(src.includes("Cache-Control"));
  });
});

describe("F12-3 — counter semantics (integration)", () => {
  after(() => {
    void pool.end().catch(() => undefined);
  });

  it("allows requests up to the limit, then blocks and never runs expensive work", async (t) => {
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
        expensive.push("db");
        return 200;
      };

      assert.equal(await attempt(), 200);
      assert.equal(await attempt(), 200);
      assert.equal(await attempt(), 429);
      assert.deepEqual(expensive, ["db", "db"]);
    } finally {
      await deleteTestKeys([key]);
    }
  });
});
