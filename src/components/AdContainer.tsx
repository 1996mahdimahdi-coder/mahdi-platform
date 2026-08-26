"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const SMARTLINK_URL =
  "https://www.profitableratecpmnetwork.com/tt8bxkgbwu?";

export default function AdContainer() {
  const [mounted, setMounted] = useState(false);
  const [isCapacitor, setIsCapacitor] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent || "";
    const inCapacitor =
      ua.includes("Capacitor") ||
      window.location.protocol === "capacitor:" ||
      window.location.protocol === "ionic:" ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).Capacitor !== undefined;

    setIsCapacitor(inCapacitor);
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (isCapacitor) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-3">
        <a
          href={SMARTLINK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-3 text-sm text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-600"
        >
          <span className="text-xs opacity-60">Ad</span>
          <span>شاهد العرض</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-50"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>
    );
  }

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
