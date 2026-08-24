import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "خطة تنفيذ المشروع خطوة بخطوة",
  description: "أنشئ تصورًا عمليًا لخطوات إطلاق مشروعك وتنظيم المهام والموارد والعمل على الوصول إلى أول العملاء.",
};

export default function PlanLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
