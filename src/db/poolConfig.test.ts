import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { resolvePoolConfig } from "./poolConfig";

describe("resolvePoolConfig TLS hardening (V2 fix)", () => {
  it("requires TLS with certificate verification for remote hosts", () => {
    const cfg = resolvePoolConfig(
      "postgres://user:pass@db.example.com:5432/nabda"
    );
    assert.deepEqual(cfg.ssl, { rejectUnauthorized: true });
  });

  it("does not enable SSL for localhost / 127.0.0.1 (keeps dev behaviour)", () => {
    const local = resolvePoolConfig(
      "postgres://user:pass@localhost:5432/nabda"
    );
    assert.equal("ssl" in local, false);
    assert.equal(
      local.connectionString,
      "postgres://user:pass@localhost:5432/nabda"
    );
  });

  it("allows insecure TLS only via explicit DATABASE_SSL_INSECURE flag", () => {
    const cfg = resolvePoolConfig(
      "postgres://user:pass@db.example.com:5432/nabda",
      { DATABASE_SSL_INSECURE: "1" }
    );
    assert.deepEqual(cfg.ssl, { rejectUnauthorized: false });
  });

  it("sets explicit connection timeouts / pool bounds", () => {
    const cfg = resolvePoolConfig(
      "postgres://user:pass@db.example.com:5432/nabda"
    );
    assert.equal(cfg.connectionTimeoutMillis, 10000);
    assert.equal(cfg.idleTimeoutMillis, 30000);
    assert.equal(cfg.max, 10);
  });
});