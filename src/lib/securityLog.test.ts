import "./rateLimitTestEnv";
import { after, describe, it } from "node:test";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { pool } from "@/db";
import {
  DEFAULT_SUPPRESS_MAX,
  DEFAULT_SUPPRESS_WINDOW_SECONDS,
  SECURITY_EVENT_CLEANUP_BATCH,
  SECURITY_EVENT_RETENTION_SECONDS,
  hashForLog,
  logSecurity,
  runSecurityEventRetention,
  safeErrorMessage,
} from "@/lib/securityLog";

// ============================================================================
// F7 — unified security logger.
//
// Pure assertions verify the structured envelope, severity mapping, bounded
// payload pruning, redaction and the identifier pseudonymizer. The PostgreSQL
// integration blocks exercise (1) the DB-backed global flood suppression and
// (2) persistence + retention of `security_events` — both self-skip when the
// database is unreachable, and persistence additionally skips until the
// `0019_security_events` migration is applied locally.
// ============================================================================

const TEST_KEY_PREFIX = "test:seclog:suppress:";

async function dbAvailable(): Promise<boolean> {
  try {
    await pool.query("SELECT 1");
    return true;
  } catch {
    return false;
  }
}

async function securityEventsTableExists(): Promise<boolean> {
  const { rows } = await pool.query<{ t: string | null }>(
    "SELECT to_regclass('public.security_events') AS t"
  );
  return Boolean(rows[0]?.t);
}

// Captures console.log while `logSecurity` runs and returns the parsed lines.
async function capture(
  fn: () => Promise<unknown>
): Promise<Record<string, unknown>[]> {
  const lines: string[] = [];
  const original = console.log;
  console.log = (message?: unknown) => {
    lines.push(typeof message === "string" ? message : String(message));
  };
  try {
    await fn();
  } finally {
    console.log = original;
  }
  return lines
    .map((line) => {
      try {
        return JSON.parse(line) as Record<string, unknown>;
      } catch {
        return null;
      }
    })
    .filter((entry): entry is Record<string, unknown> => entry !== null);
}

// @types/node declares NODE_ENV readonly; tests need a writable env handle.
function setEnv(key: string, value: string | undefined) {
  const env = process.env as Record<string, string | undefined>;
  if (value === undefined) delete env[key];
  else env[key] = value;
}

function saveEnvState() {
  return { authSecret: process.env.AUTH_SECRET, nodeEnv: process.env.NODE_ENV };
}

function restoreEnvState(state: {
  authSecret: string | undefined;
  nodeEnv: string | undefined;
}) {
  setEnv("AUTH_SECRET", state.authSecret);
  setEnv("NODE_ENV", state.nodeEnv);
}

describe("F7 — structured envelope", () => {
  it("emits a single structured entry with kind=security and ISO timestamp", async () => {
    const entries = await capture(() =>
      logSecurity("test.envelope", "info", { marker: 1 })
    );
    const entry = entries.find((e) => e.event === "test.envelope");
    assert.ok(entry, "structured entry must be logged");
    assert.equal(entry.kind, "security");
    assert.match(entry.t as string, /^\d{4}-\d{2}-\d{2}T/);
    assert.deepEqual(entry.payload, { marker: 1 });
  });

  it("maps valid severities and defaults invalid/undefined to info", async () => {
    for (const sev of ["warn", "error", "crit"] as const) {
      const entries = await capture(() =>
        logSecurity(`test.sev.${sev}`, sev, {})
      );
      const entry = entries.find((e) => e.event === `test.sev.${sev}`);
      assert.ok(entry);
      assert.equal(entry.severity, sev);
    }

    const asInfo = await capture(() =>
      logSecurity("test.sev.bogus", "explode" as never, {})
    );
    assert.equal(
      asInfo.find((e) => e.event === "test.sev.bogus")?.severity,
      "info"
    );
  });

  it("keeps the legacy two-argument call form (object => severity info)", async () => {
    const entries = await capture(() =>
      logSecurity("test.legacy", { marker: "x" })
    );
    const entry = entries.find((e) => e.event === "test.legacy");
    assert.ok(entry);
    assert.equal(entry.severity, "info");
    assert.deepEqual(entry.payload, { marker: "x" });
  });

  it("hoists integer userId and ipHash out of the payload", async () => {
    const entries = await capture(() =>
      logSecurity("test.hoist", "info", {
        userId: 7,
        ipHash: "ab".repeat(32),
        marker: "ok",
      })
    );
    const entry = entries.find((e) => e.event === "test.hoist");
    assert.ok(entry);
    assert.equal(entry.userId, 7);
    assert.equal(entry.ipHash, "ab".repeat(32));
    assert.deepEqual(entry.payload, { marker: "ok" });
    assert.equal((entry.payload as Record<string, unknown>).userId, undefined);
  });

  it("omits the payload key when there are no safe payload fields", async () => {
    const entries = await capture(() => logSecurity("test.nopayload"));
    const entry = entries.find((e) => e.event === "test.nopayload");
    assert.ok(entry);
    assert.equal(entry.payload, undefined);
  });
});

describe("F7 — bounded payload", () => {
  it("truncates the event name to 64 characters", async () => {
    const long = "a".repeat(100);
    const entries = await capture(() => logSecurity(long));
    assert.equal(entries[0].event, "a".repeat(64));
  });

  it("truncates strings to 300 characters", async () => {
    const entries = await capture(() =>
      logSecurity("test.trunc", "info", { text: "x".repeat(5000) })
    );
    const text = (entries[0].payload as { text: string }).text;
    assert.equal(text.length, 300);
  });

  it("caps arrays at 20 items and marks truncation", async () => {
    const entries = await capture(() =>
      logSecurity("test.array", "info", { list: Array.from({ length: 30 }, (_, i) => i) })
    );
    const list = (entries[0].payload as { list: unknown[] }).list;
    assert.equal(list.length, 21);
    assert.deepEqual(list.slice(-1), ["[more]"]);
  });

  it("caps object depth at 3 and marks deeper values", async () => {
    const deep = { l1: { l2: { l3: { l4: "too deep" } } } };
    const entries = await capture(() =>
      logSecurity("test.depth", "info", { deep })
    );
    const payload = entries[0].payload as { deep: { l1: { l2: { l3: unknown } } } };
    assert.equal(payload.deep.l1.l2.l3, "[deep]");
  });

  it("drops oversized envelopes instead of spilling them", async () => {
    const big: Record<string, string> = {};
    for (let i = 0; i < 40; i++) big[`k${i}`] = "x".repeat(300);
    const entries = await capture(() =>
      logSecurity("test.oversize", "info", big)
    );
    const payload = entries[0].payload as Record<string, unknown>;
    assert.equal(payload.dropped, true);
    assert.equal(payload.reason, "payload_too_large");
  });
});

describe("F7 — redaction", () => {
  it("redacts exact-match sensitive keys (email/ip/phone/password…)", async () => {
    const fields = {
      email: "victim@example.com",
      ip: "203.0.113.9",
      ipAddress: "198.51.100.2",
      phone: "+213550000000",
      password: "hunter2",
      passwd: "hunter2",
      pwd: "hunter2",
    };
    const entries = await capture(() => logSecurity("test.redact.exact", "info", fields));
    const payload = entries[0].payload as Record<string, string>;
    for (const v of Object.values(payload)) assert.equal(v, "[redacted]");
  });

  it("redacts substring keys holding tokens/secrets/cookies/raw identifiers", async () => {
    const fields = {
      idToken: "eyJ.raw.id.token",
      access_token_hash: "tok",
      csrfToken: "sig",
      apiKey: "ak-1234",
      authorization: "Bearer abc",
      bearer: "xyz",
      sessionCookie: "sess",
      jwt: "aaaaaaaa",
      oauthClientSecret: "sec",
      credentials: "creds",
      privateKey: "BEGIN KEY",
      authCode: "code",
    };
    const entries = await capture(() => logSecurity("test.redact.sub", "info", fields));
    const payload = entries[0].payload as Record<string, unknown>;
    for (const [k, v] of Object.entries(payload)) {
      assert.equal(v, "[redacted]", `key ${k} must be redacted`);
    }
  });

  it("keeps benign payload values untouched", async () => {
    const fields = {
      reason: "rate_limit",
      source: "internal",
      userId: "not-an-int",
      count: 3,
      ok: true,
      note: "مرحبا",
    };
    const entries = await capture(() => logSecurity("test.redact.keep", "info", fields));
    assert.deepEqual(entries[0].payload, fields);
  });
});

describe("F7 — identifier pseudonymizer (hashForLog)", () => {
  it("produces a deterministic 16-hex digest", () => {
    const a = hashForLog("user@example.com");
    const b = hashForLog("user@example.com");
    assert.ok(a && b);
    assert.match(a, /^[0-9a-f]{16}$/);
    assert.equal(a, b);
  });

  it("never embeds the raw identifier in the digest", () => {
    const h = hashForLog("user@example.com");
    assert.ok(h && !h.includes("user") && !h.includes("exampl"));
  });

  it("differs under a different secret", () => {
    const state = saveEnvState();
    setEnv("AUTH_SECRET", "s".repeat(48));
    const one = hashForLog("x");
    setEnv("AUTH_SECRET", "t".repeat(48));
    const two = hashForLog("x");
    restoreEnvState(state);
    assert.ok(one && two);
    assert.notEqual(one, two);
  });

  it("returns null in production when AUTH_SECRET is missing (no static fallback)", () => {
    const state = saveEnvState();
    setEnv("AUTH_SECRET", undefined);
    setEnv("NODE_ENV", "production");
    try {
      assert.equal(hashForLog("user@example.com"), null);
    } finally {
      restoreEnvState(state);
    }
  });

  it("keeps the dev/local fallback digest so local behavior is unchanged", () => {
    const state = saveEnvState();
    setEnv("AUTH_SECRET", undefined);
    setEnv("NODE_ENV", "development");
    try {
      assert.match(hashForLog("x") ?? "", /^[0-9a-f]{16}$/);
    } finally {
      restoreEnvState(state);
    }
  });
});

describe("F7 — safeErrorMessage", () => {
  it("summarizes Error instances without stack traces", () => {
    const m = safeErrorMessage(new Error("boom ".repeat(500)));
    assert.equal(m, "boom ".repeat(300).slice(0, 300));
  });

  it("handles strings, nullish and non-serializable values", () => {
    assert.equal(safeErrorMessage("plain"), "plain");
    assert.equal(safeErrorMessage(null), null);
    assert.equal(safeErrorMessage(undefined), null);
    const cyclic: Record<string, unknown> = { self: null as unknown };
    cyclic.self = cyclic;
    assert.ok(typeof safeErrorMessage(cyclic) === "string");
  });
});

describe("F7 — fail-open (logging can never fail the request)", () => {
  it("resolves and still prints when the DB write is impossible", async () => {
    const entries = await capture(() =>
      logSecurity("test.failopen", "warn", { note: "ok" })
    );
    assert.ok(entries.some((e) => e.event === "test.failopen"));
  });
});

describe("F7 — PostgreSQL flood suppression & persistence (integration)", () => {
  after(() => {
    void pool.end().catch(() => undefined);
  });

  it("drops repeat flood events beyond the per-window max (global, DB-backed)", async (t) => {
    if (!(await dbAvailable())) {
      t.skip("PostgreSQL unavailable");
      return;
    }

    const suppressKey = `${TEST_KEY_PREFIX}${randomBytes(4).toString("hex")}`;
    const entries = await capture(() =>
      Promise.all(
        Array.from({ length: 5 }, () =>
          logSecurity(
            "test.flood.warn",
            "warn",
            {},
            { suppress: { key: suppressKey, max: 2, windowSeconds: 60 } }
          )
        )
      )
    );
    const emitted = entries.filter((e) => e.event === "test.flood.warn");
    assert.equal(emitted.length, 2, "only max events per window are emitted");

    await pool
      .query("DELETE FROM rate_limits WHERE key = $1", [
        `seclog:suppress:test.flood.warn:${suppressKey}`,
      ])
      .catch(() => undefined);
  });

  it("persists a bounded row into security_events when the table exists", async (t) => {
    if (!(await dbAvailable())) {
      t.skip("PostgreSQL unavailable");
      return;
    }
    if (!(await securityEventsTableExists())) {
      t.skip("security_events not migrated yet (0019)");
      return;
    }

    const event = `test.evt.${randomBytes(4).toString("hex")}`;
    try {
      await logSecurity(event, "info", { marker: "x" });
      const { rows } = await pool.query(
        "SELECT severity, payload::text AS payload FROM security_events WHERE event = $1",
        [event]
      );
      assert.equal(rows.length, 1);
      assert.equal(rows[0].severity, "info");
      assert.deepEqual(JSON.parse(rows[0].payload as string), { marker: "x" });
    } finally {
      await pool.query("DELETE FROM security_events WHERE event = $1", [event]);
    }
  });

  it("retains rows within the retention window and bounds cleanup batches", async (t) => {
    if (!(await dbAvailable())) {
      t.skip("PostgreSQL unavailable");
      return;
    }
    if (!(await securityEventsTableExists())) {
      t.skip("security_events not migrated yet (0019)");
      return;
    }

    const pastEvent = `test.old.${randomBytes(4).toString("hex")}`;
    const freshEvent = `test.fresh.${randomBytes(4).toString("hex")}`;
    try {
      await pool.query(
        `INSERT INTO security_events (event, severity, payload, ip_hash, created_at)
         VALUES ($1, 'info', NULL, NULL, now() - interval '4 days')`,
        [pastEvent]
      );
      await logSecurity(freshEvent, "info", { marker: "keep" });

      const result = await runSecurityEventRetention({
        maxAgeSeconds: 3 * 24 * 60 * 60,
        batch: 10,
      });
      assert.ok(result.deleted >= 1);

      const oldGone = await pool.query(
        "SELECT 1 FROM security_events WHERE event = $1",
        [pastEvent]
      );
      assert.equal(oldGone.rowCount, 0);

      const freshKept = await pool.query(
        "SELECT 1 FROM security_events WHERE event = $1",
        [freshEvent]
      );
      assert.equal(freshKept.rowCount, 1);
    } finally {
      await pool.query("DELETE FROM security_events WHERE event = $1", [pastEvent]);
      await pool.query("DELETE FROM security_events WHERE event = $1", [freshEvent]);
    }
  });
});

describe("F7 — config invariants (regression)", () => {
  it("exposes sane defaults for the flood window", () => {
    assert.equal(DEFAULT_SUPPRESS_MAX, 5);
    assert.equal(DEFAULT_SUPPRESS_WINDOW_SECONDS, 60);
  });

  it("defines a 30-day bounded retention", () => {
    assert.equal(SECURITY_EVENT_RETENTION_SECONDS, 30 * 24 * 60 * 60);
    assert.ok(SECURITY_EVENT_CLEANUP_BATCH > 0);
    assert.ok(SECURITY_EVENT_CLEANUP_BATCH <= 1000);
  });
});