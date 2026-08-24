import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "اختبار فكرة مشروع — NABDA",
  description: "اختبر فكرة مشروعك قبل البدء من خلال تحليل عناصر الفكرة والسوق والموارد والمخاطر للحصول على تقييم يساعدك على اتخاذ قرار مدروس.",
};

export default function IdeaTestLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
