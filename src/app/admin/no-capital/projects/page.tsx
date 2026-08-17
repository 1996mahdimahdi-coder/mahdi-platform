"use client";

import AdminShell from "@/components/admin/AdminShell";
import AdminResource, { type FormField, type Column } from "@/components/admin/AdminResource";

const fields: FormField[] = [
  { key: "slug", label: "المعرّف (Slug)", kind: "text", required: true },
  { key: "nameAr", label: "اسم المشروع بالعربية", kind: "text", required: true },
  { key: "nameFr", label: "الاسم بالفرنسية", kind: "text" },
  { key: "categoryId", label: "التصنيف (معرف)", kind: "number" },
  { key: "domainId", label: "المجال (معرف)", kind: "number" },
  { key: "description", label: "الوصف", kind: "textarea", required: true },
  { key: "effortLevel", label: "مستوى المجهود", kind: "select", options: [
    { value: "منخفض", label: "منخفض" },
    { value: "متوسط", label: "متوسط" },
    { value: "مرتفع", label: "مرتفع" },
  ], defaultValue: "متوسط" },
  { key: "timeRequired", label: "الوقت المطلوب", kind: "text", defaultValue: "2-4 ساعات" },
  { key: "startCostEstimate", label: "تكلفة الانطلاق", kind: "text", defaultValue: "0 دج" },
  { key: "skillsRequired", label: "المهارات المطلوبة", kind: "tags", help: "كل سطر مهارة" },
  { key: "toolsNeeded", label: "الوسائل اللازمة", kind: "tags", help: "كل سطر وسيلة" },
  { key: "tags", label: "وسوم التوافق (Tags)", kind: "tags", help: "وسوم يطابقها المحرك مع اختيارات المستخدم" },
  { key: "risks", label: "المخاطر", kind: "tags", help: "كل سطر خطر" },
  { key: "advantages", label: "المزايا", kind: "tags" },
  { key: "disadvantages", label: "العيوب", kind: "tags" },
  { key: "steps", label: "خطوات الانطلاق (JSON)", kind: "json", help: "[{ \"title\": \"...\", \"detail\": \"...\" }]" },
  { key: "legalNotes", label: "ملاحظات قانونية", kind: "textarea" },
  { key: "active", label: "مفعل", kind: "boolean", defaultValue: true },
];

const columns: Column[] = [
  { key: "nameAr", label: "المشروع" },
  { key: "effortLevel", label: "المجهود" },
  { key: "startCostEstimate", label: "التكلفة" },
  { key: "tags", label: "الوسوم" },
  { key: "active", label: "الحالة" },
];

export default function AdminNoCapitalProjectsPage() {
  return (
    <AdminShell title="مشاريع بدون رأس مال" subtitle="هذه القائمة تبقى فارغة حتى تُراجع وتُضاف المشاريع يدوياً">
      <AdminResource
        resourceName="المشاريع"
        apiPath="/api/admin/no-capital/projects"
        fields={fields}
        columns={columns}
        rowTitleKey="nameAr"
        infoNote="بما أن القائمة فارغة حالياً، تعرض صفحة النتائج حالة فارغة صادقة. أضف مشاريع مراجعة ومحلية هنا وستظهر فوراً في اختبار بدون رأس مال."
      />
    </AdminShell>
  );
}
