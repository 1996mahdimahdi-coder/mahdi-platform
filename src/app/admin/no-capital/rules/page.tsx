"use client";

import AdminShell from "@/components/admin/AdminShell";
import AdminResource, { type FormField, type Column } from "@/components/admin/AdminResource";

const fields: FormField[] = [
  { key: "questionKey", label: "مفتاح السؤال", kind: "text", required: true, help: "مثال: mode, skills, tools, hours" },
  { key: "optionValue", label: "قيمة الخيار", kind: "text", required: true, help: "قيمة الخيار الذي يختاره المستخدم" },
  { key: "tag", label: "الوسم (Tag)", kind: "text", required: true, help: "الوسم المطابق في ملف المشروع" },
  { key: "weight", label: "الوزن (1-10)", kind: "number", required: true, defaultValue: 1, help: "1 = عادي، أعلى = تعزيز أقوى" },
  { key: "note", label: "ملاحظة", kind: "text" },
  { key: "active", label: "مفعل", kind: "boolean", defaultValue: true },
];

const columns: Column[] = [
  { key: "questionKey", label: "السؤال" },
  { key: "optionValue", label: "الخيار" },
  { key: "tag", label: "الوسم" },
  { key: "weight", label: "الوزن" },
  { key: "active", label: "الحالة" },
];

export default function AdminNoCapitalRulesPage() {
  return (
    <AdminShell title="قواعد التوصية" subtitle="تحكم في كيف تؤثر الإجابات على ترتيب النتائج">
      <AdminResource
        resourceName="القواعد"
        apiPath="/api/admin/no-capital/rules"
        fields={fields}
        columns={columns}
        rowTitleKey="tag"
        infoNote="هذه القواعد تُضاف على المحرّك الأساسي. كل قاعدة تربط (سؤال + خيار + وسم) بوزن تعزيز. إذا لم تُضف قواعد، يعمل المحرك بالأوزان الافتراضية."
      />
    </AdminShell>
  );
}
