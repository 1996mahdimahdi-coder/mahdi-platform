"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Navbar from "./Navbar";
import WelcomeBanner from "./WelcomeBanner";
import AdContainer from "./AdContainer";
import Footer from "./Footer";
import FloatingChatButton from "./ai/FloatingChatButton";

export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isAuthPage =
    pathname === "/login" || (pathname?.startsWith("/login/") ?? false);

  if (isAuthPage) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <WelcomeBanner />
      <main className="flex-1">
        <AdContainer />
        {children}
      </main>
      <Footer />
      <FloatingChatButton />
    </>
  );
}