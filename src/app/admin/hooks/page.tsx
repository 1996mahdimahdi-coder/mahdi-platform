"use client";

import AdminShell from "@/components/admin/AdminShell";
import AdminResource, { type FormField, type Column } from "@/components/admin/AdminResource";

const fields: FormField[] = [
  { key: "title", label: "العنوان", kind: "text", required: true },
  { key: "hookText", label: "نص الخطاف", kind: "textarea", required: true },
  { key: "type", label: "النوع", kind: "select", options: [
    { value: "question", label: "سؤال" },
    { value: "number", label: "رقم" },
    { value: "curiosity", label: "فضول" },
    { value: "contrast", label: "تباين" },
    { value: "story", label: "قصة" },
  ], defaultValue: "question" },
  { key: "niche", label: "المجال/النيش", kind: "text" },
  { key: "categoryId", label: "التصنيف (معرف)", kind: "number" },
  { key: "usageContext", label: "سياق الاستخدام", kind: "text" },
  { key: "strength", label: "القوة", kind: "select", options: [
    { value: "low", label: "منخفضة" },
    { value: "medium", label: "متوسطة" },
    { value: "high", label: "عالية" },
  ], defaultValue: "medium" },
  { key: "example", label: "مثال تطبيقي", kind: "textarea" },
  { key: "published", label: "منشور", kind: "boolean", defaultValue: false },
];

const columns: Column[] = [
  { key: "title", label: "العنوان" },
  { key: "hookText", label: "النص" },
  { key: "type", label: "النوع" },
  { key: "strength", label: "القوة" },
  { key: "published", label: "الحالة" },
];

export default function AdminHooksPage() {
  return (
    <AdminShell title="مكتبة الخطافات" subtitle="أكثر من 100 خطاف فيديو مجرّب">
      <AdminResource
        resourceName="الخطافات"
        apiPath="/api/admin/hooks"
        fields={fields}
        columns={columns}
        rowTitleKey="title"
        infoNote="المكتبة تُبنى تدريجياً من قبل فريق المحتوى. أضف أول خطافاتك هنا وستظهر في صفحة الخطافات."
      />
    </AdminShell>
  );
}
