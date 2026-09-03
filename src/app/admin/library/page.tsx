"use client";

import AdminShell from "@/components/admin/AdminShell";
import AdminResource, { type FormField, type Column } from "@/components/admin/AdminResource";

const fields: FormField[] = [
  { key: "slug", label: "المعرّف (Slug)", kind: "text", required: true, help: "معرّف فريد يظهر في رابط الكتاب، مثال: book-commercial-guide" },
  { key: "title", label: "عنوان الكتاب", kind: "text", required: true },
  { key: "category", label: "المجال", kind: "text", required: true, placeholder: "تجارة، تسويق، إدارة..." },
  { key: "shortDescription", label: "الوصف المختصر", kind: "textarea", required: true },
  { key: "description", label: "الوصف الكامل", kind: "textarea" },
  { key: "coverImage", label: "غلاف الكتاب", kind: "image-upload", uploadEndpoint: "/api/admin/library/upload", help: "ارفع صورة من جهازك (JPG، PNG، WebP) حتى 5 ميجابايت. تُخزَّن الصورة في Vercel Blob ويُحفظ رابطها فقط في قاعدة البيانات." },
  { key: "whatYouLearn", label: "ماذا ستتعلم؟ (كل سطر = نقطة)", kind: "tags" },
  { key: "outline", label: "المحاور/المحتوى (كل سطر = محور)", kind: "tags" },
  { key: "priceDzd", label: "السعر (دج)", kind: "number", defaultValue: 0 },
  { key: "published", label: "منشور", kind: "boolean", defaultValue: false },
];

const columns: Column[] = [
  { key: "title", label: "الكتاب" },
  { key: "category", label: "المجال" },
  {
    key: "priceDzd",
    label: "السعر",
    render: (row) => (
      <span className="text-xs font-bold text-slate-700">
        {Number(row.priceDzd).toLocaleString("ar-DZ")} دج
      </span>
    ),
  },
  { key: "published", label: "الحالة" },
];

export default function AdminLibraryPage() {
  return (
    <AdminShell title="إدارة المكتبة" subtitle="كتب وأدلة NABDA المدفوعة تباع عبر Telegram">
      <AdminResource
        resourceName="الكتب"
        apiPath="/api/admin/library"
        fields={fields}
        columns={columns}
        rowTitleKey="title"
        infoNote="الكتب المنشورة فقط تظهر في صفحة المكتبة. لا تُخزَّن ملفات PDF داخل قاعدة البيانات؛ يُسلَّم الكتاب يدوياً عبر Telegram بعد تأكيد الدفع."
      />
    </AdminShell>
  );
}