import type { Metadata } from "next";
import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VisitorOnboarding from "@/components/VisitorOnboarding";
import WelcomeBanner from "@/components/WelcomeBanner";
import "./globals.css";

export const metadata: Metadata = {
  title: "NABDA – قبل ما تبدأ مشروعك... اختبره",
  description:
    "منصة NABDA تساعدك على اختبار مدى ملاءمة المشروع لوضعك المالي والشخصي والمحلي قبل أن تبدأ، وتقترح أفضل المشاريع المناسبة لرأس مالك ووقتك وموقعك في الجزائر.",
  keywords: [
    "NABDA",
    "نابدا",
    "مشاريع مربحة في الجزائر",
    "مشروع بـ 5 ملايين",
    "مشروع بـ 10 ملايين",
    "مشاريع صغيرة في الجزائر",
    "حاسبة الربح",
    "دراسة مشروع في الجزائر",
    "مشروع أونلاين بالجزائر",
    "اختبار فكرة مشروع",
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-['Noto_Sans_Arabic',sans-serif] bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col">
        <VisitorOnboarding />
        <Navbar />
        <WelcomeBanner />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
