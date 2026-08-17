export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <h1 className="text-2xl font-black text-slate-900 border-b border-slate-100 pb-3">
          سياسة الخصوصية وحماية البيانات
        </h1>

        <div className="space-y-4">
          <p>
            تولي منصة <strong>NABDA</strong> أقصى درجات الأهمية لخصوصية مستخدميها وحماية بياناتهم الشخصية والمالية.
          </p>

          <h2 className="font-extrabold text-slate-900">1. البيانات التي نجمعها</h2>
          <p>
            نجمع فقط البيانات التي تدخلها في استبيان التقييم (مثل رأس المال، الإقامة، والمهارات) بغرض حساب أفضل المشاريع المناسبة لك.
          </p>

          <h2 className="font-extrabold text-slate-900">2. حماية البيانات وعدم مشاركتها</h2>
          <p>
            نلتزم بعدم بيع أو مشاركة أي بيانات شخصية مع طرف ثالث لأغراض إعلانية.
          </p>

          <h2 className="font-extrabold text-slate-900">3. أمان الحسابات</h2>
          <p>
            تُشفر جميع كلمات المرور بأحدث تقنيات التشفير الأمنية (Bcrypt).
          </p>
        </div>
      </div>
    </div>
  );
}
