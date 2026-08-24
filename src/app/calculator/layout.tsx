import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "حاسبة الأرباح ونقطة التعادل",
  description: "احسب الإيرادات والتكاليف والأرباح ونقطة التعادل لمشروعك باستخدام بياناتك الفعلية قبل اتخاذ قرار البدء.",
};

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
