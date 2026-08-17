"use client";

import AdminShell from "@/components/admin/AdminShell";
import AdminResource, { type FormField, type Column } from "@/components/admin/AdminResource";

const fields: FormField[] = [
  { key: "slug", label: "المعرّف (Slug)", kind: "text", required: true },
  { key: "nameAr", label: "الاسم بالعربية", kind: "text", required: true },
  { key: "nameFr", label: "الاسم بالفرنسية", kind: "text", required: true },
  { key: "type", label: "النوع", kind: "select", options: [
    { value: "domain", label: "مجال (Domain)" },
    { value: "category", label: "تصنيف فرعي (Category)" },
  ], defaultValue: "category" },
  { key: "parentId", label: "التصنيف الأب (معرف)", kind: "number", placeholder: "اتركه فارغاً للمجال الرئيسي" },
  { key: "icon", label: "الأيقونة", kind: "text" },
  { key: "description", label: "الوصف", kind: "textarea" },
  { key: "sortOrder", label: "ترتيب العرض", kind: "number", defaultValue: 0 },
  { key: "active", label: "مفعل", kind: "boolean", defaultValue: true },
];

const columns: Column[] = [
  { key: "nameAr", label: "الاسم" },
  { key: "nameFr", label: "بالفرنسية" },
  { key: "type", label: "النوع" },
  { key: "slug", label: "المعرّف" },
  { key: "sortOrder", label: "الترتيب" },
  { key: "active", label: "الحالة" },
];

export default function AdminCategoriesPage() {
  return (
    <AdminShell title="إدارة المجالات والتصنيفات" subtitle="المجالات الرئيسية والتصنيفات الفرعية">
      <AdminResource
        resourceName="التصنيفات"
        apiPath="/api/admin/categories"
        fields={fields}
        columns={columns}
        rowTitleKey="nameAr"
        infoNote="تظهر المجالات الافتراضية في الموقع من الكود حتى يتم إنشاء الجداول. بمجرد التفعيل، تُدار هذه القائمة من هنا فقط."
      />
    </AdminShell>
  );
}
