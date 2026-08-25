import Script from 'next/script';
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VisitorOnboarding from "@/components/VisitorOnboarding";
import WelcomeBanner from "@/components/WelcomeBanner";
import FloatingChatButton from "@/components/ai/FloatingChatButton";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://nabda-dz.vercel.app"),
  title: {
    template: "%s — NABDA",
    default: "NABDA — قبل ما تبدأ مشروعك... اختبره",
  },
  alternates: {
    canonical: "/",
  },
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
  openGraph: {
    title: "NABDA — قبل ما تبدأ مشروعك... اختبره",
    images: [{ url: "https://nabda-dz.vercel.app/icon.svg", width: 512, height: 512, alt: "NABDA" }],
    description:
      "منصة NABDA تساعدك على اختبار مدى ملاءمة المشروع لوضعك المالي والشخصي والمحلي قبل أن تبدأ، وتقترح أفضل المشاريع المناسبة لرأس مالك ووقتك وموقعك في الجزائر.",
    siteName: "NABDA",
    locale: "ar_DZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NABDA — قبل ما تبدأ مشروعك... اختبره",
    description:
      "اختبر مدى ملاءمة مشروعك قبل أن تبدأ، واحصل على أفضل المشاريع المناسبة لرأس مالك وموقعك في الجزائر.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta name="google-site-verification" content="5RqiD3-hsDCLaPKFK96AFsEX-kuuD4cbijyaHsQPyhg" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700;800;900&family=Amiri:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-official bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col">
        <VisitorOnboarding />
        <Navbar />
        <WelcomeBanner />
        <main className="flex-1">        <div id="container-0cebd69048a8ad4484c12999507dd876"></div>
        <Script
          src="https://pl30900770.profitableratecpmnetwork.com/0cebd69048a8ad4484c12999507dd876/invoke.js"
          strategy="lazyOnload"
          async
          data-cfasync="false"
        />
        {children}</main>
        <Footer />
        <FloatingChatButton />
      </body>
    </html>
  );
}

