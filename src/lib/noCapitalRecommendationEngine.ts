import type {
  NoCapitalAnswer,
  NoCapitalAnswers,
  NoCapitalProfile,
  NoCapitalQuestion,
  NoCapitalRecommendation,
  NoCapitalRecommendationRule,
} from "@/lib/noCapital/types";

// ============================================================================
// No-capital recommendation engine.
//
// Pure, deterministic, independent of the scoringEngine used by /api/assess
// (that engine stays untouched for the capital / existing path).
//
// Approach: tag-based matching. Every answer option carries tags (topic,
// effort level, skills, tools, risk, income, objective). Profiles carry a
// `tags` array plus structured `skillsRequired` / `toolsNeeded`. Each profile
// gets a score per dimension (mode/effort/skills/tools/startability), the
// dimensions are weighted, and results are sorted best-first with short
// reasons in Arabic.
//
// Optional recommendation rules allow the admin to boost or reduce specific
// tag matches per (questionKey, optionValue) pair via the DB.
// When rules is empty the engine behaves identically to the hardcoded version.
// ============================================================================

export const NO_CAPITAL_DIMENSION_WEIGHTS = {
  mode: 30,
  effort: 20,
  skills: 25,
  tools: 15,
  startability: 10,
} as const;

type MatchedSet = { value: string; tags: string[] }[];

function collectAnswerValues(question: NoCapitalQuestion, answer: NoCapitalAnswer): MatchedSet {
  const values = Array.isArray(answer) ? answer : [answer];
  return values
    .map((value) => ({ value, tags: question.options.find((o) => o.value === value)?.tags ?? [] }))
    .filter((item) => item.value !== undefined);
}

function flatTags(items: MatchedSet): string[] {
  return items.flatMap((item) => item.tags).filter((tag, i, arr) => arr.indexOf(tag) === i);
}

export function scoreNoCapitalProfiles(input: {
  answers: NoCapitalAnswers;
  questions: NoCapitalQuestion[];
  profiles: NoCapitalProfile[];
  rules?: NoCapitalRecommendationRule[];
}): NoCapitalRecommendation[] {
  const { answers, questions, profiles, rules = [] } = input;

  const byKey = new Map(questions.map((q) => [q.questionKey, q]));
  const modeQ = byKey.get("mode");
  const hoursQ = byKey.get("hours");
  const skillsQ = byKey.get("skills");
  const toolsQ = byKey.get("tools");

  const selectedTags = new Set<string>();
  if (modeQ && answers.mode) selectedTags.add(answers.mode as string);
  const hoursAnswer = answers.hours as string | undefined;

  const userSkills = new Set<string>();
  if (skillsQ && answers.skills) {
    for (const item of collectAnswerValues(skillsQ, answers.skills)) {
      userSkills.add(item.value);
      item.tags.forEach((t) => selectedTags.add(t));
    }
  }

  const userTools = new Set<string>();
  if (toolsQ && answers.tools) {
    for (const item of collectAnswerValues(toolsQ, answers.tools)) {
      userTools.add(item.value);
      item.tags.forEach((t) => selectedTags.add(t));
    }
  }

  if (hoursQ && answers.hours) {
    for (const item of collectAnswerValues(hoursQ, answers.hours)) item.tags.forEach((t) => selectedTags.add(t));
  }

  const effortAnswer = hoursAnswer ?? "";
  const matchedEffortLevel = effortAnswer.startsWith("lt")
    ? "منخفض"
    : effortAnswer.startsWith("h2to4") || effortAnswer.startsWith("h4to6")
      ? "متوسط"
      : effortAnswer.startsWith("full")
        ? "مرتفع"
        : undefined;

  // Build a lookup of active rules: key = `${questionKey}:${optionValue}:${tag}`
  const ruleMap = new Map<string, number>();
  for (const rule of rules) {
    if (!rule.active) continue;
    ruleMap.set(`${rule.questionKey}:${rule.optionValue}:${rule.tag}`, rule.weight);
  }

  const scored = profiles.map((profile) => {
    const profileTags = new Set(profile.tags ?? []);
    const reasons: string[] = [];

    // --- mode dimension: topic tag overlap ---
    const topicTags = Array.from(profileTags).filter((t) =>
      ["تجارة", "خدمات", "أونلاين", "محتوى", "حرفة", "زراعة", "تعليم", "بيع", "تسويق", "تصميم", "تصوير", "كتابة", "برمجة", "طبخ", "الحرف"].includes(t),
    );
    const selectedTopicTags = topicTags.filter((t) => selectedTags.has(t));
    let modeScore =
      topicTags.length === 0
        ? 60
        : Math.round(Math.min(1, selectedTopicTags.length / Math.max(1, topicTags.length)) * 100);
    if (selectedTopicTags.length > 0) {
      reasons.push(`يناسب اهتمامك في: ${selectedTopicTags.slice(0, 3).join("، ")}`);
    }

    // Apply rule multipliers to mode dimension tags
    if (ruleMap.size > 0) {
      let ruleBoost = 0;
      for (const tag of selectedTopicTags) {
        for (const [qKey, optValue] of Object.entries(answers)) {
          const optValues = Array.isArray(optValue) ? optValue : [optValue];
          for (const ov of optValues) {
            const w = ruleMap.get(`${qKey}:${String(ov)}:${tag}`);
            if (w !== undefined && w !== 0) ruleBoost += (w - 1) * 10;
          }
        }
      }
      modeScore = Math.min(100, Math.max(0, modeScore + Math.round(ruleBoost)));
    }

    // --- effort dimension: hours answer vs profile effort level ---
    let effortScore = 60;
    if (matchedEffortLevel && profile.effortLevel) {
      if (matchedEffortLevel === profile.effortLevel) {
        effortScore = 100;
      } else if (matchedEffortLevel === "مرتفع") {
        effortScore = 75; // full-time can run any profile
      } else if (profile.effortLevel === "منخفض") {
        effortScore = 85; // limited time fits light profiles
      } else {
        effortScore = 55;
      }
    }
    reasons.push(`الوقت المتاح (${matchedEffortLevel ?? "غير محدد"}) مناسب لمشروع بمجهود ${profile.effortLevel}`);

    // --- skills dimension ---
    const skillsRequired = profile.skillsRequired ?? [];
    const skillsMatched = skillsRequired.filter((s) => userSkills.has(s) || selectedTags.has(s));
    let skillsScore = skillsRequired.length === 0 ? 75 : Math.round(Math.min(1, skillsMatched.length / skillsRequired.length) * 100);
    if (skillsMatched.length > 0) {
      reasons.push(`تمتلك المهارة الأساسية: ${skillsMatched.slice(0, 3).join("، ")}`);
    }
    // Apply rule multipliers to skills dimension
    if (ruleMap.size > 0) {
      let skillRuleBoost = 0;
      for (const s of skillsMatched) {
        for (const [qKey, optValue] of Object.entries(answers)) {
          const optValues = Array.isArray(optValue) ? optValue : [optValue];
          for (const ov of optValues) {
            const w = ruleMap.get(`${qKey}:${String(ov)}:${s}`);
            if (w !== undefined && w !== 0) skillRuleBoost += (w - 1) * 10;
          }
        }
      }
      skillsScore = Math.min(100, Math.max(0, skillsScore + Math.round(skillRuleBoost)));
    }

    // --- tools dimension ---
    const toolsNeeded = profile.toolsNeeded ?? [];
    const toolsMatched = toolsNeeded.filter((t) => userTools.has(t) || selectedTags.has(t));
    let toolsScore = toolsNeeded.length === 0 ? 85 : Math.round(Math.min(1, toolsMatched.length / toolsNeeded.length) * 100);
    if (toolsMatched.length > 0) {
      reasons.push(`الوسائل المتوفرة لديك كافية (${toolsMatched.slice(0, 3).join("، ")})`);
    }
    // Apply rule multipliers to tools dimension
    if (ruleMap.size > 0) {
      let toolsRuleBoost = 0;
      for (const t of toolsMatched) {
        for (const [qKey, optValue] of Object.entries(answers)) {
          const optValues = Array.isArray(optValue) ? optValue : [optValue];
          for (const ov of optValues) {
            const w = ruleMap.get(`${qKey}:${String(ov)}:${t}`);
            if (w !== undefined && w !== 0) toolsRuleBoost += (w - 1) * 10;
          }
        }
      }
      toolsScore = Math.min(100, Math.max(0, toolsScore + Math.round(toolsRuleBoost)));
    }

    // --- startability dimension ---
    const startabilityScore = profile.effortLevel === "منخفض" ? 90 : profile.effortLevel === "متوسط" ? 72 : 50;
    if (profile.startCostEstimate === "0 دج" || profile.startCostEstimate.startsWith("أقل")) {
      reasons.push("انطلاق بدون تكلفة مادية تقريباً");
    }

    const w = NO_CAPITAL_DIMENSION_WEIGHTS;
    const totalScore = Math.round(
      (modeScore * w.mode + effortScore * w.effort + skillsScore * w.skills + toolsScore * w.tools + startabilityScore * w.startability) / 100,
    );

    const matchLevel: NoCapitalRecommendation["matchLevel"] = totalScore >= 75 ? "high" : totalScore >= 55 ? "medium" : "low";

    return {
      profile,
      totalScore,
      dimensionScores: { mode: modeScore, effort: effortScore, skills: skillsScore, tools: toolsScore, startability: startabilityScore },
      reasons: reasons.slice(0, 5),
      matchLevel,
    };
  });

  return scored.sort((a, b) => b.totalScore - a.totalScore);
}

export function summarizeRecommendations(recs: NoCapitalRecommendation[]) {
  return recs.map((r) => ({
    slug: r.profile.slug,
    nameAr: r.profile.nameAr,
    totalScore: r.totalScore,
    matchLevel: r.matchLevel,
    reasons: r.reasons,
  }));
}
