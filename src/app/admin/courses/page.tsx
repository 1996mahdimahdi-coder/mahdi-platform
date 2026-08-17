"use client";

import AdminShell from "@/components/admin/AdminShell";
import AdminResource, { type FormField, type Column } from "@/components/admin/AdminResource";

const fields: FormField[] = [
  { key: "slug", label: "المعرّف (Slug)", kind: "text", required: true },
  { key: "title", label: "عنوان الدورة", kind: "text", required: true },
  { key: "summary", label: "الملخص", kind: "textarea", required: true },
  { key: "description", label: "الوصف الكامل", kind: "textarea" },
  { key: "categoryId", label: "التصنيف (معرف)", kind: "number" },
  { key: "level", label: "المستوى", kind: "text", defaultValue: "مبتدئ" },
  { key: "durationMinutes", label: "المدة (دقائق)", kind: "number", defaultValue: 30 },
  { key: "lessonsCount", label: "عدد الدروس", kind: "number", defaultValue: 0 },
  { key: "coverImage", label: "صورة الغلاف (رابط)", kind: "text" },
  { key: "published", label: "منشورة", kind: "boolean", defaultValue: false },
];

const columns: Column[] = [
  { key: "title", label: "الدورة" },
  { key: "level", label: "المستوى" },
  { key: "durationMinutes", label: "المدة" },
  { key: "lessonsCount", label: "الدروس" },
  { key: "published", label: "الحالة" },
];

export default function AdminCoursesPage() {
  return (
    <AdminShell title="الدورات" subtitle="دورات مجانية (إضافة الدروس تجري عبر قاعدة البيانات مباشرة حالياً)">
      <AdminResource
        resourceName="الدورات"
        apiPath="/api/admin/courses"
        fields={fields}
        columns={columns}
        rowTitleKey="title"
        infoNote="لا تُضاف دورات جاهزة حالياً. أضف دورتك الأولى هنا وستظهر في صفحة الدورات فور تفعيل الجدول."
      />
    </AdminShell>
  );
}
