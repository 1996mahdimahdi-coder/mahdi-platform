import { NextResponse } from "next/server";
import { DEFAULT_EXECUTION_PLAN } from "@/lib/noCapital/publicData";

export const dynamic = "force-dynamic";

// The 90-day plans are generated reference content (code defaults) until the
// migration is applied and curated plans are provisioned by the content team.
export async function GET() {
  return NextResponse.json({
    success: true,
    source: "defaults",
    plans: [DEFAULT_EXECUTION_PLAN],
  });
}
