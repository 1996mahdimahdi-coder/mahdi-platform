import { asc } from "drizzle-orm";
import { categories } from "@/db/schema";
import { createAdminRoutes } from "@/lib/noCapital/adminHandlers";

export const dynamic = "force-dynamic";

const routes = createAdminRoutes({
  table: categories,
  tableName: "categories",
  itemName: "التصنيف",
  orderBy: (t) => asc(t.sortOrder),
  validate: (body) => {
    if (!body.slug || !body.nameAr || !body.nameFr) {
      return "الاسم بالعربية، الاسم بالفرنسية والمعرّف مطلوبة.";
    }
    return null;
  },
  create: (body) => ({
    parentId: body.parentId ? Number(body.parentId) : null,
    slug: String(body.slug),
    nameAr: String(body.nameAr),
    nameFr: String(body.nameFr),
    type: body.type === "domain" ? "domain" : "category",
    icon: body.icon ? String(body.icon) : null,
    description: body.description ? String(body.description) : null,
    sortOrder: body.sortOrder != null ? Number(body.sortOrder) : 0,
    active: body.active === false ? false : true,
  }),
  update: (body) => ({
    parentId: body.parentId ? Number(body.parentId) : null,
    slug: String(body.slug),
    nameAr: String(body.nameAr),
    nameFr: String(body.nameFr),
    type: body.type === "domain" ? "domain" : "category",
    icon: body.icon ? String(body.icon) : null,
    description: body.description ? String(body.description) : null,
    sortOrder: body.sortOrder != null ? Number(body.sortOrder) : 0,
    active: body.active === false ? false : true,
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
