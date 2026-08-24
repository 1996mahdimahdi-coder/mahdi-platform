import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "محاكي السيناريوهات المالية للمشاريع — NABDA",
  description: "اختبر سيناريوهات مختلفة لمشروعك مثل المتحفظ والمتوقع والمتفائل، وشاهد كيف يمكن أن تتغير الإيرادات والتكاليف والنتائج.",
};

export default function SimulatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
