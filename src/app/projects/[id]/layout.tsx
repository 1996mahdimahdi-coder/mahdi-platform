import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";

const BASE = "https://nabda-dz.vercel.app";

async function getProject(id: string) {
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
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await props.params;
  const project = await getProject(id);

  if (!project) {
    return { title: "المشروع غير موجود" };
  }

  return {
    title: project.projectName,
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

export default async function ProjectLayout(props: { children: React.ReactNode; params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const project = await getProject(id);
  if (!project) notFound();
  return <>{props.children}</>;
}
