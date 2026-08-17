import { NextResponse } from "next/server";
import { DEFAULT_FIRST_ORDER_PLAN } from "@/lib/noCapital/publicData";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    success: true,
    source: "defaults",
    plan: DEFAULT_FIRST_ORDER_PLAN,
  });
}
