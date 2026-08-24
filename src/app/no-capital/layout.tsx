import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "مشاريع بدون رأس مال في الجزائر",
  description: "اكتشف أفكار مشاريع يمكن البدء بها برأس مال محدود أو بدون رأس مال، مع معلومات تساعدك على اختيار الفكرة المناسبة لمهاراتك وإمكاناتك.",
};

export default function NoCapitalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
