import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  AI_GUARDRAIL,
  AI_REQUEST_TIMEOUT_MS,
  MAX_SKILL_CHARS,
  MAX_SKILLS,
  MAX_USER_PROMPT_CHARS,
  boundUserSkills,
} from "./aiExplanation";

// ============================================================================
// F12-5 — LLM hardening: request timeout, prompt-injection guardrail, and
// hard bounds on every user-supplied string that reaches OpenAI.
// ============================================================================

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "../..");

describe("F12-5 — bounds constants", () => {
  it("caps skills at 20 items of at most 40 chars and prompts at 2000 chars", () => {
    assert.equal(MAX_SKILLS, 20);
    assert.equal(MAX_SKILL_CHARS, 40);
    assert.equal(MAX_USER_PROMPT_CHARS, 2000);
  });

  it("enforces a 10s AI timeout", () => {
    assert.equal(AI_REQUEST_TIMEOUT_MS, 10_000);
  });
});

describe("F12-5 — boundUserSkills behavior", () => {
  it("trims, drops empties, limits count and per-skill length", () => {
    const longSkill = "أ".repeat(120);
    const result = boundUserSkills([
      "  مدير مبيعات  ",
      "",
      "   ",
      longSkill,
      null as unknown as string,
      ...Array.from({ length: 30 }, (_, i) => `مهارة ${i}`),
    ]);

    assert.equal(result.length, MAX_SKILLS);
    assert.ok(result[0] === "مدير مبيعات", "trims surrounding whitespace");
    assert.ok(!result.includes(""), "empty skills removed");
    assert.ok(
      result.every((s) => s.length <= MAX_SKILL_CHARS),
      `no skill exceeds ${MAX_SKILL_CHARS} chars`
    );
    assert.equal(result[0].length, "مدير مبيعات".length);
  });
});

describe("F12-5 — route structure (structural)", () => {
  it("every OpenAI fetch carries the timeout signal", async () => {
    const src = await readFile(join(repoRoot, "src/lib/aiExplanation.ts"), "utf8");
    const fetchCount = src.match(/fetch\("https:\/\/api\.openai\.com/g)?.length ?? 0;
    const timeoutCount = src.match(/signal: AbortSignal\.timeout\(AI_REQUEST_TIMEOUT_MS\)/g)?.length ?? 0;

    assert.equal(fetchCount, 2, "two OpenAI fetches expected");
    assert.equal(timeoutCount, 2, "both fetches must carry the timeout");
  });

  it("both system prompts embed the injection guardrail", async () => {
    const src = await readFile(join(repoRoot, "src/lib/aiExplanation.ts"), "utf8");
    const systemContents = src.match(/role: "system"/g)?.length ?? 0;
    // Two prompts + declaration: the guardrail constant must be referenced in
    // each system prompt (the value appears only once, at the declaration).

    assert.equal(systemContents, 2);
    const concatRefs = src.match(/\+ AI_GUARDRAIL/g)?.length ?? 0;
    assert.ok(
      concatRefs >= 2,
      `both system-prompt contents must append the guardrail (found ${concatRefs})`
    );
  });

  it("skills are bounded before joining into the prompt; assembled prompt is capped", async () => {
    const src = await readFile(join(repoRoot, "src/lib/aiExplanation.ts"), "utf8");

    assert.ok(src.includes("boundUserSkills(user.skills).join"));
    assert.ok(src.includes("content.slice(0, MAX_USER_PROMPT_CHARS)"));
    assert.ok(src.includes("boundUserSkills(userSkills)"));
    assert.ok(src.includes('.slice(0, 600)'), "custom-idea skills line is also capped");
  });
});

describe("F12-5 — login route cleanup", () => {
  it("removes every LOGIN_DIAG diagnostic line", async () => {
    const src = await readFile(
      join(repoRoot, "src/app/api/auth/login/route.ts"),
      "utf8"
    );

    assert.ok(!src.includes("loginDiag"));
    assert.ok(!src.includes("LOGIN_DIAG"));
    assert.ok(!src.includes("Date.now()"));
  });

  it("keeps all security logic intact", async () => {
    const src = await readFile(
      join(repoRoot, "src/app/api/auth/login/route.ts"),
      "utf8"
    );

    for (const needle of [
      "csrfGuard(request)",
      "clientIpKey(request, \"login\")",
      "RATE_LIMITS.login.email",
      "emailRateLimitKey(\"login\", email)",
      'createSession({',
      '"auth.login_success"',
      '"auth.login_failed"',
      '"auth.login_rate_limited"',
      "bcrypt.compare(password, DUMMY_BCRYPT_HASH)",
      "SESSION_COOKIE_NAME",
      "getSessionCookieOptions()",
    ]) {
      assert.ok(src.includes(needle));
    }
  });
});