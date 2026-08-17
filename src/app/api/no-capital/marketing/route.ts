import { NextResponse } from "next/server";
import { DEFAULT_MARKETING_PLANS } from "@/lib/noCapital/publicData";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const budgetLevel = url.searchParams.get("budget");

  let plans = DEFAULT_MARKETING_PLANS;
  if (budgetLevel === "low" || budgetLevel === "medium" || budgetLevel === "high") {
    plans = plans.filter((p) => p.budgetLevel === budgetLevel);
  }

  return NextResponse.json({
    success: true,
    source: "defaults",
    count: plans.length,
    plans,
  });
}
