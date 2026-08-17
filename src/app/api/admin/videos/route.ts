import { desc } from "drizzle-orm";
import { videos } from "@/db/schema";
import { createAdminRoutes } from "@/lib/noCapital/adminHandlers";

export const dynamic = "force-dynamic";

const routes = createAdminRoutes({
  table: videos,
  tableName: "videos",
  itemName: "الفيديو",
  orderBy: (t) => desc(t.updatedAt),
  validate: (body) => {
    if (!body.slug || !body.title) {
      return "المعرّف والعنوان مطلوبان.";
    }
    return null;
  },
  create: (body) => ({
    slug: String(body.slug),
    title: String(body.title),
    videoUrl: body.videoUrl ? String(body.videoUrl) : null,
    embedUrl: body.embedUrl ? String(body.embedUrl) : null,
    durationSeconds: body.durationSeconds != null ? Number(body.durationSeconds) : 0,
    categoryId: body.categoryId ? Number(body.categoryId) : null,
    description: body.description ? String(body.description) : null,
    thumbnailUrl: body.thumbnailUrl ? String(body.thumbnailUrl) : null,
    transcript: body.transcript ? String(body.transcript) : null,
    published: body.published === true ? true : false,
  }),
  update: (body) => ({
    slug: String(body.slug),
    title: String(body.title),
    videoUrl: body.videoUrl ? String(body.videoUrl) : null,
    embedUrl: body.embedUrl ? String(body.embedUrl) : null,
    durationSeconds: body.durationSeconds != null ? Number(body.durationSeconds) : 0,
    categoryId: body.categoryId ? Number(body.categoryId) : null,
    description: body.description ? String(body.description) : null,
    thumbnailUrl: body.thumbnailUrl ? String(body.thumbnailUrl) : null,
    transcript: body.transcript ? String(body.transcript) : null,
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
