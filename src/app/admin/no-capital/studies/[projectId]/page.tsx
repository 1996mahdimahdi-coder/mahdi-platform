"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import PaidStudyEditor from "@/components/admin/PaidStudyEditor";
import AdminStudyPdfDownload from "@/components/admin/AdminStudyPdfDownload";
import { getCsrfToken } from "@/lib/clientCsrf";
import { ChevronLeft, Loader2 } from "lucide-react";
import { emptyPaidStudyDraft } from "@/lib/noCapital/studyValidation";
import type { PaidStudy } from "@/lib/noCapital/types";

function normalizeToPaidStudy(raw: unknown): PaidStudy {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const hasSummary =
      (raw as Record<string, unknown>).summary &&
      typeof (raw as Record<string, unknown>).summary === "object";
    if (hasSummary) return raw as PaidStudy;
  }
  return emptyPaidStudyDraft();
}

export default function AdminPaidStudyEditPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;

  const [study, setStudy] = useState<PaidStudy | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  const endpoint = `/api/admin/no-capital/studies/${projectId}`;

  const load = useCallback(async () => {
    if (!projectId) return;
    try {
      const res = await fetch(endpoint, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error ?? "تعذر تحميل الدراسة.");
      setStudy(normalizeToPaidStudy(data.study));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر تحميل الدراسة.");
      setStudy(emptyPaidStudyDraft());
    } finally {
      setLoading(false);
    }
  }, [endpoint, projectId]);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (next: PaidStudy) => {
    setSaving(true);
    setSavedMsg(null);
    setError(null);
    try {
      const csrfToken = await getCsrfToken();
      const res = await fetch(endpoint, {
        method: next.summary ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", "x-csrf-token": csrfToken },
        body: JSON.stringify(next),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error ?? "فشل الحفظ.");
      setStudy(normalizeToPaidStudy(data.study));
      setSavedMsg("تم حفظ الدراسة بنجاح.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل الحفظ.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell
      title="تحرير الدراسة المدفوعة"
      subtitle={`مشروع رقم ${projectId}`}
    >
      <div className="mb-5 flex items-center justify-between gap-3 flex-wrap">
        <Link
          href="/admin/no-capital/studies"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600"
        >
          <ChevronLeft className="w-4 h-4" />
          العودة لقائمة الدراسات
        </Link>

        <div className="flex items-center gap-3 flex-wrap">
          {study?.status === "approved" && <AdminStudyPdfDownload projectId={projectId} />}
          {savedMsg && (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
              {savedMsg}
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          جارٍ التحميل...
        </div>
      ) : study ? (
        <PaidStudyEditor initial={study} onSave={save} saving={saving} error={error} />
      ) : null}
    </AdminShell>
  );
}