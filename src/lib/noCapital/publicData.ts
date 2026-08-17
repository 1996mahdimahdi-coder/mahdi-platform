import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  categories,
  consentVersions,
  noCapitalProjects,
  noCapitalQuestions,
  noCapitalRecommendationRules,
} from "@/db/schema";
import { isMissingTableError } from "@/lib/noCapital/fallback";
import {
  DEFAULT_CATEGORIES,
  DEFAULT_CONSENT,
  DEFAULT_QUESTIONS,
} from "@/lib/noCapital/defaults";
import type {
  CategoryItem,
  ConsentVersion,
  ExecutionPlanItem,
  FirstOrderPlanItem,
  MarketingPlanItem,
  NoCapitalProfile,
  NoCapitalQuestion,
  NoCapitalRecommendationRule,
} from "@/lib/noCapital/types";

// ============================================================================
// Loaders for public read paths. Every loader fails-open on "table missing"
// (42P01) and returns the code defaults. A `source` field tells the UI whether
// the data came from the database or from the built-in defaults.
// ============================================================================

export async function loadCategories(): Promise<{ categories: CategoryItem[]; source: "database" | "defaults" }> {
  try {
    const rows = await db.select().from(categories).orderBy(asc(categories.sortOrder));
    if (rows.length === 0) return { categories: DEFAULT_CATEGORIES, source: "defaults" };
    return { categories: rows as unknown as CategoryItem[], source: "database" };
  } catch (error) {
    if (isMissingTableError(error)) return { categories: DEFAULT_CATEGORIES, source: "defaults" };
    throw error;
  }
}

export async function loadQuestions(): Promise<{ questions: NoCapitalQuestion[]; source: "database" | "defaults" }> {
  try {
    const rows = await db
      .select()
      .from(noCapitalQuestions)
      .where(eq(noCapitalQuestions.active, true))
      .orderBy(asc(noCapitalQuestions.order));
    if (rows.length === 0) return { questions: DEFAULT_QUESTIONS, source: "defaults" };
    return { questions: rows as unknown as NoCapitalQuestion[], source: "database" };
  } catch (error) {
    if (isMissingTableError(error)) return { questions: DEFAULT_QUESTIONS, source: "defaults" };
    throw error;
  }
}

export async function loadNoCapitalProfiles(): Promise<{ profiles: NoCapitalProfile[]; source: "database" | "defaults" }> {
  try {
    const projectRows = await db
      .select()
      .from(noCapitalProjects)
      .where(eq(noCapitalProjects.active, true));

    if (projectRows.length === 0) return { profiles: [], source: "database" };

    const catIds = [...new Set(projectRows.map((r) => r.categoryId).filter((id): id is number => id != null))];
    const domIds = [...new Set(projectRows.map((r) => r.domainId).filter((id): id is number => id != null))];

    let catMap = new Map<number, string>();
    let domMap = new Map<number, string>();

    if (catIds.length > 0) {
      const catRows = await db
        .select({ id: categories.id, slug: categories.slug })
        .from(categories);
      for (const row of catRows) {
        if (catIds.includes(row.id)) catMap.set(row.id, row.slug);
        if (domIds.includes(row.id)) domMap.set(row.id, row.slug);
      }
    }

    const profiles = projectRows.map((row) => ({
      ...row,
      categorySlug: row.categoryId != null ? (catMap.get(row.categoryId) ?? null) : null,
      domainSlug: row.domainId != null ? (domMap.get(row.domainId) ?? null) : null,
    })) as unknown as NoCapitalProfile[];
    return { profiles, source: "database" };
  } catch (error) {
    if (isMissingTableError(error)) return { profiles: [], source: "defaults" };
    throw error;
  }
}

export async function loadRecommendationRules(): Promise<{ rules: NoCapitalRecommendationRule[]; source: "database" | "defaults" }> {
  try {
    const rows = await db
      .select()
      .from(noCapitalRecommendationRules)
      .where(eq(noCapitalRecommendationRules.active, true));
    return { rules: rows as unknown as NoCapitalRecommendationRule[], source: "database" };
  } catch (error) {
    if (isMissingTableError(error)) return { rules: [], source: "defaults" };
    throw error;
  }
}

export async function loadActiveConsent(): Promise<{ consent: ConsentVersion; source: "database" | "defaults" }> {
  try {
    const [row] = await db
      .select()
      .from(consentVersions)
      .where(eq(consentVersions.active, true))
      .orderBy(desc(consentVersions.updatedAt))
      .limit(1);
    if (row) return { consent: row as unknown as ConsentVersion, source: "database" };
    return { consent: DEFAULT_CONSENT, source: "defaults" };
  } catch (error) {
    if (isMissingTableError(error)) return { consent: DEFAULT_CONSENT, source: "defaults" };
    throw error;
  }
}

// ----------------------------------------------------------------------------
// Reference content for the plans sections. These are generic templates that
// the user can apply to any no-capital project. They are code defaults by
// design (plans are generated per-project later from curated data).
// ----------------------------------------------------------------------------

export const DEFAULT_EXECUTION_PLAN: ExecutionPlanItem = {
  id: 0,
  slug: "generic-90-days",
  title: "الخطة الشاملة 90 يوماً",
  subtitle: "خطة عامة قابلة للتخصيص حسب مشروعك المختار",
  durationDays: 90,
  objective: "الانتقال من الصفر إلى أول عميلين ثابتين خلال 90 يوماً",
  phases: [
    {
      month: 1,
      week: "الأسبوع 1 - 2",
      title: "اختيار الفكرة وضبطها",
      tasks: [
        "تحديد الخدمة أو المنتج بدقة وبجملة واحدة",
        "دراسة المنافسين المحليين ووضع عرض مختلف",
        "تحديد أول عرض تجريبي بجودة عالية",
      ],
      kpis: ["فكرة واضحة", "قائمة 5 منافسين", "عرض أول محدد"],
    },
    {
      month: 1,
      week: "الأسبوع 3 - 4",
      title: "تجهيز الهوية والعرض",
      tasks: [
        "إنشاء صفحة عرض بسيطة (واتساب + صفحة تعريف)",
        "فتح حسابين على منصات تناسب جمهورك",
        "كتابة عرض القيمة: ماذا تقدم ولمن ولماذا أنت",
      ],
      kpis: ["صفحة جاهزة", "10 زيارات", "عرض قيمة واضح"],
    },
    {
      month: 2,
      week: "الأسبوع 5 - 8",
      title: "البحث عن أول العملاء",
      tasks: [
        "إرسال 30 عرضاً شخصياً للدائرة القريبة",
        "نشر محتوى 3 مرات أسبوعياً",
        "طلب رأي صادق بعد كل تجربة خدمة",
      ],
      kpis: ["أول عميل", "20 محادثة", "5 تجارب"],
    },
    {
      month: 3,
      week: "الأسبوع 9 - 12",
      title: "التثبيت والتوسع",
      tasks: [
        "تحسين جودة الخدمة بناءً على الملاحظات",
        "طلب تزكيات وإضافة عميلين ثانويين",
        "قياس الأرباح وضبط الأسعار للمرحلة القادمة",
      ],
      kpis: ["عميلان ثابتان", "دخل شهري متكرر", "رضا العملاء"],
    },
  ],
  kpis: ["أول عميل خلال 60 يوماً", "دخل شهري ثابت", "رضا العملاء"],
};

export const DEFAULT_FIRST_ORDER_PLAN: FirstOrderPlanItem = {
  id: 0,
  slug: "first-customer-generic",
  title: "خطة الحصول على أول عميل",
  targetAudience: "الدائرة القريبة جغرافياً: المعارف، المتاجر، المكاتب الصغيرة في ولايتك",
  valueProposition: "عرض بسيط وواضح: خدمة جيدة + سعر مناسب + جدية في المواعيد",
  channels: [
    { channel: "المعاينة المباشرة", effort: "مرتفع", notes: "زيارة المتاجر والمكاتب المحلية" },
    { channel: "الواتساب والعائلة", effort: "منخفض", notes: "إشعار بسيط للأقارب والمعارف" },
    { channel: "مجموعات الفيسبوك المحلية", effort: "متوسط", notes: "نشر عرض واضح مع أمثلة" },
    { channel: "انستغرام", effort: "متوسط", notes: "3 منشورات أسبوعياً لعرض العمل" },
  ],
  outreachSteps: [
    "جهّز عرضاً من سطرين يشرح ماذا تقدم ولمن",
    "ابدأ بالدائرة القريبة: المعارف والمتاجر المحلية",
    "قدّم أول 3 عملاء بسعر تشجيعي مقابل تقييم صادق",
    "اطلب تزكية بعد إنجاز كل خدمة",
    "جمّع كل ردود العملاء في سجل واحد",
  ],
  scriptText:
    "السلام عليكم، أنا [اسمك]، أقدّم [خدمة/منتج] في [منطقتك]. حالياً أبحث عن أول عملاء بأسعار خاصة مقابل رأيك الصادق. هل أنتم مهتمون بتجربة؟",
  successMetrics: ["أول عميل مدفوع خلال 30 يوماً", "3 تقييمات أو تزكيات", "طلب متكرر أو إحالة"],
};

export const DEFAULT_MARKETING_PLANS: MarketingPlanItem[] = [
  {
    id: 0,
    slug: "marketing-low",
    title: "تسويق بالمجهود (ميزانية صفر)",
    budgetLevel: "low",
    goals: ["بناء حضور محلي أولي", "أول 10 عملاء محتملين"],
    channels: [
      { channel: "مجموعات الفيسبوك المحلية", priority: "عليا", cost: "0", effort: "متوسط", notes: "إجابات مفيدة قبل أي ترويج" },
      { channel: "الواتساب / الدائرة القريبة", priority: "عليا", cost: "0", effort: "منخفض", notes: "رسائل شخصية لا جماعية" },
      { channel: "انستغرام", priority: "متوسطة", cost: "0", effort: "مرتفع", notes: "محتوى ثابت يعرض عملك" },
    ],
    timelineWeeks: [
      { week: "الأسبوع 1 - 2", focus: "الحضور", tasks: ["ملء الحسابات بمحتوى أساسي", "الانضمام لمجموعات محلية"] },
      { week: "الأسبوع 3 - 6", focus: "التفاعل", tasks: ["نشر 3 مرات أسبوعياً", "الرد على كل استفسار"] },
      { week: "الأسبوع 7 - 12", focus: "التحويل", tasks: ["عروض مباشرة للدائرة القريبة", "طلب تزكيات"] },
    ],
  },
  {
    id: 0,
    slug: "marketing-medium",
    title: "تسويق بميزانية صغيرة",
    budgetLevel: "medium",
    goals: ["جلب 30 عميلاً محتملاً", "بناء صفحة أعمال معتمدة"],
    channels: [
      { channel: "إعلانات فيسبوك وإنستغرام", priority: "عليا", cost: "منخفضة", effort: "متوسط", notes: "حملة مستهدفة محلياً بـ 500 - 1500 دج" },
      { channel: "محتوى + مؤثرات محلية", priority: "متوسطة", cost: "متوسطة", effort: "متوسط", notes: "تعاون صغير مع حسابات محلية" },
      { channel: "تيك توك", priority: "متوسطة", cost: "0", effort: "مرتفع", notes: "1 - 2 فيديو يومياً" },
    ],
    timelineWeeks: [
      { week: "الأسبوع 1 - 3", focus: "الإعداد", tasks: ["تحسين الصفحة والبيانات", "إعداد أول حملة إعلانية صغيرة"] },
      { week: "الأسبوع 4 - 8", focus: "الاختبار", tasks: ["اختبار 3 إعلانات مختلفة", "تتبع التحويلات يومياً"] },
      { week: "الأسبوع 9 - 12", focus: "التوسع", tasks: ["توسيع الحملة الناجحة", "بناء قائمة عملاء محتملين"] },
    ],
  },
  {
    id: 0,
    slug: "marketing-high",
    title: "تسويق مؤسسي متكامل",
    budgetLevel: "high",
    goals: ["نمو سريع وعلامة تجارية واضحة", "قناة مبيعات شبه مستمرة"],
    channels: [
      { channel: "حملات إعلانية متعددة", priority: "عليا", cost: "متوسطة", effort: "متوسط", notes: "فيسبوك + جوجل حسب النشاط" },
      { channel: "يوتيوب ومحتوى معمق", priority: "متوسطة", cost: "متوسطة", effort: "مرتفع", notes: "فيديو أسبوعي يبني ثقة" },
      { channel: "تعاون وتوزيع تجاري", priority: "متوسطة", cost: "متوسطة", effort: "مرتفع", notes: "شراكات مع موزعين محليين" },
    ],
    timelineWeeks: [
      { week: "الأسبوع 1 - 4", focus: "الاستراتيجية", tasks: ["وضع استراتيجية العلامة", "إعداد الحملات والمواد"] },
      { week: "الأسبوع 5 - 8", focus: "الإطلاق", tasks: ["إطلاق الحملات", "بناء المحتوى الأسبوعي"] },
      { week: "الأسبوع 9 - 12", focus: "التحسين", tasks: ["قياس عائد الاستثمار", "توجيه الميزانية نحو الأفضل أداءً"] },
    ],
  },
];
