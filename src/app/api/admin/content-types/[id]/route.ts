import { asc } from "drizzle-orm";
import { contentTypes } from "@/db/schema";
import { createAdminRoutes } from "@/lib/noCapital/adminHandlers";

export const dynamic = "force-dynamic";

const routes = createAdminRoutes({
  table: contentTypes,
  tableName: "content_types",
  itemName: "نوع المحتوى",
  orderBy: (t) => asc(t.id),
  validate: (body) => {
    if (!body.slug || !body.nameAr) {
      return "المعرّف والاسم مطلوبان.";
    }
    return null;
  },
  create: (body) => ({
    slug: String(body.slug),
    nameAr: String(body.nameAr),
    description: body.description ? String(body.description) : null,
    bestPractices: Array.isArray(body.bestPractices) ? body.bestPractices : [],
    example: body.example ? String(body.example) : null,
  }),
  update: (body) => ({
    slug: String(body.slug),
    nameAr: String(body.nameAr),
    description: body.description ? String(body.description) : null,
    bestPractices: Array.isArray(body.bestPractices) ? body.bestPractices : [],
    example: body.example ? String(body.example) : null,
  }),
});

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  return routes.getById(request, context);
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  return routes.update(request, context);
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  return routes.remove(request, context);
}
