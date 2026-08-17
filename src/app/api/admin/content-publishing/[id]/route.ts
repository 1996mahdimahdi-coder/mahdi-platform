import { asc } from "drizzle-orm";
import { contentPublishingPlans } from "@/db/schema";
import { createAdminRoutes } from "@/lib/noCapital/adminHandlers";

export const dynamic = "force-dynamic";

const routes = createAdminRoutes({
  table: contentPublishingPlans,
  tableName: "content_publishing_plans",
  itemName: "خطة النشر",
  orderBy: (t) => asc(t.platform),
  validate: (body) => {
    if (!body.platform) {
      return "المنصة مطلوبة.";
    }
    return null;
  },
  create: (body) => ({
    platform: String(body.platform),
    cadence: body.cadence ? String(body.cadence) : null,
    bestTimes: Array.isArray(body.bestTimes) ? body.bestTimes : [],
    tips: Array.isArray(body.tips) ? body.tips : [],
    active: body.active === false ? false : true,
  }),
  update: (body) => ({
    platform: String(body.platform),
    cadence: body.cadence ? String(body.cadence) : null,
    bestTimes: Array.isArray(body.bestTimes) ? body.bestTimes : [],
    tips: Array.isArray(body.tips) ? body.tips : [],
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
