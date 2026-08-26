"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function AdContainer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Script
      src="https://pl31037223.profitableratecpmnetwork.com/bf/c3/03/bfc303335dbc5949b9c2633aa9453870.js"
      strategy="lazyOnload"
      async
    />
  );
}
