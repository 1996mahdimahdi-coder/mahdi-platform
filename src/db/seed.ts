import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { ALGERIAN_WILAYAS, INITIAL_PROJECTS, INITIAL_SOURCES, INITIAL_BLOG_POSTS, INITIAL_WEIGHTS } from "./seedData";
import { eq } from "drizzle-orm";
import { wilayas, communes, projects, scoringWeights, users, verificationSources, blogPosts } from "./schema";

export async function seedDatabase() {
const { db } = await import("./index");
  try {
    console.log("Starting database seed check...");

    // 1. Seed Scoring Weights
    const existingWeights = await db.select().from(scoringWeights).limit(1);
    if (existingWeights.length === 0) {
      console.log("Seeding scoring weights...");
      await db.insert(scoringWeights).values(INITIAL_WEIGHTS);
    }

    // 2. Seed Wilayas and Communes
    const existingWilayas = await db.select().from(wilayas).limit(1);
    if (existingWilayas.length === 0) {
      console.log("Seeding Algerian wilayas & communes...");
      for (const item of ALGERIAN_WILAYAS) {
        const [insertedWilaya] = await db.insert(wilayas).values({
          code: item.code,
          nameAr: item.nameAr,
          nameFr: item.nameFr,
          areaType: item.areaType,
        }).returning();

        if (insertedWilaya && item.communes.length > 0) {
          const communeRows = item.communes.map((cName) => ({
            wilayaId: insertedWilaya.id,
            nameAr: cName,
            nameFr: cName,
            populationDensity: "medium",
          }));
          await db.insert(communes).values(communeRows);
        }
      }
    }

    // 3. Seed Projects
const existingProjects = await db.select().from(projects).limit(1);

if (existingProjects.length === 0) {
  console.log("Seeding Algerian projects...");

  for (const proj of INITIAL_PROJECTS) {
    await db.insert(projects).values(proj as any);
  }
} else {
  console.log("Updating all projects from INITIAL_PROJECTS...");

  for (const proj of INITIAL_PROJECTS) {
    await db
      .update(projects)
      .set({
        projectName: proj.projectName,
        category: proj.category,
        description: proj.description,
        minCapital: proj.minCapital,
        recommendedCapital: proj.recommendedCapital,
        maxCapital: proj.maxCapital,
        riskLevel: proj.riskLevel,
        requiresShop: proj.requiresShop,
        homeBased: proj.homeBased,
        onlinePossible: proj.onlinePossible,
        transportRequired: proj.transportRequired,
        skillsRequired: proj.skillsRequired,
        timeRequired: proj.timeRequired,
        difficulty: proj.difficulty,
        scalability: proj.scalability,
        seasonality: proj.seasonality,
        competitionLevel: proj.competitionLevel,
        targetArea: proj.targetArea,
        equipment: proj.equipment,
        initialStock: proj.initialStock,
        fixedCosts: proj.fixedCosts,
        variableCostsPercent: proj.variableCostsPercent,
        pricingMethod: proj.pricingMethod,
        profitFormula: proj.profitFormula,
        breakEvenFormula: proj.breakEvenFormula,
        risks: proj.risks,
        advantages: proj.advantages,
        disadvantages: proj.disadvantages,
        launchPlan: proj.launchPlan,
        legalNotes: proj.legalNotes,
        source: proj.source,
        lastUpdated: new Date(),
      })
      .where(eq(projects.projectId, proj.projectId));
  }

  console.log(`Updated ${INITIAL_PROJECTS.length} projects successfully.`);
}
/*
 * 4. Update financial profiles for all initial projects.
 * These are planning estimates for the Algerian market,
 * not guaranteed market prices.
 */
const PROJECT_FINANCIAL_PROFILES: Record<string, {
  minCapital: number;
  recommendedCapital: number;
  maxCapital: number;
  initialStock: number;
  fixedCosts: number;
  variableCostsPercent: number;
  legalNotes: string;
}> = {
  "phone-accessories": {
    minCapital: 25000,
    recommendedCapital: 80000,
    maxCapital: 250000,
    initialStock: 44000,
    fixedCosts: 5000,
    variableCostsPercent: 12,
    legalNotes: "نشاط تجاري لبيع السلع. يجب احترام متطلبات التسجيل والفوترة والتجارة الإلكترونية عند البيع عبر الإنترنت، والتحقق من الوضعية القانونية المناسبة قبل التوسع."
  },

  "product-photography": {
    minCapital: 30000,
    recommendedCapital: 90000,
    maxCapital: 300000,
    initialStock: 0,
    fixedCosts: 4000,
    variableCostsPercent: 8,
    legalNotes: "نشاط خدمات تصوير. يجب اختيار الوضعية القانونية المناسبة للنشاط والتصريح بالنشاط وفق القواعد المعمول بها."
  },

  "home-sweets-bakery": {
    minCapital: 30000,
    recommendedCapital: 90000,
    maxCapital: 250000,
    initialStock: 20000,
    fixedCosts: 5000,
    variableCostsPercent: 45,
    legalNotes: "نشاط غذائي يتطلب احترام الشروط الصحية والتنظيمية المعمول بها، مع التحقق من التسجيلات والتراخيص المطلوبة حسب طبيعة النشاط ومكان ممارسته."
  },

  "natural-honey-oils": {
    minCapital: 50000,
    recommendedCapital: 130000,
    maxCapital: 400000,
    initialStock: 70000,
    fixedCosts: 5000,
    variableCostsPercent: 20,
    legalNotes: "نشاط بيع منتجات غذائية أو طبيعية. يجب احترام متطلبات السلامة والوسم والتجارة والتسجيلات المطلوبة حسب نوع المنتجات."
  },

  "custom-printing-gifts": {
    minCapital: 70000,
    recommendedCapital: 180000,
    maxCapital: 500000,
    initialStock: 40000,
    fixedCosts: 7000,
    variableCostsPercent: 25,
    legalNotes: "نشاط تصنيع وطباعة حسب الطلب. يجب اختيار الوضعية القانونية المناسبة والتأكد من حقوق استعمال الصور والعلامات التجارية والتصاميم."
  },

  "fast-food-delivery-hub": {
    minCapital: 80000,
    recommendedCapital: 200000,
    maxCapital: 500000,
    initialStock: 30000,
    fixedCosts: 12000,
    variableCostsPercent: 50,
    legalNotes: "نشاط غذائي وخدمات توصيل. يتطلب احترام الشروط الصحية والتنظيمية والتسجيلات أو التراخيص المطلوبة حسب نموذج النشاط ومكانه."
  },

  "mobile-repair-freelance": {
    minCapital: 40000,
    recommendedCapital: 110000,
    maxCapital: 350000,
    initialStock: 20000,
    fixedCosts: 4000,
    variableCostsPercent: 18,
    legalNotes: "نشاط خدمات صيانة. يجب اختيار الوضعية القانونية المناسبة والتأكد من متطلبات ممارسة النشاط وشراء قطع الغيار وفوترة الخدمات."
  },

  "social-media-management": {
    minCapital: 15000,
    recommendedCapital: 50000,
    maxCapital: 150000,
    initialStock: 0,
    fixedCosts: 4000,
    variableCostsPercent: 5,
    legalNotes: "نشاط خدمات رقمية. يمكن ممارسته من المنزل وفق الوضعية القانونية المناسبة للنشاط، مع احترام العقود وحقوق المحتوى والبيانات."
  },

  "tutoring-learning-hub": {
    minCapital: 15000,
    recommendedCapital: 50000,
    maxCapital: 150000,
    initialStock: 0,
    fixedCosts: 3000,
    variableCostsPercent: 8,
    legalNotes: "نشاط تعليم أو دعم دراسي. يجب التحقق من الإطار القانوني المناسب حسب طبيعة الدروس ومكان تقديمها وصفة مقدم الخدمة."
  },

  "clothing-e-commerce": {
    minCapital: 90000,
    recommendedCapital: 220000,
    maxCapital: 800000,
    initialStock: 140000,
    fixedCosts: 9000,
    variableCostsPercent: 25,
    legalNotes: "نشاط تجارة سلع عبر الإنترنت. يجب احترام متطلبات التجارة الإلكترونية والتسجيل والفوترة وحماية المستهلك."
  },

  "car-detailing-mobile": {
    minCapital: 90000,
    recommendedCapital: 220000,
    maxCapital: 600000,
    initialStock: 25000,
    fixedCosts: 7000,
    variableCostsPercent: 25,
    legalNotes: "نشاط خدمات تنظيف وتجهيز السيارات. يجب مراعاة طبيعة مكان العمل واستعمال المياه والمواد الكيميائية وأي متطلبات محلية مرتبطة بالنشاط."
  },

  "home-maintenance-agency": {
    minCapital: 25000,
    recommendedCapital: 70000,
    maxCapital: 200000,
    initialStock: 5000,
    fixedCosts: 4000,
    variableCostsPercent: 20,
    legalNotes: "نشاط خدمات منزلية. يجب تحديد الوضعية القانونية المناسبة لكل خدمة والتحقق من الشروط الخاصة بالمهن المنظمة عند الاقتضاء."
  },

  "perfume-oils-refill": {
    minCapital: 40000,
    recommendedCapital: 100000,
    maxCapital: 300000,
    initialStock: 55000,
    fixedCosts: 4500,
    variableCostsPercent: 15,
    legalNotes: "نشاط بيع منتجات عطرية. يجب احترام قواعد الوسم والمصدر والفوترة، وعدم استعمال أسماء أو علامات تجارية محمية بطريقة غير قانونية."
  },

  "graphics-web-freelancing": {
    minCapital: 20000,
    recommendedCapital: 60000,
    maxCapital: 200000,
    initialStock: 0,
    fixedCosts: 3500,
    variableCostsPercent: 5,
    legalNotes: "نشاط خدمات رقمية. يجب اختيار الوضعية القانونية المناسبة واحترام حقوق الملكية الفكرية وحقوق استخدام الصور والخطوط والبرمجيات."
  },

  "agricultural-seedlings-honey": {
    minCapital: 30000,
    recommendedCapital: 80000,
    maxCapital: 250000,
    initialStock: 25000,
    fixedCosts: 3000,
    variableCostsPercent: 18,
    legalNotes: "نشاط مرتبط بالزراعة والمنتجات الطبيعية. يجب التحقق من القواعد الخاصة بالمنتجات الزراعية والغذائية حسب طبيعة المنتج ومصدره."
  },

  "used-books-online": {
    minCapital: 20000,
    recommendedCapital: 50000,
    maxCapital: 150000,
    initialStock: 30000,
    fixedCosts: 2000,
    variableCostsPercent: 8,
    legalNotes: "نشاط بيع كتب مستعملة. يجب احترام قواعد التجارة والفوترة وحقوق الملكية الفكرية عند التعامل مع المحتوى."
  },

  "home-event-planning": {
    minCapital: 50000,
    recommendedCapital: 130000,
    maxCapital: 350000,
    initialStock: 25000,
    fixedCosts: 5000,
    variableCostsPercent: 20,
    legalNotes: "نشاط تنظيم مناسبات وخدمات. يجب اختيار الوضعية القانونية المناسبة واحترام العقود ومتطلبات المكان والخدمات المقدمة."
  },

  "home-appliance-spareparts": {
    minCapital: 60000,
    recommendedCapital: 150000,
    maxCapital: 450000,
    initialStock: 90000,
    fixedCosts: 4000,
    variableCostsPercent: 12,
    legalNotes: "نشاط بيع قطع غيار الأجهزة المنزلية. يجب احترام قواعد التجارة والفوترة وضمان مصدر السلع ومطابقتها."
  },

  "custom-leather-handicrafts": {
    minCapital: 40000,
    recommendedCapital: 100000,
    maxCapital: 300000,
    initialStock: 30000,
    fixedCosts: 3500,
    variableCostsPercent: 20,
    legalNotes: "نشاط حرفي وتصنيع حسب الطلب. يجب اختيار الوضعية القانونية المناسبة واحترام حقوق التصاميم والعلامات التجارية."
  },

  "poultry-egg-distribution": {
    minCapital: 50000,
    recommendedCapital: 130000,
    maxCapital: 350000,
    initialStock: 50000,
    fixedCosts: 4000,
    variableCostsPercent: 30,
    legalNotes: "نشاط توزيع منتجات غذائية. يجب احترام شروط النقل والتخزين والسلامة الصحية والقواعد التجارية المعمول بها."
  },

  "home-cleaning-services": {
    minCapital: 30000,
    recommendedCapital: 80000,
    maxCapital: 250000,
    initialStock: 15000,
    fixedCosts: 5000,
    variableCostsPercent: 20,
    legalNotes: "نشاط خدمات تنظيف. يجب اختيار الوضعية القانونية المناسبة واحترام شروط السلامة عند استعمال مواد التنظيف."
  },

  "car-accessories-dashcam": {
    minCapital: 80000,
    recommendedCapital: 200000,
    maxCapital: 500000,
    initialStock: 120000,
    fixedCosts: 7000,
    variableCostsPercent: 15,
    legalNotes: "نشاط بيع إكسسوارات السيارات والأجهزة الإلكترونية. يجب احترام قواعد التجارة والفوترة وضمان مصدر المنتجات ومطابقتها."
  },

  "coffee-tea-kiosk": {
    minCapital: 70000,
    recommendedCapital: 170000,
    maxCapital: 450000,
    initialStock: 30000,
    fixedCosts: 10000,
    variableCostsPercent: 40,
    legalNotes: "نشاط غذائي ومشروبات. يجب احترام الشروط الصحية والتنظيمية والتراخيص أو التسجيلات المطلوبة حسب نموذج ومكان النشاط."
  },

  "translator-redaction-desk": {
    minCapital: 15000,
    recommendedCapital: 40000,
    maxCapital: 120000,
    initialStock: 0,
    fixedCosts: 2000,
    variableCostsPercent: 5,
    legalNotes: "نشاط خدمات لغوية وترجمة. يجب اختيار الوضعية القانونية المناسبة والتحقق من الشروط الخاصة بالوثائق الرسمية أو المهن المنظمة عند الحاجة."
  },

  "solar-cleaning-consulting": {
    minCapital: 50000,
    recommendedCapital: 150000,
    maxCapital: 400000,
    initialStock: 10000,
    fixedCosts: 5000,
    variableCostsPercent: 15,
    legalNotes: "نشاط خدمات واستشارات مرتبطة بالطاقة والتنظيف. يجب تحديد طبيعة النشاط بدقة والتحقق من أي اعتماد أو تأهيل مطلوب للأعمال التقنية."
  }
};

for (const [projectId, profile] of Object.entries(PROJECT_FINANCIAL_PROFILES)) {
  await db
    .update(projects)
    .set({
      minCapital: profile.minCapital,
      recommendedCapital: profile.recommendedCapital,
      maxCapital: profile.maxCapital,
      initialStock: profile.initialStock,
      fixedCosts: profile.fixedCosts,
      variableCostsPercent: profile.variableCostsPercent,
      legalNotes: profile.legalNotes,
      lastUpdated: new Date(),
    })
    .where(eq(projects.projectId, projectId));
}

console.log(`Updated financial profiles for ${Object.keys(PROJECT_FINANCIAL_PROFILES).length} projects.`);

// 4. Seed Verification Sources
    const existingSources = await db.select().from(verificationSources).limit(1);
    if (existingSources.length === 0) {
      console.log("Seeding verification sources...");
      await db.insert(verificationSources).values(INITIAL_SOURCES);
    }

    // 5. Seed Blog Posts
    const existingBlog = await db.select().from(blogPosts);
    if (existingBlog.length < 100) {
      console.log(`Seeding ${existingBlog.length} existing blog posts. Adding comprehensive articles...`);
      // Delete old blog posts to replace with comprehensive list
      if (existingBlog.length > 0) {
        await db.delete(blogPosts);
        console.log("Cleared old blog posts");
      }
      // Import the combined articles data
      const { VERIFIED_ARTICLES } = await import("./articlesData");
      const { getAllExtraArticles } = await import("./moreArticles");
      const { getAllFinalArticles } = await import("./finalArticles");
      const { getAllExtraArticlesBatch } = await import("./extraArticles");
      const ALL_ARTICLES = [
        ...VERIFIED_ARTICLES,
        ...getAllExtraArticles(),
        ...getAllFinalArticles(),
        ...getAllExtraArticlesBatch(),
      ];
      // Map to blog posts format
      const postsToInsert = ALL_ARTICLES.map((article: any) => ({
        slug: article.slug,
        title: article.title,
        summary: article.summary,
        content: article.content,
        category: article.category,
        capitalRange: article.capitalRange,
        readTime: article.readTime,
        image: article.image ? `/blog/${article.image}` : null,
        infographic: article.infographic ? `/blog/${article.infographic}` : null,
        sources: article.sources ? JSON.stringify(article.sources) : null,
        financialData: article.financialData ? JSON.stringify(article.financialData) : null,
      }));
      console.log(`Inserting ${postsToInsert.length} verified articles...`);
      // Insert in batches of 20 to avoid any size limits
      const batchSize = 20;
      for (let i = 0; i < postsToInsert.length; i += batchSize) {
        const batch = postsToInsert.slice(i, i + batchSize);
        await db.insert(blogPosts).values(batch);
        console.log(`Inserted batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(postsToInsert.length / batchSize)}`);
      }
    }


    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error during database seed:", error);
  }
}
