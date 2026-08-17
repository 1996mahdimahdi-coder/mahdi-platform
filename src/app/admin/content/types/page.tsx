"use client";

import AdminShell from "@/components/admin/AdminShell";
import AdminResource, { type FormField, type Column } from "@/components/admin/AdminResource";

const fields: FormField[] = [
  { key: "slug", label: "المعرّف (Slug)", kind: "text", required: true },
  { key: "nameAr", label: "الاسم بالعربية", kind: "text", required: true },
  { key: "description", label: "الوصف", kind: "textarea" },
  { key: "bestPractices", label: "أفضل الممارسات", kind: "tags", help: "كل سطر ممارسة" },
  { key: "example", label: "مثال", kind: "textarea" },
];

const columns: Column[] = [
  { key: "nameAr", label: "النوع" },
  { key: "slug", label: "المعرّف" },
  { key: "bestPractices", label: "الممارسات" },
];

export default function AdminContentTypesPage() {
  return (
    <AdminShell title="أنواع المحتوى" subtitle="أنواع المحتوى وأفضل الممارسات">
      <AdminResource
        resourceName="أنواع المحتوى"
        apiPath="/api/admin/content-types"
        fields={fields}
        columns={columns}
        rowTitleKey="nameAr"
        infoNote="الأنواع الافتراضية (ريل، فيديو طويل، شرائح، نص) تُقرأ من الكود. أضف أنواعك هنا عند التفعيل."
      />
    </AdminShell>
  );
}
