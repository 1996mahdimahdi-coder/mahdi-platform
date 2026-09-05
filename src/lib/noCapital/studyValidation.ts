// ============================================================================
// Validation for the Paid Study (noCapitalProjects.study).
//
// The goal is that invalid study data is REJECTED (with a readable error)
// instead of crashing the app. Callers (admin API + admin UI + any consumer)
// must run `validateStudy` before persisting. A minimal, complete draft is
// derivable from `emptyPaidStudyDraft()` so the admin can persist immediately
// and fill sections progressively.
//
// Phase 3 contract: study data is ADMIN-ONLY. Nothing here implies any public
// exposure. `draftSafetyError` enforces that drafts must never be treated as
// deliverable.
// ============================================================================

import type { PaidStudy, StudyStatus } from "@/lib/noCapital/types";

export const STUDY_STATUSES: StudyStatus[] = ["draft", "review", "approved"];

const STUDY_PRICING_MODELS = [
  "per_word",
  "per_minute",
  "per_project",
  "monthly_retainer",
  "package",
] as const;

const STUDY_SOURCE_STATUSES = [
  "VERIFIED",
  "BENCHMARK",
  "SUGGESTED",
  "NEEDS_VALIDATION",
] as const;

const STUDY_DIFFICULTIES = ["low", "medium", "high"] as const;

const STUDY_EQUIPMENT_TIERS = ["free", "pro"] as const;

const STUDY_PLAN_WEEKS = [1, 2, 3, 4] as const;

const STUDY_SOURCE_TYPES = ["OFFICIAL", "BENCHMARK", "REFERENCE"] as const;

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === "string");
}

function isNullOrNumber(value: unknown, min: number): value is number | undefined {
  if (value == null) return true;
  return typeof value === "number" && Number.isFinite(value) && value >= min;
}

function isOneOf<T extends readonly string[]>(value: unknown, allowed: T): value is T[number] {
  return typeof value === "string" && (allowed as readonly string[]).includes(value);
}

function isLabel(value: unknown, label: string): boolean {
  return Boolean(value) && typeof value === "string" && value.trim().length > 0;
}

// ----------------------------------------------------------------------------
// Empty draft factory
// ----------------------------------------------------------------------------

export function emptyPaidStudyDraft(): PaidStudy {
  return {
    version: 1,
    status: "draft",
    summary: { overview: "" },
    idealClients: [],
    skills: { minimum: [], advanced: [] },
    equipment: [],
    pricing: [],
    profitModel: {},
    businessModel: {},
    firstClientAcquisition: [],
    workflow: [],
    marketCompetition: [],
    commonMistakes: [],
    redFlags: [],
    marketing: { channels: [], contentTypes: [], kpis: [] },
    plan30Days: [],
    growthPath: [],
    legalDz: { needsValidation: true },
    caseStudy: { scenario: "", isSample: true },
    sources: [],
    meta: {},
  };
}

// ----------------------------------------------------------------------------
// Main validator
// ----------------------------------------------------------------------------

/**
 * Validates a Paid Study draft. Returns an array of human-readable errors.
 * An empty array means the data is structurally valid.
 *
 * NOTE: this validates SHAPE and RANGES (guards against crash/injection of
 * malformed data). It intentionally does NOT approve the research content —
 * editorial approval belongs to the status workflow, not structural checks.
 */
export function validateStudy(raw: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(raw)) {
    errors.push("الدراسة يجب أن تكون كائناً (Object) صالحاً.");
    return errors;
  }

  // version
  if (!isNullOrNumber(raw.version, 0) || raw.version === 0) {
    errors.push("إصدار الدراسة (version) يجب أن يكون رقماً موجباً.");
  }

  // status
  if (!isOneOf(raw.status, STUDY_STATUSES)) {
    errors.push("حالة الدراسة (status) يجب أن تكون draft أو review أو approved.");
  }

  // summary.overview
  if (
    !isRecord(raw.summary) ||
    typeof raw.summary.overview !== "string" ||
    raw.summary.overview.length > 4000
  ) {
    errors.push("ملخص الدراسة (summary.overview) يجب أن يكون نصاً لا يتجاوز 4000 حرفاً.");
  }

  // idealClients
  if (!Array.isArray(raw.idealClients)) {
    errors.push("قسم العملاء المثاليين (idealClients) يجب أن يكون مصفوفة.");
  } else {
    for (let i = 0; i < raw.idealClients.length; i += 1) {
      const c = raw.idealClients[i];
      if (!isRecord(c)) {
        errors.push(`idealClients[${i}] يجب أن يكون كائناً صالحاً.`);
      } else {
        if (!isLabel(c.persona, "persona")) {
          errors.push(`idealClients[${i}].persona مطلوب.`);
        }
      }
    }
  }

  // skills
  if (
    !isRecord(raw.skills) ||
    !isStringArray(raw.skills.minimum) ||
    !isStringArray(raw.skills.advanced)
  ) {
    errors.push("قسم المهارات (skills.minimum / skills.advanced) يجب أن يكون مصفوفة نصوص.");
  }

  // equipment
  if (!Array.isArray(raw.equipment)) {
    errors.push("قسم المعدات (equipment) يجب أن يكون مصفوفة.");
  } else {
    for (let i = 0; i < raw.equipment.length; i += 1) {
      const e = raw.equipment[i];
      if (!isRecord(e)) {
        errors.push(`equipment[${i}] يجب أن يكون كائناً صالحاً.`);
      } else {
        if (!isLabel(e.item, "item")) errors.push(`equipment[${i}].item مطلوب.`);
        if (!isOneOf(e.tier, STUDY_EQUIPMENT_TIERS)) {
          errors.push(`equipment[${i}].tier يجب أن يكون free أو pro.`);
        }
        if (!isOneOf(e.sourceStatus, STUDY_SOURCE_STATUSES)) {
          errors.push(`equipment[${i}].sourceStatus غير صالح.`);
        }
        if (e.cost != null && (typeof e.cost !== "number" || !Number.isFinite(e.cost) || e.cost < 0)) {
          errors.push(`equipment[${i}].cost يجب أن يكون رقماً موجباً إذا وُجد.`);
        }
      }
    }
  }

  // pricing
  if (!Array.isArray(raw.pricing)) {
    errors.push("قسم التسعير (pricing) يجب أن يكون مصفوفة.");
  } else {
    for (let i = 0; i < raw.pricing.length; i += 1) {
      const p = raw.pricing[i];
      if (!isRecord(p)) {
        errors.push(`pricing[${i}] يجب أن يكون كائناً صالحاً.`);
      } else {
        if (!isOneOf(p.model, STUDY_PRICING_MODELS)) {
          errors.push(`pricing[${i}].model غير صالح.`);
        }
        if (typeof p.globalMinUsd === "number" && p.globalMinUsd < 0) {
          errors.push(`pricing[${i}].globalMinUsd يجب ألا يكون سالباً.`);
        }
        if (typeof p.globalMaxUsd === "number" && p.globalMaxUsd < 0) {
          errors.push(`pricing[${i}].globalMaxUsd يجب ألا يكون سالباً.`);
        }
        if (typeof p.dzSuggestedDzd === "number" && p.dzSuggestedDzd < 0) {
          errors.push(`pricing[${i}].dzSuggestedDzd يجب ألا يكون سالباً.`);
        }
        if (!isOneOf(p.dzPriceStatus, STUDY_SOURCE_STATUSES)) {
          errors.push(`pricing[${i}].dzPriceStatus غير صالح.`);
        }
      }
    }
  }

  // profitModel
  if (isRecord(raw.profitModel)) {
    if (typeof raw.profitModel.hoursPerUnit === "number" && raw.profitModel.hoursPerUnit < 0) {
      errors.push("profitModel.hoursPerUnit يجب ألا يكون سالباً.");
    }
    if (typeof raw.profitModel.grossPerHour === "number" && raw.profitModel.grossPerHour < 0) {
      errors.push("profitModel.grossPerHour يجب ألا يكون سالباً.");
    }
    if (typeof raw.profitModel.breakEvenUnits === "number" && raw.profitModel.breakEvenUnits < 0) {
      errors.push("profitModel.breakEvenUnits يجب ألا يكون سالباً.");
    }
  } else {
    errors.push("قسم نموذج الربح (profitModel) يجب أن يكون كائناً صالحاً.");
  }

  // businessModel
  if (!isRecord(raw.businessModel)) {
    errors.push("قسم نموذج العمل (businessModel) يجب أن يكون كائناً صالحاً.");
  }

  // firstClientAcquisition
  if (!Array.isArray(raw.firstClientAcquisition)) {
    errors.push("قسم الحصول على أول عميل (firstClientAcquisition) يجب أن يكون مصفوفة.");
  } else {
    for (let i = 0; i < raw.firstClientAcquisition.length; i += 1) {
      const c = raw.firstClientAcquisition[i];
      if (!isRecord(c)) {
        errors.push(`firstClientAcquisition[${i}] يجب أن يكون كائناً صالحاً.`);
      } else {
        if (!isLabel(c.channel, "channel")) {
          errors.push(`firstClientAcquisition[${i}].channel مطلوب.`);
        }
        if (c.outreachTargetCount != null && !Number.isInteger(c.outreachTargetCount)) {
          errors.push(`firstClientAcquisition[${i}].outreachTargetCount يجب أن يكون عدداً صحيحاً.`);
        }
      }
    }
  }

  // workflow
  if (!Array.isArray(raw.workflow)) {
    errors.push("قسم سير العمل (workflow) يجب أن يكون مصفوفة.");
  } else {
    for (let i = 0; i < raw.workflow.length; i += 1) {
      const w = raw.workflow[i];
      if (!isRecord(w) || !isLabel(w.stage, "stage") || !isLabel(w.detail, "detail")) {
        errors.push(`workflow[${i}] يتطلب stage و detail نصيين.`);
      }
    }
  }

  // marketCompetition
  if (!Array.isArray(raw.marketCompetition)) {
    errors.push("قسم المنافسة (marketCompetition) يجب أن يكون مصفوفة.");
  } else {
    for (let i = 0; i < raw.marketCompetition.length; i += 1) {
      const c = raw.marketCompetition[i];
      if (!isRecord(c) || !isLabel(c.segment, "segment")) {
        errors.push(`marketCompetition[${i}].segment مطلوب.`);
      }
      if (c.intensity != null && !isOneOf(c.intensity, STUDY_DIFFICULTIES)) {
        errors.push(`marketCompetition[${i}].intensity يجب أن يكون low أو medium أو high.`);
      }
    }
  }

  // commonMistakes
  if (!Array.isArray(raw.commonMistakes)) {
    errors.push("قسم الأخطاء الشائعة (commonMistakes) يجب أن يكون مصفوفة.");
  } else {
    for (let i = 0; i < raw.commonMistakes.length; i += 1) {
      const m = raw.commonMistakes[i];
      if (!isRecord(m) || !isLabel(m.mistake, "mistake")) {
        errors.push(`commonMistakes[${i}].mistake مطلوب.`);
      }
    }
  }

  // redFlags
  if (!Array.isArray(raw.redFlags)) {
    errors.push("قسم العلامات الحمراء (redFlags) يجب أن يكون مصفوفة.");
  } else {
    for (let i = 0; i < raw.redFlags.length; i += 1) {
      const r = raw.redFlags[i];
      if (!isRecord(r) || !isLabel(r.flag, "flag")) {
        errors.push(`redFlags[${i}].flag مطلوب.`);
      }
    }
  }

  // marketing
  const marketing = raw.marketing;
  if (
    !isRecord(marketing) ||
    !isStringArray(marketing.channels) ||
    !isStringArray(marketing.contentTypes) ||
    !isStringArray(marketing.kpis)
  ) {
    errors.push(
      "قسم التسويق (marketing.channels / contentTypes / kpis) يجب أن يكون مصفوفة نصوص."
    );
  }

  // plan30Days
  if (!Array.isArray(raw.plan30Days)) {
    errors.push("قسم خطة 30 يوم (plan30Days) يجب أن يكون مصفوفة.");
  } else {
    for (let i = 0; i < raw.plan30Days.length; i += 1) {
      const p = raw.plan30Days[i];
      if (!isRecord(p)) {
        errors.push(`plan30Days[${i}] يجب أن يكون كائناً صالحاً.`);
      } else {
        if (!STUDY_PLAN_WEEKS.includes(p.week as 1)) {
          errors.push(`plan30Days[${i}].week يجب أن يكون بين 1 و 4.`);
        }
        if (!isStringArray(p.tasks)) {
          errors.push(`plan30Days[${i}].tasks يجب أن يكون مصفوفة نصوص.`);
        }
      }
    }
  }

  // growthPath
  if (!Array.isArray(raw.growthPath)) {
    errors.push("قسم مسار النمو (growthPath) يجب أن يكون مصفوفة.");
  } else {
    for (let i = 0; i < raw.growthPath.length; i += 1) {
      const g = raw.growthPath[i];
      if (!isRecord(g) || !isLabel(g.from, "from") || !isLabel(g.to, "to") || !isLabel(g.tactic, "tactic")) {
        errors.push(`growthPath[${i}] يتطلب from و to و tactic نصوص.`);
      }
    }
  }

  // legalDz
  if (isRecord(raw.legalDz)) {
    if (typeof raw.legalDz.needsValidation !== "boolean") {
      errors.push("legalDz.needsValidation يجب أن يكون قيمة منطقية.");
    }
  } else {
    errors.push("قسم القانون الجزائري (legalDz) يجب أن يكون كائناً صالحاً.");
  }

  // caseStudy
  if (isRecord(raw.caseStudy)) {
    if (raw.caseStudy.isSample !== true) {
      errors.push("caseStudy.isSample يجب أن يكون true.");
    }
  } else {
    errors.push("قسم دراسة الحالة (caseStudy) يجب أن يكون كائناً صالحاً.");
  }

  // sources
  if (!Array.isArray(raw.sources)) {
    errors.push("قسم المصادر (sources) يجب أن يكون مصفوفة.");
  } else {
    for (let i = 0; i < raw.sources.length; i += 1) {
      const s = raw.sources[i];
      if (!isRecord(s) || !isLabel(s.title, "title")) {
        errors.push(`sources[${i}].title مطلوب.`);
      }
      if (s.sourceType != null && !isOneOf(s.sourceType, STUDY_SOURCE_TYPES)) {
        errors.push(`sources[${i}].sourceType غير صالح.`);
      }
    }
  }

  // meta
  if (isRecord(raw.meta)) {
    const score = raw.meta.paidValueScore;
    if (score != null) {
      if (typeof score !== "number" || !Number.isFinite(score) || score < 0 || score > 10) {
        errors.push("meta.paidValueScore يجب أن يكون بين 0 و 10.");
      }
    }
    if (raw.meta.studyKind != null && !["no_capital", "capital"].includes(String(raw.meta.studyKind))) {
      errors.push("meta.studyKind يجب أن يكون no_capital أو capital.");
    }
  } else {
    errors.push("قسم البيانات الوصفية (meta) يجب أن يكون كائناً صالحاً.");
  }

  // Optional capital-project extensions ------------------------------------
  if (raw.startupCapital != null) {
    const cap = raw.startupCapital;
    if (
      !isRecord(cap) ||
      typeof cap.min !== "number" ||
      !Number.isFinite(cap.min) ||
      cap.min < 0 ||
      typeof cap.recommended !== "number" ||
      !Number.isFinite(cap.recommended) ||
      cap.recommended < 0 ||
      typeof cap.max !== "number" ||
      !Number.isFinite(cap.max) ||
      cap.max < 0
    ) {
      errors.push(
        "startupCapital يجب أن يحتوي على min و recommended و max أرقاماً موجبة."
      );
    }
  }

  if (raw.strengths != null && !isStringArray(raw.strengths)) {
    errors.push("strengths يجب أن يكون مصفوفة نصوص.");
  }

  if (raw.marketTestPlan != null) {
    const plan = raw.marketTestPlan;
    if (
      !isRecord(plan) ||
      !isStringArray(plan.steps) ||
      (plan.channels != null && !isStringArray(plan.channels)) ||
      (plan.kpis != null && !isStringArray(plan.kpis))
    ) {
      errors.push("marketTestPlan يجب أن يحتوي على steps كمصفوفة نصوص (channels/kpis اختيارية كمصفوفة نصوص).");
    }
  }

  return errors;
}

// ----------------------------------------------------------------------------
// Draft safety
// ----------------------------------------------------------------------------

/**
 * Returns a non-null error string when a study must NOT be delivered/exposed to
 * the public. Currently: any study that is not "approved" must never be treated
 * as deliverable. This is the single guardrails check the public layer must
 * call in Phase 4 before selling/showing a study.
 */
export function draftSafetyError(study: PaidStudy | null): string | null {
  if (!study) return null;
  if (study.status !== "approved") {
    return "لا يمكن تسليم عرض الدراسة قبل أن تصبح حالتها approved.";
  }
  return null;
}

/**
 * Conservative check used by any public read path: strips the study entirely
 * so no public serialization can leak draft content. Returns true if data
 * should be redacted (study present but not approved).
 */
export function shouldRedactStudy(study: PaidStudy | null): boolean {
  return study != null && study.status !== "approved";
}

export function isValidStudy(status: StudyStatus): status is StudyStatus {
  return STUDY_STATUSES.includes(status);
}