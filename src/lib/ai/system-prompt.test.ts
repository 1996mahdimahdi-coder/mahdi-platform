import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildSystemPrompt, sanitizeTestResultRecommendations } from "./system-prompt";

// ============================================================================
// F9-7 — /api/ai/chat data minimization.
//
// The OpenAI payload's system message is built by buildSystemPrompt. These
// tests pin that:
//   - userName is never forwarded (dormant server path removed),
//   - full assessment reasons are never forwarded (dormant full-results path),
//   - the required chat context (project / article / nameAr+score results)
//     still works exactly as before.
//
// Run: npx tsx src/lib/ai/system-prompt.test.ts
// ============================================================================

describe("F9-7 — AI chat data minimization (system prompt payload)", () => {
  it("never includes userName in the OpenAI payload", () => {
    const out = buildSystemPrompt({
      userName: "Karim-بوسيف-999",
    } as never);
    assert.ok(!out.includes("Karim"), "real name must not reach the payload");
    assert.ok(!out.includes("اسم المستخدم"), "userName section must be gone");
    assert.ok(!out.includes("بوسيف"), "Arabic personal data must not reach the payload");
  });

  it("never forwards full assessment reasons, only nameAr+score", () => {
    const out = buildSystemPrompt({
      testResult: {
        recommendations: [
          { slug: "cafe", nameAr: "مقهى", score: 85, reasons: ["لأنه مربح جداً", "أفضل خيار للبداية"] },
          { slug: "food", nameAr: "مطعم", score: 72, reasons: ["رأس مال مرتفع"] },
        ],
      },
    } as never);
    assert.ok(out.includes("مقهى (الدرجة: 85)"), "required nameAr+score context is kept");
    assert.ok(out.includes("مطعم (الدرجة: 72)"));
    assert.ok(!out.includes("لأنه مربح جداً"), "full reasoning must not reach the payload");
    assert.ok(!out.includes("رأس مال مرتفع"));
  });

  it("keeps required chat context: base rules, project, article", () => {
    const out = buildSystemPrompt({ currentProject: "p001", currentArticle: "a002" });
    assert.ok(out.includes("أنت مساعد NABDA الذكي"), "base personality preserved");
    assert.ok(out.includes("p001"), "project slug context preserved");
    assert.ok(out.includes("a002"), "article slug context preserved");
  });

  it("keeps sanitization of context values (no regression)", () => {
    const dirty = "ok!slug_9";
    const out = buildSystemPrompt({ currentArticle: dirty });
    assert.ok(out.includes("okslug_9"), "allowed slug chars survive");
    assert.ok(!out.includes("!"), "dangerous chars stripped");
    assert.ok(!out.includes(dirty), "raw unsanitized slug must not appear");

    const arabicOnly = buildSystemPrompt({ currentArticle: "مقال-عربي" });
    assert.ok(!arabicOnly.includes("المستخدم يقرأ مقالاً"), "empty-post-sanitize slug adds no section");
  });

  it("behaves normally with no context at all", () => {
    const out = buildSystemPrompt();
    assert.ok(out.includes("أنت مساعد NABDA الذكي"));
    assert.ok(!out.includes("نتائج اختبار المستخدم"));
    assert.ok(!out.includes("اسم المستخدم"));
  });
});

// ============================================================================
// F10-02 — testResult.recommendations score is client-supplied, so it may be
// a non-number / huge / negative value or a whole fabricated item. The system
// prompt must only ever receive a finite clamped score, and items without a
// finite score must be dropped. Integer scores keep their exact formatting.
// ============================================================================

describe("F10-02 — recommendation score sanitization", () => {
  it("clamps huge and negative scores into [0,100]", () => {
    const recs = sanitizeTestResultRecommendations([
      { slug: "a", nameAr: "أ", score: 1e9 },
      { slug: "b", nameAr: "ب", score: -500 },
      { slug: "c", nameAr: "ج", score: 42.7 },
      { slug: "d", nameAr: "د", score: 0 },
      { slug: "e", nameAr: "ه", score: 100 },
    ]);
    assert.deepEqual(recs.map((r) => r.score), [100, 0, 42.7, 0, 100]);
  });

  it("drops items whose score is not a genuine finite number", () => {
    const recs = sanitizeTestResultRecommendations([
      { slug: "ok", nameAr: "مشروع جيد", score: 80 },
      { slug: "nan", nameAr: "مشروع سيئ", score: NaN },
      { slug: "inf", nameAr: "مشروع سيئ", score: Infinity },
      { slug: "str", nameAr: "مشروع سيئ", score: "عالية جدا" },
      { slug: "numstr", nameAr: "مشروع سيئ", score: "85" },
      { slug: "obj", nameAr: "مشروع سيئ", score: { toString: () => "75" } },
      { slug: "null", nameAr: "مشروع سيئ", score: null },
      { slug: "undef", nameAr: "مشروع سيئ", score: undefined },
      "not-an-object",
      null,
      42,
    ] as never);
    assert.deepEqual(recs.map((r) => r.slug), ["ok"]);
  });

  it("filters out empty names and always strips dangerous chars", () => {
    const recs = sanitizeTestResultRecommendations([
      { slug: "x", nameAr: "", score: 50 },
      { slug: "y", nameAr: "باء\r\n<script>alert(1)</script>", score: 50 },
    ] as never);
    assert.equal(recs.length, 1);
    assert.ok(!recs[0].nameAr.includes("<script>"));
    assert.ok(!recs[0].nameAr.includes("\n"));
  });

  it("keeps integer formatting in the final prompt (no .0 suffix)", () => {
    const out = buildSystemPrompt({
      testResult: {
        recommendations: [
          { slug: "cafe", nameAr: "مقهى", score: 85 },
          { slug: "food", nameAr: "مطعم", score: 72.4 },
        ],
      },
    } as never);
    assert.ok(out.includes("مقهى (الدرجة: 85)"), "integer scores render integer");
    assert.ok(out.includes("مطعم (الدرجة: 72.4)"), "decimal scores render as one decimal");
    assert.ok(!out.includes("85.0"), "no .0 suffix for integers");
  });

  it("renders nothing when recommendations are all invalid", () => {
    const out = buildSystemPrompt({
      testResult: {
        recommendations: [{ slug: "x", nameAr: "مشروع سيئ", score: Number.NaN }],
      },
    } as never);
    assert.ok(!out.includes("نتائج اختبار المستخدم"));
  });
});