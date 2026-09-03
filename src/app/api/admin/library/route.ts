import { desc } from "drizzle-orm";
import { libraryBooks } from "@/db/schema";
import { createAdminRoutes } from "@/lib/noCapital/adminHandlers";

export const dynamic = "force-dynamic";

const routes = createAdminRoutes({
  table: libraryBooks,
  tableName: "library_books",
  itemName: "الكتاب",
  orderBy: (t) => desc(t.updatedAt),
  validate: (body) => {
    if (!body.slug || !body.title || !body.shortDescription) {
      return "المعرّف، العنوان والوصف المختصر مطلوبة.";
    }
    return null;
  },
  create: (body) => ({
    slug: String(body.slug),
    title: String(body.title),
    category: String(body.category ?? "عام"),
    shortDescription: String(body.shortDescription),
    description: body.description ? String(body.description) : null,
    coverImage: body.coverImage ? String(body.coverImage) : null,
    whatYouLearn: Array.isArray(body.whatYouLearn) ? body.whatYouLearn.map(String) : [],
    outline: Array.isArray(body.outline) ? body.outline.map(String) : [],
    priceDzd: body.priceDzd != null ? Number(body.priceDzd) : 0,
    published: body.published === true ? true : false,
  }),
  update: (body) => ({
    slug: String(body.slug),
    title: String(body.title),
    category: String(body.category ?? "عام"),
    shortDescription: String(body.shortDescription),
    description: body.description ? String(body.description) : null,
    coverImage: body.coverImage ? String(body.coverImage) : null,
    whatYouLearn: Array.isArray(body.whatYouLearn) ? body.whatYouLearn.map(String) : [],
    outline: Array.isArray(body.outline) ? body.outline.map(String) : [],
    priceDzd: body.priceDzd != null ? Number(body.priceDzd) : 0,
    published: body.published === true ? true : false,
    updatedAt: new Date(),
  }),
});

export async function GET() {
  return routes.list();
}

export async function POST(request: Request) {
  return routes.create(request);
}