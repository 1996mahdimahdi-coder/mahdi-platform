import { describe, it } from "node:test";
import assert from "node:assert/strict";

process.env.AUTH_SECRET = "c".repeat(48);

import {
  generateCsrfToken,
  verifyCsrfToken,
  csrfGuard,
  getCsrfTokenFromRequest,
} from "@/lib/csrf";

const COOKIE = "nabda_csrf";

function req(opts: { cookie?: string; header?: string }) {
  const headers = new Headers();
  if (opts.cookie) headers.set("cookie", `${COOKIE}=${opts.cookie}`);
  if (opts.header) headers.set("x-csrf-token", opts.header);
  return new Request("http://localhost/api/push/register", {
    method: "POST",
    headers,
  });
}

describe("CSRF guard (V3b — push mutations now require a valid token)", () => {
  it("valid token round-trips", () => {
    const t = generateCsrfToken();
    assert.equal(verifyCsrfToken(t), true);
  });

  it("rejects an invalid signature", () => {
    const t = generateCsrfToken();
    const [a, b, sig] = t.split(".");
    const flipped = (sig[0] === "a" ? "b" : "a") + sig.slice(1);
    assert.equal(verifyCsrfToken(`${a}.${b}.${flipped}`), false);
  });

  it("rejects an expired token", () => {
    const t = generateCsrfToken();
    assert.equal(verifyCsrfToken(t, 0), false);
  });

  it("mutation with cookie but NO header -> 403", async () => {
    const res = await csrfGuard(req({ cookie: generateCsrfToken() }));
    assert.ok(res && res.status === 403, "cookie+no-header must be rejected");
  });

  it("mutation with no cookie and no header -> 403", async () => {
    const res = await csrfGuard(req({}));
    assert.ok(res && res.status === 403, "no token at all must be rejected");
  });

  it("valid header (cookie may be absent) -> pass (Capacitor pattern)", async () => {
    const res = await csrfGuard(req({ header: generateCsrfToken() }));
    assert.equal(res, null);
  });

  it("cookie + valid header -> pass", async () => {
    const t = generateCsrfToken();
    const res = await csrfGuard(req({ cookie: t, header: t }));
    assert.equal(res, null);
  });

  it("cookie + invalid (tampered) header -> 403", async () => {
    const t = generateCsrfToken();
    const [a, b, sig] = t.split(".");
    const tampered = `${a}.${b}.${(sig[0] === "a" ? "b" : "a") + sig.slice(1)}`;
    const res = await csrfGuard(req({ cookie: generateCsrfToken(), header: tampered }));
    assert.ok(res && res.status === 403, "tampered header must be rejected");
  });

  it("getCsrfTokenFromRequest prefers header, falls back to cookie", async () => {
    const t = generateCsrfToken();
    const fromHeader = await getCsrfTokenFromRequest(req({ cookie: t, header: t }));
    assert.equal(fromHeader, t);
    const fromCookie = await getCsrfTokenFromRequest(req({ cookie: t }));
    assert.equal(fromCookie, t);
  });
});