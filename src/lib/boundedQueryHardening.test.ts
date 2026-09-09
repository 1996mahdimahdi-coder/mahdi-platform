import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// ============================================================================
// F12-4 — bounded / public query hardening (structural regression tests).
//
// Four sites previously fetched full tables and filtered in JS:
//   - /api/projects GET   → filters now pushed to SQL (same result semantics)
//   - /api/blog GET       → minimal projection (index page never renders content)
//   - blog/[slug] related → SQL-filtered, recent-first, LIMIT 3
//   - /api/assess projects→ projection of exactly the ProjectData fields (no LIMIT)
//
// These tests assert the invariant STRUCTURE of each change so a future
// refactor cannot silently reintroduce the unbounded pattern.
// ============================================================================

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "../..");

async function read(file: string): Promise<string> {
  return readFile(join(repoRoot, file), "utf8");
}

function getFunctionBody(src: string, fnName: string, file: string): string {
  const marker = `export async function ${fnName}`;
  const start = src.indexOf(marker);
  assert.ok(start !== -1, `${file}: missing ${marker}`);
  const second = src.indexOf("export async function", start + marker.length);
  return src.slice(start, second === -1 ? src.length : second);
}

describe("F12-4A — /api/projects GET filters moved to SQL", () => {
  it("keeps identical filter semantics as SQL predicates", async () => {
    const get = getFunctionBody(
      await read("src/app/api/projects/route.ts"),
      "GET",
      "projects/route.ts"
    );

    assert.ok(get.includes('eq(projects.category, category)'));
    assert.ok(get.includes('category !== "الكل"'));
    assert.ok(get.includes('eq(projects.riskLevel, riskLevel)'));
    assert.ok(get.includes('riskLevel !== "الكل"'));
    assert.ok(get.includes("lte(projects.minCapital, capNum)"));
    assert.ok(get.includes("eq(projects.homeBased, true)"));
    assert.ok(get.includes("eq(projects.onlinePossible, true)"));

    // The old JS filter chain must be gone.
    assert.ok(!get.includes(".filter((p) => p.category"));
    assert.ok(!get.includes("allProjects = allProjects.filter"));
  });

  it("results are applied via and(...) and no ORDER BY/pagination added", async () => {
    const get = getFunctionBody(
      await read("src/app/api/projects/route.ts"),
      "GET",
      "projects/route.ts"
    );

    assert.ok(get.includes(".where(and(...predicates))"));
    // The auto-seed lookup before the filters uses .limit(1), so scope the
    // no-pagination check to the filtered query itself (after the WHERE).
    const queryRegion = get.slice(get.indexOf(".where(and(...predicates))"));
    assert.ok(!queryRegion.includes("orderBy("));
    assert.ok(!queryRegion.includes(".limit("));
  });

  it("keeps the public shape and adds explicit admin-view caching", async () => {
    const get = getFunctionBody(
      await read("src/app/api/projects/route.ts"),
      "GET",
      "projects/route.ts"
    );

    assert.ok(get.includes("publicProjectShape"));
    assert.ok(get.includes("adminView"));
    assert.ok(get.includes('"Cache-Control", "private, no-store"'));
  });
});

describe("F12-4B — /api/blog GET minimal projection", () => {
  it("the RSC index does NOT render content (safe to trim the list payload)", async () => {
    const page = await read("src/app/blog/page.tsx");
    assert.ok(page.includes("summary: blogPosts.summary"));
    assert.ok(!page.includes("content: blogPosts.content"));
    assert.ok(!page.includes("post.content"));
    assert.ok(!page.includes("MarkdownContent"));
  });

  it("list endpoint selects only the display fields", async () => {
    const get = getFunctionBody(
      await read("src/app/api/blog/route.ts"),
      "GET",
      "blog/route.ts"
    );

    for (const field of ["id", "slug", "title", "summary", "category", "image"]) {
      assert.ok(
        get.includes(`blogPosts.${field}`),
        `projection must include blogPosts.${field}`
      );
    }
    // Full-row select / content blobs must not travel on the list.
    const projectionUse = get.slice(get.indexOf("const projection"), get.indexOf("return NextResponse"));
    assert.ok(!projectionUse.includes("blogPosts.content"));
    assert.ok(!projectionUse.includes("blogPosts.sources"));
    assert.ok(!projectionUse.includes("blogPosts.financialData"));
    // No pagination introduced.
    assert.ok(!get.includes(".limit("));
    assert.ok(!get.includes("orderBy("));
  });
});

describe("F12-4C — related posts bounded & deterministic", () => {
  it("uses SQL filter + recent-first + LIMIT 3, same category, excluding current", async () => {
    const src = await read("src/app/blog/[slug]/page.tsx");

    assert.ok(src.includes("eq(blogPosts.category, post.category)"));
    assert.ok(src.includes("ne(blogPosts.id, post.id)"));
    assert.ok(src.includes("desc(blogPosts.id)"));
    assert.ok(src.includes(".limit(3)"));
    // The previous unbounded full-table + JS slice path is gone.
    assert.ok(!src.includes(".slice(0, 3)"));
    assert.ok(!src.includes("all.filter((p) => p.category"));
  });
});

describe("F12-4D — /api/assess project projection completeness", () => {
  it("every field read by the typedProjects mapping is selected (no omission)", async () => {
    const src = await read("src/app/api/assess/route.ts");

    const selectionRegion = src.slice(
      src.indexOf("const projectSelection"),
      src.indexOf("let dbProjects")
    );
    const mappingRegion = src.slice(
      src.indexOf("const typedProjects: ProjectData[]"),
      src.indexOf("}));")
    );

    // All field reads (p.<field>) used by the ranking-engine mapping.
    const readFields = new Set(
      [...mappingRegion.matchAll(/\bp\.([A-Za-z0-9_]+)\b/g)].map(
        (m) => m[1]
      )
    );
    assert.ok(readFields.size > 30, `expected many fields, got ${readFields.size}`);

    for (const field of readFields) {
      assert.ok(
        selectionRegion.includes(`projects.${field}`),
        `projection must include projects.${field} (consumed by ranking)`
      );
    }

    // The select must use the projection, not a full-row select.
    assert.ok(src.includes(".select(projectSelection)"));
    assert.ok(!src.includes("db\n      .select()\n      .from(projects)"));
  });

  it("deliberately keeps NO LIMIT on the project load (ranking needs all rows)", async () => {
    const src = await read("src/app/api/assess/route.ts");
    const loadRegion = src.slice(
      src.indexOf("const projectSelection"),
      src.indexOf("if (dbProjects.length === 0)")
    );
    assert.ok(!loadRegion.includes(".limit("));
  });
});

describe("F12-4 — regression guard: protected GET limiter stays first", () => {
  it("projects GET still enforces readList before any DB read", async () => {
    const get = getFunctionBody(
      await read("src/app/api/projects/route.ts"),
      "GET",
      "projects/route.ts"
    );
    const checkAt = get.indexOf("checkRateLimit");
    const readAt = get.indexOf("db.select()");
    assert.ok(checkAt !== -1 && readAt !== -1);
    assert.ok(checkAt < readAt);
  });
});