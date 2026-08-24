import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { wilayas } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await props.params;
  const wilayaId = Number(id);

  if (!Number.isInteger(wilayaId) || wilayaId <= 0) {
    return { title: "ولاية غير موجودة" };
  }

  try {
    const [wilaya] = await db
      .select()
      .from(wilayas)
      .where(eq(wilayas.id, wilayaId))
      .limit(1);

    if (!wilaya) return { title: "ولاية غير موجودة" };

    return {
      title: `${wilaya.nameAr} — معلومات الولاية والبلديات`,
      description: `معلومات شاملة عن ولاية ${wilaya.nameAr} (${wilaya.nameFr}) — عدد السكان، البلديات، والفرص المحلية.`,
      alternates: { canonical: `/wilayas/${wilaya.id}` },
    };
  } catch {
    return { title: "ولاية غير موجودة" };
  }
}

export default async function WilayaDetailLayout(props: { children: React.ReactNode; params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const wilayaId = Number(id);

  if (!Number.isInteger(wilayaId) || wilayaId <= 0) notFound();

  try {
    const [wilaya] = await db
      .select()
      .from(wilayas)
      .where(eq(wilayas.id, wilayaId))
      .limit(1);
    if (!wilaya) notFound();
  } catch {
    notFound();
  }

  return <>{props.children}</>;
}