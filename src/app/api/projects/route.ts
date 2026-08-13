import { NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const riskLevel = searchParams.get("risk");
    const maxCapital = searchParams.get("maxCapital");
    const homeBasedOnly = searchParams.get("homeBased") === "true";
    const onlineOnly = searchParams.get("online") === "true";

    // Auto-seed if empty
    const check = await db.select().from(projects).limit(1);
    if (check.length === 0) {
      // Automatic database seeding is disabled in request handlers.
    }

    let allProjects = await db.select().from(projects);

    if (category && category !== "الكل") {
      allProjects = allProjects.filter((p) => p.category === category);
    }
    if (riskLevel && riskLevel !== "الكل") {
      allProjects = allProjects.filter((p) => p.riskLevel === riskLevel);
    }
    if (maxCapital) {
      const capNum = parseInt(maxCapital, 10);
      if (!isNaN(capNum)) {
        allProjects = allProjects.filter((p) => p.minCapital <= capNum);
      }
    }
    if (homeBasedOnly) {
      allProjects = allProjects.filter((p) => p.homeBased);
    }
    if (onlineOnly) {
      allProjects = allProjects.filter((p) => p.onlinePossible);
    }

    return NextResponse.json({ success: true, projects: allProjects });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.projectName || !body.projectId || !body.minCapital) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const [created] = await db.insert(projects).values(body).returning();
    return NextResponse.json({ success: true, project: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
