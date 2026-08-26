import { desc } from "drizzle-orm";
import { blogPosts } from "@/db/schema";
import { createAdminRoutes } from "@/lib/noCapital/adminHandlers";
import { notifyNewArticle } from "@/lib/push";

export const dynamic = "force-dynamic";

const routes = createAdminRoutes({
  table: blogPosts,
  tableName: "blog_posts",
  itemName: "المقال",
  orderBy: (t) => desc(t.createdAt),
  validate: (body) => {
    if (!body.slug || !body.title || !body.summary || !body.content || !body.category) {
      return "المعرّف، العنوان، الملخص، المحتوى والتصنيف مطلوبة.";
    }
    return null;
  },
  create: (body) => ({
    slug: String(body.slug),
    title: String(body.title),
    summary: String(body.summary),
    content: String(body.content),
    category: String(body.category),
    capitalRange: body.capitalRange ? String(body.capitalRange) : null,
    readTime: body.readTime ? String(body.readTime) : "5 دقائق",
    image: body.image ? String(body.image) : null,
    infographic: body.infographic ? String(body.infographic) : null,
    sources: body.sources ? String(body.sources) : null,
    financialData: body.financialData ? String(body.financialData) : null,
  }),
  update: (body) => ({
    slug: body.slug ? String(body.slug) : undefined,
    title: body.title ? String(body.title) : undefined,
    summary: body.summary ? String(body.summary) : undefined,
    content: body.content ? String(body.content) : undefined,
    category: body.category ? String(body.category) : undefined,
    capitalRange: body.capitalRange ? String(body.capitalRange) : undefined,
    readTime: body.readTime ? String(body.readTime) : undefined,
    image: body.image ? String(body.image) : undefined,
    infographic: body.infographic ? String(body.infographic) : undefined,
    sources: body.sources ? String(body.sources) : undefined,
    financialData: body.financialData ? String(body.financialData) : undefined,
  }),
  afterCreate: async (created) => {
    await notifyNewArticle({ slug: created.slug, title: created.title });
  },
});

export async function GET() {
  return routes.list();
}

export async function POST(request: Request) {
  return routes.create(request);
}
