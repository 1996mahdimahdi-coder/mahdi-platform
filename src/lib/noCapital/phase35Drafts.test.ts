// PHASE 3.5 — OFFLINE DRAFT CONTENT ARTIFACT (test-only)
//
// PURPOSE: Build the 5 PaidStudy objects IN MEMORY (status=draft), validate
// them, run draft-safety checks, and print per-project research-confidence
// stats. It DOES NOT persist to any database (the no_capital_projects table
// does not exist) and DOES NOT create permanent data files. Run with:
//
//     npx tsx src/lib/noCapital/phase35Drafts.test.ts
//
// This is a test artifact for TypeScript + validation only. It is NOT wired
// into the app and MUST NOT be imported by any production module.
import { emptyPaidStudyDraft, validateStudy, draftSafetyError, shouldRedactStudy } from "@/lib/noCapital/studyValidation";
import type { PaidStudy, StudySourceStatus } from "@/lib/noCapital/types";

const t = (name: string, fn: () => void) => {
  try {
    fn();
    console.log(`  ok - ${name}`);
  } catch (err) {
    console.error(`  FAIL - ${name}`);
    throw err;
  }
};

// ----------------------------------------------------------------------------
// 1) CONTENT-WRITING
// ----------------------------------------------------------------------------
function contentWritingStudy(): PaidStudy {
  const s = emptyPaidStudyDraft();
  return {
    ...s,
    summary: {
      overview:
        "دراسة مدفوعة لبدء مهنة كتابة المحتوى الرقمي من الصفر بدون رأس مال: استهداف العملاء المناسبين، تسعير واقعي، الحصول على أول عميل، حماية العقد، ومسار نمو قابل للتطبيق. تستند الأسعار إلى معايير عالمية وتحتاج تسعير السوق الجزائري إلى تحقق.",
    },
    idealClients: [
      { persona: "شركات ناشئة جزائرية صغيرة", orgType: "startup", platform: "LinkedIn", dzEligible: true, notes: "تحتاج نصوص مواقع وتحسين تواجد رقمي؛ دورة قرار قصيرة." },
      { persona: "وكالات سوشيال ميديا محلية", orgType: "agency", platform: "Instagram", dzEligible: true, notes: "عميل متكرر يطلب نصوصاً أسبوعية ويمكن أن يتحول إلى رتابة شهرية." },
      { persona: "أفراد وأصحاب مشاريع شخصية", orgType: "individual", platform: "X / المدونات", dzEligible: false, notes: "يحتاجون نصوصاً تسويقية ورسائل بريدية." },
      { persona: "شركات أجنبية تبحث عن كتاب عن بعد", orgType: "sme", platform: "منصات العمل الحر", dzEligible: false, notes: "فرصة أوسع لكن منافسة أشد وتتطلب ملفاً قوياً." },
    ],
    skills: {
      minimum: ["كتابة واضحة", "تدقيق نحوي", "البحث الأساسي", "تنسيق العينات"],
      advanced: ["أساسيات SEO", "الكتابة الإعلانية (copywriting)", "النصوص البريدية", "فهم الجمهور"],
    },
    equipment: [
      { item: "هاتف أو حاسوب", tier: "free", purpose: "الكتابة والتواصل", sourceStatus: "VERIFIED" },
      { item: "إنترنت مستقر", tier: "free", purpose: "التواصل وتقديم العروض", sourceStatus: "VERIFIED" },
      { item: "حساب على منصة عمل حر", tier: "free", purpose: "الاطلاع على العملاء وبناء السمعة", sourceStatus: "SUGGESTED" },
      { item: "صفحة محفظة أعمال", tier: "free", purpose: "عرض العينات وبناء الثقة", sourceStatus: "SUGGESTED" },
    ],
    pricing: [
      { model: "per_word", globalMinUsd: 0.05, globalMaxUsd: 0.5, dzPriceStatus: "NEEDS_VALIDATION", source: "منصات العمل الحر — نطاقات عالمية (BENCHMARK)", note: "سعر الكلمة يتباين حسب التخصص والجودة؛ حد أدنى 0.05$ لكل كلمة معياري عالمي للمبتدئين؛ سعر DZD يحتاج تحققاً." },
      { model: "per_project", globalMinUsd: 50, globalMaxUsd: 300, dzPriceStatus: "NEEDS_VALIDATION", source: "تعاقدات مقال أو مشروع (BENCHMARK)", note: "مقال/نص متوسط يبدأ من نحو 50$ عالمياً؛ سعر DZD يحتاج تحققاً." },
      { model: "monthly_retainer", globalMinUsd: 500, globalMaxUsd: 5000, dzPriceStatus: "NEEDS_VALIDATION", source: "رتابة محتوى شهرية عالمية (BENCHMARK)", note: "نطاق واسع حسب الحجم؛ يبدأ من نحو 500$ شهرياً عالمياً؛ سعر DZD يحتاج تحققاً." },
    ],
    profitModel: {
      priceAnchor: "تسعير لكل مشروع أو كلمة بعد تقدير ساعات العمل",
      hoursPerUnit: 1,
      grossPerHour: 15,
      breakEvenUnits: 1,
      notes: "أرقام استرشادية فقط (تقدير عالمي). الدخل الفعلي يعتمد على عدد العملاء وساعات الكتابة. لا وعود دخل مضمون.",
    },
    businessModel: {
      offerModel: "عرض كتابة يبدأ بحزمة صغيرة (مقالة أو نص) ثم يتوسع.",
      valueProposition: "نصوص تساعد العميل على البيع، لا مجرد كتابة عامة.",
      repeatClientStrategy: "تسليم في الموعد، تقارير محتوى، واقتراح خدمات إضافية (بريدي، SEO).",
    },
    firstClientAcquisition: [
      { channel: "أعمال حرة عبر الإنترنت", difficulty: "medium", outreachTargetCount: 10, messageScript: "عرض مخصص مع عينات ذات صلة بمجال العميل.", followUpScript: "متابعة بعد 3-4 أيام إن لم يصدر رد." },
      { channel: "شبكة أعمال محلية", difficulty: "low", outreachTargetCount: 5, messageScript: "عرض تحسين نصوص أعمال محلية معروفة.", followUpScript: "متابعة برسالة قصيرة مع مثال مجاني محدود." },
      { channel: "مواقع ووكالات تحتاج محتوى", difficulty: "medium", outreachTargetCount: 10, messageScript: "عرض حل لمشكلة محتوى محددة.", followUpScript: "متابعة لمرة واحدة فقط." },
    ],
    workflow: [
      { stage: "استقبال الطلب", detail: "فهم المطلوب واللغات والهدف والجمهور.", deliverable: "موجز طلب واضح" },
      { stage: "البحث والتخطيط", detail: "مخطط أو خطوط عريضة قبل الكتابة.", deliverable: "مخطط النص" },
      { stage: "الكتابة", detail: "كتابة النص وفق الموجز والجمهور.", deliverable: "مسودة" },
      { stage: "المراجعة", detail: "مراجعة أسلوبية ونحوية ذاتية ثم رد العميل.", deliverable: "نسخة نهائية" },
      { stage: "التسليم والفوترة", detail: "تسليم نهائي وفاتورة ومتابعة للتغذية الراجعة.", deliverable: "فاتورة + ملخص التعديلات" },
    ],
    marketCompetition: [
      { segment: "كتّاب عامون في منصات العمل الحر", intensity: "high", positioning: "تخصص في صناعة أو نوع محدد لتخفيف المنافسة السعرية.", notes: "المنافسة على السعر في الأعمال العامة عالية؛ التخصص يخففها." },
      { segment: "كتّاب محليون جزائريون", intensity: "medium", positioning: "سرعة الرد بالعربية والفرنسية وفهم السوق المحلي.", notes: "حجم السوق غير مؤكد — NEEDS_VALIDATION." },
    ],
    commonMistakes: [
      { mistake: "تسعير منخفض جداً بحثاً عن أول عميل", prevention: "التسعير حسب القيمة والساعات، لا قبول أي عرض." },
      { mistake: "لا عينات أو عينات ضعيفة", prevention: "تجهيز خمس عينات قبل طلب أول عميل." },
      { mistake: "قبول طلبات غير واضحة", prevention: "تأكيد الموجز كتابياً قبل البدء." },
      { mistake: "لا عقد أو شروط دفع", prevention: "توثيق الشروط وطلب دفعة أولى." },
    ],
    redFlags: [
      { flag: "طلب 'اكتب ما شئت' مع عجلة", why: "دلالة على غياب وضوح الهدف.", protection: "الطلب بتأكيد الموجز كتابياً." },
      { flag: "دفع مقابل التسجيل أو 'جدوى'", why: "طلب يصرفه كرسوم وهمية.", protection: "رفض أي دفع مسبق للتسجيل." },
      { flag: "رفض دفع دفعة أولى", why: "خطر عدم السداد بعد التسليم.", protection: "جزء من الدفع مقدماً للمشاريع الكبيرة." },
    ],
    marketing: {
      channels: ["LinkedIn", "Instagram", "منصات العمل الحر", "مجموعات أعمال محلية"],
      contentTypes: ["عينات نصوص", "نصائح كتابة قصيرة", "دراسات مصغرة"],
      cta: "احجز خدمة كتابة تجريبية",
      kpis: ["عدد الردود على العروض", "عدد عملاء المحاولة الأولى", "نسبة العميل المتكرر"],
    },
    plan30Days: [
      { week: 1, tasks: ["تحديد تخصص الكتابة", "تجهيز خمس عينات", "بناء الملف الشخصي"], outreach: [], content: ["منشور واحد"], kpis: ["ملف جاهز", "عينات كاملة"] },
      { week: 2, tasks: ["إرسال العروض على منصات العمل الحر", "إرسال رسائل لأعمال محلية"], outreach: ["5-10 عروض أو رسائل"], content: ["منشور أسبوعي"], kpis: ["عدد العروض المرسلة"] },
      { week: 3, tasks: ["متابعة العروض", "إعداد مقترح مخصص لكل مهتم"], outreach: ["متابعات العروض"], content: ["محتوى ثبات"], kpis: ["عدد الحوارات الجديدة"] },
      { week: 4, tasks: ["إغلاق أول عميل", "تحسين تقديم العروض", "تصميم خطة عميل متكرر"], outreach: ["متابعة العملاء المحاورين"], content: ["إعادة نشر العينات"], kpis: ["أول عميل", "بداية رتابة محتملة"] },
    ],
    growthPath: [
      { from: "كتابة عامة", to: "تخصص في صناعة معينة", tactic: "نشر عينات متخصصة واستهداف عميل محدد." },
      { from: "مشاريع منفردة", to: "رتابة شهرية", tactic: "اقتراح حزم شهرية وإظهار قيمة الرسالية." },
      { from: "بضعة عملاء", to: "وكالة محتوى مصغرة", tactic: "الاستعانة بكتّاب فرعيين مع رفع السعر النهائي." },
    ],
    legalDz: {
      autoEntrepreneur: "نشاطات رقمية معينة مثل كتابة المحتوى والخدمات الرقمية يمكن أن تدخل ضمن نظام المقاول الذاتي وفق قائمة ANAE؛ يجب التحقق من النشاط المحدد والوضع القانوني الحالي قبل التسجيل.",
      ifu: "تحتاج تحققاً من مصدر رسمي.",
      casnos: "تحتاج تحققاً من مصدر رسمي.",
      tva: "تحتاج تحققاً من مصدر رسمي.",
      crypto: "لا تُستخدم العملات المشفرة كوسيلة دفع للعملاء في الجزائر دون التحقق القانوني؛ التشريعات الجزائرية الحديثة تتضمن حظراً وعقوبات مرتبطة بالعملات الافتراضية.",
      notes: "أهليّة المقاول الذاتي للخدمات الرقمية مؤكدة وفق ANAE؛ IFU/CASNOS/TVA ما زالت تحتاج تأكيداً من مصدر رسمي — needsValidation = true.",
      needsValidation: true,
    },
    caseStudy: {
      scenario: "سيناريو توضيحي (SAMPLE) — كاتب مبتدئ يبدأ بتخصص نصوص وصف المنتجات لمتاجر إلكترونية.",
      inputs: ["متجران محليان يحتاجان وصف منتجات"],
      outcome: "توضيح كيفية بناء الرسالة الأولى، إغلاق صفقة صغيرة، وتحويلها لعميل متكرر. أرقام افتراضية توضيحية فقط ولا بيانات حقيقية.",
      isSample: true,
    },
    sources: [
      { title: "معايير تسعير عالمية على منصات العمل الحر (EFA/EarnifyHub)", url: "https://www.the-efa.org/rates/", sourceType: "BENCHMARK", verifiedAt: "2026-09-04", notes: "نطاقات متغيرة؛ تُستخدم كمرجع استراتيجي لا كتسعير DZD." },
      { title: "أفضل ممارسات بناء محفظة الأعمال", url: "", sourceType: "REFERENCE" },
    ],
    meta: { paidValueScore: 7, researchVersion: "PHASE_3.5_DRAFT" },
  };
}

// ----------------------------------------------------------------------------
// 2) TRANSLATION
// ----------------------------------------------------------------------------
function translationStudy(): PaidStudy {
  const s = emptyPaidStudyDraft();
  return {
    ...s,
    summary: {
      overview:
        "دراسة مدفوعة لبدء مهنة الترجمة بدون رأس مال: التخصص واللغات، تسعير لكل كلمة مصدر مع حد أدنى للرسوم، أدوات الترجمة بمساعدة الحاسوب (CAT)، الحصول على أول عميل، وتوثيق العقد. الأسعار العالمية معايير مرجعية والسعر الجزائري يحتاج تحققاً.",
    },
    idealClients: [
      { persona: "شركات تحتاج ترجمة وثائق رسمية", orgType: "company", dzEligible: true, notes: "عقود وفواتير ومواد تسويقية؛ دورة قرار أبطأ لكن قيمة أعلى." },
      { persona: "مكاتب ترجمة محلية تُسنِد العمل", orgType: "agency", dzEligible: true, notes: "ممر دخول للمبتدئين؛ عميل متكرر." },
      { persona: "أفراد وطلبة بحاجة ترجمة وقرارات", orgType: "individual", platform: "منصات/مباشرة", dzEligible: true, notes: "مشاريع صغيرة لبناء السمعة." },
      { persona: "علامات تجارية بمحتوى متعدد اللغات", orgType: "sme", platform: "عبر الإنترنت", dzEligible: false, notes: "مواقع ومنتجات؛ فرصة دولية عبر منصات العمل الحر." },
    ],
    skills: {
      minimum: ["إتقان لغتين على الأقل", "كتابة واضحة باللغة الهدف", "دقة وتدقيق"],
      advanced: ["تخصص (قانوني، طبي، تقني)", "أدوات CAT", "تحرير ومراجعة نهائية"],
    },
    equipment: [
      { item: "حاسوب", tier: "pro", purpose: "الكتابة والترجمة والمصالحة", sourceStatus: "VERIFIED" },
      { item: "إنترنت مستقر", tier: "free", purpose: "البحث والتواصل", sourceStatus: "VERIFIED" },
      { item: "قاموس وقوائم مصطلحات", tier: "free", purpose: "اتساق المصطلحات", sourceStatus: "SUGGESTED" },
      { item: "أداة CAT مجانية أو مدفوعة", tier: "pro", purpose: "زيادة الإنتاجية والاتساق", sourceStatus: "BENCHMARK" },
    ],
    pricing: [
      { model: "per_word", globalMinUsd: 0.08, globalMaxUsd: 0.3, dzPriceStatus: "NEEDS_VALIDATION", source: "معيار عالمي لكل كلمة مصدر (BENCHMARK)", note: "نطاق عالمي؛ حد أدنى 0.08$ لكل كلمة معياري للترجمة العامة؛ سعر DZD لكل كلمة يحتاج تحققاً." },
      { model: "per_project", globalMinUsd: 10, globalMaxUsd: 100, dzPriceStatus: "NEEDS_VALIDATION", source: "مشاريع صغيرة", note: "تسعير لكل وثيقة أو مشروع صغير؛ سعر DZD يستحق تحققاً للترجمة الحرة." },
      { model: "package", globalMinUsd: 20, globalMaxUsd: 150, dzPriceStatus: "BENCHMARK", source: "ترجمة وثائق رسمية/معتمدة — جهة تجارية جزائرية (BENCHMARK)", dzSuggestedDzd: 700, note: "ترجمة وثائق رسمية/معتمدة تبلغ تقريباً 648–777.6 دج لكل وثيقة (مصدر تجاري جزائري)؛ ليس سعراً عاماً للترجمة الحرة." },
    ],
    profitModel: {
      priceAnchor: "رسوم حد أدنى لكل مشروع تضمن ساعات عمل مجدية.",
      hoursPerUnit: 0.5,
      grossPerHour: 20,
      breakEvenUnits: 1,
      notes: "أرقام استرشادية (معيار عالمي) فقط. الدخل يعتمد على الطلبات والإنتاجية. لا وعود دخل.",
    },
    businessModel: {
      offerModel: "ابدأ بتخصص واحد؛ ثم اقترح خدمة ترجمة متخصصة مع مراجعة نهائية.",
      valueProposition: "ترجمة دقيقة في وقت محدد وبمسرد مصطلحات ثابت.",
      repeatClientStrategy: "تسليم في الموعد، تقارير جودة، واقتراح خدمة مراجعة دورية.",
    },
    firstClientAcquisition: [
      { channel: "مكاتب ترجمة محلية", difficulty: "low", outreachTargetCount: 4, messageScript: "عرض خدماتك لمهام صغيرة وبناء علاقة عمل.", followUpScript: "متابعة أسبوعية لطيفة." },
      { channel: "منصات عمل حر أجنبية", difficulty: "medium", outreachTargetCount: 10, messageScript: "تخصص في لغة أو مجال وتقديم عينة.", followUpScript: "متابعة لمرة واحدة." },
      { channel: "شركات بمحتوى متعدد اللغات", difficulty: "high", outreachTargetCount: 6, messageScript: "عرض ترجمة تجريبية لصفحة نموذجية.", followUpScript: "متابعة بعد خمسة أيام." },
    ],
    workflow: [
      { stage: "استلام المستند", detail: "تأكيد اللغة والمصدر والمجال وعدد الكلمات.", deliverable: "تأكيد المطلوب" },
      { stage: "التسعير والموعد", detail: "تحديد السعر والموعد بمعايير واضحة.", deliverable: "عرض سعر مكتوب" },
      { stage: "الترجمة", detail: "الترجمة مع مسرد مصطلحات واتساق الأسماء.", deliverable: "مسودة مترجمة" },
      { stage: "المراجعة", detail: "مراجعة لغوية وتدقيق نهائي.", deliverable: "نسخة نهائية" },
      { stage: "التسليم", detail: "تسليم للعميل مع فاتورة وتغذية راجعة.", deliverable: "فاتورة" },
    ],
    marketCompetition: [
      { segment: "مترجمون عامون", intensity: "high", positioning: "تخصص في لغة أو مجال لتخفيف منافسة الكلمة.", notes: "المنافسة العامة شديدة." },
      { segment: "سوق محلي (عربية/فرنسية)", intensity: "medium", positioning: "إتقان السياق المحلي وفروق الترجمة.", notes: "حجم السوق غير مؤكد — NEEDS_VALIDATION." },
    ],
    commonMistakes: [
      { mistake: "تسعير لكل كلمة دون حد أدنى", prevention: "فرض حد أدنى يمنع مشاريع غير مجدية." },
      { mistake: "تجاهل التخصص", prevention: "اختيار مجال يخفف المنافسة ويرفع السعر." },
      { mistake: "ترجمة حرفية", prevention: "الترجمة حسب المعنى لا الشكل." },
      { mistake: "لا مسرد مصطلحات", prevention: "إعداد مسرد مصطلحات لكل عميل." },
    ],
    redFlags: [
      { flag: "طلب دفع رسوم تسجيل", why: "قد لا يكون لهدف عمل حقيقي.", protection: "رفض أي دفع مسبق للتسجيل." },
      { flag: "عميل لا يقبل حداً أدنى", why: "مشاريع صغيرة جداً وعالية الإجهاد.", protection: "رفض بأدب واقتراح مشروع أصغر." },
      { flag: "وعد بكميات هائلة دون تعاقد", why: "قد يستهدف عملاً شبه مجاني أو عيّنات متكررة.", protection: "تحديد نطاق العمل كتابياً." },
    ],
    marketing: {
      channels: ["LinkedIn", "منصات العمل الحر", "مكاتب الترجمة المحلية"],
      contentTypes: ["عينات ترجمة", "أدلة المصطلحات", "مقالات عن الترجمة"],
      cta: "اطلب ترجمة تجريبية",
      kpis: ["عدد عروض الترجمة", "نسبة تحويل العروض", "طلبات متكررة"],
    },
    plan30Days: [
      { week: 1, tasks: ["تحديد أزواج اللغات والتخصص", "تجهيز ثلاث عينات مترجمة", "تثبيت أداة CAT"], outreach: [], content: [], kpis: ["عينات جاهزة"] },
      { week: 2, tasks: ["إرسال عروض لمكاتب ترجمة", "نشر مقترحات في منصات العمل الحر"], outreach: ["4-6 مكاتب", "3-6 عروض"], content: ["منشور حول التخصص"], kpis: ["عدد العروض المرسلة"] },
      { week: 3, tasks: ["متابعة العروض والرد", "التفاوض على أول مشروع"], outreach: ["متابعات"], content: ["تحديث العينات"], kpis: ["عدد الحوارات"] },
      { week: 4, tasks: ["تسليم أول مشروع", "تحسين جودة التسليم", "طلب تقييم أو توصية"], outreach: ["متابعة العملاء الجدد"], content: [], kpis: ["أول عميل", "مراجعة إيجابية"] },
    ],
    growthPath: [
      { from: "ترجمة عامة", to: "تخصص محدد", tactic: "نشر عينات تخصص واستهداف المتخصصين." },
      { from: "مشاريع صغيرة", to: "علاقات متكررة مع مكاتب", tactic: "تسليم موثوق في الموعد يبني الثقة." },
      { from: "مترجم منفرد", to: "فريق ترجمة مصغر", tactic: "تولي مشاريع أكبر والاستعانة بمراجعين." },
    ],
    legalDz: {
      autoEntrepreneur: "الترجمة العامة/التجارية يمكن أن تدخل ضمن الخدمات الموجهة للمؤسسات وفق قائمة ANAE، لكن الترجمة العامة ليست نفسها مهنة المترجم المحلف أو المترجم المعتمد؛ المهن المنظمة لها إطار مختلف ولا ينبغي تقديمها على أنها مشمولة تلقائياً بنظام المقاول الذاتي. تحقق من النشاط المحدد قبل التسجيل.",
      ifu: "تحتاج تحققاً من مصدر رسمي.",
      casnos: "تحتاج تحققاً من مصدر رسمي.",
      tva: "تحتاج تحققاً من مصدر رسمي.",
      crypto: "لا تُستخدم العملات المشفرة كوسيلة دفع للعملاء في الجزائر دون التحقق القانوني؛ التشريعات الجزائرية الحديثة تتضمن حظراً وعقوبات مرتبطة بالعملات الافتراضية.",
      notes: "أهليّة المقاول الذاتي محدودة بالترجمة العامة/التجارية وليست للمهن المنظمة (المترجم المحلف/المعتمد)؛ IFU/CASNOS/TVA ما زالت تحتاج تأكيداً رسمياً — needsValidation = true.",
      needsValidation: true,
    },
    caseStudy: {
      scenario: "سيناريو توضيحي (SAMPLE) — مترجم مبتدئ يبدأ بترجمة عربية/فرنسية لمكتب ترجمة محلي.",
      inputs: ["ثلاث وثائق صغيرة", "أداة CAT"],
      outcome: "توضيح بناء السمعة عبر مكاتب محلية وتباعد طلبات الترجمة؛ الأرقام توضيحية فقط.",
      isSample: true,
    },
    sources: [
      { title: "معايير تسعير الترجمة عالمياً (FreelanceDesk)", url: "https://freelancedesk.online", sourceType: "BENCHMARK", verifiedAt: "2026-09-04", notes: "لكل كلمة مصدر؛ نطاقات متغيرة." },
      { title: "ترجمة الوثائق الرسمية في الجزائر (Fast4Trans)", url: "https://fast4trans.com", sourceType: "BENCHMARK", verifiedAt: "2026-09-04", notes: "وثائق رسمية/معتمدة تقريباً 648–777.6 دج لكل وثيقة — معيار تجاري جزائري وليس سعراً عاماً للترجمة الحرة." },
      { title: "أهلية الترجمة ضمن المقاول الذاتي (ANAE)", url: "https://anae.dz", sourceType: "OFFICIAL", verifiedAt: "2026-09-04", notes: "الترجمة العامة ضمن الخدمات الموجهة للمؤسسات؛ المهن المنظمة خارج النطاق." },
      { title: "أفضل ممارسات أدوات CAT والتخصص", url: "https://www.polilingua.com/blog/post/cat_tools.htm", sourceType: "REFERENCE", verifiedAt: "2026-09-04" },
    ],
    meta: { paidValueScore: 7, researchVersion: "PHASE_3.5_DRAFT" },
  };
}

// ----------------------------------------------------------------------------
// 3) GRAPHIC DESIGN
// ----------------------------------------------------------------------------
function graphicDesignStudy(): PaidStudy {
  const s = emptyPaidStudyDraft();
  return {
    ...s,
    summary: {
      overview:
        "دراسة مدفوعة لبدء عمل التصميم الجرافيكي بدون رأس مال عبر أدوات مجانية: حزم الشعار والهوية والسوشيال، التسعير وعدد المراحل والترخيص، الحصول على أول عميل، وحماية حقوق التصميم. الأسعار العالمية معايير مرجعية والسعر الجزائري مُدعَّم بأمثلة سوقية (Bricoram/Piteur) كامرجعية وليست سعراً إلزامياً.",
    },
    idealClients: [
      { persona: "شركات ناشئة بحاجة هوية بصرية", orgType: "startup", dzEligible: true, notes: "شعار وألوان وقوالب؛ أعلى قيمة." },
      { persona: "متاجر إلكترونية بحاجة قوالب سوشيال", orgType: "ecommerce", dzEligible: true, notes: "منشورات وقوالب مستمرة." },
      { persona: "أفراد ومشاريع شخصية", orgType: "individual", dzEligible: true, notes: "مشاريع صغيرة لبناء المحفظة." },
      { persona: "وكالات تسويق تُسنِد التصميم", orgType: "agency", dzEligible: false, notes: "استعانة خارجية للعمل الإضافي." },
    ],
    skills: {
      minimum: ["أساسيات التخطيط والألوان", "استخدام Canva أو Figma أو GIMP", "تصدير ملفات بأحجام مناسبة"],
      advanced: ["الهوية البصرية", "نظرية الألوان والطباعة", "إدارة مراجعات العميل"],
    },
    equipment: [
      { item: "حاسوب", tier: "pro", purpose: "التصميم والتصدير", sourceStatus: "VERIFIED" },
      { item: "أدوات مجانية (Canva/Figma/GIMP)", tier: "free", purpose: "بدون تكلفة انطلاق", sourceStatus: "VERIFIED" },
      { item: "إنترنت مستقر", tier: "free", purpose: "التواصل والرفع", sourceStatus: "VERIFIED" },
      { item: "قالب عقد وترخيص تصميم", tier: "pro", purpose: "حماية الحقوق", sourceStatus: "SUGGESTED" },
    ],
    pricing: [
      { model: "per_project", globalMinUsd: 300, globalMaxUsd: 5000, dzPriceStatus: "BENCHMARK", source: "شعارات وهويات عالمياً (BENCHMARK)", dzSuggestedDzd: 6000, note: "شعار بسيط يبدأ من نحو 300$ عالمياً وحتى 5000$؛ في السوق الجزائري شعار freelance يتراوح تقريباً بين 1,000–12,000 دج والاستوديوهات أعلى بكثير (Bricoram/Piteur) — أمثلة من السوق وليست سعراً إلزامياً." },
      { model: "package", globalMinUsd: 300, globalMaxUsd: 10000, dzPriceStatus: "BENCHMARK", source: "هوية بصرية عالمياً (BENCHMARK)", dzSuggestedDzd: 40000, note: "حزمة الهوية العالمية من 300$ وحتى 10,000$+؛ الهوية البصرية الجزائرية من حوالي 40,000 دج حسب المحترفين (Bricoram/Piteur) — أمثلة سوقية وليست إلزامية." },
      { model: "monthly_retainer", globalMinUsd: 500, globalMaxUsd: 2500, dzPriceStatus: "BENCHMARK", source: "رتابة تصميم شهرية (BENCHMARK)", dzSuggestedDzd: 1500, note: "منشور سوشيال جزائري حوالي 1,500 دج للواحد/باقة شهرية؛ النطاق حسب حجم النشر — أمثلة سوقية وليست سعراً موحداً." },
    ],
    profitModel: {
      priceAnchor: "تسعير المشاريع حسب النطاق ومستوى الاستخدام (تجاري أو شخصي).",
      hoursPerUnit: 3,
      grossPerHour: 25,
      breakEvenUnits: 1,
      notes: "قيم استرشادية نموذجية فقط. لا وعود دخل.",
    },
    businessModel: {
      offerModel: "حزم واضحة: شعار فقط، هوية كاملة، أو حزمة سوشيال. بدل مشاريع مفتوحة.",
      valueProposition: "تصميم يبني هوية متسقة ويسرّع إدراك العلامة تجارياً.",
      repeatClientStrategy: "باقات تعديل، قوالب شهرية، وترقية الحزمة مع نمو العلامة.",
    },
    firstClientAcquisition: [
      { channel: "شبكة أعمال محلية", difficulty: "low", outreachTargetCount: 6, messageScript: "عرض تحسين عنصر بصري واحد مقابل رمزية أو مجاناً.", followUpScript: "متابعة بعد خمسة أيام." },
      { channel: "منصات عمل حر", difficulty: "medium", outreachTargetCount: 10, messageScript: "مشاريع شعار أو سوشيال صغيرة لبناء التقييمات.", followUpScript: "متابعة لمرة واحدة." },
      { channel: "متاجر إلكترونية", difficulty: "medium", outreachTargetCount: 8, messageScript: "عرض تحديث منشورات أو قوالب سوشيال.", followUpScript: "متابعة بعد أربعة أيام." },
    ],
    workflow: [
      { stage: "موجز التصميم", detail: "تحديد الهدف والجمهور والمراجع.", deliverable: "موجز مكتوب" },
      { stage: "عرض السعر ومراحل التعديل", detail: "تحديد عدد مرات التعديل رسمياً.", deliverable: "عرض سعر ومراحل" },
      { stage: "التصميم الأولي", detail: "اقتراح مفاهيم ومسودات.", deliverable: "مسودات" },
      { stage: "التعديلات", detail: "تطبيق التعديلات ضمن المراحل المتفق عليها.", deliverable: "نسخة محدثة" },
      { stage: "التسليم والترخيص", detail: "تسليم الملفات ونقل الحقوق مقابل السعر.", deliverable: "ملفات وفاتورة" },
    ],
    marketCompetition: [
      { segment: "مصممون عامون", intensity: "high", positioning: "تخصص في الهوية البصرية أو السوشيال بدل التصميم العام.", notes: "منافسة سعرية عالية في الأسواق العامة." },
      { segment: "سوق محلي (هويات الشركات الجزائرية)", intensity: "medium", positioning: "فهم الذوق واللغة المحليين.", notes: "حجم السوق غير مؤكد — NEEDS_VALIDATION." },
    ],
    commonMistakes: [
      { mistake: "تعديلات بلا نهاية", prevention: "تحديد عدد مرات التعديل في العرض." },
      { mistake: "تسليم ملفات فوضوية", prevention: "تنظيم الملفات والتصدير بمعايير واضحة." },
      { mistake: "تسعير منخفض جداً", prevention: "التسعير حسب النطاق والاستخدام." },
      { mistake: "التخلي عن الحقوق بسعر منخفض", prevention: "تمييز سعر الاستخدام التجاري عن الشخصي." },
    ],
    redFlags: [
      { flag: "طلب غير واضح مع عجلة", why: "قد يكون عمل شبه مجاني بلا موجز.", protection: "تأكيد الموجز والدفعة الأولية." },
      { flag: "رغبة في تجربة مجانية بلا نطاق", why: "قد يتوسع العمل بلا حدود.", protection: "عرض عينة محدودة بنطاق واضح." },
      { flag: "عدم قبول مراحل تعديل محددة", why: "خطر التعديل المفتوح بلا نهاية.", protection: "توثيق المراحل كتابياً." },
    ],
    marketing: {
      channels: ["Instagram / Behance / Dribbble", "LinkedIn", "منصات العمل الحر"],
      contentTypes: ["قبل وبعد", "دراسات هوية", "عمليات التصميم"],
      cta: "احجز تصميم هوية أو حزمة",
      kpis: ["استفسارات الهوية", "تحويل الحزم", "عملاء متكررون"],
    },
    plan30Days: [
      { week: 1, tasks: ["اختيار الأداة", "تصميم خمسة تصاميم تجريبية", "بناء المعرض"], outreach: [], content: ["منشور قبل وبعد"], kpis: ["معرض جاهز"] },
      { week: 2, tasks: ["تحديد الحزم والأسعار", "إرسال عروض لأعمال محلية"], outreach: ["5-8 عروض"], content: ["منشور هوية"], kpis: ["عدد العروض"] },
      { week: 3, tasks: ["متابعة العروض", "الرد على الاستفسارات", "تجهيز العقد والترخيص"], outreach: ["متابعات"], content: [], kpis: ["حوارات جديدة"] },
      { week: 4, tasks: ["إغلاق أول مشروع", "التسليم والفاتورة", "طلب توصية"], outreach: ["متابعة العملاء"], content: ["إعادة نشر الأعمال"], kpis: ["أول مشروع", "توصية"] },
    ],
    growthPath: [
      { from: "تصميم عام", to: "تخصص هوية وسوشيال", tactic: "عرض أعمال متخصصة فقط." },
      { from: "مشاريع منفردة", to: "حزمة شهرية", tactic: "بيع حزم سوشيال متكررة." },
      { from: "مصمم", to: "استوديو صغير", tactic: "الاستعانة بمنتجين ورفع سعر التسليم النهائي." },
    ],
    legalDz: {
      autoEntrepreneur: "التصميم الجرافيكي من النشاطات الرقمية المذكورة ضمن منتجات المقاول الذاتي وفق قائمة ANAE؛ يجب التحقق من النشاط المحدد والوضع القانوني الحالي قبل التسجيل.",
      ifu: "تحتاج تحققاً من مصدر رسمي.",
      casnos: "تحتاج تحققاً من مصدر رسمي.",
      tva: "تحتاج تحققاً من مصدر رسمي.",
      crypto: "لا تُستخدم العملات المشفرة كوسيلة دفع للعملاء في الجزائر دون التحقق القانوني؛ التشريعات الجزائرية الحديثة تتضمن حظراً وعقوبات مرتبطة بالعملات الافتراضية.",
      notes: "أهليّة المقاول الذاتي للتصميم مؤكدة وفق ANAE؛ IFU/CASNOS/TVA ما زالت تحتاج تأكيداً رسمياً — needsValidation = true.",
      needsValidation: true,
    },
    caseStudy: {
      scenario: "سيناريو توضيحي (SAMPLE) — مصمم يبدأ بحزمة هوية بصرية مبسطة لمقهى محلي.",
      inputs: ["موجز بسيط", "أداة مجانية"],
      outcome: "توضيح مراحل الهوية وعدد المراحل ونقل الحقوق؛ أرقام توضيحية فقط.",
      isSample: true,
    },
    sources: [
      { title: "معايير تسعير التصميم والهوية عالمياً (SmashingApps/SoloPricing)", url: "https://www.smashingapps.com", sourceType: "BENCHMARK", verifiedAt: "2026-09-04", notes: "نطاقات متغيرة حسب التعقيد؛ الشعار من 300$ عالمياً." },
      { title: "أسعار التصميم في السوق الجزائري (Bricoram)", url: "https://bricoram.com/service/infographie", sourceType: "BENCHMARK", verifiedAt: "2026-09-04", notes: "شعار freelance 1,000–12,000 دج؛ هوية من 40,000 دج؛ منشور سوشيال 1,500 دج — أمثلة من السوق الجزائري." },
      { title: "تسعير الشعار في استوديو جزائري (Piteur Studio)", url: "https://www.piteur-studio.dz/blog/cout-logo-ar", sourceType: "BENCHMARK", verifiedAt: "2026-09-04", notes: "شعار 70,000–130,000 دج وهوية من 200,000 دج على مستوى الاستوديوهات." },
      { title: "قوالب عقد وترخيص التصميم", url: "", sourceType: "REFERENCE" },
      { title: "أهلية التصميم ضمن المقاول الذاتي (ANAE)", url: "https://anae.dz", sourceType: "OFFICIAL", verifiedAt: "2026-09-04" },
    ],
    meta: { paidValueScore: 8, researchVersion: "PHASE_3.5_DRAFT" },
  };
}

// ----------------------------------------------------------------------------
// 4) VIDEO EDITING
// ----------------------------------------------------------------------------
function videoEditingStudy(): PaidStudy {
  const s = emptyPaidStudyDraft();
  return {
    ...s,
    summary: {
      overview:
        "دراسة مدفوعة لبدء عمل المونتاج بدون رأس مال: حزم مونتاج الفيديو، سير العمل، عدد مراحل التعديل، المونتاج القصير والحركات البصرية، والحصول على أول عميل. الأسعار العالمية معايير مرجعية والسعر الجزائري مُدعَّم بأمثلة سوقية (Bricoram) كمرجعية وليست سعراً إلزامياً.",
    },
    idealClients: [
      { persona: "صنّاع محتوى على يوتيوب وTikTok", orgType: "creator", dzEligible: true, notes: "حزم مونتاج دورية." },
      { persona: "شركات تحتاج فيديوهات تسويقية", orgType: "sme", dzEligible: true, notes: "مونتاج إعلانات أو عروض منتجات." },
      { persona: "وكالات إنتاج وتسويق", orgType: "agency", dzEligible: false, notes: "استعانة بمونتير خارجي." },
      { persona: "أفراد وحفلات ومناسبات", orgType: "individual", dzEligible: true, notes: "مونتاج مناسبات للدخول إلى السوق." },
    ],
    skills: {
      minimum: ["أساسيات المونتاج", "استخدام برنامج مونتاج", "القص والمزامنة الصوتية"],
      advanced: ["الحركات البصرية (motion graphics)", "تصحيح الألوان", "رواية القصة عبر المونتاج"],
    },
    equipment: [
      { item: "حاسوب متوسط القدرة", tier: "pro", purpose: "المونتاج والتصدير", sourceStatus: "VERIFIED" },
      { item: "برنامج مونتاج (مجاني أو مدفوع)", tier: "free", purpose: "بدون تكلفة انطلاق", sourceStatus: "VERIFIED" },
      { item: "تخزين خارجي", tier: "pro", purpose: "نسخ احتياطي للمشاريع", sourceStatus: "SUGGESTED" },
      { item: "إنترنت مستقر", tier: "free", purpose: "استلام المواد ورفع النتائج", sourceStatus: "VERIFIED" },
    ],
    pricing: [
      { model: "per_minute", globalMinUsd: 50, globalMaxUsd: 500, dzPriceStatus: "BENCHMARK", source: "مونتاج لكل دقيقة منجزة عالمياً (BENCHMARK)", dzSuggestedDzd: 3000, note: "المونتاج يبدأ من نحو 50$ للدقيقة عالمياً وحتى 500$ للجودة العالية؛ في السوق الجزائري المونتاج/post-production يتراوح تقريباً 1,500–7,000 دج للدقيقة (متوسط 3,000) — يختلف حسب التعقيد والمؤثرات." },
      { model: "per_project", globalMinUsd: 20, globalMaxUsd: 100, dzPriceStatus: "BENCHMARK", source: "فيديوهات سوشيال (BENCHMARK)", dzSuggestedDzd: 4000, note: "فيديو سوشيال قصير يبدأ من 20$ عالمياً؛ فيديو الإعلان الاجتماعي جزائرياً حوالي 600–9,200 دج للفيديو (متوسط 4,000) — يختلف حسب التعقيد." },
      { model: "package", globalMinUsd: 200, globalMaxUsd: 2500, dzPriceStatus: "SUGGESTED", source: "باقات فيديو بالجملة (SUGGESTED)", note: "باقات الفيديوهات القصيرة تبدأ من نحو 200$؛ يُستعان بها استرشادياً وليس سعراً محدداً للسوق." },
    ],
    profitModel: {
      priceAnchor: "التسعير لكل دقيقة منجزة أو الحزمة بعد تقدير ساعات المونتاج.",
      hoursPerUnit: 3,
      grossPerHour: 20,
      breakEvenUnits: 1,
      notes: "قيم استرشادية فقط؛ مونتاج معقد يحتاج ساعات أكبر. لا وعود دخل.",
    },
    businessModel: {
      offerModel: "ابدأ بحزمة قصيرة متكررة ثم وسّع إلى فيديوهات أطول.",
      valueProposition: "مونتاج يرفع تفاعل الجمهور ضمن أسلوب معتمد.",
      repeatClientStrategy: "تسليم متسق وفهم أسلوب كل صانع محتوى.",
    },
    firstClientAcquisition: [
      { channel: "صنّاع محتوى محليون", difficulty: "medium", outreachTargetCount: 6, messageScript: "عرض مونتاج أول مقطع قصير مقابل رمزية أو مجاناً للمحفظة.", followUpScript: "متابعة بعد أربعة أيام." },
      { channel: "منصات عمل حر", difficulty: "medium", outreachTargetCount: 8, messageScript: "مشاريع مونتاج قصيرة لبناء التقييمات.", followUpScript: "متابعة لمرة واحدة." },
      { channel: "وكالات إنتاج أو تسويق", difficulty: "high", outreachTargetCount: 5, messageScript: "عرض خدماتك كاستعانة خارجية.", followUpScript: "متابعة بعد خمسة أيام." },
    ],
    workflow: [
      { stage: "استلام المواد", detail: "فهم الأسلوب والفيديو الأصلي والموسيقى والموعد.", deliverable: "موجز مونتاج" },
      { stage: "عرض السعر والمدة", detail: "التسعير حسب الطول والتعقيد وعدد مرات التعديل.", deliverable: "عرض مكتوب" },
      { stage: "المونتاج", detail: "القص، المؤثرات، الموسيقى، تلوين الألوان.", deliverable: "مسودة" },
      { stage: "التعديلات", detail: "تطبيق التعديلات ضمن عدد محدد.", deliverable: "نسخة محدثة" },
      { stage: "التسليم النهائي", detail: "تسليم بصيغ مناسبة مع الفاتورة.", deliverable: "ملف نهائي وفاتورة" },
    ],
    marketCompetition: [
      { segment: "مونتيرو عامون", intensity: "high", positioning: "تخصص في الفيديو القصير أو التسويقي بدل المونتاج العام.", notes: "المنافسة السعرية عالية في الأسواق العامة." },
      { segment: "سوق محلي للفيديو", intensity: "medium", positioning: "فهم التنسيقات المحلية والأسلوب المفضل.", notes: "حجم السوق غير مؤكد — NEEDS_VALIDATION." },
    ],
    commonMistakes: [
      { mistake: "مبالغة في التعديلات بلا حد", prevention: "تحديد عدد مرات التعديل في العرض." },
      { mistake: "إهمال المزامنة الصوتية", prevention: "فحص الصوت والمزامنة قبل التسليم." },
      { mistake: "تسعير غير واضح للمؤثرات", prevention: "فصل المونتاج الأساسي عن الحركات البصرية في السعر." },
      { mistake: "تصدير بتنسيقات خاطئة", prevention: "تحديد المنصة والصيغة والجودة مسبقاً." },
    ],
    redFlags: [
      { flag: "طلب مونتاج مجاني كتجربة", why: "قد يكون عملاً بلا نطاق أو دفع.", protection: "عرض مقطع قصير جداً مقابل رمزية." },
      { flag: "عميل لا يوفّر المواد النهائية في موعدها", why: "يؤخر التسليم ويؤثر على الجودة.", protection: "جدولة زمنية واضحة لكل طرف." },
      { flag: "رغبة في تملك حقوق كاملة بسعر رمزي", why: "خطر تسليم عمل إبداعي بلا مقابل عادل.", protection: "توثيق حقوق الاستخدام في العقد." },
    ],
    marketing: {
      channels: ["Instagram / TikTok", "منصات العمل الحر", "LinkedIn"],
      contentTypes: ["مونتاج قبل وبعد", "فيديوهات عرض", "عرض العمليات في الفيديو"],
      cta: "احجز مونتاج مقطع قصير",
      kpis: ["طلبات المونتاج", "نسبة ثبات المشاهدة", "عملاء متكررون"],
    },
    plan30Days: [
      { week: 1, tasks: ["اختيار برنامج المونتاج", "مونتاج ثلاث مقاطع تجريبية", "بناء المحفظة"], outreach: [], content: ["فيديو عرض"], kpis: ["محفظة جاهزة"] },
      { week: 2, tasks: ["وضع الحزم والأسعار", "إرسال عروض لصنّاع محتوى"], outreach: ["5-8 عروض"], content: ["منشور مونتاج"], kpis: ["عدد العروض"] },
      { week: 3, tasks: ["متابعة العروض", "تقديم عروض وتجارب قصيرة"], outreach: ["متابعات"], content: [], kpis: ["حوارات جديدة"] },
      { week: 4, tasks: ["إغلاق أول مشروع مدفوع", "التسليم والفاتورة", "طلب توصية"], outreach: ["متابعة العملاء"], content: ["إعادة نشر"], kpis: ["أول مشروع", "توصية"] },
    ],
    growthPath: [
      { from: "مونتاج عام", to: "تخصص في الفيديو القصير أو التسويقي", tactic: "تركيز المعرض على نوع واحد." },
      { from: "مشاريع منفردة", to: "باقة شهرية", tactic: "بيع باقات فيديو قصير دورية." },
      { from: "مونتير", to: "استوديو مصغر", tactic: "تطوير قوالب قابلة للإعادة." },
    ],
    legalDz: {
      autoEntrepreneur: "المونتاج والخدمات السمعية البصرية ضمن النشاطات التي قد تدخل في المقاول الذاتي وفق قائمة ANAE؛ يجب التحقق من النشاط المحدد والوضع القانوني الحالي قبل التسجيل.",
      ifu: "تحتاج تحققاً من مصدر رسمي.",
      casnos: "تحتاج تحققاً من مصدر رسمي.",
      tva: "تحتاج تحققاً من مصدر رسمي.",
      crypto: "لا تُستخدم العملات المشفرة كوسيلة دفع للعملاء في الجزائر دون التحقق القانوني؛ التشريعات الجزائرية الحديثة تتضمن حظراً وعقوبات مرتبطة بالعملات الافتراضية.",
      notes: "حقوق المحتوى والموسيقى والترخيص تُعالج في العقد وتبقى بحاجة مراجعة قانونية؛ IFU/CASNOS/TVA تحتاج تأكيداً رسمياً — needsValidation = true.",
      needsValidation: true,
    },
    caseStudy: {
      scenario: "سيناريو توضيحي (SAMPLE) — مونتير يبدأ بمونتاج دوري لمقاطع قصيرة لصانع محتوى محلي.",
      inputs: ["مواد خام", "برنامج مجاني"],
      outcome: "توضيح بناء علاقة متكررة ورفع السعر مع النمو؛ الأرقام توضيحية فقط.",
      isSample: true,
    },
    sources: [
      { title: "معايير تسعير مونتاج الفيديو عالمياً (FileCurrent/SoloPricing)", url: "https://filecurrent.com", sourceType: "BENCHMARK", verifiedAt: "2026-09-04", notes: "لكل دقيقة أو حزمة؛ من 50$ للدقيقة." },
      { title: "أسعار المونتاج في السوق الجزائري (Bricoram)", url: "https://bricoram.com/service/videographie", sourceType: "BENCHMARK", verifiedAt: "2026-09-04", notes: "مونتاج 1,500–7,000 دج/دقيقة؛ فيديو سوشيال 600–9,200 دج/فيديو." },
      { title: "قواعد حقوق الموسيقى والمحتوى", url: "", sourceType: "REFERENCE" },
      { title: "أهلية الخدمات السمعية البصرية ضمن المقاول الذاتي (ANAE)", url: "https://anae.dz", sourceType: "OFFICIAL", verifiedAt: "2026-09-04" },
    ],
    meta: { paidValueScore: 8, researchVersion: "PHASE_3.5_DRAFT" },
  };
}

// ----------------------------------------------------------------------------
// 5) SOCIAL MEDIA MANAGEMENT
// ----------------------------------------------------------------------------
function socialMediaManagementStudy(): PaidStudy {
  const s = emptyPaidStudyDraft();
  return {
    ...s,
    summary: {
      overview:
        "دراسة مدفوعة لبدء إدارة صفحات التواصل الاجتماعي بدون رأس مال: حزم شهرية، تقويم محتوى، تقارير أداء، خدمات إضافية، والحصول على أول عميل. الأسعار العالمية معايير مرجعية والسعر الجزائري مُدعَّم بأمثلة سوقية (Bricoram/Ouedkniss) كمرجعية وليست سعراً رسمياً موحداً.",
    },
    idealClients: [
      { persona: "متاجر إلكترونية وأعمال محلية", orgType: "business", dzEligible: true, notes: "إدارة صفحات شهرية وتقارير." },
      { persona: "مشاريع شخصية وخدمات", orgType: "individual", dzEligible: true, notes: "إدارة حساب وصفحة موحدة." },
      { persona: "خدمات محلية (مقاهٍ، صالونات، عيادات)", orgType: "service", dzEligible: true, notes: "حاجة قوية لوجود سوشيال." },
      { persona: "علامات تحتاج تسويقاً احترافياً", orgType: "sme", dzEligible: false, notes: "فرصة عبر وسيط." },
    ],
    skills: {
      minimum: ["خط محتوى أساسي", "إنشاء منشورات", "الرد والتفاعل", "فهم الجمهور"],
      advanced: ["تحليل الأداء analytics", "إعلانات ممولة", "تقويم استراتيجي", "إدارة الأزمات"],
    },
    equipment: [
      { item: "هاتف أو حاسوب", tier: "free", purpose: "إنشاء المحتوى والرد", sourceStatus: "VERIFIED" },
      { item: "أدوات جدولة مجانية", tier: "free", purpose: "برمجة المنشورات", sourceStatus: "SUGGESTED" },
      { item: "أدوات تحليل مجانية", tier: "free", purpose: "قياس الأداء", sourceStatus: "SUGGESTED" },
      { item: "إنترنت مستقر", tier: "free", purpose: "المتابعة والرد", sourceStatus: "VERIFIED" },
    ],
    pricing: [
      { model: "monthly_retainer", globalMinUsd: 500, globalMaxUsd: 5000, dzPriceStatus: "BENCHMARK", source: "رتابة إدارة سوشيال عالمية (BENCHMARK)", dzSuggestedDzd: 20000, note: "الرتابة الشهرية تبدأ من نحو 500$ عالمياً وحتى 5,000$؛ في السوق الجزائري إدارة شهرية حوالي 13,600–35,000 دج (متوسط 20,000) ومثال FB+IG حوالي 19,000 دج — ليست سعراً رسمياً موحداً للسوق." },
      { model: "package", globalMinUsd: 150, globalMaxUsd: 800, dzPriceStatus: "NEEDS_VALIDATION", source: "حزم إدارة موسمية (SUGGESTED)", note: "حزم إطلاق أو حملات؛ استرشادية وليست معلنة سوقياً." },
      { model: "per_project", globalMinUsd: 50, globalMaxUsd: 500, dzPriceStatus: "NEEDS_VALIDATION", source: "باقات محتوى لمرة (SUGGESTED)", note: "كتابة منشورات أو إطلاق حملة؛ استرشادية وليست معلنة سوقياً." },
    ],
    profitModel: {
      priceAnchor: "رتابة شهرية بعدد منشورات ومنصات محددة بوضوح.",
      hoursPerUnit: 1,
      grossPerHour: 30,
      breakEvenUnits: 1,
      notes: "قيم استرشادية فقط؛ الإدارة تتطلب ساعات متواصلة. لا وعود دخل.",
    },
    businessModel: {
      offerModel: "حزم شهرية تشمل النشر والرد وتقريراً شهرياً.",
      valueProposition: "إدارة تظهر النمو بالأرقام وتبني حضوراً متسقاً.",
      repeatClientStrategy: "تقرير شهري يظهر القيمة وتجديد شهري واضح.",
    },
    firstClientAcquisition: [
      { channel: "أعمال محلية بوجود ضعيف على السوشيال", difficulty: "low", outreachTargetCount: 6, messageScript: "مراجعة مجانية سريعة لحسابهم واقتراح تحسينات.", followUpScript: "متابعة بعد أربعة أيام." },
      { channel: "خدمات محلية", difficulty: "low", outreachTargetCount: 6, messageScript: "عرض شهر تجريبي بسعر رمزي.", followUpScript: "متابعة بعد خمسة أيام." },
      { channel: "متاجر إلكترونية", difficulty: "medium", outreachTargetCount: 6, messageScript: "عرض خطة محتوى مناسبة لمواسمهم.", followUpScript: "متابعة لمرة واحدة." },
    ],
    workflow: [
      { stage: "تحليل الحساب", detail: "مراجعة الوضع الحالي والجمهور والمنافسين.", deliverable: "تقرير أساسي" },
      { stage: "توقيع العرض", detail: "تحديد عدد المنشورات والمنصات ورسوم الالتزام الشهري.", deliverable: "عقد شهري" },
      { stage: "تقويم المحتوى", detail: "جدولة المحتوى والأوقات.", deliverable: "تقويم شهري" },
      { stage: "النشر والرد", detail: "نشر المحتوى والتفاعل يومياً.", deliverable: "نشر نشط" },
      { stage: "التقرير الشهري", detail: "مقاييس الأداء والتوصيات.", deliverable: "تقرير وتجديد" },
    ],
    marketCompetition: [
      { segment: "وكالات تسويق", intensity: "high", positioning: "تخصص في الأعمال المحلية الصغيرة بأسعار أوضح.", notes: "منافسة عالية مع الوكالات." },
      { segment: "مديرو سوشيال فرديون", intensity: "medium", positioning: "تخصص في قطاع أو صناعة محلية.", notes: "حجم السوق غير مؤكد — NEEDS_VALIDATION." },
    ],
    commonMistakes: [
      { mistake: "الوعد بنمو مضمون", prevention: "الوعد بالتسليم والالتزام لا بالنتائج الرقمية." },
      { mistake: "لا تقرير أداء", prevention: "تقرير شهري يثبت القيمة." },
      { mistake: "الخلط بين المحتوى والإعلانات", prevention: "فصل الإعلانات الممولة كخدمة مستقلة." },
      { mistake: "قبول عدد منصات غير واقعي", prevention: "البدء بمنصة أو منصتين واضحتين." },
    ],
    redFlags: [
      { flag: "عميل يطلب ضمانة نتيجة (متابعين)", why: "مستحيل وقد يدفعك لأرقام زائفة.", protection: "توضيح الالتزام بالمحتوى والتفاعل لا بالأرقام." },
      { flag: "رغبة في شراء متابعين", why: "ضرر على السمعة والحساب.", protection: "رفض هذه الممارسة." },
      { flag: "لا يريد عقداً شهرياً واضحاً", why: "خطر تفكك العلاقة والغموض التعاقدي.", protection: "عقد واضح مع شرط الإنهاء." },
    ],
    marketing: {
      channels: ["LinkedIn", "Instagram (حسابات أعمال)", "مجموعات أعمال محلية"],
      contentTypes: ["نتائج موثقة بإذن العملاء", "نصائح إدارة سوشيال", "أمثلة تقارير"],
      cta: "احجز شهراً تجريبياً",
      kpis: ["توقيع عقود شهرية", "نسبة تجديد الاشتراك", "التوسع لحزم أكبر"],
    },
    plan30Days: [
      { week: 1, tasks: ["تعريف العرض والحزم", "إعداد عقد ونموذج تقرير", "إعداد قواعد العروض"], outreach: [], content: [], kpis: ["مستندات جاهزة"] },
      { week: 2, tasks: ["تقديم عروض لأعمال محلية"], outreach: ["6-10 رسائل"], content: ["منشور توعوي"], kpis: ["عدد العروض"] },
      { week: 3, tasks: ["متابعة العروض", "إجراء مراجعات مجانية سريعة"], outreach: ["متابعات"], content: [], kpis: ["حوارات جديدة"] },
      { week: 4, tasks: ["توقيع أول عميل", "تشغيل التقويم الأول", "طلب شهادة"], outreach: ["متابعة العملاء"], content: ["تقرير مبسط"], kpis: ["أول عقد شهري"] },
    ],
    growthPath: [
      { from: "منصة واحدة", to: "حزم متعددة المنصات", tactic: "توسيع الحزمة مع تحسن النتائج." },
      { from: "عميل واحد", to: "بضعة عقود شهرية", tactic: "عقود ثابتة مع توصيات." },
      { from: "مدير سوشيال", to: "وكالة مصغرة", tactic: "فريق فرعي ورفع السعر لكل عميل." },
    ],
    legalDz: {
      autoEntrepreneur: "إدارة صفحات التواصل/الخدمات الرقمية يمكن أن تدخل ضمن المقاول الذاتي وفق قائمة ANAE؛ يجب التحقق من النشاط المحدد والوضع القانوني الحالي قبل التسجيل.",
      ifu: "تحتاج تحققاً من مصدر رسمي.",
      casnos: "تحتاج تحققاً من مصدر رسمي.",
      tva: "تحتاج تحققاً من مصدر رسمي.",
      crypto: "لا تُستخدم العملات المشفرة كوسيلة دفع للعملاء في الجزائر دون التحقق القانوني؛ التشريعات الجزائرية الحديثة تتضمن حظراً وعقوبات مرتبطة بالعملات الافتراضية.",
      notes: "عقود العملاء وحماية البيانات تحتاج مراجعة قانونية (قانون حماية البيانات 18-07)؛ أهليّة المقاول الذاتي مؤكدة وفق ANAE — needsValidation = true.",
      needsValidation: true,
    },
    caseStudy: {
      scenario: "سيناريو توضيحي (SAMPLE) — مدير سوشيال يبدأ بإدارة حساب مقهى أو متجر محلي لمدة شهر.",
      inputs: ["حساب نشط", "أداة جدولة مجانية"],
      outcome: "توضيح تقويم محتوى وتقرير شهري وتحويل العميل لتجديد الشهر؛ الأرقام توضيحية فقط.",
      isSample: true,
    },
    sources: [
      { title: "معايير تسعير إدارة سوشيال عالمياً (Damongo/WebFX)", url: "https://damongo.com/freelance-social-media-manager-rates-2026/", sourceType: "BENCHMARK", verifiedAt: "2026-09-04", notes: "رتابة شهرية من 500$ وحتى 5,000$." },
      { title: "أسعار إدارة السوشيال في السوق الجزائري (Bricoram)", url: "https://bricoram.com/service/community-management", sourceType: "BENCHMARK", verifiedAt: "2026-09-04", notes: "إدارة شهرية 13,600–35,000 دج (متوسط 20,000)." },
      { title: "مثال إدارة سوشيال على الإعلانات المحلية (Ouedkniss)", url: "https://www.ouedkniss.com", sourceType: "BENCHMARK", verifiedAt: "2026-09-04", notes: "إدارة FB+IG حوالي 19,000 دج." },
      { title: "ممارسات إعداد تقارير الأداء", url: "", sourceType: "REFERENCE" },
      { title: "أهلية الخدمات الرقمية ضمن المقاول الذاتي (ANAE)", url: "https://anae.dz", sourceType: "OFFICIAL", verifiedAt: "2026-09-04" },
    ],
    meta: { paidValueScore: 8, researchVersion: "PHASE_3.5_DRAFT" },
  };
}

// ----------------------------------------------------------------------------
// Test runner + stats
// ----------------------------------------------------------------------------

type Stats = {
  sectionsPopulated: number;
  sectionsMissing: string[];
  needsValidation: number;
  benchmark: number;
  verified: number;
  suggested: number;
  paidValueScore: number;
};

const REQUIRED_SECTIONS: (keyof PaidStudy)[] = [
  "summary", "idealClients", "skills", "equipment", "pricing", "profitModel",
  "businessModel", "firstClientAcquisition", "workflow", "marketCompetition",
  "commonMistakes", "redFlags", "marketing", "plan30Days", "growthPath",
  "legalDz", "caseStudy", "sources", "meta",
];

function isPopulated(s: PaidStudy, k: keyof PaidStudy): boolean {
  const v = s[k];
  if (v == null) return false;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === "object") {
    return Object.keys(v as object).some(
      (kk) => (v as Record<string, unknown>)[kk] != null && (v as Record<string, unknown>)[kk] !== ""
    );
  }
  return Boolean(v);
}

function countSourceStatus(s: PaidStudy, want: StudySourceStatus): number {
  let n = 0;
  for (const item of s.equipment) if (item.sourceStatus === want) n += 1;
  for (const item of s.pricing) if (item.dzPriceStatus === want) n += 1;
  return n;
}

function buildStats(s: PaidStudy): Stats {
  return {
    sectionsPopulated: REQUIRED_SECTIONS.filter((k) => isPopulated(s, k)).length,
    sectionsMissing: REQUIRED_SECTIONS.filter((k) => !isPopulated(s, k)).map((k) => String(k)),
    needsValidation: countSourceStatus(s, "NEEDS_VALIDATION"),
    benchmark: countSourceStatus(s, "BENCHMARK"),
    verified: countSourceStatus(s, "VERIFIED"),
    suggested: countSourceStatus(s, "SUGGESTED"),
    paidValueScore: s.meta.paidValueScore ?? 0,
  };
}

export const studies: Record<string, PaidStudy> = {
  "content-writing": contentWritingStudy(),
  "translation": translationStudy(),
  "graphic-design": graphicDesignStudy(),
  "video-editing": videoEditingStudy(),
  "social-media-management": socialMediaManagementStudy(),
};

console.log("PHASE 3.5 — OFFLINE DRAFT VALIDATION");
for (const [slug, study] of Object.entries(studies)) {
  const errors = validateStudy(study);
  t(`${slug}: status === draft`, () => {
    if (study.status !== "draft") throw new Error(`status is ${study.status}`);
  });
  t(`${slug}: validateStudy passes (0 errors)`, () => {
    if (errors.length > 0) throw new Error(errors.join(" | "));
  });
  t(`${slug}: shouldRedactStudy === true (not public)`, () => {
    if (!shouldRedactStudy(study)) throw new Error("draft leaked as approved");
  });
  t(`${slug}: draftSafetyError is set`, () => {
    if (draftSafetyError(study) == null) throw new Error("draft not blocked");
  });
}

console.log("\n=== PER-PROJECT REPORT ===");
const rows: Record<string, Stats> = {};
for (const [slug, study] of Object.entries(studies)) {
  const st = buildStats(study);
  rows[slug] = st;
  console.log(`\n${slug}`);
  console.log(`  Draft Status: DRAFT`);
  console.log(`  Paid Value Score: ${st.paidValueScore}`);
  console.log(`  Sections Populated: ${st.sectionsPopulated}/19`);
  console.log(`  Sections Missing: ${st.sectionsMissing.length === 0 ? "none" : st.sectionsMissing.join(", ")}`);
  console.log(`  NEEDS_VALIDATION: ${st.needsValidation}`);
  console.log(`  BENCHMARK: ${st.benchmark}`);
  console.log(`  VERIFIED: ${st.verified}`);
  console.log(`  SUGGESTED: ${st.suggested}`);
  console.log(`  Validation Result: VALID`);
}

console.log("\n=== DRAFT SAFETY (all must be true) ===");
const allDraft = Object.values(studies).every((s) => s.status === "draft");
t("all 5 studies are DRAFT", () => {
  if (!allDraft) throw new Error("not all draft");
});

console.log("\nAll OFFLINE draft validation checks completed.");