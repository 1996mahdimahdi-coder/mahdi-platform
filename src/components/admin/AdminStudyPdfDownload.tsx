"use client";

import { useState } from "react";
import { Download, Loader2, FileText } from "lucide-react";
import { buildStudyPdfBytes, studyPdfFileName } from "@/lib/noCapital/studyPdf";
import type { PaidStudy } from "@/lib/noCapital/types";

type FetchPayload = {
  success: boolean;
  slug?: string | null;
  projectId?: string | null;
  nameAr?: string | null;
  projectName?: string | null;
  study?: unknown;
  error?: string;
};

type Props = {
  projectId: string;
  /** Admin study endpoint. Defaults to the no-capital studies endpoint. */
  endpoint?: string;
  /** Response field carrying the identifier used in the PDF/file name. */
  slugKey?: "slug" | "projectId";
  /** Response field carrying the project display name (Arabic). */
  nameKey?: "nameAr" | "projectName";
};

/**
 * Admin-only "تحميل PDF الدراسة" button. Shown only when the current study is
 * approved (parent gates on study.status). On click it re-fetches the study
 * from the trusted admin API and builds/downloads the PDF fully in the browser.
 * buildStudyPdfBytes itself refuses draft/review, so this can never leak a
 * non-approved study. No server-side PDF is created and no public endpoint is
 * involved.
 */
export default function AdminStudyPdfDownload({
  projectId,
  endpoint,
  slugKey = "slug",
  nameKey = "nameAr",
}: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const download = async () => {
    setBusy(true);
    setError(null);
    setReady(false);
    try {
      const res = await fetch(endpoint ?? `/api/admin/no-capital/studies/${projectId}`, { cache: "no-store" });
      const data = (await res.json()) as FetchPayload;
      if (!res.ok || !data.success) throw new Error(data.error ?? "تعذر تحميل الدراسة من خادم الإدارة.");
      if (!data.study) throw new Error("الدراسة غير متوفرة.");
      const study = data.study as PaidStudy;
      if (study.status !== "approved") {
        throw new Error("لا يمكن توليد PDF إلا لدراسة معتمدة (approved).");
      }

      const slug = data[slugKey] ?? undefined;
      const projectNameAr = data[nameKey] ?? undefined;

      const bytes = await buildStudyPdfBytes(study, {
        slug,
        projectNameAr,
      });

      const blob = new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = studyPdfFileName({ slug });
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      setReady(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل توليد PDF الدراسة.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={download}
        disabled={busy}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 text-white text-sm font-extrabold hover:bg-emerald-700 transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {busy ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            جارٍ توليد PDF الدراسة...
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            تحميل PDF الدراسة
          </>
        )}
      </button>
      {ready && (
        <span className="text-[11px] font-bold text-emerald-600 inline-flex items-center gap-1">
          <FileText className="w-3.5 h-3.5" />
          تم توليد PDF الدراسة وبدء التحميل.
        </span>
      )}
      {error && <span className="text-[11px] font-bold text-rose-600">{error}</span>}
    </div>
  );
}