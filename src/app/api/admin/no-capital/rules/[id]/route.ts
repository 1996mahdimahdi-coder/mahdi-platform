import { asc } from "drizzle-orm";
import { noCapitalRecommendationRules } from "@/db/schema";
import { createAdminRoutes } from "@/lib/noCapital/adminHandlers";

export const dynamic = "force-dynamic";

const routes = createAdminRoutes({
  table: noCapitalRecommendationRules,
  tableName: "no_capital_recommendation_rules",
  itemName: "قاعدة التوصية",
  orderBy: (t) => asc(t.id),
  validate: (body) => {
    if (!body.questionKey || !body.optionValue || !body.tag) {
      return "مفتاح السؤال والخيار والوسم مطلوبة.";
    }
    if (body.weight != null && (typeof body.weight !== "number" || body.weight < 1 || body.weight > 10)) {
      return "الوزن يجب أن يكون بين 1 و 10.";
    }
    return null;
  },
  create: (body) => ({
    questionKey: String(body.questionKey),
    optionValue: String(body.optionValue),
    tag: String(body.tag),
    weight: body.weight != null ? Number(body.weight) : 1,
    note: body.note ? String(body.note) : null,
    active: body.active === false ? false : true,
  }),
  update: (body) => ({
    questionKey: String(body.questionKey),
    optionValue: String(body.optionValue),
    tag: String(body.tag),
    weight: body.weight != null ? Number(body.weight) : 1,
    note: body.note ? String(body.note) : null,
    active: body.active === false ? false : true,
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
