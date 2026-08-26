import { desc } from "drizzle-orm";
import { courses } from "@/db/schema";
import { createAdminRoutes } from "@/lib/noCapital/adminHandlers";
import { notifyNewCourse } from "@/lib/push";

export const dynamic = "force-dynamic";

const routes = createAdminRoutes({
  table: courses,
  tableName: "courses",
  itemName: "الدورة",
  orderBy: (t) => desc(t.updatedAt),
  validate: (body) => {
    if (!body.slug || !body.title || !body.summary) {
      return "المعرّف، العنوان والملخص مطلوبة.";
    }
    return null;
  },
  create: (body) => ({
    slug: String(body.slug),
    title: String(body.title),
    summary: String(body.summary),
    description: body.description ? String(body.description) : null,
    categoryId: body.categoryId ? Number(body.categoryId) : null,
    level: String(body.level ?? "مبتدئ"),
    durationMinutes: body.durationMinutes != null ? Number(body.durationMinutes) : 30,
    lessonsCount: body.lessonsCount != null ? Number(body.lessonsCount) : 0,
    coverImage: body.coverImage ? String(body.coverImage) : null,
    published: body.published === true ? true : false,
  }),
  update: (body) => ({
    slug: String(body.slug),
    title: String(body.title),
    summary: String(body.summary),
    description: body.description ? String(body.description) : null,
    categoryId: body.categoryId ? Number(body.categoryId) : null,
    level: String(body.level ?? "مبتدئ"),
    durationMinutes: body.durationMinutes != null ? Number(body.durationMinutes) : 30,
    lessonsCount: body.lessonsCount != null ? Number(body.lessonsCount) : 0,
    coverImage: body.coverImage ? String(body.coverImage) : null,
    published: body.published === true ? true : false,
    updatedAt: new Date(),
  }),
  afterCreate: async (created) => {
    if (created.published) {
      await notifyNewCourse({ slug: created.slug, title: created.title });
    }
  },
});

export async function GET() {
  return routes.list();
}

export async function POST(request: Request) {
  return routes.create(request);
}
