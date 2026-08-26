"use client";

import AdminShell from "@/components/admin/AdminShell";
import AdminResource, { type FormField, type Column } from "@/components/admin/AdminResource";

const fields: FormField[] = [
  { key: "slug", label: "المعرّف (Slug)", kind: "text", required: true },
  { key: "title", label: "عنوان المقال", kind: "text", required: true },
  { key: "summary", label: "الملخص", kind: "textarea", required: true },
  { key: "content", label: "المحتوى (Markdown)", kind: "textarea", required: true },
  { key: "category", label: "التصنيف", kind: "select", required: true, options: [
    { value: "نصائح", label: "نصائح" },
    { value: "دروس رأس المال", label: "دروس رأس المال" },
    { value: "مشاريع منزليّة", label: "مشاريع منزليّة" },
    { value: "تسويق", label: "تسويق" },
    { value: "قانوني", label: "قانوني" },
  ]},
  { key: "capitalRange", label: "نطاق رأس المال", kind: "text" },
  { key: "readTime", label: "وقت القراءة", kind: "text", defaultValue: "5 دقائق" },
  { key: "image", label: "صورة الغلاف (رابط)", kind: "text" },
  { key: "infographic", label: "إنفوجرافيك (رابط)", kind: "text" },
  { key: "sources", label: "المصادر (JSON array)", kind: "json" },
  { key: "financialData", label: "البيانات المالية (JSON)", kind: "json" },
];

const columns: Column[] = [
  { key: "title", label: "المقال" },
  { key: "category", label: "التصنيف" },
  { key: "readTime", label: "وقت القراءة" },
];

export default function AdminBlogPage() {
  return (
    <AdminShell title="المقالات" subtitle="إدارة مقالات المدونة للترويج وتحسين محركات البحث">
      <AdminResource
        resourceName="المقالات"
        apiPath="/api/admin/blog"
        fields={fields}
        columns={columns}
        rowTitleKey="title"
        infoNote="أضف مقالات جديدة هنا. عند الحفظ سيتم إرسال إشعار Push Notification لمستخدمي التطبيق على Android."
      />
    </AdminShell>
  );
}
