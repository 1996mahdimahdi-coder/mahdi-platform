"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function AdContainer() {
  const [showAd, setShowAd] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent || "";
    const inCapacitor =
      ua.includes("Capacitor") ||
      window.location.protocol === "capacitor:" ||
      window.location.protocol === "ionic:" ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).Capacitor !== undefined;

    setShowAd(!inCapacitor);
  }, []);

  if (!showAd) return null;

  return (
    <>
      <div id="container-0cebd69048a8ad4484c12999507dd876" />
      <Script
        src="https://pl30900770.profitableratecpmnetwork.com/0cebd69048a8ad4484c12999507dd876/invoke.js"
        strategy="lazyOnload"
        async
        data-cfasync="false"
      />
    </>
  );
}
