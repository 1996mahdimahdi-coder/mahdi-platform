import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  createSessionToken,
  verifySessionToken,
  verifySessionTokenMinimal,
  SESSION_COOKIE_NAME,
} from "@/lib/sessionToken";

process.env.AUTH_SECRET = "a".repeat(48);

describe("session token boundary (V1b — proxy + auth shared verification)", () => {
  it("verifySessionTokenMinimal returns the signed identity (no DB)", () => {
    const token = createSessionToken({ id: 42, role: "admin", tokenVersion: 3 });
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
    const token = createSessionToken({ id: 1, role: "user", tokenVersion: 0 });
    const [p, sig] = token.split(".");
    const flipped = sig[0] === "A" ? "B" : "A";
    const tampered = `${p}.${flipped}${sig.slice(1)}`;
    assert.equal(verifySessionToken(tampered), null);
    assert.equal(verifySessionTokenMinimal(tampered), null);
  });

  it("rejects a tampered payload (userId swapped)", () => {
    const token = createSessionToken({ id: 1, role: "user", tokenVersion: 0 });
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
    const token = createSessionToken({ id: 1, role: "user", tokenVersion: 0 });
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
    const token = createSessionToken({ id: 1, role: "user", tokenVersion: 0 });
    process.env.AUTH_SECRET = "b".repeat(48);
    try {
      assert.equal(verifySessionToken(token), null);
    } finally {
      process.env.AUTH_SECRET = "a".repeat(48);
    }
  });
});