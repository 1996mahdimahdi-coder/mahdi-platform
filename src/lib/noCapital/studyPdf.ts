// ============================================================================
// Phase 4.2 — Paid Study PDF exporter.
//
// Produces a professional Arabic PDF of an APPROVED PaidStudy for MANUAL
// delivery via Telegram after payment. There is NO checkout and NO public link:
// the study is ADMIN-ONLY data, passed into this module by the caller; the
// module never reads anything from the public API and is never routed to a
// public endpoint.
//
// Draft safety is enforced here again (defense in depth): the exporter refuses
// to build a PDF unless study.status === "approved" (see draftSafetyError).
//
// Content rule: the PDF renders exactly the fields present in the PaidStudy
// (its 19 sections) — labels, headings and the sample disclaimer are the only
// additions. No new study content is ever invented.
// ============================================================================

import jsPDF from "jspdf";
import {
  arrayBufferToBase64,
  createPdf,
  prepareArabicText,
  safeFileName,
} from "@/lib/pdfExport";
import { draftSafetyError } from "@/lib/noCapital/studyValidation";
import { PAID_STUDY_PRICE_DZD } from "@/lib/noCapital/studySales";
import type { PaidStudy } from "@/lib/noCapital/types";

// ---------------------------------------------------------------------------
// Fonts (browser fetch + Node filesystem support)
// ---------------------------------------------------------------------------

export type StudyPdfFonts = {
  regular: ArrayBuffer;
  bold: ArrayBuffer;
};

const FONT_REGULAR_PATH = "/fonts/static/NotoNaskhArabic-Regular.ttf";
const FONT_BOLD_PATH = "/fonts/static/NotoNaskhArabic-Bold.ttf";

function arrayBufferOf(buf: Buffer): ArrayBuffer {
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
}

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

/** Loads the Arabic TTF font bundles: provided > browser fetch > repo filesystem. */
export async function loadStudyPdfFonts(fonts?: StudyPdfFonts, fontDir?: string): Promise<StudyPdfFonts> {
  if (fonts) return fonts;

  if (!isBrowser()) {
    const { readFile } = await import("node:fs/promises");
    const { fileURLToPath } = await import("node:url");
    const { dirname, join } = await import("node:path");

    const dir = fontDir ?? join(dirname(fileURLToPath(import.meta.url)), "../../../public/fonts/static");
    const [regular, bold] = await Promise.all([
      readFile(join(dir, "NotoNaskhArabic-Regular.ttf")),
      readFile(join(dir, "NotoNaskhArabic-Bold.ttf")),
    ]);
    return { regular: arrayBufferOf(regular), bold: arrayBufferOf(bold) };
  }

  const [regular, bold] = await Promise.all([
    fetch(FONT_REGULAR_PATH).then((r) => r.arrayBuffer()),
    fetch(FONT_BOLD_PATH).then((r) => r.arrayBuffer()),
  ]);
  return { regular, bold };
}

function installFonts(pdf: jsPDF, fonts: StudyPdfFonts): void {
  pdf.addFileToVFS("NotoNaskhArabic-Regular.ttf", arrayBufferToBase64(fonts.regular));
  pdf.addFont("NotoNaskhArabic-Regular.ttf", "NotoNaskhArabic", "normal");

  pdf.addFileToVFS("NotoNaskhArabic-Bold.ttf", arrayBufferToBase64(fonts.bold));
  pdf.addFont("NotoNaskhArabic-Bold.ttf", "NotoNaskhArabic", "bold");

  pdf.setFont("NotoNaskhArabic", "normal");

  try {
    pdf.setR2L(true);
  } catch {
    // Older jsPDF versions may not expose setR2L.
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export type StudyPdfContext = {
  /** Arabic project name, shown as the study owner. */
  projectNameAr?: string;
  /** French project name (optional line). */
  projectNameFr?: string;
  /** Project slug, used as identifier + in the file name. */
  slug?: string;
  /** Sale price in DZD. Defaults to the uniform price (490). */
  priceDzd?: number;
  /** Study title. Defaults to "الدراسة التفصيلية". */
  title?: string;
  /** Preparation date (display string). Defaults to today. */
  date?: string;
  /** Font bundles; auto-loaded from filesystem (Node) or public dir (browser). */
  fonts?: StudyPdfFonts;
  /** Path override for the fonts directory (Node only). */
  fontDir?: string;
  /** Whether to compress content streams. Defaults to true. */
  compress?: boolean;
};

// ---------------------------------------------------------------------------
// Localization of enum values (labels only — never study content)
// ---------------------------------------------------------------------------

const PRICING_MODEL_LABELS: Record<string, string> = {
  per_word: "لكل كلمة",
  per_minute: "لكل دقيقة",
  per_project: "لكل مشروع",
  monthly_retainer: "راتب شهري",
  package: "حزمة (باقة)",
};

const SOURCE_STATUS_LABELS: Record<string, string> = {
  VERIFIED: "مؤكَّد",
  BENCHMARK: "معيار مرجعي",
  SUGGESTED: "مقترح",
  NEEDS_VALIDATION: "يحتاج تحققاً",
};

const DIFFICULTY_LABELS: Record<string, string> = {
  low: "منخفض",
  medium: "متوسط",
  high: "مرتفع",
};

const TIER_LABELS: Record<string, string> = {
  free: "مجاني",
  pro: "احترافي",
};

const SOURCE_TYPE_LABELS: Record<string, string> = {
  OFFICIAL: "مصدر رسمي",
  BENCHMARK: "معيار مرجعي",
  REFERENCE: "مرجع",
};

const WEEK_LABELS: Record<number, string> = {
  1: "الأسبوع الأول",
  2: "الأسبوع الثاني",
  3: "الأسبوع الثالث",
  4: "الأسبوع الرابع",
};

// ---------------------------------------------------------------------------
// The 19 paid sections (order + Arabic headings) — exported for QA checks.
// ---------------------------------------------------------------------------

export const STUDY_PDF_SECTIONS: { key: keyof PaidStudy; label: string }[] = [
  { key: "summary", label: "الملخص" },
  { key: "idealClients", label: "العملاء المثاليون" },
  { key: "skills", label: "المهارات" },
  { key: "equipment", label: "المعدات والأدوات" },
  { key: "pricing", label: "التسعير" },
  { key: "profitModel", label: "نموذج الربح" },
  { key: "businessModel", label: "نموذج العمل" },
  { key: "firstClientAcquisition", label: "الحصول على أول عميل" },
  { key: "workflow", label: "سير العمل" },
  { key: "marketCompetition", label: "المنافسة في السوق" },
  { key: "commonMistakes", label: "الأخطاء الشائعة" },
  { key: "redFlags", label: "علامات التحذير" },
  { key: "marketing", label: "التسويق" },
  { key: "plan30Days", label: "خطة الثلاثين يوماً" },
  { key: "growthPath", label: "مسار النمو" },
  { key: "legalDz", label: "الجانب القانوني في الجزائر" },
  { key: "caseStudy", label: "دراسة الحالة" },
  { key: "sources", label: "المصادر" },
  { key: "meta", label: "بيانات المراجعة" },
];

// ---------------------------------------------------------------------------
// PDF layout helpers
// ---------------------------------------------------------------------------

const ACCENT: [number, number, number] = [79, 70, 229]; // indigo-600
const ACCENT2: [number, number, number] = [16, 185, 129]; // emerald-600
const ROSE: [number, number, number] = [225, 29, 72];
const AMBER: [number, number, number] = [180, 83, 9];
const SLATE: [number, number, number] = [51, 65, 85];

type Pager = {
  pdf: jsPDF;
  pageWidth: number;
  pageHeight: number;
  margin: number;
  contentWidth: number;
  y: number;
  pageNum: number;
  brand: string;
  appendFooter: boolean;
};

function footerText(pager: Pager): void {
  const { pdf, pageWidth, margin, pageHeight, pageNum, brand } = pager;
  pdf.setFont("NotoNaskhArabic", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(148, 163, 184);
  pdf.text(
    prepareArabicText(
      `${brand} — وثيقة مدفوعة. سيناريوهات دراسة الحالة توضيحية (SAMPLE). الصفحة ${pageNum}`
    ),
    pageWidth - margin,
    pageHeight - 10,
    { align: "right", isInputRtl: true } as any
  );
}

function addPage(pager: Pager): void {
  pager.pdf.addPage();
  pager.pageNum += 1;
  pager.y = pager.margin + 6;
  if (pager.appendFooter) footerText(pager);
}

function ensureSpace(pager: Pager, required: number): void {
  if (pager.y + required > pager.pageHeight - 22) {
    addPage(pager);
  }
}

function sectionTitle(pager: Pager, title: string, color: [number, number, number]): void {
  const { pdf, pageWidth, margin } = pager;
  pdf.setFont("NotoNaskhArabic", "bold");
  pdf.setFontSize(12);
  pdf.setTextColor(color[0], color[1], color[2]);
  pdf.text(prepareArabicText(title), pageWidth - margin, pager.y, {
    align: "right",
    isInputRtl: true,
  } as any);
  pager.y += 7;
}

function bodyText(pager: Pager, text: string, fontSize = 9.5): void {
  const { pdf } = pager;
  pdf.setFont("NotoNaskhArabic", "normal");
  pdf.setFontSize(fontSize);
  pdf.setTextColor(SLATE[0], SLATE[1], SLATE[2]);
  const lines = pdf.splitTextToSize(prepareArabicText(text), pager.contentWidth);
  pdf.text(lines, pager.pageWidth - pager.margin, pager.y, {
    align: "right",
    isInputRtl: true,
  } as any);
  pager.y += lines.length * (fontSize * 0.5 + 1.6) + 2;
}

function bullet(pager: Pager, text: string, fontSize = 9.5): void {
  bodyText(pager, `•  ${text}`, fontSize);
}

function fieldLine(pager: Pager, label: string, value: string | number | null | undefined, fontSize = 9.5): void {
  if (value === null || value === undefined || value === "") return;
  bodyText(pager, `${label}: ${String(value)}`, fontSize);
}

function notEmpty(v: unknown): boolean {
  if (v === null || v === undefined) return false;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === "object") {
    return Object.keys(v as object).some((k) => {
      const x = (v as Record<string, unknown>)[k];
      return x !== null && x !== undefined && x !== "";
    });
  }
  return String(v) !== "";
}

// ---------------------------------------------------------------------------
// Section renderers (render ONLY what exists in the study)
// ---------------------------------------------------------------------------

function renderIdealClients(pager: Pager, s: PaidStudy): void {
  s.idealClients.forEach((c) => {
    ensureSpace(pager, 14);
    pager.pdf.setFont("NotoNaskhArabic", "bold");
    pager.pdf.setFontSize(9.5);
    pager.pdf.setTextColor(15, 23, 42);
    pager.pdf.text(prepareArabicText(c.persona), pager.pageWidth - pager.margin, pager.y, {
      align: "right",
      isInputRtl: true,
    } as any);
    pager.y += 5;
    fieldLine(pager, "نوع المنظمة", c.orgType);
    fieldLine(pager, "المنصّة", c.platform);
    fieldLine(pager, "أهليته للسوق الجزائري", c.dzEligible === undefined ? undefined : c.dzEligible ? "نعم" : "لا");
    fieldLine(pager, "ملاحظات", c.notes);
    pager.y += 3;
  });
}

function renderSkills(pager: Pager, s: PaidStudy): void {
  if (s.skills.minimum.length) {
    ensureSpace(pager, 12);
    bodyText(pager, "الحد الأدنى من المهارات:", 9.5);
    s.skills.minimum.forEach((x) => bullet(pager, x));
    pager.y += 2;
  }
  if (s.skills.advanced.length) {
    ensureSpace(pager, 12);
    bodyText(pager, "مهارات متقدمة:", 9.5);
    s.skills.advanced.forEach((x) => bullet(pager, x));
    pager.y += 2;
  }
}

function renderEquipment(pager: Pager, s: PaidStudy): void {
  s.equipment.forEach((e) => {
    ensureSpace(pager, 14);
    pager.pdf.setFont("NotoNaskhArabic", "bold");
    pager.pdf.setFontSize(9.5);
    pager.pdf.setTextColor(15, 23, 42);
    pager.pdf.text(prepareArabicText(e.item), pager.pageWidth - pager.margin, pager.y, {
      align: "right",
      isInputRtl: true,
    } as any);
    pager.y += 5;
    fieldLine(pager, "الفئة", TIER_LABELS[e.tier] ?? e.tier);
    fieldLine(pager, "الغرض", e.purpose);
    fieldLine(pager, "المصدر", e.source);
    fieldLine(pager, "حالة المصدر", SOURCE_STATUS_LABELS[e.sourceStatus] ?? e.sourceStatus);
    pager.y += 3;
  });
}

function renderPricing(pager: Pager, s: PaidStudy): void {
  s.pricing.forEach((p, i) => {
    ensureSpace(pager, 22);
    bodyText(pager, `${i + 1}) ${PRICING_MODEL_LABELS[p.model] ?? p.model}.`, 9.5);
    const rangeParts: string[] = [];
    if (typeof p.globalMinUsd === "number") rangeParts.push(`${p.globalMinUsd}$`);
    if (typeof p.globalMaxUsd === "number") rangeParts.push(`${p.globalMaxUsd}$`);
    if (rangeParts.length) bodyText(pager, `النطاق العالمي: ${rangeParts.join(" — ")}`);
    fieldLine(pager, "السعر المقترح محلياً (دج)", p.dzSuggestedDzd);
    fieldLine(pager, "حالة السعر المحلي", SOURCE_STATUS_LABELS[p.dzPriceStatus] ?? p.dzPriceStatus);
    fieldLine(pager, "المصدر", p.source);
    fieldLine(pager, "ملاحظة", p.note);
    pager.y += 3;
  });
}

function renderProfitModel(pager: Pager, s: PaidStudy): void {
  fieldLine(pager, "مرتكز التسعير", s.profitModel.priceAnchor);
  fieldLine(pager, "ساعات الوحدة", s.profitModel.hoursPerUnit);
  fieldLine(pager, "إجمالي الدخل لكل ساعة", s.profitModel.grossPerHour);
  fieldLine(pager, "وحدات التعادل", s.profitModel.breakEvenUnits);
  fieldLine(pager, "ملاحظات", s.profitModel.notes);
}

function renderBusinessModel(pager: Pager, s: PaidStudy): void {
  fieldLine(pager, "نموذج العرض", s.businessModel.offerModel);
  fieldLine(pager, "عرض القيمة", s.businessModel.valueProposition);
  fieldLine(pager, "استراتيجية العميل المتكرر", s.businessModel.repeatClientStrategy);
}

function renderFirstClientAcquisition(pager: Pager, s: PaidStudy): void {
  s.firstClientAcquisition.forEach((c) => {
    ensureSpace(pager, 14);
    pager.pdf.setFont("NotoNaskhArabic", "bold");
    pager.pdf.setFontSize(9.5);
    pager.pdf.setTextColor(15, 23, 42);
    pager.pdf.text(prepareArabicText(c.channel), pager.pageWidth - pager.margin, pager.y, {
      align: "right",
      isInputRtl: true,
    } as any);
    pager.y += 5;
    fieldLine(pager, "الصعوبة", DIFFICULTY_LABELS[c.difficulty ?? ""] ?? c.difficulty);
    fieldLine(pager, "العدد المستهدف للتواصل", c.outreachTargetCount);
    fieldLine(pager, "رسالة التواصل", c.messageScript);
    fieldLine(pager, "رسالة المتابعة", c.followUpScript);
    pager.y += 3;
  });
}

function renderWorkflow(pager: Pager, s: PaidStudy): void {
  s.workflow.forEach((w, i) => {
    ensureSpace(pager, 14);
    const base = `${i + 1}) ${w.stage} — ${w.detail}`;
    bodyText(pager, w.deliverable ? `${base}  (المُسلَّم: ${w.deliverable})` : base, 9.5);
  });
}

function renderMarketCompetition(pager: Pager, s: PaidStudy): void {
  s.marketCompetition.forEach((c) => {
    ensureSpace(pager, 14);
    pager.pdf.setFont("NotoNaskhArabic", "bold");
    pager.pdf.setFontSize(9.5);
    pager.pdf.setTextColor(15, 23, 42);
    pager.pdf.text(prepareArabicText(c.segment), pager.pageWidth - pager.margin, pager.y, {
      align: "right",
      isInputRtl: true,
    } as any);
    pager.y += 5;
    fieldLine(pager, "شدة المنافسة", DIFFICULTY_LABELS[c.intensity ?? ""] ?? c.intensity);
    fieldLine(pager, "التمركز", c.positioning);
    fieldLine(pager, "ملاحظات", c.notes);
    pager.y += 3;
  });
}

function renderCommonMistakes(pager: Pager, s: PaidStudy): void {
  s.commonMistakes.forEach((m) => {
    ensureSpace(pager, 12);
    bodyText(pager, m.prevention ? `${m.mistake} — الوقاية: ${m.prevention}` : m.mistake, 9.5);
  });
}

function renderRedFlags(pager: Pager, s: PaidStudy): void {
  s.redFlags.forEach((r) => {
    ensureSpace(pager, 12);
    const parts = [r.flag];
    if (r.why) parts.push(`السبب: ${r.why}`);
    if (r.protection) parts.push(`الوقاية: ${r.protection}`);
    bullet(pager, parts.join(" — "));
  });
}

function renderMarketing(pager: Pager, s: PaidStudy): void {
  fieldLine(pager, "دعوة لاتخاذ إجراء (CTA)", s.marketing.cta);
  bodyText(pager, "قنوات التسويق:");
  s.marketing.channels.forEach((x) => bullet(pager, x));
  pager.y += 2;
  bodyText(pager, "أنواع المحتوى:");
  s.marketing.contentTypes.forEach((x) => bullet(pager, x));
  pager.y += 2;
  bodyText(pager, "مؤشرات الأداء الرئيسية (KPIs):");
  s.marketing.kpis.forEach((x) => bullet(pager, x));
  pager.y += 2;
}

function renderPlan30Days(pager: Pager, s: PaidStudy): void {
  s.plan30Days.forEach((w) => {
    ensureSpace(pager, 18);
    pager.pdf.setFont("NotoNaskhArabic", "bold");
    pager.pdf.setFontSize(9.5);
    pager.pdf.setTextColor(ACCENT2[0], ACCENT2[1], ACCENT2[2]);
    pager.pdf.text(prepareArabicText(WEEK_LABELS[w.week] ?? `الأسبوع ${w.week}`), pager.pageWidth - pager.margin, pager.y, {
      align: "right",
      isInputRtl: true,
    } as any);
    pager.y += 5;
    bodyText(pager, "المهام:");
    w.tasks.forEach((x) => bullet(pager, x, 9));
    if (w.outreach?.length) {
      bodyText(pager, "التواصل:");
      w.outreach.forEach((x) => bullet(pager, x, 9));
    }
    if (w.content?.length) {
      bodyText(pager, "المحتوى:");
      w.content.forEach((x) => bullet(pager, x, 9));
    }
    if (w.kpis?.length) {
      bodyText(pager, "مؤشرات الأسبوع:");
      w.kpis.forEach((x) => bullet(pager, x, 9));
    }
    pager.y += 3;
  });
}

function renderGrowthPath(pager: Pager, s: PaidStudy): void {
  s.growthPath.forEach((g) => {
    ensureSpace(pager, 12);
    bullet(pager, `${g.from} ← ${g.to} — ${g.tactic}`, 9.5);
  });
}

function renderLegalDz(pager: Pager, s: PaidStudy): void {
  fieldLine(pager, "المقاول الذاتي", s.legalDz.autoEntrepreneur);
  fieldLine(pager, "IFU", s.legalDz.ifu);
  fieldLine(pager, "CASNOS", s.legalDz.casnos);
  fieldLine(pager, "TVA", s.legalDz.tva);
  fieldLine(pager, "العملات المشفّرة", s.legalDz.crypto);
  fieldLine(pager, "ملاحظات", s.legalDz.notes);
  if (typeof s.legalDz.needsValidation === "boolean") {
    bodyText(pager, s.legalDz.needsValidation ? "حالة التحقق: المعلومات القانونية تحتاج تحققاً إضافياً من مصادر رسمية." : "حالة التحقق: المعلومات القانونية خضعت للتحقق.", 9.5);
  }
}

function renderCaseStudy(pager: Pager, s: PaidStudy): void {
  if (s.caseStudy.isSample === true) {
    ensureSpace(pager, 20);
    const { pdf, pageWidth, margin } = pager;
    pdf.setFillColor(254, 243, 199);
    pdf.setDrawColor(AMBER[0], AMBER[1], AMBER[2]);
    pdf.setLineWidth(0.4);
    const boxW = pager.contentWidth;
    const warning =
      "تنويه: سيناريو دراسة الحالة في هذه الوثيقة هو سيناريو توضيحي (SAMPLE) وليس نتيجة أو تجربة حقيقية، وليس وعداً بالنتائج أو الأرباح.";
    const lines = pdf.splitTextToSize(prepareArabicText(warning), boxW - 10);
    const boxH = lines.length * 4.6 + 8;
    pdf.roundedRect(margin, pager.y - 3, boxW, boxH, 1.5, 1.5, "FD");
    pdf.setTextColor(AMBER[0], AMBER[1], AMBER[2]);
    pdf.setFont("NotoNaskhArabic", "bold");
    pdf.setFontSize(9);
    pdf.text(lines, pageWidth - margin - 5, pager.y + 3, { align: "right", isInputRtl: true } as any);
    pager.y += boxH + 6;
  }

  ensureSpace(pager, 14);
  bodyText(pager, s.caseStudy.scenario, 9.5);
  if (s.caseStudy.inputs?.length) {
    bodyText(pager, "المدخلات:");
    s.caseStudy.inputs.forEach((x) => bullet(pager, x, 9));
  }
  fieldLine(pager, "النتيجة", s.caseStudy.outcome);
}

function renderSources(pager: Pager, s: PaidStudy): void {
  s.sources.forEach((src, i) => {
    ensureSpace(pager, 14);
    bodyText(pager, `${i + 1}) ${src.title}`, 9.5);
    fieldLine(pager, "الرابط", src.url);
    fieldLine(pager, "نوع المصدر", SOURCE_TYPE_LABELS[src.sourceType] ?? src.sourceType);
    fieldLine(pager, "تاريخ التحقق", src.verifiedAt);
    fieldLine(pager, "ملاحظات", src.notes);
    pager.y += 2;
  });
}

function renderMeta(pager: Pager, s: PaidStudy): void {
  fieldLine(pager, "قيمة المحتوى (من 10)", s.meta.paidValueScore);
  fieldLine(pager, "آخر تحقق", s.meta.lastVerified);
  fieldLine(pager, "إصدار البحث", s.meta.researchVersion);
}

function renderSummary(pager: Pager, s: PaidStudy): void {
  bodyText(pager, s.summary.overview, 9.5);
}

const SECTION_RENDERERS: Record<string, (pager: Pager, s: PaidStudy) => void> = {
  summary: renderSummary,
  idealClients: renderIdealClients,
  skills: renderSkills,
  equipment: renderEquipment,
  pricing: renderPricing,
  profitModel: renderProfitModel,
  businessModel: renderBusinessModel,
  firstClientAcquisition: renderFirstClientAcquisition,
  workflow: renderWorkflow,
  marketCompetition: renderMarketCompetition,
  commonMistakes: renderCommonMistakes,
  redFlags: renderRedFlags,
  marketing: renderMarketing,
  plan30Days: renderPlan30Days,
  growthPath: renderGrowthPath,
  legalDz: renderLegalDz,
  caseStudy: renderCaseStudy,
  sources: renderSources,
  meta: renderMeta,
};

/** All sections the renderer can draw (for QA coverage assertions). */
export const RENDERED_SECTION_KEYS: string[] = Object.keys(SECTION_RENDERERS);

// ---------------------------------------------------------------------------
// Main builder
// ---------------------------------------------------------------------------

function formatDate(d?: string): string {
  if (d) return d;
  return new Date().toLocaleDateString("ar-DZ", { year: "numeric", month: "long", day: "numeric" });
}

/**
 * Builds the paid-study PDF bytes.
 * Throws if the study is not approved (draft/review cannot generate a PDF).
 * Returns the raw PDF bytes; the caller decides how to persist/deliver them
 * (manual Telegram delivery — no public link is ever created here).
 */
export async function buildStudyPdfBytes(study: PaidStudy, ctx: StudyPdfContext = {}): Promise<Uint8Array> {
  if (!study) {
    throw new Error("بناء PDF للدراسة يتطلب كائن دراسة صالحاً.");
  }

  const safety = draftSafetyError(study);
  if (safety) {
    throw new Error(safety);
  }

  const priceDzd = ctx.priceDzd ?? PAID_STUDY_PRICE_DZD;
  const title = ctx.title ?? "الدراسة التفصيلية";
  const projectNameAr = ctx.projectNameAr ?? "";
  const date = formatDate(ctx.date);

  const pdf = ctx.compress === false ? new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: false }) : createPdf();
  installFonts(pdf, await loadStudyPdfFonts(ctx.fonts, ctx.fontDir));

  pdf.setProperties({
    title: `${title} — NABDA`,
    subject: `دراسة مدفوعة ${ctx.slug ? `(${ctx.slug})` : ""} — ${priceDzd} دج`,
    author: "NABDA",
    creator: "NABDA",
    keywords: `NABDA,${ctx.slug ?? "study"},study,paid`,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 18;
  const brand = "منصة NABDA — دراسة المهن من رمز ذهني ودقيق";

  const pager: Pager = {
    pdf,
    pageWidth,
    pageHeight,
    margin,
    contentWidth: pageWidth - margin * 2,
    y: margin + 16,
    pageNum: 1,
    brand,
    appendFooter: true,
  };
  footerText(pager);

  // --- Cover -----------------------------------------------------------------
  pdf.setTextColor(100, 116, 139);
  pdf.setFont("NotoNaskhArabic", "normal");
  pdf.setFontSize(9);
  pdf.text(prepareArabicText("وثيقة مدفوعة — تُسلَّم عبر Telegram بعد الدفع"), pageWidth - margin, pager.y, {
    align: "right",
    isInputRtl: true,
  } as any);
  pager.y += 14;

  pdf.setFont("NotoNaskhArabic", "bold");
  pdf.setFontSize(24);
  pdf.setTextColor(ACCENT[0], ACCENT[1], ACCENT[2]);
  pdf.text(prepareArabicText(title), pageWidth - margin, pager.y, { align: "right", isInputRtl: true } as any);
  pager.y += 12;

  if (projectNameAr) {
    pdf.setFontSize(17);
    pdf.setTextColor(15, 23, 42);
    pdf.text(prepareArabicText(projectNameAr), pageWidth - margin, pager.y, { align: "right", isInputRtl: true } as any);
    pager.y += 10;
    if (ctx.projectNameFr) {
      pdf.setFontSize(10);
      pdf.setTextColor(100, 116, 139);
      pdf.text(prepareArabicText(ctx.projectNameFr), pageWidth - margin, pager.y, { align: "right", isInputRtl: true } as any);
      pager.y += 10;
    }
  }

  pdf.setDrawColor(ACCENT[0], ACCENT[1], ACCENT[2]);
  pdf.setLineWidth(0.6);
  pdf.line(margin, pager.y, pageWidth - margin, pager.y);
  pager.y += 10;

  // Meta block
  pdf.setFillColor(238, 242, 255);
  const metaRows: [string, string][] = [
    ["السعر", `${priceDzd} دج`],
    ["تاريخ إعداد الدراسة", date],
    ["حالة الدراسة", "معتمدة (Approved)"],
  ];
  if (ctx.slug) metaRows.push(["المعرّف", ctx.slug]);
  if (study.meta?.researchVersion) metaRows.push(["إصدار البحث", study.meta.researchVersion]);

  const rowH = 7.5;
  ensureSpace(pager, metaRows.length * rowH + 8);
  pdf.roundedRect(margin, pager.y - 2, pager.contentWidth, metaRows.length * rowH + 6, 2, 2, "F");
  for (const [label, value] of metaRows) {
    pdf.setFont("NotoNaskhArabic", "bold");
    pdf.setFontSize(9.5);
    pdf.setTextColor(SLATE[0], SLATE[1], SLATE[2]);
    pdf.text(prepareArabicText(label), pageWidth - margin - 4, pager.y + 2, { align: "right", isInputRtl: true } as any);
    pdf.setFont("NotoNaskhArabic", "normal");
    pdf.setFontSize(9.5);
    pdf.setTextColor(79, 70, 229);
    const labelWidth = pdf.getTextWidth(prepareArabicText(label));
    pdf.text(prepareArabicText(value), pageWidth - margin - labelWidth - 6, pager.y + 2, { align: "right", isInputRtl: true } as any);
    pager.y += rowH;
  }
  pager.y += 10;

  // --- 19 sections ------------------------------------------------------------
  for (const section of STUDY_PDF_SECTIONS) {
    const value = study[section.key];
    if (!notEmpty(value)) continue;

    ensureSpace(pager, 20);
    sectionTitle(pager, `${STUDY_PDF_SECTIONS.indexOf(section) + 1}. ${section.label}`, ACCENT);

    const render = SECTION_RENDERERS[section.key];
    if (render) render(pager, study);
    pager.y += 4;
  }

  // --- Closing ---------------------------------------------------------------
  ensureSpace(pager, 18);
  pdf.setDrawColor(ACCENT[0], ACCENT[1], ACCENT[2]);
  pdf.setLineWidth(0.4);
  pdf.line(margin, pager.y, pageWidth - margin, pager.y);
  pager.y += 7;
  pdf.setFont("NotoNaskhArabic", "normal");
  pdf.setFontSize(8.5);
  pdf.setTextColor(100, 116, 139);
  pdf.text(
    prepareArabicText("تم إعداد هذه الوثيقة بواسطة منصة NABDA لتُسلَّم يدوياً عبر Telegram بعد الدفع. يمنع إعادة توزيعها أو نشرها."),
    pageWidth - margin,
    pager.y,
    { align: "right", isInputRtl: true } as any
  );

  const arrayBuffer = pdf.output("arraybuffer");
  return new Uint8Array(arrayBuffer);
}

/** Persists PDF bytes to disk (Node/serverside). Returns the file name used. */
export function studyPdfFileName(ctx: StudyPdfContext): string {
  const base = ctx.slug || ctx.projectNameAr || "study";
  return `NABDA-study-${safeFileName(base)}.pdf`;
}