import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// ============================================================================
// F9-C — share-link copy guard.
//
// Product decision: NABDA share links are PERMANENT (no TTL, no expiration).
// This guard pins the user-facing copy in the share flow so no message may
// claim a link/result "expired" when no expiration mechanism exists, while the
// genuine invalid/not-found behavior (400 invalid format, 404 not found,
// client redirect to /test) stays intact.
//
// Source-scan style (mirrors readRateLimit.test.ts): no DB required.
//
// Run: npx tsx src/lib/shareLinkWording.test.ts
// ============================================================================

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "../..");

const SHARE_ROUTE = join(repoRoot, "src/app/api/share/[token]/route.ts");
const RESULTS_PAGE = join(repoRoot, "src/app/results/page.tsx");
const ASSESS_ROUTE = join(repoRoot, "src/app/api/assess/route.ts");

const FORBIDDEN = [
  "انتهت صلاحيتها",
  "انتهت صلاحية",
  "صلاحية الرابط",
  "انتهاء الرابط",
  "أو انتهت",
  "share link has expired",
  "has expired",
];

describe("F9-C — share links are permanent (no misleading expiration copy)", () => {
  it("share API never tells users a result/link expired", async () => {
    const src = await readFile(SHARE_ROUTE, "utf8");
    for (const phrase of FORBIDDEN) {
      assert.ok(!src.includes(phrase), `share route must not contain '${phrase}'`);
    }
  });

  it("share API not-found path speaks accurately (no expiration claim)", async () => {
    const src = await readFile(SHARE_ROUTE, "utf8");
    assert.ok(src.includes("النتيجة غير موجودة"), "accurate not-found wording must be present");
    assert.ok(!src.includes("أو انتهت صلاحيتها"), 'old "not found OR expired" copy must be gone');
  });

  it("share API keeps the genuine invalid-link behavior and wording", async () => {
    const src = await readFile(SHARE_ROUTE, "utf8");
    assert.ok(src.includes("رابط المشاركة غير صالح."), "invalid-format guard wording preserved");
    assert.ok(src.includes('status: 400'), "400 for malformed token preserved");
    assert.ok(src.includes('status: 404'), "404 for missing result preserved");
  });

  it("share API still resolves valid stored links (lookup untouched)", async () => {
    const src = await readFile(SHARE_ROUTE, "utf8");
    assert.ok(src.includes("analysisResults.shareToken"), "shareToken lookup preserved");
    assert.ok(src.includes("success: true"), "success payload preserved");
  });

  it("results page share playback holds no expiration copy and no behavior change", async () => {
    const src = await readFile(RESULTS_PAGE, "utf8");
    for (const phrase of FORBIDDEN) {
      assert.ok(!src.includes(phrase), `results page must not contain '${phrase}'`);
    }
    assert.ok(src.includes('/api/share/'), "client fetch to share API preserved");
    assert.ok(src.includes("router.push(\"/test\")"), "client redirect-on-failure preserved");
  });

  it("share-token creation is random and permanent (no expiry column used)", async () => {
    const src = await readFile(ASSESS_ROUTE, "utf8");
    assert.ok(src.includes("randomBytes(24).toString(\"hex\")"), "random token generation preserved");
    assert.ok(!src.includes("shareTokenExpires"), "no expiry logic introduced");
  });
});