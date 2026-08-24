import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "مكتبة الهوكات والمكتبات",
  description: "مكتبة شاملة من الهوكات والمكتبات البرمجية المفيدة لتطوير تطبيقات الويب والموبايل.",
};

export default function LearnHooksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}