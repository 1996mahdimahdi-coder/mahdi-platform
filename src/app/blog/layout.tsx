import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "مقالات وأدلة المشاريع في الجزائر",
  description: "مقالات وأدلة عملية حول المشاريع في الجزائر، التسويق، التجارة الإلكترونية، دراسة الأفكار، وإدارة المشروع للمبتدئين.",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
