import { test } from "node:test";
import assert from "node:assert/strict";

import { isSafeUrl, renderMarkdown } from "@/lib/markdown";

test("isSafeUrl — http/https URLs are allowed", () => {
  assert.equal(isSafeUrl("https://example.com"), true);
  assert.equal(isSafeUrl("HTTPS://example.com"), true);
  assert.equal(isSafeUrl("http://example.com/a?b=c&d=e"), true);
  assert.equal(isSafeUrl("https://example.com/%D9%85%D8%B1"), true);
});

test("isSafeUrl — mailto/tel/# and relative URLs are allowed", () => {
  assert.equal(isSafeUrl("mailto:hello@nabda.dz"), true);
  assert.equal(isSafeUrl("tel:+213123456"), true);
  assert.equal(isSafeUrl("#section-2"), true);
  assert.equal(isSafeUrl("/communes/1012"), true);
  assert.equal(isSafeUrl("/communes/1012?tab=plan"), true);
  assert.equal(isSafeUrl("communes/1012"), true);
  assert.equal(isSafeUrl("//example.com/path"), true);
});

test("isSafeUrl — dangerous schemes rejected in every encoding", () => {
  const attacks = [
    "javascript:alert(1)",
    "JaVaScRiPt:alert(1)",
    "java\u0000script:alert(1)",
    "jav\tascript:alert(1)",
    "java\nscript:alert(1)",
    "java\rscript:alert(1)",
    "vbscript:msgbox(1)",
    "data:text/html;base64,PHNjcmlwdD4=",
    "data:image/svg+xml,<svg onload=alert(1)>",
    "file:///etc/passwd",
    "blob:https://example.com/abc",
    "chrome://settings",
    "javascript&#58;alert(1)",
    "javascript&colon;alert(1)",
    "java%73cript:alert(1)",
    "%6a%61%76%61%73%63%72%69%70%74:alert(1)",
    "javascript%3Aalert(1)",
    "java&Tab;script:alert(1)",
    "java&NewLine;script:alert(1)",
    "java&nbsp;script:alert(1)",
    "j&#x61;va&#x73;cript:alert(1)",
    "&#106;avascript:alert(1)",
    "&amp;#106;avascript:alert(1)",
    "javascript&colon;////example.com",
    "java&#58;script;&colon;alert(1)",
  ];
  for (const attack of attacks) {
    assert.equal(isSafeUrl(attack), false, `expected false for: ${JSON.stringify(attack)}`);
  }
});

test("isSafeUrl — decoded lookalike paths remain allowed", () => {
  assert.equal(isSafeUrl("https://example.com/%3F"), true);
  assert.equal(isSafeUrl("https://example.com/?q=a%26b"), true);
  // %uXXXX is not a valid percent-escape: the browser never decodes it, so
  // `java%u0073cript:` is an inert relative path, not an executable scheme.
  assert.equal(isSafeUrl("java%u0073cript:alert(1)"), true);
});

test("renderMarkdown — final HTML contains no dangerous scheme", () => {
  const hostile = "[click](javascript:alert(document.cookie))";
  const out = renderMarkdown(hostile);
  assert.ok(!out.includes("javascript:"), "javascript: must not appear in HTML");
  assert.ok(out.includes("click"), "link text is preserved");
});

test("renderMarkdown — entity-obfuscated scheme stays inert", () => {
  const cases = [
    "[x](java&Tab;script:alert(1))",
    "[x](java&#58;script:alert(1))",
    "[x](java%73cript:alert(1))",
    "[x](&amp;#106;avascript:alert(1))",
  ];
  for (const md of cases) {
    const out = renderMarkdown(md);
    assert.ok(!/href=/.test(out), `no <a> should be emitted for: ${md}`);
    assert.ok(!out.includes("javascript:"), `javascript: must not appear for: ${md}`);
  }
});

test("renderMarkdown — safe links still render as anchors", () => {
  const out = renderMarkdown("[الموقع](https://example.com)");
  assert.ok(out.includes('<a href="https://example.com"'));
  assert.ok(out.includes('rel="noopener noreferrer"'));
});

test("renderMarkdown — non-url (relative) links still render", () => {
  const out = renderMarkdown("[دليل](/communes/1012)");
  assert.ok(out.includes('href="/communes/1012"'));
});