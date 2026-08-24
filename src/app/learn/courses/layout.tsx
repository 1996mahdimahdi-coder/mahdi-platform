import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "دورات مجانية لتعلم إدارة المشاريع — NABDA",
  description: "دورات ودروس مجانية تساعدك على تعلم أساسيات التسويق والبيع وإدارة المشاريع وتطوير مهاراتك العملية.",
};

export default function LearnCoursesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
