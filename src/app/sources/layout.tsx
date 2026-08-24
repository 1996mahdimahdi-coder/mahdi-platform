import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "مصادرنا الموثوقة",
  description: "المصادر والمرجعيات الرسمية التي تعتمد عليها منصة NABDA في جمع وتحقق بيانات المشاريع والمدن.",
};

export default function SourcesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}