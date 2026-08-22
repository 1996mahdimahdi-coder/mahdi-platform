"use client";

import { Printer, FileDown } from "lucide-react";
import ShareButtons from "./ShareButtons";
import type { NoCapitalPdfData } from "@/lib/pdfExport";

export default function NoCapitalActions({
  data,
  title,
}: {
  data: NoCapitalPdfData;
  title: string;
}) {
  const handlePdf = async () => {
    const { downloadNoCapitalProjectPdf } = await import("@/lib/pdfExport");
    await downloadNoCapitalProjectPdf(data);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <ShareButtons title={title} />
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
