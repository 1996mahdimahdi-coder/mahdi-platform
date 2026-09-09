import "./rateLimitTestEnv";
import { after, beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { pool } from "@/db";
import { registerDeviceToken, unregisterDeviceToken } from "@/lib/push";

// ============================================================================
// F9-3 — push device-token registration must be ownership-scoped.
//
// registerDeviceToken now performs a single atomic upsert:
//   INSERT ... ON CONFLICT (token) DO UPDATE ... WHERE user_id = EXCLUDED.user_id
// A conflicting token that belongs to another user is NEVER relabeled, while a
// same-user re-registration still reactivates/updates the row. unregister is
// (unchanged) scoped by token AND userId.
//
// Run: npx tsx src/lib/pushTokenScoping.test.ts
// ============================================================================

const TEST_EMAIL_DOMAIN = "example.test";
let userAId: number | null = null;
let userBId: number | null = null;
let ready = false;

async function deviceTokensTableReady(): Promise<boolean> {
  try {
    await pool.query("SELECT 1 FROM device_tokens LIMIT 1");
    return true;
  } catch {
    return false;
  }
}

async function insertTestUser(tag: string): Promise<number> {
  const email = `f9a-push-${tag}-${randomBytes(8).toString("hex")}@${TEST_EMAIL_DOMAIN}`;
  const inserted = await pool.query<{ id: number }>(
    "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id",
    [`F9A Push ${tag}`, email, "f9a-test-hash", "user"]
  );
  return inserted.rows[0].id;
}

async function ownerOf(token: string): Promise<{ userId: number | null; active: boolean } | null> {
  const { rows } = await pool.query<{ user_id: number | null; active: boolean }>(
    "SELECT user_id, active FROM device_tokens WHERE token = $1",
    [token]
  );
  if (rows.length === 0) return null;
  return { userId: rows[0].user_id, active: rows[0].active };
}

beforeEach(async () => {
  if (ready) return;
  if (!(await deviceTokensTableReady())) return;
  userAId = await insertTestUser("A");
  userBId = await insertTestUser("B");
  ready = true;
});

after(async () => {
  if (userAId !== null) {
    await pool.query("DELETE FROM users WHERE id = $1", [userAId]).catch(() => undefined);
  }
  if (userBId !== null) {
    await pool.query("DELETE FROM users WHERE id = $1", [userBId]).catch(() => undefined);
  }
  void pool.end().catch(() => undefined);
});

describe("F9-3 — push token ownership", () => {
  it("user A registers a new token → PASS", async (t) => {
    if (!ready) { t.skip("device_tokens table or DB unreachable"); return; }
    const token = randomBytes(24).toString("hex");
    const res = await registerDeviceToken(userAId!, token);
    assert.equal(res.success, true);
    const owner = await ownerOf(token);
    assert.ok(owner, "token row must exist");
    assert.equal(owner!.userId, userAId, "owner must be A");
    assert.equal(owner!.active, true);
  });

  it("user A re-registers / updates own token → PASS", async (t) => {
    if (!ready) { t.skip("device_tokens table or DB unreachable"); return; }
    const token = randomBytes(24).toString("hex");
    await registerDeviceToken(userAId!, token);
    await registerDeviceToken(userAId!, token, "ios");
    const owner = await ownerOf(token);
    assert.equal(owner!.userId, userAId, "owner stays A after update");
    assert.equal(owner!.active, true);
    const { rows } = await pool.query<{ platform: string }>(
      "SELECT platform FROM device_tokens WHERE token = $1", [token]);
    assert.equal(rows[0].platform, "ios");
  });

  it("user B attempts the same token → ownership remains A", async (t) => {
    if (!ready) { t.skip("device_tokens table or DB unreachable"); return; }
    const token = randomBytes(24).toString("hex");
    await registerDeviceToken(userAId!, token);
    const res = await registerDeviceToken(userBId!, token);
    assert.equal(res.success, true, "API contract unchanged (success)");
    const owner = await ownerOf(token);
    assert.equal(owner!.userId, userAId, "B must NOT take ownership of A's token");
    assert.equal(owner!.active, true);
  });

  it("user A unregisters own token (DELETE stays scoped) → PASS", async (t) => {
    if (!ready) { t.skip("device_tokens table or DB unreachable"); return; }
    const token = randomBytes(24).toString("hex");
    await registerDeviceToken(userAId!, token);
    const res = await unregisterDeviceToken(userAId!, token);
    assert.equal(res.success, true);
    const owner = await ownerOf(token);
    assert.ok(owner);
    assert.equal(owner!.userId, userAId);
    assert.equal(owner!.active, false, "A's DELETE must deactivate own token");
  });

  it("user B unregister cannot deactivate A's token", async (t) => {
    if (!ready) { t.skip("device_tokens table or DB unreachable"); return; }
    const token = randomBytes(24).toString("hex");
    await registerDeviceToken(userAId!, token);
    await unregisterDeviceToken(userBId!, token);
    const owner = await ownerOf(token);
    assert.ok(owner);
    assert.equal(owner!.active, true, "B must not be able to deactivate A's token");
  });

  it("existing token behavior remains compatible (reactivation after conflict)", async (t) => {
    if (!ready) { t.skip("device_tokens table or DB unreachable"); return; }
    const token = randomBytes(24).toString("hex");
    await registerDeviceToken(userAId!, token);
    await registerDeviceToken(userBId!, token);
    await unregisterDeviceToken(userAId!, token);
    assert.equal((await ownerOf(token))!.active, false);
    await registerDeviceToken(userAId!, token);
    assert.equal((await ownerOf(token))!.active, true, "A re-register reactivates own token");
  });

  it("concurrent same-new-token registration converges to a single row", async (t) => {
    if (!ready) { t.skip("device_tokens table or DB unreachable"); return; }
    const token = randomBytes(24).toString("hex");
    const results = await Promise.all([
      registerDeviceToken(userAId!, token),
      registerDeviceToken(userAId!, token),
    ]);
    assert.ok(results.every((r) => r.success), "both upserts must succeed");
    const { rows } = await pool.query<{ count: string }>(
      "SELECT count(*)::text as count FROM device_tokens WHERE token = $1", [token]);
    assert.equal(Number(rows[0].count), 1, "exactly one row per token");
    assert.equal((await ownerOf(token))!.userId, userAId);
  });
});