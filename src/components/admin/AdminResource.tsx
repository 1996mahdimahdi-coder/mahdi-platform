"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Loader2, Plus, Pencil, Trash2, X, AlertTriangle, Save } from "lucide-react";
import { upload } from "@vercel/blob/client";
import { getCsrfToken } from "@/lib/clientCsrf";

const IMAGE_ACCEPT = ["image/jpeg", "image/png", "image/webp"];
const DEFAULT_MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

export type FieldKind =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "select"
  | "tags"
  | "json"
  | "image-upload";

export type FormField = {
  key: string;
  label: string;
  kind: FieldKind;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  help?: string;
  defaultValue?: unknown;
  uploadEndpoint?: string;
  maxImageBytes?: number;
};

export type Column = {
  key: string;
  label: string;
  render?: (row: Record<string, unknown>) => ReactNode;
};

type AdminResourceProps = {
  resourceName: string;
  apiPath: string;
  fields: FormField[];
  columns: Column[];
  rowTitleKey?: string;
  infoNote?: string;
  createSupported?: boolean;
};

function fieldToRequestValue(field: FormField, raw: string): { value: unknown; error: string | null } {
  switch (field.kind) {
    case "number": {
      const n = Number(raw);
      return raw.trim() === "" ? { value: null, error: null } : Number.isFinite(n) ? { value: n, error: null } : { value: null, error: `قيمة "${field.label}" يجب أن تكون رقماً.` };
    }
    case "boolean":
      return { value: raw === "true" || raw === "1", error: null };
    case "tags": {
      const items = raw.split(/[\n,،]/).map((s) => s.trim()).filter(Boolean);
      return { value: items, error: null };
    }
    case "json": {
      if (raw.trim() === "") return { value: [], error: null };
      try {
        return { value: JSON.parse(raw), error: null };
      } catch {
        return { value: null, error: `حقل "${field.label}" يحتوي JSON غير صالح.` };
      }
    }
    case "image-upload":
    default:
      return { value: raw, error: null };
  }
}

function valueToFormValue(field: FormField, value: unknown): string {
  if (value == null) return "";
  switch (field.kind) {
    case "tags":
      return Array.isArray(value) ? value.join("\n") : String(value);
    case "json":
      return JSON.stringify(value, null, 2);
    case "boolean":
      return value === true ? "true" : "false";
    case "number":
      return String(value);
    case "image-upload":
    default:
      return String(value);
  }
}

export default function AdminResource({
  resourceName,
  apiPath,
  fields,
  columns,
  rowTitleKey,
  infoNote,
  createSupported = true,
}: AdminResourceProps) {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const coverFileInput = useRef<HTMLInputElement | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiPath, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) {
        setItems([]);
        if (res.status === 409) {
          setError(data.error ?? "الجدول غير مفعّل بعد.");
        } else {
          setError(data.error ?? "حدث خطأ أثناء التحميل.");
        }
        return;
      }
      setItems(data.items ?? []);
    } catch {
      setError("حدث خطأ أثناء التحميل.");
    } finally {
      setLoading(false);
    }
  }, [apiPath]);

  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  const openNew = () => {
    setEditingId("new");
    setFormError(null);
    const initial: Record<string, string> = {};
    for (const field of fields) {
      initial[field.key] = valueToFormValue(field, field.defaultValue);
    }
    setFormValues(initial);
  };

  const openEdit = (row: Record<string, unknown>) => {
    setEditingId(Number(row.id));
    setFormError(null);
    const initial: Record<string, string> = {};
    for (const field of fields) {
      initial[field.key] = valueToFormValue(field, row[field.key]);
    }
    setFormValues(initial);
  };

  const closeForm = () => {
    setEditingId(null);
    setFormError(null);
  };

  const submit = async () => {
    const payload: Record<string, unknown> = {};
    for (const field of fields) {
      if (field.required && formValues[field.key].trim() === "") {
        setFormError(`حقل "${field.label}" مطلوب.`);
        return;
      }
      const { value, error: fieldError } = fieldToRequestValue(field, formValues[field.key] ?? "");
      if (fieldError) {
        setFormError(fieldError);
        return;
      }
      if (value !== null) payload[field.key] = value;
    }

    setSaving(true);
    setFormError(null);
    try {
      const isNew = editingId === "new";
      const csrfToken = await getCsrfToken();
      const res = await fetch(apiPath, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json", "x-csrf-token": csrfToken },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error ?? "حدث خطأ أثناء الحفظ.");
        return;
      }
      closeForm();
      await load();
    } catch {
      setFormError("حدث خطأ أثناء الحفظ.");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (field: FormField, file: File) => {
    if (!field.uploadEndpoint) {
      setFormError(`حقل "${field.label}" لا يملك نقطة رفع معرّفة.`);
      return;
    }

    const maxBytes = field.maxImageBytes ?? DEFAULT_MAX_IMAGE_BYTES;
    if (file.size <= 0) {
      setFormError(`الملف "${file.name}" فارغ.`);
      return;
    }
    if (file.size > maxBytes) {
      setFormError(
        `صورة الغلاف كبيرة جداً. الحد الأقصى ${Math.round(maxBytes / (1024 * 1024))} ميجابايت.`
      );
      return;
    }
    if (!IMAGE_ACCEPT.includes(file.type)) {
      setFormError("صيغة الصورة غير مدعومة. يُقبل JPG أو PNG أو WebP فقط.");
      return;
    }

    setUploadingField(field.key);
    setFormError(null);
    try {
      const csrfToken = await getCsrfToken();
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: field.uploadEndpoint,
        headers: { "x-csrf-token": csrfToken },
      });
      setFormValues((prev) => ({ ...prev, [field.key]: blob.url }));
    } catch (error) {
      setFormError(
        `تعذّر رفع الصورة: ${
          error instanceof Error ? error.message : "خطأ غير معروف"
        }`
      );
    } finally {
      setUploadingField(null);
    }
  };

  const remove = async (row: Record<string, unknown>) => {
    const title = rowTitleKey ? String(row[rowTitleKey] ?? row.id ?? "هذا العنصر") : `هذا العنصر`;
    if (!window.confirm(`هل أنت متأكد من حذف "${title}"؟`)) return;
    try {
      const csrfToken = await getCsrfToken();
      const res = await fetch(`${apiPath}/${row.id}`, { method: "DELETE", headers: { "x-csrf-token": csrfToken } });
      const data = await res.json();
      if (!res.ok) {
        window.alert(data.error ?? "حدث خطأ أثناء الحذف.");
        return;
      }
      await load();
    } catch {
      window.alert("حدث خطأ أثناء الحذف.");
    }
  };

  const renderCell = (row: Record<string, unknown>, column: Column) => {
    if (column.render) return column.render(row);
    const value = row[column.key];
    if (Array.isArray(value)) {
      if (value.length === 0) return <span className="text-slate-300">—</span>;
      return <span className="text-xs text-slate-600">{value.join("، ")}</span>;
    }
    if (typeof value === "boolean") {
      return (
        <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${value ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
          {value ? "مفعّل" : "غير مفعّل"}
        </span>
      );
    }
    if (value == null || value === "") return <span className="text-slate-300">—</span>;
    return <span className="text-xs text-slate-700 line-clamp-2 max-w-xs">{String(value)}</span>;
  };

  return (
    <div dir="rtl" className="space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-slate-900">{resourceName}</h1>
          <p className="text-xs text-slate-500 mt-1">
            إدارة محتوى الوحدة من لوحة التحكم.
          </p>
        </div>

        {createSupported && (
          <button
            onClick={openNew}
            className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-extrabold hover:bg-slate-800 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            إضافة جديد
          </button>
        )}
      </div>

      {infoNote && (
        <div className="bg-sky-50 border border-sky-200 text-sky-800 text-xs rounded-2xl p-4 leading-relaxed">
          {infoNote}
        </div>
      )}

      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-extrabold block mb-0.5">تنبيه</span>
            {error}
          </div>
        </div>
      )}

      {editingId !== null && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-black text-sm">
              {editingId === "new" ? `إضافة ${resourceName.slice(0, -1)} جديد` : `تعديل ${resourceName.slice(0, -1)}`}
            </h2>

            <button
              onClick={closeForm}
              className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {fields.map((field) => (
              <div key={field.key} className={field.kind === "textarea" || field.kind === "json" || field.kind === "tags" || field.kind === "image-upload" ? "sm:col-span-2" : ""}>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  {field.label}
                  {field.required && <span className="text-red-500"> *</span>}
                </label>

                {field.kind === "textarea" || field.kind === "json" ? (
                  <textarea
                    value={formValues[field.key] ?? ""}
                    onChange={(e) => setFormValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    rows={field.kind === "json" ? 6 : 3}
                    className="w-full p-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm font-mono resize-y"
                    placeholder={field.placeholder}
                  />
                ) : field.kind === "select" ? (
                  <select
                    value={formValues[field.key] ?? ""}
                    onChange={(e) => setFormValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    className="w-full p-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm bg-white"
                  >
                    {(field.options ?? []).map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : field.kind === "boolean" ? (
                  <select
                    value={formValues[field.key] ?? "false"}
                    onChange={(e) => setFormValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    className="w-full p-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm bg-white"
                  >
                    <option value="true">مفعّل</option>
                    <option value="false">غير مفعّل</option>
                  </select>
                ) : field.kind === "image-upload" ? (
                  <div className="space-y-3">
                    <div className="flex items-start gap-4">
                      <div className="w-28 h-36 shrink-0 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
                        {formValues[field.key] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={formValues[field.key]}
                            alt={`معاينة ${field.label}`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-[11px] font-bold text-slate-400 px-2 text-center">
                            لا يوجد غلاف بعد
                          </span>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <input
                          ref={coverFileInput}
                          type="file"
                          accept={IMAGE_ACCEPT.join(",")}
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) void handleImageUpload(field, file);
                            e.target.value = "";
                          }}
                        />
                        <button
                          onClick={() => coverFileInput.current?.click()}
                          disabled={uploadingField !== null}
                          className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-extrabold hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2"
                        >
                          {uploadingField === field.key ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : null}
                          {formValues[field.key] ? "تغيير الغلاف" : "📤 رفع غلاف الكتاب"}
                        </button>
                        {formValues[field.key] && (
                          <p className="text-[11px] text-slate-400">
                            يتم نشر الصورة تلقائياً عند الضغط على «حفظ».
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <input
                    type={field.kind === "number" ? "number" : "text"}
                    value={formValues[field.key] ?? ""}
                    onChange={(e) => setFormValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    className="w-full p-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm"
                    placeholder={field.placeholder}
                  />
                )}

                {field.help && (
                  <p className="text-[11px] text-slate-400 mt-1">{field.help}</p>
                )}
              </div>
            ))}
          </div>

          {formError && (
            <p className="text-xs font-bold text-red-600">{formError}</p>
          )}

          <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
            <button
              onClick={submit}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-extrabold hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              حفظ
            </button>

            <button
              onClick={closeForm}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 text-xs font-bold hover:bg-slate-50"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-xs font-bold">جاري التحميل...</span>
          </div>
        ) : items.length === 0 && !error ? (
          <div className="py-16 text-center">
            <p className="text-xs font-bold text-slate-400">
              لا توجد عناصر بعد. استخدم زر الإضافة للبدء.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {columns.map((column) => (
                    <th key={column.key} className="px-4 py-3 text-[11px] font-extrabold text-slate-500 whitespace-nowrap">
                      {column.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-[11px] font-extrabold text-slate-500 whitespace-nowrap">
                    إجراءات
                  </th>
                </tr>
              </thead>

              <tbody>
                {items.map((row, index) => (
                  <tr key={index} className="border-b border-slate-50 hover:bg-slate-50/50">
                    {columns.map((column) => (
                      <td key={column.key} className="px-4 py-3">
                        {renderCell(row, column)}
                      </td>
                    ))}

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEdit(row)}
                          className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center hover:bg-sky-100"
                          title="تعديل"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => remove(row)}
                          className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100"
                          title="حذف"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
