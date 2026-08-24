import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سياسة الخصوصية",
  description: "تعرّف على كيفية جمع واستخدام وحماية بياناتك الشخصية عند استخدام منصة NABDA.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <h1 className="text-2xl font-black text-slate-900 border-b border-slate-100 pb-3">
          سياسة الخصوصية وحماية البيانات
        </h1>
        <p className="text-slate-500">آخر تحديث: أوت 2026</p>
        <div className="space-y-4">
          <p>
            تولي منصة <strong>NABDA</strong> أقصى درجات الأهمية لخصوصية مستخدميها وحماية بياناتهم الشخصية والمالية.
          </p>

          <h2 className="font-extrabold text-slate-900">1. البيانات التي نجمعها</h2>
          <p>
            نجمع البيانات التالية: (أ) بيانات استبيان التقييم (رأس المال، الإقامة، المهارات) لحساب أفضل المشاريع المناسبة لك؛ (ب) بيانات نافذة الترحيب الاختيارية (الاسم واللقب والعمر) إذا اخترت تعبئتها؛ (ج) محتوى محادثاتك مع المساعد الذكي داخل المنصة؛ (د) بيانات تقنية أساسية (نوع المتصفح، الجهاز، عنوان IP) لأغراض الأمان وتحسين الأداء.
          </p>

          <h2 className="font-extrabold text-slate-900">2. حماية البيانات وعدم مشاركتها</h2>
          <p>
            نلتزم بعدم بيع أو مشاركة أي بيانات شخصية مع طرف ثالث لأغراض إعلانية موجهة (targeted advertising).
          </p>

          <h2 className="font-extrabold text-slate-900">3. خدمات الطرف الثالث</h2>
          <p>
            نستخدم شبكة Adsterra لعرض إعلانات على المنصة. قد تستخدم هذه الشبكة ملفات تعريف ارتباط (cookies) خاصة بها لعرض إعلانات عامة، بشكل مستقل عن بيانات حسابك الشخصية في NABDA. نوصي بمراجعة سياسة خصوصية Adsterra للمزيد من التفاصيل.
          </p>

          <h2 className="font-extrabold text-slate-900">4. ملفات تعريف الارتباط (Cookies)</h2>
          <p>
            تستخدم المنصة ملفات تعريف ارتباط أساسية لتشغيل الموقع وحفظ تفضيلاتك (مثل تخطي نافذة الترحيب)، بالإضافة لملفات خاصة بشبكة الإعلانات المذكورة أعلاه.
          </p>

          <h2 className="font-extrabold text-slate-900">5. مدة الاحتفاظ بالبيانات</h2>
          <p>
            نحتفظ ببيانات حسابك طالما بقي نشطاً. يمكنك طلب حذف حسابك وكل بياناته المرتبطة في أي وقت عبر التواصل معنا.
          </p>

          <h2 className="font-extrabold text-slate-900">6. حقوقك</h2>
          <p>
            يحق لك في أي وقت طلب الاطلاع على بياناتك، تعديلها، أو حذفها بالكامل من منصتنا، عبر التواصل معنا على البريد الإلكتروني الموضح في صفحة التواصل.
          </p>

          <h2 className="font-extrabold text-slate-900">7. أمان الحسابات</h2>
          <p>
            تُخزَّن كلمات المرور بعد تجزئتها (hashing) باستخدام خوارزمية Bcrypt، وهي طريقة آمنة لا تسمح باسترجاع كلمة المرور الأصلية حتى من داخل قاعدة البيانات.
          </p>
        </div>
      </div>
    </div>
  );
}