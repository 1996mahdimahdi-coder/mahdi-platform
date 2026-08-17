"use client";

import AdminShell from "@/components/admin/AdminShell";
import AdminResource, { type FormField, type Column } from "@/components/admin/AdminResource";

const fields: FormField[] = [
  { key: "slug", label: "المعرّف (Slug)", kind: "text", required: true },
  { key: "title", label: "عنوان الفيديو", kind: "text", required: true },
  { key: "videoUrl", label: "رابط الفيديو", kind: "text" },
  { key: "embedUrl", label: "رابط التضمين (Embed)", kind: "text", help: "رابط iframe مثلاً يوتيوب" },
  { key: "durationSeconds", label: "المدة (ثانية)", kind: "number", defaultValue: 0 },
  { key: "categoryId", label: "التصنيف (معرف)", kind: "number" },
  { key: "description", label: "الوصف", kind: "textarea" },
  { key: "thumbnailUrl", label: "صورة مصغرة (رابط)", kind: "text" },
  { key: "transcript", label: "النص المكتوب", kind: "textarea" },
  { key: "published", label: "منشور", kind: "boolean", defaultValue: false },
];

const columns: Column[] = [
  { key: "title", label: "الفيديو" },
  { key: "durationSeconds", label: "المدة" },
  { key: "published", label: "الحالة" },
];

export default function AdminVideosPage() {
  return (
    <AdminShell title="الفيديوهات" subtitle="فيديوهات تعليمية قصيرة">
      <AdminResource
        resourceName="الفيديوهات"
        apiPath="/api/admin/videos"
        fields={fields}
        columns={columns}
        rowTitleKey="title"
        infoNote="لا تُضاف فيديوهات جاهزة حالياً. أضف فيديوهاتك هنا وستظهر في صفحة الفيديوهات."
      />
    </AdminShell>
  );
}
