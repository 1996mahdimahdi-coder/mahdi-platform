import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, projects, analysisResults, wilayas, visitorProfiles } from "@/db/schema";
import { count } from "drizzle-orm";
import {
  forbiddenResponse,
  getSession,
  PRIVATE_NO_STORE_HEADERS,
  unauthorizedResponse,
} from "@/lib/auth";
import {
  checkRateLimit,
  RATE_LIMITS,
  rateLimitExceededResponse,
} from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return unauthorizedResponse();
  }

  if (session.role !== "admin") {
    return forbiddenResponse();
  }

  const statsLimit = RATE_LIMITS.adminStats.user;

  const statsCheck = await checkRateLimit({
    key: `admin:stats:user:${session.userId}`,
    limit: statsLimit.limit,
    windowSeconds: statsLimit.windowSeconds,
  });

  if (!statsCheck.allowed) {
    return rateLimitExceededResponse(statsCheck);
  }

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

    const response = NextResponse.json({
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

    response.headers.set(
      "Cache-Control",
      "private, no-store"
    );

    return response;
  } catch (error: unknown) {
    console.error("Admin stats error:", error);

    return NextResponse.json({ success: false, error: "\u062d\u062f\u062b \u062e\u0637\u0623 \u062f\u0627\u062e\u0644\u064a. \u062d\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649 \u0644\u0627\u062d\u0642\u064b\u0627." }, {
      status: 500,
      headers: PRIVATE_NO_STORE_HEADERS,
    });
  }
}
