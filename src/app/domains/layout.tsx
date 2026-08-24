import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "مجالات المشاريع في الجزائر",
  description: "تصفح مجالات المشاريع المختلفة مثل التجارة والخدمات والزراعة والاقتصاد الرقمي والصناعة، واكتشف الأفكار المرتبطة بكل مجال.",
};

export default function DomainsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
