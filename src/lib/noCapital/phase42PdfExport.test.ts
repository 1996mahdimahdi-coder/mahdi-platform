// PHASE 4.2 — OFFLINE PAID STUDY PDF QA (test-only).
//
// Generates a PDF for each of the 5 studies using IN-MEMORY copies forced to
// "approved" (to prove the approved path builds). The ORIGINAL draft objects are
// never modified and no DB/study content is changed. PDFs are written only to a
// temp QA folder.local. Run with:
//
//     npx tsx src/lib/noCapital/phase42PdfExport.test.ts
//
// Also verifies draft/review protection (must refuse to build).
import { writeFile, mkdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { buildStudyPdfBytes, RENDERED_SECTION_KEYS, STUDY_PDF_SECTIONS, studyPdfFileName } from "@/lib/noCapital/studyPdf";
import { studies } from "@/lib/noCapital/phase35Drafts.test";
import type { PaidStudy } from "@/lib/noCapital/types";

const t = async (name: string, fn: () => void | Promise<void>) => {
  try {
    await fn();
    console.log(`  ok - ${name}`);
  } catch (err) {
    console.error(`  FAIL - ${name}`);
    throw err;
  }
};

const OUT = join(process.cwd(), ".tmp-phase42-pdfs");
const SLUGS = ["content-writing", "translation", "graphic-design", "video-editing", "social-media-management"];

function assertSection(study: PaidStudy, section: (typeof STUDY_PDF_SECTIONS)[number]): boolean {
  const v = study[section.key];
  if (v === null || v === undefined) return false;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === "object") return Object.keys(v as object).length > 0;
  return String(v).length > 0;
}

async function run() {
  await mkdir(OUT, { recursive: true });
  console.log("PHASE 4.2 — PAID STUDY PDF EXPORT QA");

  // 1) Draft/review protection
  console.log("\n=== DRAFT / REVIEW REFUSAL (must throw) ===");
  for (const [slug, study] of Object.entries(studies)) {
    const draftCopy: PaidStudy = { ...study, status: "draft" };
    const reviewCopy: PaidStudy = { ...study, status: "review" };
    for (const status of ["draft", "review"] as const) {
      const copy = status === "draft" ? draftCopy : reviewCopy;
      await t(`${slug} [${status}] refuses build`, async () => {
        try {
          await buildStudyPdfBytes(copy, { slug });
          throw new Error(`should have thrown for ${status}`);
        } catch (e) {
          if (e instanceof Error && e.message.includes("approved")) return;
          throw e;
        }
      });
    }
  }

  // 0) Renderer covers all 19 sections
  console.log("\n=== RENDERER COVERAGE ===");
  await t("renderer covers all 19 paid sections", () => {
    const expected = STUDY_PDF_SECTIONS.map((s) => s.key);
    const missing = expected.filter((k) => !RENDERED_SECTION_KEYS.includes(k));
    if (missing.length > 0) throw new Error(`not rendered: ${missing.join(", ")}`);
  });
  await t("sample disclaimer present in every caseStudy (isSample=true)", () => {
    for (const study of Object.values(studies)) {
      if (study.caseStudy.isSample !== true) throw new Error("caseStudy.isSample !== true");
    }
  });

  // 2) Approved path for the 5 studies
  console.log("\n=== APPROVED PDF GENERATION ===");
  for (const slug of Object.entries(studies).map(([k]) => k)) {
    const study = studies[slug];
    const approved: PaidStudy = { ...study, status: "approved" };

    // section presence (data-driven)
    const empty = STUDY_PDF_SECTIONS.filter((sec) => !assertSection(approved, sec));
    t(`${slug}: study has all 19 sections`, () => {
      if (empty.length > 0) throw new Error(`missing: ${empty.map((s) => s.key).join(", ")}`);
    });

    await t(`${slug}: buildStudyPdfBytes succeeds`, async () => {
      const bytes = await buildStudyPdfBytes(approved, { slug, projectNameAr: slug });
      if (!bytes || bytes.length < 4096) throw new Error(`PDF too small (${bytes.length})`);
    });
    void empty;
  }

  // 3) Write files for visual QA
  console.log("\n=== WRITING PDFs ===");
  for (const slug of SLUGS) {
    const study = studies[slug];
    const approved: PaidStudy = { ...study, status: "approved" };
    const bytes = await buildStudyPdfBytes(approved, { slug, projectNameAr: slug, title: `الدراسة التفصيلية — ${slug}` });
    const fileName = studyPdfFileName({ slug });
    await writeFile(join(OUT, fileName), bytes);
    console.log(`  wrote ${fileName} (${bytes.length} bytes)`);
  }

  // 4) Verify files exist + PDF magic
  console.log("\n=== FILE / MAGIC CHECK ===");
  for (const slug of SLUGS) {
    const fileName = studyPdfFileName({ slug });
    const filePath = join(OUT, fileName);
    const buf = await readFile(filePath);
    const magic = buf.subarray(0, 5).toString("latin1");
    await t(`${slug}: file exists and is a PDF (%PDF-)`, () => {
      if (magic !== "%PDF-") throw new Error(`bad magic: ${magic}`);
    });
  }

  console.log("\nAll PDF QA checks completed.");
  console.log(`PDFs written to: ${OUT}`);
}

run().catch((err) => {
  console.error("QA ERROR:", err);
  process.exit(1);
});