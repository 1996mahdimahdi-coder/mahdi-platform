import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildSystemPrompt } from "./system-prompt";

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