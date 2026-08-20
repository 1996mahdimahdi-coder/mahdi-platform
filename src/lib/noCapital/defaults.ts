import type {
  CategoryItem,
  ConsentVersion,
  NoCapitalProfile,
  NoCapitalQuestion,
  CourseItem,
} from "@/lib/noCapital/types";

// ============================================================================
// Code-level defaults for the NABDA growth architecture.
//
// Fallbacks used by public API routes when the matching database table has NOT
// been created yet. Contains reference/structure data:
//   - categories / domains
//   - no-capital assessment questions (11 axes)
//   - curated no-capital project profiles (strict digital/service only)
//   - legal consent text
//   - reference content types + publishing tips
//
// The no-capital project list is kept intentionally small and curated.
// Quality > quantity: only projects genuinely startable with phone/computer +
// internet, with zero mandatory inventory, materials, equipment, or capital.
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

// ============================================================================
// DEFAULT_QUESTIONS — 11 assessment axes
//
// Engine-compatible keys (mode / hours / skills / tools) MUST stay exactly as
// is — the recommendation engine looks them up by questionKey. The remaining
// 7 axes are informational and used by future rules / analytics.
// ============================================================================

export const DEFAULT_QUESTIONS: NoCapitalQuestion[] = [
  // ── Engine-critical: mode ────────────────────────────────────────────────
  // The engine adds the selected option's raw value to selectedTags.
  // Option values MUST be whitelisted topic tags for engine scoring.
  {
    questionKey: "mode",
    type: "single",
    title: "ما المجال الذي يجذبك أكثر؟",
    subtitle: "اختر المجال الذي تستهويك أكثر حالياً. يمكنك تجربة مسارات أخرى لاحقاً.",
    required: true,
    order: 1,
    options: [
      { value: "محتوى", label: "صناعة محتوى", desc: "فيديوهات، تصوير، إنتاج رقمي", tags: ["محتوى"] },
      { value: "خدمات", label: "خدمات رقمية", desc: "مساعدة الشركات والأفراد", tags: ["خدمات"] },
      { value: "برمجة", label: "برمجة وتطوير", desc: "تطبيقات ومواقع وبرمجيات", tags: ["برمجة"] },
      { value: "تصميم", label: "تصميم وبصريات", desc: "تصميم جرافيك وهوية بصرية", tags: ["تصميم"] },
      { value: "تعليم", label: "تعليم وتدريب", desc: "مشاركة المعرفة والخبرات", tags: ["تعليم"] },
      { value: "تسويق", label: "تسويق ومبيعات", desc: "ترويج وتوسيع نطاق الوصول", tags: ["تسويق"] },
      { value: "كتابة", label: "كتابة وترجمة", desc: "نصوص ومقالات وترجمات", tags: ["كتابة"] },
      { value: "لا أعرف", label: "لا أعرف بعد", desc: "سأساعدك في اكتشاف الأنسب", tags: [] },
    ],
  },

  // ── Engine-critical: hours ───────────────────────────────────────────────
  // Values starting with "lt" / "h2to4" / "h4to6" / "full" are mapped by
  // the engine to effort levels: منخفض / متوسط / مرتفع.
  {
    questionKey: "hours",
    type: "single",
    title: "كم ساعة يومياً تستطيع تخصيصها للمشروع؟",
    subtitle: "الوقت المتاح يحدد حجم ونوع المشروع الذي تستطيع تشغيله.",
    required: true,
    order: 2,
    options: [
      { value: "lt2", label: "1 – 2 ساعة", desc: "وقت محدود بجانب نشاطك", tags: ["effort:low"] },
      { value: "h2to4", label: "3 – 4 ساعات", desc: "نصف يوم تقريباً", tags: ["effort:medium"] },
      { value: "full", label: "5+ ساعات يومياً", desc: "أستطيع تخصيص وقت كبير", tags: ["effort:high"] },
    ],
  },

  // ── Engine-critical: skills ──────────────────────────────────────────────
  // Multi-select. Engine adds both option values AND their tags to
  // selectedTags. Profile.skillsRequired is matched against userSkills OR
  // selectedTags.
  {
    questionKey: "skills",
    type: "multi",
    title: "ما هي المهارات التي تمتلكها اليوم فعلياً؟",
    subtitle: "اختر كل ما تتقنه أو لديك خبرة حقيقية فيه.",
    required: true,
    order: 3,
    options: [
      { value: "البيع", label: "البيع والتفاوض", tags: ["بيع"] },
      { value: "الكتابة", label: "الكتابة والتعبير", tags: ["كتابة"] },
      { value: "التصميم", label: "التصميم (جرافيك / UI)", tags: ["تصميم"] },
      { value: "التصوير", label: "التصوير الفوتوغرافي / المرئي", tags: ["تصوير"] },
      { value: "المونتاج", label: "مونتاج الفيديو", tags: ["محتوى"] },
      { value: "البرمجة", label: "البرمجة وتطوير البرمجيات", tags: ["برمجة"] },
      { value: "التعليم", label: "التعليم والتدريب", tags: ["تعليم"] },
      { value: "الترجمة", label: "الترجمة بين اللغات", tags: ["كتابة"] },
      { value: "التسويق", label: "التسويق الرقمي", tags: ["تسويق"] },
      { value: "التنظيم", label: "التنظيم وإدارة المهام", tags: ["خدمات"] },
      { value: "التواصل", label: "التواصل وخدمة العملاء", tags: ["خدمات"] },
      { value: "لا أملك خبرة محددة", label: "لا أملك خبرة محددة", tags: [] },
    ],
  },

  // ── Engine-critical: tools ───────────────────────────────────────────────
  // Multi-select. Engine adds both option values and tags to selectedTags.
  // Profile.toolsNeeded is matched against userTools OR selectedTags.
  {
    questionKey: "tools",
    type: "multi",
    title: "ما هي الوسائل المتوفرة لديك الآن؟",
    subtitle: "هذه الوسائل كافية للانطلاق في المشاريع بدون رأس مال.",
    required: true,
    order: 4,
    options: [
      { value: "هاتف ذكي", label: "هاتف ذكي", tags: ["هاتف ذكي"] },
      { value: "كمبيوتر", label: "كمبيوتر / لابتوب", tags: ["كمبيوتر"] },
      { value: "إنترنت مستقر", label: "إنترنت مستقر", tags: ["إنترنت مستقر"] },
    ],
  },

  // ── Informational axes (not used by engine core) ────────────────────────

  {
    questionKey: "internet",
    type: "single",
    title: "كيف جودة اتصالك بالإنترنت؟",
    subtitle: "يؤثر على نوع المشاريع التي يمكنك القيام بها بكفاءة.",
    required: true,
    order: 5,
    options: [
      { value: "جيد", label: "جيد ومستقر", desc: "أستطيع تنزيل ورفع الملفات بسهولة", tags: ["internet:high"] },
      { value: "محدود", label: "محدود أو غير مستقر", desc: "أواجه تقطعات أحياناً", tags: ["internet:low"] },
    ],
  },

  {
    questionKey: "work_style",
    type: "single",
    title: "ما أسلوب العمل الذي يناسبك؟",
    subtitle: "اختر الطريقة التي تشعر بالراحة والفعالية فيها.",
    required: true,
    order: 6,
    options: [
      { value: "العمل من المنزل", label: "العمل من المنزل", tags: ["work:home"] },
      { value: "العمل أونلاين", label: "العمل أونلاين بالكامل", tags: ["work:online"] },
      { value: "العمل مع العملاء", label: "العمل مع العملاء مباشرة", tags: ["work:clients"] },
      { value: "العمل الفردي", label: "العمل الفردي المستقل", tags: ["work:solo"] },
      { value: "العمل ضمن فريق", label: "العمل ضمن فريق", tags: ["work:team"] },
    ],
  },

  {
    questionKey: "appearance",
    type: "single",
    title: "هل تقبل الظهور أمام الكاميرا؟",
    subtitle: "يؤثر على المشاريع التي تتطلب محتوى مصوراً أو بثاً مباشراً.",
    required: true,
    order: 7,
    options: [
      { value: "أقبل الظهور أمام الكاميرا", label: "نعم، أقبل الظهور", desc: "لا مشكلة في التصوير أو البث المباشر", tags: ["appearance:on"] },
      { value: "أفضل عدم الظهور", label: "أفضل عدم الظهور", desc: "أعمل بشكل مخفي أو بشخصية رقمية", tags: ["appearance:off"] },
    ],
  },

  {
    questionKey: "experience",
    type: "single",
    title: "ما مستواك في المهارة التي تمتلكها؟",
    subtitle: "لا حرج إن كنت مبتدئاً، كل مسار له نقطة انطلاق.",
    required: true,
    order: 8,
    options: [
      { value: "مبتدئ", label: "مبتدئ", desc: "أعرف الأساسيات فقط", tags: ["exp:beginner"] },
      { value: "متوسط", label: "متوسط", desc: "لدي خبرة عملية معينة", tags: ["exp:medium"] },
      { value: "متقدم", label: "متقدم", desc: "أمتلك خبرة عميقة ومشاريع سابقة", tags: ["exp:advanced"] },
    ],
  },

  {
    questionKey: "languages",
    type: "multi",
    title: "ما اللغات التي تتقنها؟",
    subtitle: "يؤثر على نطاق العملاء والأسواق المتاحة.",
    required: true,
    order: 9,
    options: [
      { value: "العربية", label: "العربية", tags: ["lang:ar"] },
      { value: "الفرنسية", label: "الفرنسية", tags: ["lang:fr"] },
      { value: "الإنجليزية", label: "الإنجليزية", tags: ["lang:en"] },
      { value: "أكثر من لغة", label: "أكثر من لغة (أتقن 3 أو أكثر)", tags: ["lang:multi"] },
    ],
  },

  {
    questionKey: "goal",
    type: "single",
    title: "ما هو هدفك الأساسي من هذا المشروع؟",
    subtitle: "هدفك يحدد نوع الخطة والسرعة المطلوبة.",
    required: true,
    order: 10,
    options: [
      { value: "أول دخل", label: "الحصول على أول دخل", desc: "أحتاج مصدراً للدخل ASAP", tags: ["goal:first"] },
      { value: "دخل إضافي", label: "دخل إضافي بجانب نشاطي", desc: "أريد دخلاً إضافياً دون التخلي عن وظيفتي", tags: ["goal:extra"] },
      { value: "مشروع كامل", label: "بناء مشروع كامل", desc: "أريد الانتقال إلى مشروع مستقل", tags: ["goal:full"] },
      { value: "Freelance", label: "العمل الحر (Freelance)", desc: "أريد العمل بحسابي وبتوقيتي", tags: ["goal:freelance"] },
      { value: "بناء علامة", label: "بناء علامة / براند خاص", desc: "أريد بناء هوية تجارية معروفة", tags: ["goal:brand"] },
    ],
  },

  {
    questionKey: "learning",
    type: "single",
    title: "هل أنت مستعد لتعلم مهارة جديدة؟",
    subtitle: "بعض المشاريع تتطلب تعلم مهارات إضافية قبل الانطلاق.",
    required: true,
    order: 11,
    options: [
      { value: "أريد البدء بما أعرفه", label: "أريد البدء بما أعرفه", desc: "أفضل استخدام مهاراتي الحالية فوراً", tags: ["learn:existing"] },
      { value: "مستعد لتعلم مهارة جديدة", label: "مستعد لتعلم مهارة جديدة", desc: "مستعد لأستثمر وقتاً في التعلم أولاً", tags: ["learn:new"] },
    ],
  },
];

// ============================================================================
// DEFAULT_NO_CAPITAL_PROJECTS — curated digital/service profiles
//
// Every profile here satisfies the strict no-capital definition:
//   ✅ Phone or computer + internet = enough to start
//   ❌ No inventory, materials, equipment, shop, workshop, or mandatory capital
//
// Engine compatibility:
//   - tags include whitelisted topic tags for mode scoring
//   - skillsRequired values match skill option values
//   - toolsNeeded values match tool option values
//   - effortLevel maps to engine hours: منخفض / متوسط / مرتفع
//   - startCostType is always "zero_tools_existing"
// ============================================================================

export const DEFAULT_NO_CAPITAL_PROJECTS: NoCapitalProfile[] = [
  {
    slug: "content-writing",
    nameAr: "كتابة محتوى رقمي",
    description: "كتابة مقالات ومحتوى تسويقي ونصوص صفحات لشركات وأفراد. مهارة الكتابة تتحول إلى دخل عبر منصات العمل الحر والشركات المحلية.",
    categorySlug: "content",
    effortLevel: "منخفض",
    timeRequired: "1 – 2 ساعة يومياً",
    skillsRequired: ["الكتابة"],
    toolsNeeded: ["هاتف ذكي", "إنترنت مستقر"],
    startCostEstimate: "يمكن البدء باستخدام هاتفك أو حاسوبك والإنترنت المتوفر لديك",
    startCostType: "zero_tools_existing",
    tags: ["محتوى", "كتابة"],
    risks: ["المنافسة العالية في منصات العمل الحر", "تأخر استلام المبالغ من بعض العملاء"],
    advantages: ["طلب مستمر على المحتوى الرقمي", "مرونة تامة في الأوقات", "لا يحتاج أي معدات إضافية"],
    disadvantages: ["قد يستغرق بناء السمعة والعملاء الدائمين وقتاً", "الدخل يعتمد على الإنتاجية وجودة الكتابة"],
    steps: [
      { title: "تحديد النّوع", detail: "حدد نوع الكتابة: مقالات، نصوص تسويقية، وصف منتجات، أو محتوى سوشيال ميديا." },
      { title: "بناء عيّنات", detail: "أعد 3-5 عيّنات كتابة مجانية لإظهار جودة عملك." },
      { title: "إنشاء ملف شخصي", detail: "أنشئ حساباً على منصة عمل حر وضف عيّناتك." },
      { title: "أول عميل", detail: "قدّم عرضاً على 5-10 مشاريع صغيرة لبناء تقييماتك الأولى." },
    ],
  },
  {
    slug: "translation",
    nameAr: "ترجمة نصوص",
    description: "ترجمة مستندات ومقالات ونصوص بين اللغات (عربية / فرنسية / إنجليزية). خدمة مطلوبة من الشركات والأفراد والمؤسسات.",
    categorySlug: "services",
    effortLevel: "منخفض",
    timeRequired: "1 – 2 ساعة يومياً",
    skillsRequired: ["الترجمة"],
    toolsNeeded: ["كمبيوتر", "إنترنت مستقر"],
    startCostEstimate: "يمكن البدء باستخدام حاسوبك والإنترنت المتوفر لديك",
    startCostType: "zero_tools_existing",
    tags: ["خدمات", "كتابة"],
    risks: ["المنافسة الدولية في منصات الترجمة", "تحديث المفردات والتخصص مستمر"],
    advantages: ["طلب عالي من الشركات والمؤسسات", "أرباح مجزية لكل صفحة", "مرونة كاملة في اختيار المشاريع"],
    disadvantages: ["يحتاج دقة عالية ومهارة لغوية عميقة", "بعض المشاريع تتطلب تخصصاً طبياً أو قانونياً"],
    steps: [
      { title: "تحديد التخصص", detail: "حدد اللغات والتخصص: عام، طبي، قانوني، تقني." },
      { title: "بناء عيّنات", detail: "ترجم عيّنات قصيرة لإظهار أسلوبك وجودة عملك." },
      { title: "التقديم على منصات", detail: "سجّل في منصات الترجمة الحر وضف ملفك الشخصي." },
      { title: "أول عميل", detail: "قدّم عرضاً على 3-5 مشاريع صغيرة لبناء سمعتك." },
    ],
  },
  {
    slug: "graphic-design",
    nameAr: "تصميم جرافيك",
    description: "تصميم شعارات ومنشورات وهويات بصرية لشركات وأفراد. مهارة التصميم تتحول إلى دخل عبر تقديم تصاميم احترافية بأدوات مجانية.",
    categorySlug: "content",
    effortLevel: "متوسط",
    timeRequired: "3 – 4 ساعات يومياً",
    skillsRequired: ["التصميم"],
    toolsNeeded: ["كمبيوتر", "إنترنت مستقر"],
    startCostEstimate: "يمكن البدء باستخدام حاسوبك وأدوات التصميم المجانية (Canva / Figma / GIMP)",
    startCostType: "zero_tools_existing",
    tags: ["تصميم", "محتوى"],
    risks: ["المنافسة الكبيرة على الأسعار", "تحديث مستمر لأدوات التصميم"],
    advantages: ["طلب مستمر من الشركات الناشئة", "مرونة في اختيار المشاريع", "تطوير مهارات إبداعية متجددة"],
    disadvantages: ["يحتاج وقتاً لإتقان الأدوات", "بعض العملاء يطلبون تعديلات كثيرة"],
    steps: [
      { title: "اختيار الأداة", detail: "تعلّم Canva أو Figma (مجانيان) واستكشف أدواتهما." },
      { title: "بناء معرض", detail: "صمم 5-8 تصاميم نموذجية في مجالات مختلفة." },
      { title: "التقديم على مشاريع", detail: "قدّم على مشاريع تصميم صغيرة لبناء سمعتك." },
      { title: "توسيع النطاق", detail: "أضف خدمات تصميم الهوية البصرية والشعارات." },
    ],
  },
  {
    slug: "video-editing",
    nameAr: "مونتاج فيديو",
    description: "تحرير وmontage فيديوهات لصناع المحتوى والشركات. مهارة المونتاج مطلوبة بشدة مع النمو السريع لمحتوى الفيديو.",
    categorySlug: "content",
    effortLevel: "متوسط",
    timeRequired: "3 – 4 ساعات يومياً",
    skillsRequired: ["المونتاج"],
    toolsNeeded: ["كمبيوتر", "إنترنت مستقر"],
    startCostEstimate: "يمكن البدء باستخدام حاسوبك وبرامج المونتاج المجانية (CapCut / DaVinci Resolve)",
    startCostType: "zero_tools_existing",
    tags: ["محتوى", "تصوير"],
    risks: ["يحتاج حاسوب بأداء جيد نسبياً", "المنافسة على منصات العمل الحر"],
    advantages: ["طلب كبير جداً من صناع المحتوى", "أرباح مجزية لكل فيديو", "مرونة في العمل من أي مكان"],
    disadvantages: ["إنتاج الفيديو يستغرق وقتاً", "تعلم الأدوات يحتاج صبراً"],
    steps: [
      { title: "تعلّم الأساسيات", detail: "تعلّم CapCut (للهاتف) أو DaVinci Resolve (مجاني للحاسوب)." },
      { title: "بناء معرض", detail: "عدّل 3-5 فيديوهات نموذجية بأساليب مختلفة." },
      { title: "التواصل مع صناع المحتوى", detail: "تواصل مع صناع محتوى محليين واعرض خدماتك." },
      { title: "أول عميل", detail: "قدّم أول فيديو مجاناً أو بسعر رمزي مقابل تقييم." },
    ],
  },
  {
    slug: "programming",
    nameAr: "برمجة وتطوير تطبيقات",
    description: "تطوير تطبيقات ومواقع وبرمجيات للشركات والأفراد. البرمجة توفر أعلى هامش ربح في المشاريع بدون رأس مال.",
    categorySlug: "online",
    effortLevel: "مرتفع",
    timeRequired: "5+ ساعات يومياً",
    skillsRequired: ["البرمجة"],
    toolsNeeded: ["كمبيوتر", "إنترنت مستقر"],
    startCostEstimate: "يمكن البدء باستخدام حاسوبك وبيئة التطوير المجانية",
    startCostType: "zero_tools_existing",
    tags: ["برمجة", "أونلاين"],
    risks: ["منحنى تعلم حاد للمبتدئين", "المنافسة العالمية في سوق العمل الحر"],
    advantages: ["أرباح عالية جداً", "طلب مستمر من الشركات", "إمكانية العمل عن بعد بالكامل"],
    disadvantages: ["يحتاج وقتاً طويلاً للتعلم", "تحديث مستمر للتقنيات مطلوب"],
    steps: [
      { title: "اختيار المسار", detail: "حدد: تطوير ويب، تطبيقات موبايل، أو أتمتة. ابدأ بلغة واحدة." },
      { title: "التدريب العملي", detail: "تابع دورة عملية وابدأ في بناء مشاريع صغيرة." },
      { title: "بناء معرض", detail: "أنشئ 2-3 مشاريع عملية وضفها على GitHub." },
      { title: "أول عميل", detail: "قدّم على مشاريع صغيرة على منصات العمل الحر." },
    ],
  },
  {
    slug: "web-development",
    nameAr: "تطوير مواقع الويب",
    description: "تصميم وتطوير مواقع إلكترونية للشركات والأفراد. الطلب مرتفع دائماً مع النمو المستمر للتجارة الإلكترونية.",
    categorySlug: "online",
    effortLevel: "مرتفع",
    timeRequired: "5+ ساعات يومياً",
    skillsRequired: ["البرمجة", "التصميم"],
    toolsNeeded: ["كمبيوتر", "إنترنت مستقر"],
    startCostEstimate: "يمكن البدء باستخدام حاسوبك وأدوات التطوير المجانية",
    startCostType: "zero_tools_existing",
    tags: ["برمجة", "تصميم"],
    risks: ["يحتاج معرفة تقنية عميقة", "المنافسة العالمية"],
    advantages: ["طلب عالي من الشركات الناشئة", "مشاريع متنوعة وممتعة", "أرباح مجزية لكل مشروع"],
    disadvantages: ["يحتاج وقتاً طويلاً لإتقان التقنيات", "الصيانة والدعم المستمر مطلوب"],
    steps: [
      { title: "تعلّم الأساسيات", detail: "تعلّم HTML/CSS ثم إطار عمل واحد (WordPress / React / Next.js)." },
      { title: "بناء معرض", detail: "صمم 2-3 مواقع نموذجية." },
      { title: "التواصل مع الشركات", detail: "اعرض خدماتك على الشركات المحلية الناشئة." },
      { title: "أول عميل", detail: "قدّم أول موقع بسعر رمزي أو كمشروع تعليمي." },
    ],
  },
  {
    slug: "social-media-management",
    nameAr: "إدارة صفحات التواصل الاجتماعي",
    description: "إدارة ونشر المحتوى على صفحات الشركات على فيسبوك وإنستغرام وتيك توك. خدمة مطلوبة بشدة من الشركات الصغيرة والمحلات.",
    categorySlug: "content",
    effortLevel: "منخفض",
    timeRequired: "1 – 2 ساعة يومياً",
    skillsRequired: ["التسويق", "الكتابة"],
    toolsNeeded: ["هاتف ذكي", "إنترنت مستقر"],
    startCostEstimate: "يمكن البدء باستخدام هاتفك والإنترنت المتوفر لديك",
    startCostType: "zero_tools_existing",
    tags: ["تسويق", "محتوى"],
    risks: ["العمل في أوقات غير منتظمة حسب جدول العملاء", "المنافسة في خدمات التسويق"],
    advantages: ["طلب كبير من الشركات الصغيرة والمحلات", "دخل شهري ثابت مع عقود متكررة", "مرونة في العمل من الهاتف"],
    disadvantages: ["يحتاج متابعة مستمرة للمحتوى", "التعامل مع توقعات العملاء المتغيرة"],
    steps: [
      { title: "تعلّم الأساسيات", detail: "تعلّم إدارة المحتوى على فيسبوك وإنستغرام وتيك توك." },
      { title: "بناء عيّنات", detail: "أنشئ صفحة نموذجية ونشر عليها محتوى متنوع لمدة أسبوعين." },
      { title: "التواصل مع المحلات", detail: "اعرض خدماتك على 10 محلات أو شركات محلية." },
      { title: "أول عميل", detail: "قدّم أول شهر مجاناً أو بسعر رمزي مقابل تجربة." },
    ],
  },
  {
    slug: "content-management",
    nameAr: "إدارة محتوى رقمي",
    description: "تنسيق وتنظيم ونشر المحتوى الرقمي للشركات: مقالات، صور، فيديوهات، تقويم المحتوى. يختلف عن إدارة السوشيال في أنه يشمل كل القنوات.",
    categorySlug: "content",
    effortLevel: "منخفض",
    timeRequired: "1 – 2 ساعة يومياً",
    skillsRequired: ["التنظيم", "الكتابة"],
    toolsNeeded: ["هاتف ذكي", "إنترنت مستقر"],
    startCostEstimate: "يمكن البدء باستخدام هاتفك والإنترنت المتوفر لديك",
    startCostType: "zero_tools_existing",
    tags: ["محتوى", "تنظيم"],
    risks: ["يحتاج تنظيماً عالياً للمتابعة", "بعض العملاء يطلبون تغييرات مفاجئة"],
    advantages: ["طلب متزايد مع نمو التسويق الرقمي", "مرونة في العمل", "تطوير مهارات التسويق والتنظيم"],
    disadvantages: ["يتطلب انتباهاماً للتفاصيل", "المواعيد النهائية ضيقة أحياناً"],
    steps: [
      { title: "تعلّم الأدوات", detail: "تعلّم أدوات التقويم مثل Google Sheets أو Notion." },
      { title: "بناء نموذج", detail: "أنشئ نموذج تقويم محتوى نموذجياً." },
      { title: "التواصل مع الشركات", detail: "اعرض خدمة إدارة المحتوى على الشركات الصغيرة." },
      { title: "أول عميل", detail: "قدّم أول أسبوع مجاناً كتجربة." },
    ],
  },
  {
    slug: "customer-service",
    nameAr: "خدمة العملاء عن بُعد",
    description: "الرد على استفسارات وشكاوى العملاء عبر الهاتف أو الواتساب أو البريد. خدمة مطلوبة من الشركات التي لا تملك فريقاً كاملاً.",
    categorySlug: "services",
    effortLevel: "منخفض",
    timeRequired: "1 – 2 ساعة يومياً",
    skillsRequired: ["التواصل", "التنظيم"],
    toolsNeeded: ["هاتف ذكي", "إنترنت مستقر"],
    startCostEstimate: "يمكن البدء باستخدام هاتفك والإنترنت المتوفر لديك",
    startCostType: "zero_tools_existing",
    tags: ["خدمات", "تواصل"],
    risks: ["يعتمد على جدول عمل الشركة", "التعامل مع العملاء الغاضبين قد يكون مرهقاً"],
    advantages: ["طلب عالي جداً من الشركات الناشئة", "مدرب عليه بسرعة نسبياً", "دخل شهري ثابت"],
    disadvantages: ["قد يكون مرهقاً نفسياً", "ساعات العمل قد تكون غير منتظمة"],
    steps: [
      { title: "تهيئة الهاتف", detail: "تأكد من اتصالك المستقر وخصص مساحة عمل هادئة." },
      { title: "تعلّم السكريبت", detail: "اسأل الشركة عن سكريبت الرد واطلع على خدماتها." },
      { title: "التدريب الذاتي", detail: "تدرب على الرد على الأسئلة الشائعة بصوت عالٍ." },
      { title: "أول يوم", detail: "ابدأ بساعات قليلة ثم زِد تدريجياً." },
    ],
  },
  {
    slug: "lead-generation",
    nameAr: "توليد عملاء محتملين",
    description: "البحث عن عملاء محتملين للشركات عبر الإنترنت أو الاتصال المباشر. خدمة عالية القيمة تدفع حسب عدد العملاء المولّدين.",
    categorySlug: "services",
    effortLevel: "متوسط",
    timeRequired: "3 – 4 ساعات يومياً",
    skillsRequired: ["البيع", "التسويق"],
    toolsNeeded: ["هاتف ذكي", "إنترنت مستقر"],
    startCostEstimate: "يمكن البدء باستخدام هاتفك والإنترنت المتوفر لديك",
    startCostType: "zero_tools_existing",
    tags: ["تسويق", "بيع"],
    risks: ["يعتمد على نتائج فعلية قد تكون غير منتظمة", "المنافسة على منصات العمل الحر"],
    advantages: ["طلب عالي من الشركات التي تحتاج عملاء", "أرباح تتحسن مع الخبرة", "مرونة في أوقات العمل"],
    disadvantages: ["يحتاج مهارات بحث وتحليل", "قد يحتاج وقتاً لإتقان طرق التوليد"],
    steps: [
      { title: "تحديد النّوع", detail: "حدد نوع العملاء: B2B (شركات) أو B2C (أفراد) والمجال." },
      { title: "تعلم طرق البحث", detail: "تعلّم البحث على لينكد إن وفيسبوك والبحث المحلي." },
      { title: "بناء قاعدة بيانات", detail: "أعد قائمة أول 50 عميلاً محتملاً." },
      { title: "أول عميل", detail: "اعرض خدمة مجانية لمدة أسبوع على 5 شركات." },
    ],
  },
  {
    slug: "affiliate-marketing",
    nameAr: "تسويق بالعمولة",
    description: "الترويج لمنتجات الآخرين والحصول على نسبة من كل عملية بيع. لا يحتاج مخزوناً أو موارد مالية، فقط هاتف + إنترنت + محتوى.",
    categorySlug: "trade",
    effortLevel: "متوسط",
    timeRequired: "3 – 4 ساعات يومياً",
    skillsRequired: ["البيع", "التسويق"],
    toolsNeeded: ["هاتف ذكي", "إنترنت مستقر"],
    startCostEstimate: "يمكن البدء باستخدام هاتفك والإنترنت المتوفر لديك",
    startCostType: "zero_tools_existing",
    tags: ["بيع", "تجارة"],
    risks: ["دخل غير مضمون في البداية", "يحتاج بناء جمهور أو قنوات ترويجية"],
    advantages: ["بدون مخزون أو مخاطرة مالية", "مرونة في اختيار المنتجات", "إمكانية أرباح سلبية مع الوقت"],
    disadvantages: ["بطيء في البداية حتى تبناء جمهوراً", "يعتمد على منصات قد تغير سياساتها"],
    steps: [
      { title: "اختيار المنصة", detail: "سجّل في برنامج عمولة مناسب (Amazon / منصات محلية)." },
      { title: "اختيار المنتج", detail: "اختر منتجاً تعرفه وتؤمن بجودته." },
      { title: "إنشاء محتوى", detail: "أنشئ محتوى تقييمي (فيديو / مقال / منشور) يروج للمنتج." },
      { title: "نشر وتتبع", detail: "انشر المحتوى وتتبع روابط التتبع." },
    ],
  },
  {
    slug: "digital-broker",
    nameAr: "وسيط خدمات رقمية",
    description: "ربط مزودي الخدمات بالعملاء والحصول على عمولة. أنت الوسيط الذي يجمع بين الطلب والعرض دون تقديم الخدمة بنفسك.",
    categorySlug: "services",
    effortLevel: "منخفض",
    timeRequired: "1 – 2 ساعة يومياً",
    skillsRequired: ["البيع", "التواصل"],
    toolsNeeded: ["هاتف ذكي", "إنترنت مستقر"],
    startCostEstimate: "يمكن البدء باستخدام هاتفك والإنترنت المتوفر لديك",
    startCostType: "zero_tools_existing",
    tags: ["بيع", "خدمات"],
    risks: ["المسؤولية القانونية عند عدم رضا العميل", "بناء الثقة مع الطرفين يحتاج وقتاً"],
    advantages: ["دخل جيد من كل وسيطة", "مرونة تامة في العمل", "طلب متزايد مع نمو التجارة الإلكترونية"],
    disadvantages: ["يحتاج شبكة علاقات واسعة", "إدارة توقعات الطرفين صعبة أحياناً"],
    steps: [
      { title: "تحديد السوق", detail: "حدد نوع الخدمات: تصميم، برمجة، ترجمة، etc." },
      { title: "بناء الشبكة", detail: "ابحث عن 5-10 مزودين موثوقين لكل خدمة." },
      { title: "الترويج", detail: "انشر عروضك على مجموعات فيسبوك والواتساب." },
      { title: "أول وسيطة", detail: "قدّم أول خدمة بعمولة صغيرة لبناء الثقة." },
    ],
  },
  {
    slug: "visual-content",
    nameAr: "صناعة محتوى بصري",
    description: "إنشاء صور وريلز ومحتوى بصري للعلامات التجارية والأفراد. هاتفك الكافي لإنتاج محتوى احترافي يجذب الانتباه.",
    categorySlug: "content",
    effortLevel: "منخفض",
    timeRequired: "1 – 2 ساعة يومياً",
    skillsRequired: ["التصوير", "المونتاج"],
    toolsNeeded: ["هاتف ذكي", "إنترنت مستقر"],
    startCostEstimate: "يمكن البدء باستخدام هاتفك والإنترنت المتوفر لديك",
    startCostType: "zero_tools_existing",
    tags: ["تصوير", "محتوى"],
    risks: ["المنافسة الكبيرة في سوق المحتوى", "تحديث مستمر للترندات مطلوب"],
    advantages: ["طلب كبير من الشركات والعلامات التجارية", "مرونة في العمل والإبداع", "تطوير مهارات بصرية متجددة"],
    disadvantages: ["إنتاج المحتوى يستغرق وقتاً", "جودة الهاتف قد تكون محدودة مقارنة بالكاميرا الاحترافية"],
    steps: [
      { title: "تعلّم الأساسيات", detail: "تعلّم قواعد التصوير والإضاءة باستخدام هاتفك." },
      { title: "بناء معرض", detail: "أعد 5-10 محتوى بصري نموذجي بأساليب مختلفة." },
      { title: "التواصل مع العلامات", detail: "اعرض خدماتك على 10 علامات تجارية محلية." },
      { title: "أول عميل", detail: "قدّم أول جلسة تصوير مجاناً أو بسعر رمزي." },
    ],
  },
  {
    slug: "online-teaching",
    nameAr: "التعليم والتدريب عن بُعد",
    description: "تقديم دروس ودورات تدريبية عبر الإنترنت في مجال خبرتك. مهارة التعليم تتحول إلى مصدر دخل ثابت عبر المنصات الرقمية.",
    categorySlug: "education",
    effortLevel: "متوسط",
    timeRequired: "3 – 4 ساعات يومياً",
    skillsRequired: ["التعليم"],
    toolsNeeded: ["كمبيوتر", "إنترنت مستقر"],
    startCostEstimate: "يمكن البدء باستخدام حاسوبك والإنترنت المتوفر لديك",
    startCostType: "zero_tools_existing",
    tags: ["تعليم", "أونلاين"],
    risks: ["يحتاج خبرة سابقة في التدريس أو المجال", "المنافسة على منصات الدورات"],
    advantages: ["طلب متزايد على التعليم الرقمي", "أرباح مجزية لكل دورة", "تأثير إيجابي على حياة الطلاب"],
    disadvantages: ["يحتاج مهارات عرض وشرح واضحة", "تحضير الدورات يستغرق وقتاً"],
    steps: [
      { title: "تحديد المادة", detail: "حدد مادة أو مهارة تتقنها ويمكنك تعليمها." },
      { title: "تحضير المحتوى", detail: "أعد خطة درس واحدة على الأقل ومحتوى تعليمياً." },
      { title: "اختيار المنصة", detail: "اختر منصة: Zoom لدروس مباشرة أو منصة دورات للفيديو." },
      { title: "أول دورة", detail: "قدّم أول دورة بسعر رمزي لبناء سمعتك." },
    ],
  },
  {
    slug: "virtual-assistance",
    nameAr: "مساعدة افتراضية",
    description: "تقديم خدمات إدارية وتنظيمية للشركات والأفراد عن بُعد: تنسيق مواعيد، إدارة بريد إلكتروني، ترتيب ملفات. خدمة مطلوبة جداً من رواد الأعمال.",
    categorySlug: "services",
    effortLevel: "منخفض",
    timeRequired: "1 – 2 ساعة يومياً",
    skillsRequired: ["التنظيم", "التواصل"],
    toolsNeeded: ["هاتف ذكي", "إنترنت مستقر"],
    startCostEstimate: "يمكن البدء باستخدام هاتفك والإنترنت المتوفر لديك",
    startCostType: "zero_tools_existing",
    tags: ["خدمات", "تنظيم"],
    risks: ["يعتمد على توفر العميل واحتياجاته", "ساعات العمل قد تتداخل مع أوقات العميل"],
    advantages: ["طلب عالٍ من رواد الأعمال والشركات الناشئة", "مدرب عليه بسرعة", "دخل شهري ثابت مع عقود متكررة"],
    disadvantages: ["يحتاج تنظيماً عالياً ودقة في التفاصيل", "التعامل مع أوقات مختلفة للعملاء"],
    steps: [
      { title: "تحديد الخدمات", detail: "حدد أنواع المساعدة: بريد، مواعيد، ترتيب، بحث." },
      { title: "تهيئة الأدوات", detail: "جهّز حسابات Gmail وGoogle Calendar ومجلدات تنظيمية." },
      { title: "التواصل مع رواد الأعمال", detail: "اعرض خدماتك على 10 رواد أعمال محليين." },
      { title: "أول عميل", detail: "قدّم أول أسبوع مجاناً كتجربة." },
    ],
  },
  {
    slug: "social-media-ads-management",
    nameAr: "إدارة الإعلانات الممولة",
    description: "إدارة حملات إعلانية ممولة على فيسبوك وانستغرام للمحلات والشركات المحلية مقابل نسبة أو أجر شهري.",
    categorySlug: "online",
    effortLevel: "متوسط",
    timeRequired: "2 – 3 ساعات يومياً",
    skillsRequired: ["فهم إعلانات فيسبوك", "تحليل النتائج"],
    toolsNeeded: ["حاسوب", "إنترنت مستقر"],
    startCostEstimate: "يمكن البدء باستخدام حاسوبك والإنترنت المتوفر لديك",
    startCostType: "zero_tools_existing",
    tags: ["إعلانات", "تسويق"],
    risks: ["تقلب أداء الإعلانات", "مسؤولية ميزانيات العملاء"],
    advantages: ["طلب كبير من المحلات", "دخل متكرر شهري", "نتائج قابلة للقياس"],
    disadvantages: ["يحتاج خبرة عملية قبل جذب عملاء", "ضغط النتائج"],
    steps: [
      { title: "تعلم الأساسيات", detail: "أكمل كورساً مجانياً في إعلانات فيسبوك (Meta Blueprint) وتدرّب على حسابك." },
      { title: "حملة تجريبية", detail: "أدر حملة صغيرة لمحل قريب بسعر رمزي لبناء نتائج حقيقية." },
      { title: "عيّنة نتائج", detail: "وثّق النتائج (تكلفة/عملاء) في عرض جاهز تقدمه للعملاء." },
      { title: "أول عملاء", detail: "استهدف 5 محلات واعرض عليهم إدارة إعلاناتهم بأجر شهري." },
    ],
  },
  {
    slug: "tiktok-reels-editing",
    nameAr: "مونتاج ريلز وتيك توك للمحلات",
    description: "صناعة ومونتاج فيديوهات قصيرة (Reels/TikTok) للمحلات والعلامات التجارية لجذب الزبائن.",
    categorySlug: "content",
    effortLevel: "متوسط",
    timeRequired: "2 – 4 ساعات يومياً",
    skillsRequired: ["مونتاج", "حس إبداعي"],
    toolsNeeded: ["هاتف ذكي", "CapCut مجاني"],
    startCostEstimate: "يمكن البدء بهاتفك وتطبيق CapCut المجاني",
    startCostType: "zero_tools_existing",
    tags: ["فيديو", "مونتاج"],
    risks: ["اتجاهات المحتوى تتغير بسرعة", "منافسة من المبتدئين"],
    advantages: ["طلب متزايد من المحلات", "نتائج سريعة الظهور", "إبداع ممتع"],
    disadvantages: ["يتطلب مواكبة الترندات", "دخل يعتمد على عدد العملاء"],
    steps: [
      { title: "تعلم CapCut", detail: "أتقن المونتاج والترجمة التلقائية والمؤثرات في CapCut." },
      { title: "معرض أعمال", detail: "اصنع 5-10 فيديوهات تجريبية لعينات منتجات وارفعها." },
      { title: "عرض على المحلات", detail: "قدّم فيديو مجاني لمحل واحد مقابل نشر اسمك." },
      { title: "باقات أسعار", detail: "جهّز باقات: 4 فيديوهات شهرياً / 8 فيديوهات شهرياً." },
    ],
  },
  {
    slug: "data-entry-services",
    nameAr: "إدخال البيانات وتنظيمها",
    description: "إدخال وتنظيم بيانات المحلات والشركات في جداول وأنظمة، مع تفريغ مستندات وملفات.",
    categorySlug: "online",
    effortLevel: "منخفض",
    timeRequired: "1 – 3 ساعات يومياً",
    skillsRequired: ["إتقان Excel", "دقة عالية"],
    toolsNeeded: ["حاسوب", "إنترنت"],
    startCostEstimate: "يمكن البدء باستخدام حاسوبك وبرنامج Excel",
    startCostType: "zero_tools_existing",
    tags: ["بيانات", "إدخال"],
    risks: ["أجور منخفضة في البداية", "عمل متكرر"],
    advantages: ["سهل البدء", "لا يحتاج خبرة سابقة", "مرونة في الأوقات"],
    disadvantages: ["دخل محدود في البداية", "قد يكون مملاً"],
    steps: [
      { title: "إتقان Excel", detail: "تعلم الجداول والصيغ الأساسية في Excel." },
      { title: "حساب عمل حر", detail: "أنشئ حساباً على منصة عمل حر وحدد خدمتك." },
      { title: "أول مهام", detail: "قدّم على مهام صغيرة بأسعار تنافسية." },
      { title: "تخصص", detail: "تخصص في نوع بيانات محدد (فواتير، مخزون، عملاء)." },
    ],
  },
  {
    slug: "online-tutoring-sessions",
    nameAr: "دروس خصوصية أونلاين",
    description: "تقديم دروس دعم في مادة تتقنها (لغات، رياضيات، برمجة) عبر Zoom أو Meet للطلبة.",
    categorySlug: "education",
    effortLevel: "متوسط",
    timeRequired: "2 – 4 ساعات يومياً",
    skillsRequired: ["إتقان مادة", "شرح مبسط"],
    toolsNeeded: ["حاسوب", "إنترنت مستقر"],
    startCostEstimate: "يمكن البدء باستخدام حاسوبك والإنترنت",
    startCostType: "zero_tools_existing",
    tags: ["تعليم", "دروس"],
    risks: ["الاعتماد على الموسم الدراسي", "منافسة من مراكز الدعم"],
    advantages: ["طلب كبير في الجزائر", "أجر ساعي جيد", "يعتمد على معرفتك فقط"],
    disadvantages: ["يحتاج صبراً في الشرح", "أوقات محددة"],
    steps: [
      { title: "حدد مادتك", detail: "اختر مادة تتقنها ولها طلب (فرنسية، رياضيات، إعلام آلي)." },
      { title: "منهج بسيط", detail: "جهّز خطة دروس لشهر كامل." },
      { title: "جرب مجاناً", detail: "قدّم حصة تجريبية مجانية لطالب أو طالبين." },
      { title: "تسويق", detail: "انشر في جروبات الأولياء وفيسبوك، واعتمد على توصية الطلبة." },
    ],
  },
  {
    slug: "transcription-services",
    nameAr: "التفريغ الصوتي",
    description: "تحويل التسجيلات الصوتية والمرئية (محاضرات، اجتماعات، بودكاست) إلى نصوص مكتوبة.",
    categorySlug: "content",
    effortLevel: "منخفض",
    timeRequired: "1 – 3 ساعات يومياً",
    skillsRequired: ["سمع دقيق", "سرعة كتابة"],
    toolsNeeded: ["حاسوب", "سماعات"],
    startCostEstimate: "يمكن البدء بحاسوبك وسماعات عادية",
    startCostType: "zero_tools_existing",
    tags: ["تفريغ", "نصوص"],
    risks: ["أجور متواضعة", "يتطلب تركيزاً"],
    advantages: ["طلب مستمر", "عمل بسيط وواضح", "بدون معدات"],
    disadvantages: ["قد يكون متعباً للسمع", "دخل محدود"],
    steps: [
      { title: "تعلم أساسيات", detail: "تعلم تنسيق التفريغ (متحدث، طابع زمني)." },
      { title: "منصات", detail: "سجّل في منصات التفريغ أو اعرض الخدمة على صنّاع المحتوى." },
      { title: "أول عملاء", detail: "اعرض خدمتك على البودكاسترز والمترجمين." },
      { title: "رفع السعر", detail: "بعد الخبرة، تخصص في المجالات التقنية (طبي/قانوني)." },
    ],
  },
  {
    slug: "canva-template-seller",
    nameAr: "بيع قوالب تصميم جاهزة",
    description: "تصميم وبيع قوالب جاهزة (سوشيال ميديا، سير ذاتية، عروض) على منصات القوالب.",
    categorySlug: "online",
    effortLevel: "متوسط",
    timeRequired: "2 – 3 ساعات يومياً",
    skillsRequired: ["Canva", "ذوق تصميم"],
    toolsNeeded: ["حاسوب", "Canva مجاني"],
    startCostEstimate: "يمكن البدء بـ Canva المجاني",
    startCostType: "zero_tools_existing",
    tags: ["تصميم", "قوالب"],
    risks: ["منافسة عالمية", "دخل بطيء في البداية"],
    advantages: ["دخل سلبي (تبيع نفس القالب مرات)", "إبداع", "بلا عملاء مباشرين"],
    disadvantages: ["يحتاج صبراً لبناء مكتبة قوالب", "منافسة"],
    steps: [
      { title: "تخصص", detail: "اختر نوعاً واحداً: قوالب انستغرام للمحلات، سير ذاتية، عروض." },
      { title: "أنتج 10 قوالب", detail: "صمم 10 قوالب عالية الجودة." },
      { title: "منصة بيع", detail: "سجّل في منصة بيع قوالب (Etsy أو بدائل)." },
      { title: "وسّع المكتبة", detail: "أضف 3-5 قوالب أسبوعياً." },
    ],
  },
  {
    slug: "voice-over-services",
    nameAr: "التعليق الصوتي",
    description: "تسجيل تعليقات صوتية للإعلانات والفيديوهات والكتب الصوتية بصوت واضح.",
    categorySlug: "content",
    effortLevel: "منخفض",
    timeRequired: "1 – 2 ساعة يومياً",
    skillsRequired: ["صوت واضح", "إلقاء جيد"],
    toolsNeeded: ["هاتف أو ميكروفون بسيط"],
    startCostEstimate: "يمكن البدء بهاتفك ومكان هادئ",
    startCostType: "zero_tools_existing",
    tags: ["صوت", "تعليق"],
    risks: ["منافسة من أصحاب المعدات الاحترافية", "طلب متقطع"],
    advantages: ["إبداعي وممتع", "أجور جيدة للجودة العالية", "بلا رأس مال"],
    disadvantages: ["يحتاج تحسين الصوت", "يحتاج عينات احترافية"],
    steps: [
      { title: "عيّنات", detail: "سجّل 5 عيّنات متنوعة (إعلان، تعريفي، قصة)." },
      { title: "تحسين الجودة", detail: "سجّل في مكان هادئ وعدّل الصوت في Audacity المجاني." },
      { title: "منصات", detail: "اعرض خدمتك على منصات العمل الحر." },
      { title: "تخصص", detail: "تخصص في نوع: إعلانات، كتب صوتية، فيديوهات تعليمية." },
    ],
  },
  {
    slug: "virtual-assistant-local",
    nameAr: "مساعد افتراضي للمحلات",
    description: "تقديم دعم إداري عن بعد للمحلات: جدولة، رد على العملاء، تنظيم الملفات.",
    categorySlug: "services",
    effortLevel: "متوسط",
    timeRequired: "2 – 4 ساعات يومياً",
    skillsRequired: ["تنظيم", "تواصل"],
    toolsNeeded: ["هاتف", "إنترنت"],
    startCostEstimate: "يمكن البدء بهاتفك والإنترنت",
    startCostType: "zero_tools_existing",
    tags: ["مساعدة", "إدارية"],
    risks: ["أجور متفاوتة", "تعدد المهام"],
    advantages: ["طلب من المحلات المتنامية", "تعلم سريع", "مرونة"],
    disadvantages: ["قد يتطلب تفرغاً", "مسؤوليات متعددة"],
    steps: [
      { title: "حدد خدماتك", detail: "رد على رسائل، جدولة مواعيد، متابعة طلبات." },
      { title: "اعرض على المحلات", detail: "استهدف المحلات النشطة على السوشيال ميديا." },
      { title: "أول عميل", detail: "ابدأ بمحل واحد بأجر رمزي." },
      { title: "وسّع", detail: "أضف عملاء تدريجياً مع الحفاظ على الجودة." },
    ],
  },
  {
    slug: "affiliate-content-tiktok",
    nameAr: "صناعة محتوى تسويق بالعمولة",
    description: "صناعة محتوى (تيك توك/انستغرام) يروج منتجات بروابط عمولة عبر منصات التسويق بالعمولة.",
    categorySlug: "online",
    effortLevel: "متوسط",
    timeRequired: "2 – 3 ساعات يومياً",
    skillsRequired: ["صناعة محتوى", "إقناع"],
    toolsNeeded: ["هاتف ذكي", "إنترنت"],
    startCostEstimate: "يمكن البدء بهاتفك فقط",
    startCostType: "zero_tools_existing",
    tags: ["عمولة", "محتوى"],
    risks: ["بناء جمهور يحتاج وقتاً", "أرباح غير مستقرة"],
    advantages: ["بلا رأس مال", "دخل غير محدود نظرياً", "ممتع وإبداعي"],
    disadvantages: ["نتائج بطيئة", "الاعتماد على خوارزميات المنصات"],
    steps: [
      { title: "اختر نيتش", detail: "اختر مجالاً: منتجات تقنية، تجميل، كتب." },
      { title: "منصة عمولة", detail: "سجّل في برنامج عمولة متاح في منطقتك." },
      { title: "انشر بانتظام", detail: "انشر 3-5 فيديوهات أسبوعياً." },
      { title: "حلل", detail: "تابع أي نوع محتوى يحقق مبيعات وكرره." },
    ],
  },
  {
    slug: "store-management-services",
    nameAr: "إدارة متاجر أونلاين للغير",
    description: "إدارة متاجر إلكترونية (منتجات، أسعار، طلبات، رد على العملاء) لأصحاب البضائع.",
    categorySlug: "services",
    effortLevel: "متوسط",
    timeRequired: "2 – 4 ساعات يومياً",
    skillsRequired: ["تنظيم", "فهم المتاجر"],
    toolsNeeded: ["حاسوب", "إنترنت"],
    startCostEstimate: "يمكن البدء بحاسوبك والإنترنت",
    startCostType: "zero_tools_existing",
    tags: ["متاجر", "إدارة"],
    risks: ["مسؤولية المبيعات", "التزام بمواعيد العملاء"],
    advantages: ["طلب متزايد مع نمو التجارة الإلكترونية", "دخل شهري متكرر"],
    disadvantages: ["يحتاج ثقة أصحاب البضائع", "تعدد المهام"],
    steps: [
      { title: "تعلم إدارة متجر", detail: "تعلم منصة متجر واحدة جيداً (فيسبوك شوب/متجر إلكتروني)." },
      { title: "اعرض الخدمة", detail: "استهدف أصحاب الصفحات الناشئة." },
      { title: "أول متجر", detail: "أدر متجراً واحداً بأجر رمزي." },
      { title: "وسّع", detail: "أضف متاجر أخرى مع نظام متابعة واضح." },
    ],
  },
];

// ============================================================================
// DEFAULT_CONSENT — legal gate for assessment results
// ============================================================================

export const DEFAULT_CONSENT: ConsentVersion = {
  version: "1.0",
  title: "شروط عرض النتائج الاسترشادية",
  text: `تنبيه مهم: قبل عرض نتائجك، يرجى قراءة هذه الشروط بعناية.

1) طبيعة النتائج
النتائج المعروضة هنا توصيات استرشادية مبنية على إجاباتك ومعطيات عامة عن السوق الجزائري. هذه النتائج لا تُشكل ضماناً للربح أو النجاح أو تحقيق أي دخل محدد.

2) ليست استشارة مالية
منصة NABDA ليست مستشاراً مالياً مؤهلاً. لا تعتمد على هذه النتائج وحدها في اتخاذ قرارات مالية أو استثمارية. ننصحك باستشارة خبير مالي معتمد.

3) ليست استشارة قانونية
هذه النتائج لا تُشكل استشارة قانونية. بعض الأنشطة التجارية قد تتطلب تسجيلاً تجارياً أو بطاقة مهنية أو تراخيص خاصة حسب الولاية ونوع النشاط.

4) ليست استشارة محاسبية
لا تُعد هذه النتائج بديلاً عن استشارة محاسبية أو مالية. يُنصح بالرجوع إلى محاسب معتمد لفهم الالتزامات الضريبية والمحاسبية.

5) مسؤوليتك القانونية
أنت المسؤول الوحيد عن التحقق من الشروط القانونية والإدارية والتنظيمية الخاصة بالنشاط الذي تريده قبل الانطلاق. تأكد من الامتثال للقوانين المعمول بها في ولايتك.

6) دقة المعلومات
النتائج تعتمد بشكل كامل على المعلومات التي أدخلتها. كلما كانت إجاباتك أدق وأصدق، كانت التوصيات أكثر ملاءمة لوضعيتك.

7) القرار النهائي
القرار النهائي بشأن بدء أي نشاط تجاري أو مالي هو قرارك الشخصي وحده. منصة NABDA لا تتحمل المسؤولية عن أي قرارات تتخذها بناءً على هذه النتائج.

بملاحظتك "أوافق"، أنت تقر أنك قرأت وفهمت هذه الشروط وتوافق عليها طوعاً.`,
  required: true,
};

// ============================================================================
// Reference content — unchanged from original
// ============================================================================

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
