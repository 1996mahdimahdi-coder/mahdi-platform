import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ولايات الجزائر والفرص المحلية — NABDA",
  description: "تصفح ولايات الجزائر ومعلوماتها لمساعدة رواد الأعمال على التفكير في اختيار موقع المشروع والسوق المحلي.",
};

export default function WilayasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
