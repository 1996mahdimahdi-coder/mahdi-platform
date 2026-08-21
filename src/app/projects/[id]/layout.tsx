import type { Metadata } from "next";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";

const BASE = "https://nabda-dz.vercel.app";

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await props.params;

  let project: { projectName?: string; description?: string; projectId?: string } | null = null;
  try {
    const rows = await db
      .select({
        projectName: projects.projectName,
        description: projects.description,
        projectId: projects.projectId,
      })
      .from(projects)
      .where(eq(projects.projectId, id))
      .limit(1);
    project = rows[0] ?? null;
  } catch {
    project = null;
  }

  if (!project) {
    return { title: "المشروع غير موجود — NABDA" };
  }

  return {
    title: `${project.projectName} — NABDA`,
    description: (project.description ?? "").slice(0, 160),
    alternates: { canonical: `${BASE}/projects/${project.projectId}` },
    openGraph: {
      title: project.projectName,
      description: (project.description ?? "").slice(0, 160),
      url: `${BASE}/projects/${project.projectId}`,
      type: "article",
      siteName: "NABDA",
      locale: "ar_DZ",
    },
  };
}

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
