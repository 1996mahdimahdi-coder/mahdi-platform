import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "فيديوهات تعليمية",
  description: "فيديوهات تعليمية قصيرة تشرح أساسيات المشاريع والتسويق وإدارة الأعمال للمبتدئين في الجزائر.",
};

export default function LearnVideosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}