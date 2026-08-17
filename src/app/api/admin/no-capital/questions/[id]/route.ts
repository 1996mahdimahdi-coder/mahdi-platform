import { asc } from "drizzle-orm";
import { noCapitalQuestions } from "@/db/schema";
import { createAdminRoutes } from "@/lib/noCapital/adminHandlers";

export const dynamic = "force-dynamic";

const routes = createAdminRoutes({
  table: noCapitalQuestions,
  tableName: "no_capital_questions",
  itemName: "السؤال",
  orderBy: (t) => asc(t.order),
  validate: (body) => {
    if (!body.questionKey || !body.title) {
      return "مفتاح السؤال وعنوانه مطلوبان.";
    }
    const type = body.type;
    if ((type === "single" || type === "multi") && (!Array.isArray(body.options) || body.options.length === 0)) {
      return "أضف خياراً واحداً على الأقل لسؤال الاختيار.";
    }
    return null;
  },
  create: (body) => ({
    questionKey: String(body.questionKey),
    type: body.type === "multi" ? "multi" : body.type === "text" ? "text" : "single",
    title: String(body.title),
    subtitle: body.subtitle ? String(body.subtitle) : null,
    required: body.required === false ? false : true,
    order: body.order != null ? Number(body.order) : 0,
    options: Array.isArray(body.options) ? body.options : [],
    active: body.active === false ? false : true,
  }),
  update: (body) => ({
    questionKey: String(body.questionKey),
    type: body.type === "multi" ? "multi" : body.type === "text" ? "text" : "single",
    title: String(body.title),
    subtitle: body.subtitle ? String(body.subtitle) : null,
    required: body.required === false ? false : true,
    order: body.order != null ? Number(body.order) : 0,
    options: Array.isArray(body.options) ? body.options : [],
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
