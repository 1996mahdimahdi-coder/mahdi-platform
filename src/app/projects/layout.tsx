import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "مشاريع وأفكار تجارية في الجزائر",
  description: "تصفح أفكار ومشاريع متنوعة في الجزائر حسب المجال ورأس المال، مع معلومات تساعدك على دراسة المشروع قبل البدء.",
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
