import type {
  CategoryItem,
  ConsentVersion,
  NoCapitalQuestion,
  CourseItem,
} from "@/lib/noCapital/types";

// ============================================================================
// Code-level defaults for the NABDA growth architecture.
//
// These are the "honest empty" fallbacks used by public API routes whenever the
// matching database table has NOT been created yet (migration not applied, or
// PostgreSQL error 42P01). They contain reference/structure data only:
//   - categories / domains
//   - the flexible no-capital question bank
//   - the current legal consent text (reviewable + replaceable via Admin CMS)
//   - reference content types + publishing tips
//
// NO projects, courses, hooks or videos live here: those stay empty until the
// content team curates them through the Admin CMS (or until the migration is
// applied and the DB is provisioned).
// ============================================================================

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  { slug: "trade", nameAr: "تجارة", nameFr: "Commerce", type: "domain", icon: "store", description: "شراء وإعادة بيع المنتجات والأسواق المحلية", sortOrder: 1 },
  { slug: "services", nameAr: "خدمات", nameFr: "Services", type: "domain", icon: "wrench", description: "تقديم خدمات للفرد والشركات المحلية", sortOrder: 2 },
  { slug: "online", nameAr: "أونلاين", nameFr: "En ligne", type: "domain", icon: "globe", description: "مشاريع تعمل عبر الإنترنت والشحن", sortOrder: 3 },
  { slug: "content", nameAr: "محتوى وإعلام", nameFr: "Contenu & médias", type: "domain", icon: "video", description: "صناعة المحتوى والتصوير والتسويق الرقمي", sortOrder: 4 },
  { slug: "crafts", nameAr: "صناعة تقليدية", nameFr: "Artisanat", type: "domain", icon: "hammer", description: "حرف يدوية ومنتجات مصنعة محلياً", sortOrder: 5 },
  { slug: "agriculture", nameAr: "زراعة", nameFr: "Agriculture", type: "domain", icon: "sprout", description: "إنتاج زراعي وبيوت بلاستيكية وتربية", sortOrder: 6 },
  { slug: "education", nameAr: "تعليم وتدريب", nameFr: "Éducation", type: "domain", icon: "book", description: "دروس خصوصية ودورات وتدريب مهني", sortOrder: 7 },
];

export const DEFAULT_QUESTIONS: NoCapitalQuestion[] = [
  {
    questionKey: "mode",
    type: "single",
    title: "بماذا تريد أن تبدأ بدون رأس مال؟",
    subtitle: "اختر المجال الذي يستهويك أكثر، يمكنك تجربته لاحقاً في اختبارات أخرى.",
    required: true,
    order: 1,
    options: [
      { value: "services", label: "تقديم خدمات", desc: "خدماتي للفرد والشركات", tags: ["services", "خدمات"] },
      { value: "online", label: "مشروع أونلاين", desc: "إنترنت وشحن وتوصيل", tags: ["online", "أونلاين"] },
      { value: "content", label: "صناعة محتوى", desc: "فيديوهات، تصميم، تسويق", tags: ["content", "محتوى"] },
      { value: "trade", label: "بيع منتجات بالعمولة", desc: "دون شراء المخزون مسبقاً", tags: ["trade", "تجارة"] },
      { value: "crafts", label: "حرفة يدوية", desc: "منتجات مصنوعة يدوياً", tags: ["crafts", "حرفة"] },
      { value: "unknown", label: "لا أعرف بعد", desc: "ساعدني في اكتشاف الأنسب", tags: [] },
    ],
  },
  {
    questionKey: "hours",
    type: "single",
    title: "كم ساعة يومياً تستطيع تخصيصها؟",
    subtitle: "الوقت المتاح يحدد حجم المشروع الذي تستطيع تشغيله.",
    required: true,
    order: 2,
    options: [
      { value: "lt2", label: "أقل من ساعتين", desc: "وقت محدود جداً", tags: ["effort:low"] },
      { value: "h2to4", label: "من 2 إلى 4 ساعات", desc: "نصف يوم تقريباً", tags: ["effort:medium"] },
      { value: "h4to6", label: "من 4 إلى 6 ساعات", desc: "جزء كبير من اليوم", tags: ["effort:medium"] },
      { value: "full", label: "دوام كامل", desc: "المشروع هو وظيفتي", tags: ["effort:high"] },
    ],
  },
  {
    questionKey: "skills",
    type: "multi",
    title: "ما هي المهارات التي تمتلكها اليوم؟",
    subtitle: "اختر كل ما تنطبق عليه فعلياً.",
    required: true,
    order: 3,
    options: [
      { value: "البيع", label: "البيع", tags: ["بيع", "مبيعات"] },
      { value: "التسويق", label: "التسويق", tags: ["تسويق"] },
      { value: "الكتابة", label: "الكتابة", tags: ["كتابة"] },
      { value: "التصميم", label: "التصميم", tags: ["تصميم"] },
      { value: "التصوير", label: "التصوير", tags: ["تصوير"] },
      { value: "البرمجة", label: "البرمجة", tags: ["برمجة"] },
      { value: "الطبخ", label: "الطبخ", tags: ["طبخ"] },
      { value: "الحرف", label: "حرف يدوية", tags: ["حرفة"] },
      { value: "التعليم", label: "التعليم والتدريب", tags: ["تعليم"] },
      { value: "الخدمات المنزلية", label: "خدمات منزلية", tags: ["خدمات"] },
      { value: "الزراعة", label: "الزراعة", tags: ["زراعة"] },
      { value: "لا أملك خبرة محددة", label: "لا أملك خبرة محددة", tags: [] },
    ],
  },
  {
    questionKey: "tools",
    type: "multi",
    title: "ما هي الوسائل المتوفرة لديك؟",
    subtitle: "هذه الوسائل كافية للانطلاق في معظم المشاريع بدون رأس مال.",
    required: true,
    order: 4,
    options: [
      { value: "هاتف ذكي", label: "هاتف ذكي", tags: ["هاتف ذكي"] },
      { value: "كمبيوتر", label: "كمبيوتر / لابتوب", tags: ["كمبيوتر"] },
      { value: "إنترنت", label: "إنترنت مستقر", tags: ["إنترنت"] },
      { value: "سيارة", label: "سيارة", tags: ["سيارة"] },
      { value: "دراجة نارية", label: "دراجة نارية", tags: ["دراجة"] },
      { value: "لا شيء", label: "لا شيء من هذا", tags: [] },
    ],
  },
  {
    questionKey: "risk",
    type: "single",
    title: "ما هو مستوى المخاطرة المقبول لديك؟",
    subtitle: "بدون رأس مال يُقاس الخطر بالوقت والجهد المبذول.",
    required: true,
    order: 5,
    options: [
      { value: "low", label: "منخفض جداً", desc: "أفضّل التجربة الآمنة", tags: ["risk:low"] },
      { value: "medium", label: "متوسط", desc: "مستعد لبعض المحاولة", tags: ["risk:medium"] },
      { value: "high", label: "مرتفع", desc: "مستعد للمجازفة بتجارب جديدة", tags: ["risk:high"] },
    ],
  },
  {
    questionKey: "income",
    type: "single",
    title: "هل لديك مصدر دخل آخر حالياً؟",
    subtitle: "وجوده يمنحك حرية أكبر في اختيار مشروع ينمو ببطء.",
    required: true,
    order: 6,
    options: [
      { value: "yes", label: "نعم", desc: "وظيفة أو راتب أو نشاط آخر", tags: ["income:yes"] },
      { value: "no", label: "لا", desc: "المشروع يجب أن يدر بسرعة", tags: ["income:no"] },
    ],
  },
  {
    questionKey: "objective",
    type: "single",
    title: "ما هو هدفك من هذا المشروع؟",
    subtitle: "هدفك يحدد خطة العمل المناسبة (خطة 90 يوماً، أول عميل، التسويق).",
    required: true,
    order: 7,
    options: [
      { value: "extra", label: "دخل إضافي", desc: "بجانب نشاطي الحالي", tags: ["objective:extra"] },
      { value: "main", label: "مصدر دخل رئيسي", desc: "أعتمد عليه مستقبلاً", tags: ["objective:main"] },
      { value: "skill", label: "تطوير مهارة", desc: "التعلم ثم الانطلاق", tags: ["objective:skill"] },
      { value: "test", label: "تجربة الفكرة", desc: "اختبار قبل القرار النهائي", tags: ["objective:test"] },
    ],
  },
];

export const DEFAULT_CONSENT: ConsentVersion = {
  version: "1.0",
  title: "موافقة على عرض النتائج الاسترشادية",
  text: "باستخدامك لهذه النتيجة، فإنك تقر وتوافق على ما يلي:\n\n1) النتائج المعروضة هنا توصيات استرشادية تُبنى على إجاباتك ومعطيات عامة عن السوق الجزائري، ولا تُشكل ضماناً للربح أو نجاح المشروع بأي شكل.\n\n2) منصة NABDA ليست مستشاراً مالياً أو قانونياً، وننصحك باستشارة المختصين والجهات الرسمية قبل اتخاذ أي قرار استثماري.\n\n3) قد تخضع بعض الأنشطة لشروط قانونية أو إدارية محلية (السجل التجاري، البطاقة المهنية، التصاريح)، ويقع على عاتقك التحقق من ذلك قبل الانطلاق الفعلي.",
  required: true,
};

export const DEFAULT_CONTENT_TYPES: { slug: string; nameAr: string; description: string; bestPractices: string[]; example: string }[] = [
  {
    slug: "reel",
    nameAr: "ريل / فيديو قصير",
    description: "فيديو قصير سريع لـ تيك توك وانستغرام، يجذب الانتباه في أول 3 ثوانٍ.",
    bestPractices: ["ابدأ بـ Hook قوي في أول ثانيتين", "حافظ على الإيقاع السريع", "أنهِ بدعوة واضحة للتفاعل"],
    example: "في 30 ثانية أشرح كيف تبدأ خدمة تنظيف بدون رأس مال.",
  },
  {
    slug: "long",
    nameAr: "فيديو طويل / يوتيوب",
    description: "محتوى معمق على يوتيوب لبناء ثقة ومرجعية في مجالك.",
    bestPractices: ["غلاف واضح وعنوان يعد بقيمة", "خطة مقطع مع مقدمات سريعة", "قسم للأسئلة والتعليقات"],
    example: "شرح كامل لخطة أول عميل خلال 90 يوماً.",
  },
  {
    slug: "carousel",
    nameAr: "منشور شرائح",
    description: "شرائح معلومات على انستغرام ولينكد إن لتبسيط الأفكار.",
    bestPractices: ["أول شريحة تجذب وتلخص الفكرة", "نص مختصر لكل شريحة", "اختم بدعوة لحفظ المنشور"],
    example: "5 طرق لتسويق خدمتك بميزانية صفر.",
  },
  {
    slug: "text",
    nameAr: "منشور نصي",
    description: "نص قصير على فيسبوك وتويتر لفتح نقاش حول موضوع.",
    bestPractices: ["سؤال في البداية", "فقرات قصيرة وسهلة", "تفاعل مع المعلقين"],
    example: "سؤال: ما أكبر عائق واجهته عند بدء مشروعك الأول؟",
  },
];

export const DEFAULT_PUBLISHING_PLANS: { platform: string; cadence: string; bestTimes: string[]; tips: string[] }[] = [
  {
    platform: "tiktok",
    cadence: "يومياً (1-2 فيديو)",
    bestTimes: ["7 صباحاً", "12 ظهراً", "8 مساءً"],
    tips: ["رد على التعليقات خلال الساعة الأولى", "استخدم أصوات وترندات شائعة بحذر"],
  },
  {
    platform: "instagram",
    cadence: "4-5 مرات أسبوعياً",
    bestTimes: ["6 مساءً", "9 مساءً"],
    tips: ["نوّع بين ريل وستوري وشرائح", "حافظ على تناسق الهوية البصرية"],
  },
  {
    platform: "youtube",
    cadence: "فيديو واحد أسبوعياً",
    bestTimes: ["الخميس والجمعة مساءً"],
    tips: ["ثبات المواعيد أهم من الكم", "انتهز الترندات المحلية في الاقتراحات"],
  },
  {
    platform: "facebook",
    cadence: "3-4 مرات أسبوعياً",
    bestTimes: ["9 صباحاً", "8 مساءً"],
    tips: ["انضم لمجموعات النشاط التجاري المحلية", "أجب عن الأسئلة لبناء مصداقية"],
  },
];

export const DEFAULT_COURSES: CourseItem[] = [];
