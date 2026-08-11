import { db } from "./index";
import { wilayas, communes, projects, scoringWeights, users, verificationSources, blogPosts } from "./schema";
import { ALGERIAN_WILAYAS, INITIAL_PROJECTS, INITIAL_SOURCES, INITIAL_BLOG_POSTS, INITIAL_WEIGHTS } from "./seedData";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export async function seedDatabase() {
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
    }

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

    // 6. Seed Admin User
    const existingAdmin = await db.select().from(users).where(eq(users.email, "admin@nabda.dz")).limit(1);
    if (existingAdmin.length === 0) {
      console.log("Seeding default admin user...");
      const hashedPassword = await bcrypt.hash("admin123456", 10);
      await db.insert(users).values({
        name: "مدير NABDA",
        email: "admin@nabda.dz",
        passwordHash: hashedPassword,
        role: "admin",
        phone: "0550000000",
      });
    }

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error during database seed:", error);
  }
}
