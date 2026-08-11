"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

export default function WelcomeBanner() {
  const [visitor, setVisitor] = useState<any>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("nabda_visitor");
      if (stored) {
        setVisitor(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  if (!visitor) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-bold">
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
          <span>
            أهلاً بك يا <span className="font-black">{visitor.firstName}</span> من{" "}
            <span className="font-black">{visitor.wilayaName}</span> 👋 يسعدنا خدمتك في NABDA
          </span>
        </div>
      </div>
    </div>
  );
}
