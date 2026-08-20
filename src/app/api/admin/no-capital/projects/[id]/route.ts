import { desc } from "drizzle-orm";
import { noCapitalProjects } from "@/db/schema";
import { createAdminRoutes } from "@/lib/noCapital/adminHandlers";

export const dynamic = "force-dynamic";

const routes = createAdminRoutes({
  table: noCapitalProjects,
  tableName: "no_capital_projects",
  itemName: "المشروع",
  orderBy: (t) => desc(t.lastUpdated),
  validate: (body) => {
    if (!body.slug || !body.nameAr || !body.description) {
      return "المعرّف، الاسم العربي والوصف مطلوبة.";
    }
    return null;
  },
  create: (body) => ({
    slug: String(body.slug),
    nameAr: String(body.nameAr),
    nameFr: body.nameFr ? String(body.nameFr) : null,
    categoryId: body.categoryId ? Number(body.categoryId) : null,
    domainId: body.domainId ? Number(body.domainId) : null,
    description: String(body.description),
    effortLevel: String(body.effortLevel ?? "متوسط"),
    timeRequired: String(body.timeRequired ?? "2-4 ساعات"),
    skillsRequired: Array.isArray(body.skillsRequired) ? body.skillsRequired : [],
    toolsNeeded: Array.isArray(body.toolsNeeded) ? body.toolsNeeded : [],
    startCostEstimate: String(body.startCostEstimate ?? "0 دج (بشرط توفر هاتف/حاسوب + إنترنت + مهارة)"),
    tags: Array.isArray(body.tags) ? body.tags : [],
    risks: Array.isArray(body.risks) ? body.risks : [],
    advantages: Array.isArray(body.advantages) ? body.advantages : [],
    disadvantages: Array.isArray(body.disadvantages) ? body.disadvantages : [],
    steps: Array.isArray(body.steps) ? body.steps : [],
    legalNotes: body.legalNotes ? String(body.legalNotes) : null,
    active: body.active === false ? false : true,
  }),
  update: (body) => ({
    slug: String(body.slug),
    nameAr: String(body.nameAr),
    nameFr: body.nameFr ? String(body.nameFr) : null,
    categoryId: body.categoryId ? Number(body.categoryId) : null,
    domainId: body.domainId ? Number(body.domainId) : null,
    description: String(body.description),
    effortLevel: String(body.effortLevel ?? "متوسط"),
    timeRequired: String(body.timeRequired ?? "2-4 ساعات"),
    skillsRequired: Array.isArray(body.skillsRequired) ? body.skillsRequired : [],
    toolsNeeded: Array.isArray(body.toolsNeeded) ? body.toolsNeeded : [],
    startCostEstimate: String(body.startCostEstimate ?? "0 دج (بشرط توفر هاتف/حاسوب + إنترنت + مهارة)"),
    tags: Array.isArray(body.tags) ? body.tags : [],
    risks: Array.isArray(body.risks) ? body.risks : [],
    advantages: Array.isArray(body.advantages) ? body.advantages : [],
    disadvantages: Array.isArray(body.disadvantages) ? body.disadvantages : [],
    steps: Array.isArray(body.steps) ? body.steps : [],
    legalNotes: body.legalNotes ? String(body.legalNotes) : null,
    active: body.active === false ? false : true,
    lastUpdated: new Date(),
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
