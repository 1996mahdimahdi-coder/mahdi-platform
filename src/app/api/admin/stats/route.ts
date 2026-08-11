import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, projects, analysisResults, wilayas, visitorProfiles } from "@/db/schema";
import { count, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [userCount] = await db.select({ value: count() }).from(users);
    const [projectCount] = await db.select({ value: count() }).from(projects);
    const [testCount] = await db.select({ value: count() }).from(analysisResults);
    const [wilayaCount] = await db.select({ value: count() }).from(wilayas);
    const [visitorCount] = await db.select({ value: count() }).from(visitorProfiles);

    // Fetch recent test results to analyze top capitals & top selected projects
    const recentTests = await db.select().from(analysisResults).limit(50);

    const capitalStats: Record<string, number> = {};
    const topProjectStats: Record<string, number> = {};

    recentTests.forEach((t) => {
      const capRange =
        t.userCapital < 50000
          ? "أقل من 5 ملايين"
          : t.userCapital <= 100000
          ? "5 - 10 ملايين"
          : t.userCapital <= 500000
          ? "10 - 50 مليون"
          : "أكثر من 50 مليون";

      capitalStats[capRange] = (capitalStats[capRange] || 0) + 1;

      const topList = (t.topProjects as any[]) || [];
      if (topList.length > 0 && topList[0]?.projectName) {
        const name = topList[0].projectName;
        topProjectStats[name] = (topProjectStats[name] || 0) + 1;
      }
    });

    // Visitor demographics
    const allVisitors = await db.select().from(visitorProfiles).limit(500);

    const ageStats: Record<string, number> = {};
    const wilayaStats: Record<string, number> = {};
    const genderByFirstName: Record<string, number> = {};

    allVisitors.forEach((v) => {
      // Age group classification
      let ageGroup = "غير محدد";
      if (v.age < 20) ageGroup = "أقل من 20 سنة";
      else if (v.age <= 25) ageGroup = "20 - 25 سنة";
      else if (v.age <= 35) ageGroup = "26 - 35 سنة";
      else if (v.age <= 45) ageGroup = "36 - 45 سنة";
      else if (v.age > 45) ageGroup = "أكثر من 45 سنة";

      ageStats[ageGroup] = (ageStats[ageGroup] || 0) + 1;

      // Wilaya stats
      if (v.wilayaName) {
        wilayaStats[v.wilayaName] = (wilayaStats[v.wilayaName] || 0) + 1;
      }
    });

    return NextResponse.json({
      success: true,
      stats: {
        usersTotal: userCount?.value || 0,
        projectsTotal: projectCount?.value || 0,
        testsTotal: testCount?.value || 0,
        wilayasTotal: wilayaCount?.value || 0,
        visitorsTotal: visitorCount?.value || 0,
        capitalStats,
        topProjectStats,
        ageStats,
        wilayaStats,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
