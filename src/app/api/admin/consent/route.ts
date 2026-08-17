import { desc } from "drizzle-orm";
import { consentVersions } from "@/db/schema";
import { createAdminRoutes } from "@/lib/noCapital/adminHandlers";

export const dynamic = "force-dynamic";

const routes = createAdminRoutes({
  table: consentVersions,
  tableName: "consent_versions",
  itemName: "نسخة الموافقة",
  orderBy: (t) => desc(t.updatedAt),
  validate: (body) => {
    if (!body.version || !body.title || !body.text) {
      return "رقم النسخة، العنوان والنص مطلوبة.";
    }
    return null;
  },
  create: (body) => ({
    version: String(body.version),
    title: String(body.title),
    text: String(body.text),
    required: body.required === false ? false : true,
    active: body.active === true ? true : false,
  }),
  update: (body) => ({
    version: String(body.version),
    title: String(body.title),
    text: String(body.text),
    required: body.required === false ? false : true,
    active: body.active === true ? true : false,
    updatedAt: new Date(),
  }),
});

export async function GET() {
  return routes.list();
}

export async function POST(request: Request) {
  return routes.create(request);
}
