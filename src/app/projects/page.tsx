import { Compass } from "lucide-react";
import { db } from "@/db";
import { projects } from "@/db/schema";
import ProjectsGrid from "@/components/ProjectsGrid";

export const dynamic = "force-dynamic";

async function getProjects() {
  try {
    return await db
      .select({
        id: projects.id,
        projectId: projects.projectId,
        projectName: projects.projectName,
        category: projects.category,
        description: projects.description,
        riskLevel: projects.riskLevel,
        minCapital: projects.minCapital,
        recommendedCapital: projects.recommendedCapital,
        homeBased: projects.homeBased,
        onlinePossible: projects.onlinePossible,
        workLocation: projects.workLocation,
        skillLevel: projects.skillLevel,
        legalStatus: projects.legalStatus,
      })
      .from(projects);
  } catch {
    return [];
  }
}

export default async function ProjectsPage() {
  const allProjects = await getProjects();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold">
          <Compass className="w-3.5 h-3.5 text-indigo-600" />
          <span>قاعدة بيانات المشاريع الجزائرية المصغرة</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          استكشف أفكار المشاريع ودراسات الجدوى
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
          تصفح قائمة الأفكار المتوافقة مع السوق الجزائري، قارن رؤوس الأموال، التكاليف الثابتة والتوصيات الميدانية لكل مشروع.
        </p>
      </div>

      <ProjectsGrid projects={allProjects} />
    </div>
  );
}
