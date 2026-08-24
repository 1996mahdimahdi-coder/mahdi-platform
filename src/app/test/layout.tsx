import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "اختبار الوضع المالي لبدء مشروع",
  description: "اختبر مدى جاهزيتك المالية لبدء مشروعك من خلال أسئلة بسيطة حول وضعك المالي والشخصي، واحصل على تقييم يساعدك على اتخاذ قرار أفضل.",
};

export default function TestLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
