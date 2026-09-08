import { createHmac } from "node:crypto";

// ============================================================================
// F7 — Unified security logger (structured, bounded, fail-open, flood-safe).
//
// Sink strategy (serverless/Vercel + Neon PostgreSQL):
//   - NO in-memory batching queue: on Vercel Functions a request may be the
//     last thing an instance runs, so unsent buffered events would be lost.
//   - Every event is (1) formatted and written to `console.log` IMMEDIATELY,
//     then (2) persisted best-effort with a single bounded `INSERT` into
//     `security_events`. Both steps are wrapped so a logging failure can
//     never fail, slow down meaningfully, or change the request.
//   - `security_events` is optional at runtime: until the migration is
//     applied the INSERT just fails and the event still lives in the console
//     stream. The logger is therefore safe on a database without the table.
//   - Global flood suppression reuses the existing `rate_limits` table
//     (namespace `seclog:suppress:...`) with the same atomic
//     INSERT ... ON CONFLICT window counter as the rate limiter. Being
//     DB-backed it stays global across serverless cold starts/instances;
//     being windowed it bounds the worst-case log volume per event per
//     window. If the database is down the suppression check fails OPEN
//     (events are logged) — logging is never a control plane.
//   - Retention: bounded, throttled cleanup of rows older than 30 days runs
//     opportunistically from the persist path (mirrors the existing
//     rate_limits cleanup pattern).
//
// Redaction: values whose key names indicate sensitive material (password,
// tokens, cookies, secrets, keys, raw identifiers) are replaced with a
// constant marker before anything is logged. Identifiers that ARE needed
// (e.g. email) must be passed pre-hashed via `hashForLog`.
// ============================================================================

export type SecurityLogSeverity = "info" | "warn" | "error" | "crit";

export type SecurityLogSuppress = {
  key: string;
  max?: number;
  windowSeconds?: number;
};

export type SecurityLogOptions = {
  suppress?: SecurityLogSuppress;
};

const SEVERITIES: ReadonlySet<string> = new Set([
  "info",
  "warn",
  "error",
  "crit",
]);

const MAX_EVENT_LENGTH = 64;
const MAX_STRING_LENGTH = 300;
const MAX_ARRAY_LENGTH = 20;
const MAX_PAYLOAD_DEPTH = 3;
const MAX_PAYLOAD_BYTES = 8192;
const REDACTED_MARKER = "[redacted]";
export const DEFAULT_SUPPRESS_MAX = 5;
export const DEFAULT_SUPPRESS_WINDOW_SECONDS = 60;

// Retention for `security_events` — 30 days keeps a usable forensic window
// without unbounded growth. Cleanup is bounded per run and self-throttles.
export const SECURITY_EVENT_RETENTION_SECONDS = 30 * 24 * 60 * 60;
export const SECURITY_EVENT_CLEANUP_BATCH = 500;
export const SECURITY_EVENT_CLEANUP_THROTTLE_MS = 60 * 60 * 1000;

// Key names whose string values must never reach a log. Matching is done on a
// normalized key (lowercased, non-alphanumeric removed). Exact-match keys are
// raw identifiers (email/ip/phone); the rest are substring matches so
// `session_token`, `csrfToken`, `apiKey`, `authorization`, `idToken`... hit.
const REDACT_EXACT = new Set([
  "email",
  "ip",
  "ipaddress",
  "phone",
  "phonenumber",
  "password",
  "passwd",
  "pwd",
]);
const REDACT_SUBSTRING = [
  "token",
  "secret",
  "cookie",
  "authorization",
  "apikey",
  "api-key",
  "credential",
  "bearer",
  "jwt",
  "auth",
  "oauth",
  "privatekey",
];

function isSensitiveKey(key: string): boolean {
  const normalized = key.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (REDACT_EXACT.has(normalized)) return true;
  for (const part of REDACT_SUBSTRING) {
    if (normalized.includes(part)) return true;
  }
  return false;
}

function truncateString(value: string): string {
  return value.length > MAX_STRING_LENGTH
    ? value.slice(0, MAX_STRING_LENGTH)
    : value;
}

// Bounded recursive sanitizer. Returns the pruned value or `undefined` for
// values that must be omitted (functions, symbols, undefined).
function pruneValue(
  value: unknown,
  key: string | undefined,
  depth: number
): unknown {
  if (value === null) return null;
  if (value === undefined) return undefined;

  const type = typeof value;

  if (type === "string") {
    if (key !== undefined && isSensitiveKey(key)) return REDACTED_MARKER;
    return truncateString(value as string);
  }

  if (type === "number" || type === "boolean") return value;
  if (type === "bigint") return truncateString(String(value));
  if (type === "function" || type === "symbol") return undefined;

  if (value instanceof Date) return truncateString(value.toISOString());

  if (Array.isArray(value)) {
    if (depth > MAX_PAYLOAD_DEPTH) return "[deep]";
    const out: unknown[] = [];
    for (const item of value.slice(0, MAX_ARRAY_LENGTH)) {
      const pruned = pruneValue(item, undefined, depth + 1);
      if (pruned !== undefined) out.push(pruned);
    }
    if (value.length > MAX_ARRAY_LENGTH) out.push("[more]");
    return out;
  }

  if (type === "object") {
    if (depth > MAX_PAYLOAD_DEPTH) return "[deep]";
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      const pruned = pruneValue(v, k, depth + 1);
      if (pruned !== undefined) out[k] = pruned;
    }
    return out;
  }

  return undefined;
}

// Hoist the dedicated identifier fields out of the payload, then bound the
// remaining payload's serialized size. Oversized envelopes are dropped rather
// than spilled (a truncated stack trace is not actionable anyway).
function sanitizeEntryInput(
  event: string,
  severity: SecurityLogSeverity,
  fields?: Record<string, unknown>
): {
  event: string;
  severity: SecurityLogSeverity;
  userId?: number;
  ipHash?: string;
  payload?: Record<string, unknown>;
} {
  let userId: number | undefined;
  let ipHash: string | undefined;

  const copy: Record<string, unknown> = { ...(fields ?? {}) };

  if (typeof copy.userId === "number" && Number.isInteger(copy.userId)) {
    userId = copy.userId;
    delete copy.userId;
  }

  if (typeof copy.ipHash === "string") {
    ipHash = copy.ipHash.slice(0, 64);
    delete copy.ipHash;
  }

  let pruned: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(copy)) {
    const out = pruneValue(v, k, 1);
    if (out !== undefined) pruned[k] = out;
  }

  const payloadSize = JSON.stringify(pruned)?.length ?? 0;
  if (payloadSize > MAX_PAYLOAD_BYTES) {
    pruned = { dropped: true, reason: "payload_too_large" };
  }

  return {
    event: String(event).slice(0, MAX_EVENT_LENGTH),
    severity: SEVERITIES.has(severity) ? severity : "info",
    ...(userId !== undefined ? { userId } : {}),
    ...(ipHash !== undefined ? { ipHash } : {}),
    ...(Object.keys(pruned).length > 0 ? { payload: pruned } : {}),
  };
}

/**
 * HMAC-SHA256 keyed pseudonymizer for identifiers that are unavoidable in a
 * log (e.g. a login email). Never reversible without AUTH_SECRET.
 *
 * If AUTH_SECRET is missing in production the function returns `null` and the
 * caller omits the identifier: a static dev fallback secret would let an
 * attacker precompute digests. Outside production the previous dev fallback
 * is kept so local behaviour does not change.
 */
export function hashForLog(value: string): string | null {
  let secret = process.env.AUTH_SECRET || undefined;

  if (!secret) {
    if (process.env.NODE_ENV === "production") return null;
    secret = "nabda-security-log-fallback";
  }

  return createHmac("sha256", secret)
    .update(value)
    .digest("hex")
    .slice(0, 16);
}

/**
 * Bounded single-line error summary for structured logs. Never pass a raw
 * Error object to logSecurity — use this (or nothing).
 */
export function safeErrorMessage(
  error: unknown,
  max = MAX_STRING_LENGTH
): string | null {
  if (error instanceof Error) {
    const text = error.message?.trim() || error.name;
    return (text || null) && String(text).slice(0, max);
  }
  if (typeof error === "string") return error.slice(0, max);
  if (error === undefined || error === null) return null;
  try {
    const serialized = JSON.stringify(error);
    return serialized ? serialized.slice(0, max) : null;
  } catch {
    return String(error).slice(0, max) ?? null;
  }
}

async function getPool(): Promise<import("pg").Pool | null> {
  try {
    // Lazy import: keeps @/db (which requires DATABASE_URL at module load)
    // out of this module's static graph so csrf.test.ts and friends load and
    // run without a database. The import is cached by Node after first use.
    const { pool } = await import("@/db");
    return pool;
  } catch {
    return null;
  }
}

async function isSuppressed(
  event: string,
  suppress: SecurityLogSuppress
): Promise<boolean> {
  const max = suppress.max ?? DEFAULT_SUPPRESS_MAX;
  const windowSeconds =
    suppress.windowSeconds ?? DEFAULT_SUPPRESS_WINDOW_SECONDS;

  const safeKey = String(suppress.key)
    .replace(/[\u0000-\u001f]/g, "")
    .slice(0, 80);

  const counterKey = `seclog:suppress:${event}:${safeKey}`.slice(0, 160);

  const now = Math.floor(Date.now() / 1000);
  const windowStart = Math.floor(now / windowSeconds) * windowSeconds;

  const pool = await getPool();
  if (!pool) return false; // fail-open: without a DB we still log

  try {
    const result = await pool.query<{ count: number }>(
      `INSERT INTO rate_limits (key, count, window_start, updated_at)
       VALUES ($1, 1, $2, now())
       ON CONFLICT (key) DO UPDATE SET
         count = CASE
           WHEN rate_limits.window_start = $2
             THEN rate_limits.count + 1
           ELSE 1
         END,
         window_start = $2,
         updated_at = now()
       RETURNING count`,
      [counterKey, windowStart]
    );

    return Number(result.rows[0]?.count ?? 1) > max;
  } catch {
    // Fail-open: suppression must never turn off logging on its own error.
    return false;
  }
}

async function maybeCleanupSecurityEvents(): Promise<void> {
  const now = Date.now();
  if (now - lastSecurityEventsCleanupAt < SECURITY_EVENT_CLEANUP_THROTTLE_MS) {
    return;
  }
  lastSecurityEventsCleanupAt = now;

  try {
    const pool = await getPool();
    if (!pool) return;
    await pool.query(
      `DELETE FROM security_events
       WHERE id IN (
         SELECT id FROM security_events
         WHERE created_at < now() - ($1 * interval '1 second')
         ORDER BY id
         LIMIT $2
         FOR UPDATE SKIP LOCKED
       )`,
      [SECURITY_EVENT_RETENTION_SECONDS, SECURITY_EVENT_CLEANUP_BATCH]
    );
  } catch {
    // best-effort retention; never affects the request
  }
}

let lastSecurityEventsCleanupAt = 0;

/** Bounded retention cleanup for `security_events` (exported for tests). */
export async function runSecurityEventRetention(options?: {
  maxAgeSeconds?: number;
  batch?: number;
}): Promise<{ deleted: number }> {
  const maxAgeSeconds =
    options?.maxAgeSeconds ?? SECURITY_EVENT_RETENTION_SECONDS;
  const batch = options?.batch ?? SECURITY_EVENT_CLEANUP_BATCH;

  const pool = await getPool();
  if (!pool) return { deleted: 0 };

  const result = await pool.query(
    `DELETE FROM security_events
     WHERE id IN (
       SELECT id FROM security_events
       WHERE created_at < now() - ($1 * interval '1 second')
       ORDER BY id
       LIMIT $2
       FOR UPDATE SKIP LOCKED
     )`,
    [maxAgeSeconds, batch]
  );

  return { deleted: result.rowCount ?? 0 };
}

async function persist(
  sanitized: ReturnType<typeof sanitizeEntryInput>
): Promise<void> {
  try {
    const pool = await getPool();
    if (!pool) return;
    await pool.query(
      `INSERT INTO security_events
         (event, severity, user_id, payload, ip_hash, created_at)
       VALUES ($1, $2, $3, $4, $5, now())`,
      [
        sanitized.event,
        sanitized.severity,
        sanitized.userId ?? null,
        sanitized.payload
          ? JSON.stringify(sanitized.payload)
          : null,
        sanitized.ipHash ?? null,
      ]
    );
    await maybeCleanupSecurityEvents();
  } catch {
    // Fail-open: the console line was already written; a missing/broken
    // security_events table must never fail or change the request.
  }
}

export type SecurityLogEntry = {
  t: string;
  kind: "security";
  event: string;
  severity: SecurityLogSeverity;
  userId?: number;
  ipHash?: string;
  payload?: Record<string, unknown>;
};

/**
 * Unified security event emitter.
 *
 * Backward-compatible call forms:
 *   logSecurity("event", "warn", { ...fields })
 *   logSecurity("event", { ...fields })                    // severity: info
 *   logSecurity("event")                                   // severity: info
 *
 * `opts.suppress` attaches a global DB-backed flood window to the event —
 * all events of the same `event`/`key` beyond `max` per window are dropped.
 * Never throws; never fails the request.
 */
export async function logSecurity(
  event: string,
  severityOrPayload?: SecurityLogSeverity | Record<string, unknown>,
  payload?: Record<string, unknown>,
  opts?: SecurityLogOptions
): Promise<void> {
  let severity: SecurityLogSeverity = "info";
  let fields: Record<string, unknown> | undefined;

  if (typeof severityOrPayload === "string") {
    severity = (SEVERITIES.has(severityOrPayload)
      ? severityOrPayload
      : "info") as SecurityLogSeverity;
    fields = payload;
  } else {
    fields = severityOrPayload;
  }

  const sanitized = sanitizeEntryInput(event, severity, fields);
  const shouldDrop =
    opts?.suppress !== undefined &&
    (await isSuppressed(sanitized.event, opts.suppress));

  if (shouldDrop) return;

  const entry: SecurityLogEntry = {
    t: new Date().toISOString(),
    kind: "security",
    event: sanitized.event,
    severity: sanitized.severity,
    ...(sanitized.userId !== undefined ? { userId: sanitized.userId } : {}),
    ...(sanitized.ipHash !== undefined ? { ipHash: sanitized.ipHash } : {}),
    ...(sanitized.payload !== undefined ? { payload: sanitized.payload } : {}),
  };

  try {
    console.log(JSON.stringify(entry));
  } catch {
    // console logging failure must not affect the request either
  }

  await persist(sanitized);
}