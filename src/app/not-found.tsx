import Link from "next/link";

export default function NotFound() {
  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-indigo-100 to-fuchsia-100 flex items-center justify-center">
          <span className="text-4xl font-black text-indigo-600">404</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          الصفحة غير موجودة
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى عنوان آخر.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors"
          >
            العودة للرئيسية
          </Link>
          <Link
            href="/projects"
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-bold hover:bg-slate-100 transition-colors"
          >
            تصفح المشاريع
          </Link>
        </div>
      </div>
    </main>
  );
}