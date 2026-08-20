"use client";

import { useState } from "react";
import { Share2, Printer, FileDown, Check } from "lucide-react";
import type { NoCapitalPdfData } from "@/lib/pdfExport";

export default function NoCapitalActions({
  data,
  title,
}: {
  data: NoCapitalPdfData;
  title: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    const text = `${title} — منصة NABDA`;
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // المستخدم ألغى المشاركة
    }
  };

  const handlePdf = async () => {
    const { downloadNoCapitalProjectPdf } = await import("@/lib/pdfExport");
    await downloadNoCapitalProjectPdf(data);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
      >
        {copied ? (
          <Check className="w-4 h-4 text-emerald-600" />
        ) : (
          <Share2 className="w-4 h-4" />
        )}
        {copied ? "تم النسخ" : "مشاركة"}
      </button>
      <button
        onClick={handlePdf}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
      >
        <FileDown className="w-4 h-4" />
        تحميل PDF
      </button>
      <button
        onClick={() => window.print()}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
      >
        <Printer className="w-4 h-4" />
        طباعة
      </button>
    </div>
  );
}
