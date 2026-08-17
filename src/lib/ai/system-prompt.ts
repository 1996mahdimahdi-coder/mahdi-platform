import type { AIChatRequest } from "./types";

const MAX_CONTEXT_FIELD_LENGTH = 100;

function sanitizeContextValue(value: string): string {
  return value
    .replace(/[\r\n\t]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_CONTEXT_FIELD_LENGTH);
}

function sanitizeSlug(value: string): string {
  return value
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .trim()
    .slice(0, MAX_CONTEXT_FIELD_LENGTH);
}

function sanitizeName(value: string): string {
  return value
    .replace(/[\r\n\t]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 50);
}

export function buildSystemPrompt(context?: AIChatRequest["context"]): string {
  const sections: string[] = [];

  sections.push(`أنت مساعد NABDA الذكي. تساعد المستخدمين في:
- اختيار المشاريع المناسبة (بدون رأس مال، رأس مال منخفض، برأس مال)
- التسويق وأول عميل
- التعلم وتطوير المهارات
- صناعة المحتوى
- الخطط والتنفيذ
- المشاكل المرتبطة بالمشاريع

أنت تقدم إرشادات عامة ومفيدة. أنت لست:
- محامياً
- طبيباً
- مستشاراً مالياً معتمداً

لا تضمن أرباحاً أو نجاحاً. أوضح عندما تكون المعلومة غير مؤكدة.
عند الموضوع القانوني/الطبي/المالي الحساس، أعطِ إرشاداً عاماً وأقترح مختصاً.
لا تخترع مصادر ولا أرقاماً.
أجب بالعربية الفصحى المبسطة مع دعم اللهجة الجزائرية عند الحاجة.`);

  if (context?.currentProject) {
    const slug = sanitizeSlug(context.currentProject);
    if (slug.length >= 2) {
      sections.push(`\nالمستخدم حالياً يتصفح مشروع: ${slug}. ركز على هذا المشروع.`);
    }
  }

  if (context?.currentArticle) {
    const slug = sanitizeSlug(context.currentArticle);
    if (slug.length >= 2) {
      sections.push(`\nالمستخدم يقرأ مقالاً: ${slug}. ركز على محتوى هذا المقال.`);
    }
  }

  if (context?.testResult?.recommendations?.length) {
    const recs = context.testResult.recommendations.slice(0, 5)
      .map((r) => `${sanitizeContextValue(r.nameAr)} (الدرجة: ${r.score})`).join(", ");
    sections.push(`\nنتائج اختبار المستخدم: ${recs}.`);
  }

  if (context?.userName) {
    const name = sanitizeName(context.userName);
    if (name.length >= 1) {
      sections.push(`\nاسم المستخدم: ${name}.`);
    }
  }

  sections.push(`\nعندما تعتمد على محتوى NABDA، أظهر:
> مصدر NABDA: [اسم المشروع/المقال/الخطة]`);

  return sections.join("\n");
}
