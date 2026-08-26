"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Plus,
  Edit,
  Trash2,
  X,
  Eye,
  Globe,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { getCsrfToken } from "@/lib/clientCsrf";

type Source = {
  id: number;
  name: string;
  institution: string;
  sourceType: string;
  url: string | null;
  category: string;
  confidenceGrade: string;
  documentTitle: string | null;
  documentYear: number | null;
  documentType: string | null;
  accessedAt: string | null;
  published: boolean;
  notes: string | null;
  lastVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type SourceForm = {
  name: string;
  institution: string;
  sourceType: string;
  url: string;
  category: string;
  confidenceGrade: string;
  documentTitle: string;
  documentYear: string;
  documentType: string;
  accessedAt: string;
  lastVerifiedAt: string;
  notes: string;
  published: boolean;
};

const EMPTY_FORM: SourceForm = {
  name: "",
  institution: "",
  sourceType: "official",
  url: "",
  category: "population",
  confidenceGrade: "U",
  documentTitle: "",
  documentYear: "",
  documentType: "report",
  accessedAt: "",
  lastVerifiedAt: "",
  notes: "",
  published: false,
};

const SOURCE_TYPE_LABELS: Record<string, string> = {
  official: "رسمي",
  institutional: "مؤسسي",
  secondary: "ثانوي",
  estimated: "تقديري",
};

const CATEGORY_LABELS: Record<string, string> = {
  population: "سكان",
  area: "مساحة",
  economy: "اقتصاد",
  market: "سوق",
  transport: "نقل",
  projects: "مشاريع",
  legal: "قانوني",
  other: "أخرى",
};

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  census: "إحصاء (تعداد)",
  report: "تقرير",
  law: "قانون",
  decree: "مرسوم",
  dataset: "مجموعة بيانات",
  portal: "بوابة إلكترونية",
  other: "أخرى",
};

const CONFIDENCE_LABELS: Record<string, string> = {
  A: "A — عالية جدًا",
  B: "B — عالية",
  C: "C — متوسطة",
  D: "D — منخفضة",
  U: "U — غير موثقة",
};

function formatDate(value: string | null) {
  if (!value) return "غير محدد";

  return new Date(value).toLocaleDateString("ar-DZ");
}

function confidenceColor(grade: string) {
  switch (grade) {
    case "A":
      return "bg-emerald-100 text-emerald-800";
    case "B":
      return "bg-green-100 text-green-800";
    case "C":
      return "bg-amber-100 text-amber-800";
    case "D":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

export default function AdminSourcesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Source | null>(null);
  const [form, setForm] = useState<SourceForm>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  const [viewing, setViewing] = useState<Source | null>(null);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const meRes = await fetch("/api/auth/me", { cache: "no-store" });

        if (meRes.status === 401 || !meRes.ok) {
          router.replace("/login");
          return;
        }

        const meData = await meRes.json();

        if (!meData.success || !meData.user) {
          router.replace("/login");
          return;
        }

        if (meData.user.role !== "admin") {
          router.replace("/dashboard");
          return;
        }

        if (cancelled) return;
        setUser(meData.user);
        fetchSources();
      } catch (e) {
        console.error(e);
        if (!cancelled) router.replace("/login");
      }
    };

    init();

    return () => {
      cancelled = true;
    };
  }, [router]);

  const fetchSources = async () => {
    try {
      const res = await fetch("/api/admin/sources");
      if (res.status === 401) {
        router.replace("/login");
        return;
      }
      if (res.status === 403) {
        router.replace("/dashboard");
        return;
      }
      const data = await res.json();
      if (data.success) {
        setSources(data.sources || []);
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      setError("تعذر تحميل المصادر.");
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormErrors([]);
    setShowForm(true);
  };

  const openEdit = (source: Source) => {
    setEditing(source);
    setForm({
      name: source.name,
      institution: source.institution,
      sourceType: source.sourceType,
      url: source.url || "",
      category: source.category,
      confidenceGrade: source.confidenceGrade,
      documentTitle: source.documentTitle || "",
      documentYear: source.documentYear ? String(source.documentYear) : "",
      documentType: source.documentType || "report",
      accessedAt: source.accessedAt
        ? source.accessedAt.slice(0, 10)
        : "",
      lastVerifiedAt: source.lastVerifiedAt
        ? source.lastVerifiedAt.slice(0, 10)
        : "",
      notes: source.notes || "",
      published: source.published,
    });
    setFormErrors([]);
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormErrors([]);
    setSavedMessage("");

    const payload = {
      ...form,
      documentYear: form.documentYear
        ? Number(form.documentYear)
        : null,
    };

    try {
      const url = editing
        ? `/api/admin/sources/${editing.id}`
        : "/api/admin/sources";
      const method = editing ? "PUT" : "POST";

      const csrfToken = await getCsrfToken();
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "x-csrf-token": csrfToken },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        router.replace("/login");
        return;
      }
      if (res.status === 403) {
        router.replace("/dashboard");
        return;
      }

      const data = await res.json();

      if (data.success) {
        setShowForm(false);
        setEditing(null);
        setSavedMessage(
          editing ? "تم تحديث المصدر بنجاح." : "تم إضافة المصدر بنجاح."
        );
        setTimeout(() => setSavedMessage(""), 3000);
        fetchSources();
      } else {
        if (data.validation && data.validation.length > 0) {
          setFormErrors(data.validation);
        } else {
          setFormErrors([data.error || "تعذر حفظ المصدر."]);
        }
      }
    } catch (err) {
      console.error(err);
      setFormErrors(["حدث خطأ غير متوقع."]);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (source: Source) => {
    if (!confirm(`هل أنت متأكد من حذف المصدر "${source.name}"؟`)) return;

    try {
      const csrfToken = await getCsrfToken();
      const res = await fetch(`/api/admin/sources/${source.id}`, {
        method: "DELETE",
        headers: { "x-csrf-token": csrfToken },
      });
      if (res.status === 401) {
        router.replace("/login");
        return;
      }
      if (res.status === 403) {
        router.replace("/dashboard");
        return;
      }
      const data = await res.json();
      if (data.success) {
        setSavedMessage("تم حذف المصدر بنجاح.");
        setTimeout(() => setSavedMessage(""), 3000);
        fetchSources();
      } else {
        alert(data.error || "تعذر حذف المصدر.");
      }
    } catch (e) {
      console.error(e);
      alert("حدث خطأ أثناء حذف المصدر.");
    }
  };

  if (!user) return null;

  return (
    <main dir="rtl" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">
              إدارة المصادر الموثوقة
            </h1>
            <p className="text-xs text-slate-400">
              سجل المصادر الرسمية التي تستند إليها أرقام السكان والمساحة والكثافة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="px-4 py-2.5 rounded-xl bg-slate-800 text-white font-extrabold text-xs border border-slate-700 hover:bg-slate-700 transition-colors"
          >
            ← لوحة الإدارة الرئيسية
          </Link>
          <button
            onClick={openAdd}
            className="px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md hover:bg-amber-400 transition-colors"
          >
            <Plus className="w-4 h-4" />
            إضافة مصدر جديد
          </button>
        </div>
      </div>

      {/* Messages */}
      {savedMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 text-sm font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {savedMessage}
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2 text-sm font-bold">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          {error}
        </div>
      )}

      {/* Sources table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-10 text-center text-sm font-bold text-slate-500">
            جاري تحميل المصادر...
          </div>
        ) : sources.length === 0 ? (
          <div className="p-10 text-center text-sm font-bold text-slate-500">
            لا توجد مصادر مسجلة حاليًا. اضغط "إضافة مصدر جديد" للبدء.
          </div>
        ) : (
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-4">المصدر / الوثيقة</th>
                <th className="p-4">الفئة</th>
                <th className="p-4">النوع</th>
                <th className="p-4">الثقة</th>
                <th className="p-4">السنة</th>
                <th className="p-4">الحالة</th>
                <th className="p-4 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {sources.map((source) => (
                <tr key={source.id} className="hover:bg-slate-50 align-top">
                  <td className="p-4">
                    <p className="font-bold text-slate-900">{source.name}</p>
                    <p className="text-slate-500 mt-0.5">{source.institution}</p>
                    {source.documentTitle && (
                      <p className="text-slate-400 mt-0.5">
                        {source.documentTitle}
                      </p>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold">
                      {CATEGORY_LABELS[source.category] || source.category}
                    </span>
                  </td>
                  <td className="p-4">
                    {SOURCE_TYPE_LABELS[source.sourceType] || source.sourceType}
                    {source.documentType && (
                      <p className="text-slate-400 mt-0.5">
                        {DOCUMENT_TYPE_LABELS[source.documentType] ||
                          source.documentType}
                      </p>
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full font-black ${confidenceColor(
                        source.confidenceGrade
                      )}`}
                    >
                      {source.confidenceGrade}
                    </span>
                  </td>
                  <td className="p-4 font-mono font-bold">
                    {source.documentYear || "—"}
                  </td>
                  <td className="p-4">
                    {source.published ? (
                      <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                        منشور
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 font-bold">
                        مسودة
                      </span>
                    )}
                    <p className="text-slate-400 mt-1">
                      تحقق: {formatDate(source.lastVerifiedAt)}
                    </p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setViewing(source)}
                        className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                        title="عرض"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEdit(source)}
                        className="p-1.5 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100"
                        title="تعديل"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(source)}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-800 hover:bg-rose-100"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">
                {editing ? "تعديل بيانات المصدر" : "إضافة مصدر موثوق جديد"}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formErrors.length > 0 && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1">
                <p className="font-black">يجب تصحيح البيانات التالية:</p>
                {formErrors.map((message, index) => (
                  <p key={index}>• {message}</p>
                ))}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs font-bold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700">اسم المصدر *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    placeholder="مثال: RGPH 2008 — تعداد السكان"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700">المؤسسة *</label>
                  <input
                    type="text"
                    required
                    value={form.institution}
                    onChange={(e) =>
                      setForm({ ...form, institution: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    placeholder="مثال: الديوان الوطني للإحصائيات (ONS)"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700">رابط المصدر الأصلي *</label>
                <input
                  type="url"
                  required
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  dir="ltr"
                  placeholder="https://www.ons.dz/..."
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700">نوع المصدر *</label>
                  <select
                    value={form.sourceType}
                    onChange={(e) =>
                      setForm({ ...form, sourceType: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    {Object.entries(SOURCE_TYPE_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700">الفئة *</label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700">درجة الثقة *</label>
                  <select
                    value={form.confidenceGrade}
                    onChange={(e) =>
                      setForm({ ...form, confidenceGrade: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    {Object.entries(CONFIDENCE_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700">عنوان الوثيقة *</label>
                  <input
                    type="text"
                    required
                    value={form.documentTitle}
                    onChange={(e) =>
                      setForm({ ...form, documentTitle: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700">سنة الوثيقة *</label>
                  <input
                    type="number"
                    required
                    min={1950}
                    max={new Date().getFullYear()}
                    value={form.documentYear}
                    onChange={(e) =>
                      setForm({ ...form, documentYear: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700">نوع الوثيقة *</label>
                  <select
                    value={form.documentType}
                    onChange={(e) =>
                      setForm({ ...form, documentType: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    {Object.entries(DOCUMENT_TYPE_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700">تاريخ الوصول</label>
                  <input
                    type="date"
                    value={form.accessedAt}
                    onChange={(e) =>
                      setForm({ ...form, accessedAt: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700">تاريخ آخر تحقق</label>
                  <input
                    type="date"
                    value={form.lastVerifiedAt}
                    onChange={(e) =>
                      setForm({ ...form, lastVerifiedAt: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700">ملاحظات</label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) =>
                    setForm({ ...form, published: e.target.checked })
                  }
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <span>نشر المصدر (يظهر في صفحة /sources وعند العرض العام)</span>
              </label>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-xl bg-slate-900 text-white font-extrabold shadow-md disabled:opacity-50"
                >
                  {saving ? "جاري الحفظ..." : "حفظ المصدر"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewing && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">
                تفاصيل المصدر
              </h3>
              <button
                onClick={() => setViewing(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-bold">
              <div>
                <p className="text-slate-500">المصدر</p>
                <p className="text-slate-900 font-black text-sm">{viewing.name}</p>
              </div>
              <div>
                <p className="text-slate-500">المؤسسة</p>
                <p className="text-slate-900">{viewing.institution}</p>
              </div>
              <div>
                <p className="text-slate-500">الوثيقة</p>
                <p className="text-slate-900">
                  {viewing.documentTitle || "—"}{" "}
                  {viewing.documentYear ? `(${viewing.documentYear})` : ""}
                </p>
              </div>
              <div>
                <p className="text-slate-500">الرابط الأصلي</p>
                {viewing.url ? (
                  <a
                    href={viewing.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline inline-flex items-center gap-1 break-all"
                    dir="ltr"
                  >
                    <Globe className="w-3.5 h-3.5 shrink-0" />
                    {viewing.url}
                  </a>
                ) : (
                  <p className="text-slate-400">غير متوفر</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-slate-500">الفئة</p>
                  <p className="text-slate-900">
                    {CATEGORY_LABELS[viewing.category] || viewing.category}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">نوع المصدر</p>
                  <p className="text-slate-900">
                    {SOURCE_TYPE_LABELS[viewing.sourceType] || viewing.sourceType}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">نوع الوثيقة</p>
                  <p className="text-slate-900">
                    {DOCUMENT_TYPE_LABELS[viewing.documentType || ""] ||
                      viewing.documentType ||
                      "—"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">درجة الثقة</p>
                  <p className="text-slate-900">
                    <span
                      className={`px-2 py-0.5 rounded-full font-black ${confidenceColor(
                        viewing.confidenceGrade
                      )}`}
                    >
                      {viewing.confidenceGrade}
                    </span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-slate-500">تاريخ الوصول</p>
                  <p className="text-slate-900">{formatDate(viewing.accessedAt)}</p>
                </div>
                <div>
                  <p className="text-slate-500">آخر تحقق</p>
                  <p className="text-slate-900">
                    {formatDate(viewing.lastVerifiedAt)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-slate-500">الحالة</p>
                <p className="text-slate-900">
                  {viewing.published ? "منشور (يظهر للعامة)" : "مسودة (غير ظاهر)"}
                </p>
              </div>

              {viewing.notes && (
                <div>
                  <p className="text-slate-500">ملاحظات</p>
                  <p className="text-slate-900 leading-6">{viewing.notes}</p>
                </div>
              )}
            </div>

            <div className="pt-3 flex justify-end">
              <button
                onClick={() => setViewing(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-extrabold text-xs"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
