"use client";

import AdminShell from "@/components/admin/AdminShell";
import AdminResource, { type FormField, type Column } from "@/components/admin/AdminResource";

const fields: FormField[] = [
  { key: "platform", label: "المنصة", kind: "select", required: true, options: [
    { value: "tiktok", label: "تيك توك" },
    { value: "instagram", label: "انستغرام" },
    { value: "youtube", label: "يوتيوب" },
    { value: "facebook", label: "فيسبوك" },
  ], defaultValue: "instagram" },
  { key: "cadence", label: "إيقاع النشر", kind: "text", placeholder: "مثال: 4-5 مرات أسبوعياً" },
  { key: "bestTimes", label: "أفضل الأوقات", kind: "tags", help: "كل سطر وقت" },
  { key: "tips", label: "نصائح", kind: "tags", help: "كل سطر نصيحة" },
  { key: "active", label: "مفعل", kind: "boolean", defaultValue: true },
];

const columns: Column[] = [
  { key: "platform", label: "المنصة" },
  { key: "cadence", label: "الإيقاع" },
  { key: "bestTimes", label: "الأوقات" },
  { key: "active", label: "الحالة" },
];

export default function AdminContentPublishingPage() {
  return (
    <AdminShell title="خطط النشر" subtitle="إيقاع النشر وأفضل الأوقات لكل منصة">
      <AdminResource
        resourceName="خطط النشر"
        apiPath="/api/admin/content-publishing"
        fields={fields}
        columns={columns}
        rowTitleKey="platform"
        infoNote="الخطط الافتراضية تُقرأ من الكود. عند التفعيل، تُدار من هنا فقط."
      />
    </AdminShell>
  );
}
