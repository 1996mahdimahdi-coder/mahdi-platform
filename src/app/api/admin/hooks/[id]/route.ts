import { desc } from "drizzle-orm";
import { hookLibrary } from "@/db/schema";
import { createAdminRoutes } from "@/lib/noCapital/adminHandlers";

export const dynamic = "force-dynamic";

const routes = createAdminRoutes({
  table: hookLibrary,
  tableName: "hook_library",
  itemName: "الخطاف",
  orderBy: (t) => desc(t.updatedAt),
  validate: (body) => {
    if (!body.title || !body.hookText) {
      return "العنوان ونص الخطاف مطلوبان.";
    }
    return null;
  },
  create: (body) => ({
    title: String(body.title),
    hookText: String(body.hookText),
    type: String(body.type ?? "question"),
    niche: body.niche ? String(body.niche) : null,
    categoryId: body.categoryId ? Number(body.categoryId) : null,
    usageContext: body.usageContext ? String(body.usageContext) : null,
    strength: body.strength === "low" || body.strength === "high" ? String(body.strength) : "medium",
    example: body.example ? String(body.example) : null,
    published: body.published === true ? true : false,
  }),
  update: (body) => ({
    title: String(body.title),
    hookText: String(body.hookText),
    type: String(body.type ?? "question"),
    niche: body.niche ? String(body.niche) : null,
    categoryId: body.categoryId ? Number(body.categoryId) : null,
    usageContext: body.usageContext ? String(body.usageContext) : null,
    strength: body.strength === "low" || body.strength === "high" ? String(body.strength) : "medium",
    example: body.example ? String(body.example) : null,
    published: body.published === true ? true : false,
    updatedAt: new Date(),
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
