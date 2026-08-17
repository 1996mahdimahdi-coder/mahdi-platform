"use client";

import AdminShell from "@/components/admin/AdminShell";
import AdminResource, { type FormField, type Column } from "@/components/admin/AdminResource";

const fields: FormField[] = [
  { key: "version", label: "رقم النسخة (Version)", kind: "text", required: true, help: "مثال: 1.0, 1.1, 2.0" },
  { key: "title", label: "العنوان", kind: "text", required: true },
  { key: "text", label: "نص الموافقة", kind: "textarea", required: true, help: "النص الكامل المعروض قبل عرض النتائج" },
  { key: "required", label: "إلزامية", kind: "boolean", defaultValue: true },
  { key: "active", label: "نسخة نشطة (معروضة)", kind: "boolean", defaultValue: false, help: "يجب أن تكون نسخة واحدة فقط نشطة" },
];

const columns: Column[] = [
  { key: "version", label: "النسخة" },
  { key: "title", label: "العنوان" },
  { key: "active", label: "نشطة" },
  { key: "updatedAt", label: "آخر تحديث" },
];

export default function AdminConsentPage() {
  return (
    <AdminShell title="شروط الموافقة (Consent)" subtitle="النص الذي يظهر قبل عرض أي نتائج اختبار">
      <AdminResource
        resourceName="نسخ الموافقة"
        apiPath="/api/admin/consent"
        fields={fields}
        columns={columns}
        rowTitleKey="title"
        infoNote="النسخة الحالية تُقرأ من الكود حتى يتم تفعيل الجدول. نصها واضح ومحدود: نتائج استرشادية، ليست نصيحة مالية/قانونية، ويجب التحقق من الشروط المحلية."
      />
    </AdminShell>
  );
}
