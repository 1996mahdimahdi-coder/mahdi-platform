import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { courses } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;

  try {
    const [course] = await db
      .select({ title: courses.title, description: courses.description })
      .from(courses)
      .where(eq(courses.slug, slug))
      .limit(1);

    if (!course) return { title: "الدورة غير موجودة" };

    return {
      title: course.title,
      description: (course.description ?? "").slice(0, 160),
      alternates: { canonical: `/learn/courses/${slug}` },
    };
  } catch {
    return { title: "الدورة غير موجودة" };
  }
}

export default async function CourseSlugLayout(props: { children: React.ReactNode; params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;

  try {
    const [course] = await db
      .select({ id: courses.id })
      .from(courses)
      .where(eq(courses.slug, slug))
      .limit(1);
    if (!course) notFound();
  } catch {
    notFound();
  }

  return <>{props.children}</>;
}