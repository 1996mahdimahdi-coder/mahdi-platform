"use client";

import AdminShell from "@/components/admin/AdminShell";
import AdminResource, { type FormField, type Column } from "@/components/admin/AdminResource";

const fields: FormField[] = [
  { key: "questionKey", label: "مفتاح السؤال", kind: "text", required: true, help: "مثال: mode, hours, skills" },
  { key: "title", label: "عنوان السؤال", kind: "text", required: true },
  { key: "subtitle", label: "الشرح الفرعي", kind: "text" },
  { key: "type", label: "نوع السؤال", kind: "select", options: [
    { value: "single", label: "اختيار واحد" },
    { value: "multi", label: "اختيار متعدد" },
    { value: "text", label: "إجابة نصية" },
  ], defaultValue: "single" },
  { key: "order", label: "الترتيب", kind: "number", defaultValue: 0 },
  { key: "required", label: "إلزامي", kind: "boolean", defaultValue: true },
  { key: "active", label: "مفعل", kind: "boolean", defaultValue: true },
  {
    key: "options",
    label: "الخيارات (JSON)",
    kind: "json",
    help: "مثال: [{ \"value\": \"services\", \"label\": \"خدمات\", \"tags\": [\"خدمات\"] }]",
  },
];

const columns: Column[] = [
  { key: "order", label: "الترتيب" },
  { key: "title", label: "السؤال" },
  { key: "questionKey", label: "المفتاح" },
  { key: "type", label: "النوع" },
  { key: "required", label: "إلزامي" },
  { key: "active", label: "الحالة" },
];

export default function AdminNoCapitalQuestionsPage() {
  return (
    <AdminShell title="أسئلة اختبار بدون رأس مال" subtitle="الأسئلة الافتراضية تُقرأ من الكود حتى يتم تفعيل الجدول">
      <AdminResource
        resourceName="الأسئلة"
        apiPath="/api/admin/no-capital/questions"
        fields={fields}
        columns={columns}
        rowTitleKey="title"
        infoNote="الأسئلة والخيارات الحالية تظهر من الكود (7 أسئلة). بمجرد إنشاء الجدول تُدار من هنا وتصبح مصدر البيانات الرئيسي للاختبار."
      />
    </AdminShell>
  );
}
