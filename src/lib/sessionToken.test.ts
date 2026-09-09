import "./rateLimitTestEnv";
import { after, describe, it } from "node:test";
import assert from "node:assert/strict";
import { createHmac, randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pool } from "@/db";
import {
  createSessionToken,
  generateSessionJti,
  verifySessionToken,
  verifySessionTokenMinimal,
  SESSION_COOKIE_NAME,
} from "@/lib/sessionToken";
import {
  authorizeUserToken,
  createSession,
  isSessionActive,
  revokeSession,
} from "@/lib/auth";

process.env.AUTH_SECRET = "a".repeat(48);

// Local stand-in for sessionToken's internal signValue, used only to author
// deliberately malformed tokens in the boundary tests below.
function signRaw(payload: unknown): string {
  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString(
    "base64url"
  );
  const sig = createHmac("sha256", process.env.AUTH_SECRET ?? "")
    .update(encoded)
    .digest("base64url");
  return `${encoded}.${sig}`;
}

function makePayload(overrides: Record<string, unknown>): string {
  const base = {
    version: 1,
    userId: 42,
    role: "user",
    tokenVersion: 0,
    jti: generateSessionJti(),
    issuedAt: Math.floor(Date.now() / 1000) - 60,
    expiresAt: Math.floor(Date.now() / 1000) + 3600,
  };
  return signRaw({ ...base, ...overrides });
}

describe("session token boundary (V1b — proxy + auth shared verification)", () => {
  it("verifySessionTokenMinimal returns the signed identity (no DB)", () => {
    const token = createSessionToken({ id: 42, role: "admin", tokenVersion: 3, jti: generateSessionJti() });
    assert.ok(token && token.includes("."), "token must be payload.signature");
    const s = verifySessionTokenMinimal(token);
    assert.ok(s, "minimal verification should accept a valid token");
    assert.equal(s!.userId, 42);
    assert.equal(s!.role, "admin");
    assert.equal(s!.tokenVersion, 3);
    assert.ok(
      s!.expiresAt > Math.floor(Date.now() / 1000),
      "expiresAt must be in the future"
    );
  });

  it("cookie name stays stable (proxy matcher reads it)", () => {
    assert.equal(SESSION_COOKIE_NAME, "nabda_session");
  });

  it("rejects a tampered signature", () => {
    const token = createSessionToken({ id: 1, role: "user", tokenVersion: 0, jti: generateSessionJti() });
    const [p, sig] = token.split(".");
    const flipped = sig[0] === "A" ? "B" : "A";
    const tampered = `${p}.${flipped}${sig.slice(1)}`;
    assert.equal(verifySessionToken(tampered), null);
    assert.equal(verifySessionTokenMinimal(tampered), null);
  });

  it("rejects a tampered payload (userId swapped)", () => {
    const token = createSessionToken({ id: 1, role: "user", tokenVersion: 0, jti: generateSessionJti() });
    const [p, sig] = token.split(".");
    const payload = JSON.parse(Buffer.from(p, "base64url").toString("utf8"));
    payload.userId = 999;
    const swappedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString(
      "base64url"
    );
    const tampered = `${swappedPayload}.${sig}`;
    assert.equal(verifySessionToken(tampered), null);
  });

  it("rejects an expired token", () => {
    const token = createSessionToken({ id: 1, role: "user", tokenVersion: 0, jti: generateSessionJti() });
    const origNow = Date.now;
    Date.now = () => origNow() + 90 * 24 * 60 * 60 * 1000; // +90 days
    try {
      assert.equal(verifySessionToken(token), null);
      assert.equal(verifySessionTokenMinimal(token), null);
    } finally {
      Date.now = origNow;
    }
  });

  it("rejects malformed tokens", () => {
    for (const bad of ["", "abc", "a.b.c", "only-one", "a.b", undefined]) {
      assert.equal(verifySessionToken(bad as unknown as string), null);
    }
  });

  it("fails when the signing secret changes (cross-deployment invalidation)", () => {
    const token = createSessionToken({ id: 1, role: "user", tokenVersion: 0, jti: generateSessionJti() });
    process.env.AUTH_SECRET = "b".repeat(48);
    try {
      assert.equal(verifySessionToken(token), null);
    } finally {
      process.env.AUTH_SECRET = "a".repeat(48);
    }
  });
});

describe("F8 — session payload carries a fresh cryptographically-random jti", () => {
  it("emits a 64-char hex jti on every session token", () => {
    const token = createSessionToken({ id: 1, role: "user", tokenVersion: 0, jti: generateSessionJti() });
    const payload = verifySessionToken(token);
    assert.ok(payload, "valid token must verify");
    assert.match(payload!.jti, /^[a-f0-9]{64}$/);
  });

  it("two issued tokens never share a jti", () => {
    const a = verifySessionToken(createSessionToken({ id: 1, role: "user", tokenVersion: 0, jti: generateSessionJti() }));
    const b = verifySessionToken(createSessionToken({ id: 1, role: "user", tokenVersion: 0, jti: generateSessionJti() }));
    assert.ok(a && b);
    assert.notEqual(a.jti, b.jti);
  });

  it("rejects a token that is missing its jti (old/unsupported tokens fail closed)", () => {
    const noJti: Record<string, unknown> = {
      version: 1,
      userId: 42,
      role: "user",
      tokenVersion: 0,
      jti: generateSessionJti(),
      issuedAt: Math.floor(Date.now() / 1000) - 60,
      expiresAt: Math.floor(Date.now() / 1000) + 3600,
    };
    delete noJti.jti;
    assert.equal(verifySessionToken(signRaw(noJti)), null);
  });

  it("rejects short, non-hex or absurdly long jti values", () => {
    assert.equal(verifySessionToken(makePayload({ jti: "abc" })), null);
    assert.equal(verifySessionToken(makePayload({ jti: "zz".repeat(32) })), null);
    assert.equal(verifySessionToken(makePayload({ jti: "a".repeat(200) })), null);
    assert.equal(verifySessionToken(makePayload({ jti: "" })), null);
    assert.equal(verifySessionToken(makePayload({ jti: null })), null);
    assert.ok(verifySessionToken(makePayload({})), "valid jti must still pass");
  });
});

describe("F8 — pure user gate (authorizeUserToken)", () => {
  it("accepts an enabled user with a matching tokenVersion", () => {
    assert.equal(
      authorizeUserToken({ role: "user", tokenVersion: 0 }, { role: "user", tokenVersion: 0 }),
      true
    );
  });

  it("rejects a tokenVersion mismatch (user-wide logout invalidation kept)", () => {
    assert.equal(
      authorizeUserToken({ role: "user", tokenVersion: 1 }, { role: "user", tokenVersion: 0 }),
      false
    );
  });

  it("rejects a disabled account regardless of tokenVersion", () => {
    assert.equal(
      authorizeUserToken({ role: "disabled", tokenVersion: 0 }, { role: "disabled", tokenVersion: 0 }),
      false
    );
  });
});

async function sessionTableReady(): Promise<boolean> {
  try {
    await pool.query("SELECT 1");
    const { rows } = await pool.query<{ t: string | null }>(
      "SELECT to_regclass('public.sessions') AS t"
    );
    return Boolean(rows[0]?.t);
  } catch {
    return false;
  }
}

describe("F8 — PostgreSQL sessions (integration, self-skip)", () => {
  let ready = false;
  let testUserId: number | null = null;
  const touchedJtis: string[] = [];

  after(async () => {
    for (const j of touchedJtis) {
      await pool.query("DELETE FROM sessions WHERE jti = $1", [j]).catch(() => undefined);
    }
    if (testUserId !== null) {
      await pool.query("DELETE FROM users WHERE id = $1", [testUserId]).catch(() => undefined);
    }
    void pool.end().catch(() => undefined);
  });

  it("createSession persists one row per token, bound to the issuing user", async (t) => {
    if (!(await sessionTableReady())) {
      t.skip("sessions not migrated yet (0020) or DB unreachable");
      return;
    }
    ready = true;

    // Raw SQL insert: the local dev DB predates 0013 (users.token_version) and
    // the F8 tests must not depend on any migration other than 0020. Only the
    // minimal NOT NULL columns are written; FK cascade cleans the session rows.
    const email = `f8-test-${randomBytes(8).toString("hex")}@example.test`;
    const inserted = await pool.query<{ id: number }>(
      "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id",
      ["F8 Test User", email, "f8-test-hash", "user"]
    );
    testUserId = inserted.rows[0].id;

    const token = await createSession({ id: testUserId, role: "user", tokenVersion: 0 });
    const payload = verifySessionToken(token);
    assert.ok(payload, "issued token must verify");
    touchedJtis.push(payload!.jti);

    const { rows } = await pool.query<{ user_id: number | null }>(
      "SELECT user_id FROM sessions WHERE jti = $1",
      [payload!.jti]
    );
    assert.equal(rows.length, 1, "exactly one session row per token");
    assert.equal(rows[0].user_id, testUserId);
  });

  it("a freshly created session is active", async (t) => {
    if (!ready) {
      t.skip("skipped (no DB above)");
      return;
    }
    const token = await createSession({ id: testUserId!, role: "user", tokenVersion: 0 });
    const payload = verifySessionToken(token)!;
    touchedJtis.push(payload.jti);
    assert.equal(await isSessionActive(payload.jti), true);
  });

  it("revoking a session deactivates it — an old cookie replay is refused", async (t) => {
    if (!ready) {
      t.skip("skipped (no DB above)");
      return;
    }
    const token = await createSession({ id: testUserId!, role: "user", tokenVersion: 0 });
    const payload = verifySessionToken(token)!;
    touchedJtis.push(payload.jti);
    assert.equal(await isSessionActive(payload.jti), true);
    await revokeSession(payload.jti, testUserId!);
    assert.equal(await isSessionActive(payload.jti), false);
  });

  it("revoking is idempotent (double logout never errors)", async (t) => {
    if (!ready) {
      t.skip("skipped (no DB above)");
      return;
    }
    const token = await createSession({ id: testUserId!, role: "user", tokenVersion: 0 });
    const payload = verifySessionToken(token)!;
    touchedJtis.push(payload.jti);
    await revokeSession(payload.jti, testUserId!);
    await revokeSession(payload.jti, testUserId!);
    assert.equal(await isSessionActive(payload.jti), false);
  });

  it("an unknown jti is never active", async (t) => {
    if (!ready) {
      t.skip("skipped (no DB above)");
      return;
    }
    assert.equal(await isSessionActive(randomBytes(32).toString("hex")), false);
  });

  it("an expired session row is inactive even when never revoked", async (t) => {
    if (!ready) {
      t.skip("skipped (no DB above)");
      return;
    }
    const expiredJti = generateSessionJti();
    touchedJtis.push(expiredJti);
    const past = new Date(Date.now() - 60_000);
    await pool.query(
      "INSERT INTO sessions (user_id, jti, created_at, expires_at, revoked_at) VALUES ($1, $2, now(), $3, NULL)",
      [testUserId!, expiredJti, past]
    );
    assert.equal(await isSessionActive(expiredJti), false);
  });

  it("CRITICAL — revoking one session keeps a concurrent session alive", async (t) => {
    if (!ready) {
      t.skip("skipped (no DB above)");
      return;
    }
    const tokenA = await createSession({ id: testUserId!, role: "user", tokenVersion: 0 });
    const tokenB = await createSession({ id: testUserId!, role: "user", tokenVersion: 0 });
    const jtiA = verifySessionToken(tokenA)!.jti;
    const jtiB = verifySessionToken(tokenB)!.jti;
    touchedJtis.push(jtiA, jtiB);
    assert.notEqual(jtiA, jtiB, "two logins must carry two distinct jtis");

    await revokeSession(jtiA, testUserId!);
    assert.equal(await isSessionActive(jtiA), false, "logged-out session revoked");
    assert.equal(await isSessionActive(jtiB), true, "concurrent session must survive");
  });

  it("createSession is fail-closed: no token, no orphan session when the row cannot persist", async (t) => {
    if (!ready) {
      t.skip("skipped (no DB above)");
      return;
    }
    // A bogus userId violates the FK, so createSession must throw BEFORE any
    // token (and no sessions row can even be attempted) — the route handler
    // then returns an error instead of a cookie.
    await assert.rejects(createSession({ id: 999_999_999, role: "user", tokenVersion: 0 }));
    const { rows } = await pool.query("SELECT 1 FROM sessions WHERE user_id = $1", [999_999_999]);
    assert.equal(rows.length, 0, "no orphan session row may exist");
  });
});

describe("F8 — route wiring invariants (static source audit)", () => {
  const read = (rel: string) =>
    readFileSync(resolve(process.cwd(), rel), "utf8");

  it("logout revokes the CURRENT session only, keeping token_version untouched", () => {
    const src = read("src/app/api/auth/logout/route.ts");
    assert.ok(src.includes("revokeSession("), "logout must revoke by jti");
    assert.ok(!src.includes(".update(users)"), "logout must not bump token_version");
    assert.ok(!src.includes("tokenVersion"), "no tokenVersion bump remains");
  });

  it("logout keeps the F7 auth.logout audit event with no raw jti/token in its payload", () => {
    const src = read("src/app/api/auth/logout/route.ts");
    const idx = src.indexOf('logSecurity("auth.logout"');
    assert.ok(idx !== -1, "auth.logout event must stay");
    const payloadFragment = src.slice(idx, src.indexOf("});", idx));
    assert.ok(payloadFragment.includes("userId"), "logs the userId");
    assert.ok(!payloadFragment.includes("jti"), "never logs the raw jti");
    assert.ok(!payloadFragment.includes("token"), "never logs the token/cookie");
  });

  it("every login flow mints a fresh per-session token via createSession", () => {
    for (const rel of [
      "src/app/api/auth/login/route.ts",
      "src/app/api/auth/google/callback/route.ts",
      "src/app/api/auth/google/capacitor/route.ts",
    ]) {
      const src = read(rel);
      assert.ok(src.includes("createSession("), `${rel} must call createSession`);
      assert.ok(!src.includes("createSessionToken("), `${rel} must not mint un-keyed tokens`);
    }
  });

  it("register is NOT a login flow: it must never mint a session/cookie", () => {
    const src = read("src/app/api/auth/register/route.ts");
    assert.ok(!src.includes("createSession("), "register must not auto-login");
    assert.ok(!src.includes("SESSION_COOKIE_NAME"), "register must not set a session cookie");
    assert.ok(!src.includes("getSessionCookieOptions"), "register must not touch cookie options");
  });
});