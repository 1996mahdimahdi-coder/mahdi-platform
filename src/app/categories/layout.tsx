import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تصنيفات المشاريع — NABDA",
  description: "تصفح أفكار المشاريع حسب التصنيف، مثل المشاريع التجارية والخدماتية والمنزلية والرقمية وغيرها.",
};

export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
