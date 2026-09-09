import "./rateLimitTestEnv";
import { after, describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { pool } from "@/db";
import {
  RATE_LIMITS,
  checkRateLimit,
  clientIpKey,
  rateLimitExceededResponse,
} from "@/lib/rateLimit";

// ============================================================================
// F12-2 — Capacitor Google OAuth: account-creation cap.
//
// The web callback enforces RATE_LIMITS.google.signup (5/15min per IP) inside
// its account-creation branch; the Capacitor Android endpoint previously did
// NOT, letting an IP-rotating attacker mint accounts (web + Android combined)
// above the F10-08 ceiling. The fix reuses the SAME shared
// `clientIpKey(request, "google:signup")` bucket so both flows combined stay
// ≤ 5/15min per IP. Existing-account logins never touch the cap.
//
// The route cannot be executed end-to-end here (it needs real Google
// idToken/JWKS), so — like readRateLimit.test.ts — the route-level checks are
// structural (branch placement, guard-before-INSERT, shared key string) and
// the counter semantics are exercised directly against the real bucket shape.
// ============================================================================

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "../..");

function request(ip: string): Request {
  return new Request("https://nabda.test/api/_f12-2", {
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

describe("F12-2 — signup cap config", () => {
  it("defines google.signup as 5 per 15 minutes per IP", () => {
    assert.equal(RATE_LIMITS.google.signup.limit, 5);
    assert.equal(RATE_LIMITS.google.signup.windowSeconds, 15 * 60);
  });

  it("shares one bucket namespace between web and Capacitor (same key)", async () => {
    const capacitor = await readFile(
      join(repoRoot, "src/app/api/auth/google/capacitor/route.ts"),
      "utf8"
    );
    const callback = await readFile(
      join(repoRoot, "src/app/api/auth/google/callback/route.ts"),
      "utf8"
    );

    // Both routes must key the signup bucket identically (no extra namespace
    // on either side), so alternating endpoints cannot double the ceiling.
    assert.ok(
      capacitor.includes('clientIpKey(request, "google:signup")'),
      "capacitor must use the shared google:signup bucket"
    );
    assert.ok(
      callback.includes('clientIpKey(request, "google:signup")'),
      "web callback must keep the shared google:signup bucket"
    );
    assert.ok(
      capacitor.includes("RATE_LIMITS.google.signup"),
      "capacitor must use the google.signup config"
    );
  });
});

describe("F12-2 — guard placement (structural)", () => {
  it("bounds ONLY the new-account branch, before the INSERT", async () => {
    const src = await readFile(
      join(repoRoot, "src/app/api/auth/google/capacitor/route.ts"),
      "utf8"
    );

    const signupAt = src.indexOf("signupCheck");
    const insertAt = src.indexOf("insert(users)");
    const existingAt = src.indexOf("existing.length > 0");
    const status429At = src.indexOf("{ status: 429 }");
    const eventAt = src.indexOf('"oauth.signup_rate_limited"');
    const hashAt = src.indexOf("hashForLog(email)");

    assert.ok(signupAt !== -1, "signup check present");
    assert.ok(insertAt !== -1, "user INSERT present");
    assert.ok(status429At !== -1, "429 response present");
    assert.ok(eventAt !== -1, "security event emitted on rejection");
    assert.ok(hashAt !== -1, "rejection logs a pseudonymized email");

    // Existing-account branch is checked BEFORE the signup cap and the
    // INSERT, so repeated logins never consume the cap.
    assert.ok(existingAt < signupAt);
    assert.ok(existingAt < insertAt);
    // The cap is enforced before any account can be written.
    assert.ok(signupAt < insertAt);
  });

  it("keeps the google.token verification path unchanged", async () => {
    const src = await readFile(
      join(repoRoot, "src/app/api/auth/google/capacitor/route.ts"),
      "utf8"
    );
    assert.ok(src.includes("verifyGoogleIdToken(idToken, audience)"));
  });
});

describe("F12-2 — 429 shape via the established helper", () => {
  it("returns Retry-After with no bucket/PII leakage", async () => {
    const res = rateLimitExceededResponse({
      allowed: false,
      limit: RATE_LIMITS.google.signup.limit,
      windowSeconds: RATE_LIMITS.google.signup.windowSeconds,
      retryAfterSeconds: 300,
    });

    assert.equal(res.status, 429);
    assert.equal(res.headers.get("Retry-After"), "300");
    assert.equal(res.headers.get("Cache-Control"), "private, no-store");
    const body = await res.json();
    assert.ok(!JSON.stringify(body).includes("google"));
    assert.ok(!JSON.stringify(body).includes("token"));
  });
});

describe("F12-2 — shared-bucket counter semantics (integration)", () => {
  after(() => {
    void pool.end().catch(() => undefined);
  });

  it("6th signup attempt from the same IP is denied; no higher budget via web+Android alternation", async (t) => {
    if (!(await dbAvailable())) {
      t.skip("PostgreSQL unavailable");
      return;
    }

    // Real bucket key exactly as both routes build it.
    const key = clientIpKey(request("198.51.100.42"), "google:signup");
    const { limit, windowSeconds } = RATE_LIMITS.google.signup;

    try {
      const outcomes: boolean[] = [];
      for (let i = 0; i < limit + 1; i++) {
        const check = await checkRateLimit({ key, limit, windowSeconds });
        outcomes.push(check.allowed);
      }

      assert.equal(
        outcomes.filter(Boolean).length,
        limit,
        `exactly ${limit} account creations allowed per IP window`
      );
      assert.equal(outcomes[outcomes.length - 1], false);
    } finally {
      await deleteTestKeys([key]);
    }
  });
});