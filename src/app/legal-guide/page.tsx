import type { Metadata } from "next";
import { ExternalLink, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "الدليل القانوني — NABDA",
  description: "دليل إرشادي للإجراءات القانونية: بطاقة المقاول الذاتي، السجل التجاري، والالتزامات الإدارية في الجزائر.",
};

export default function LegalGuidePage() {
  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">

        <div>
          <h1 className="text-2xl sm:text-4xl font-black">الدليل القانوني للانطلاق</h1>
          <p className="text-sm text-slate-500 mt-3">
            إجراءات رسمية مبسطة لممارسة نشاطك بشكل قانوني في الجزائر.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            هذا الدليل استرشادي وتبسيطي فقط، وقد تتغير القوانين والإجراءات. المصدر الرسمي الوحيد هو:
            الوكالة الوطنية للمقاول الذاتي (anae.dz)، المركز الوطني للسجل التجاري (sidjilcom.cnrc.dz)،
            ومديرية الضرائب والجهات المختصة. تحقق دائماً من المواقع الرسمية قبل أي إجراء.
          </p>
        </div>

        <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-xl font-black">1. بطاقة المقاول الذاتي (ANAE)</h2>
          <p className="text-sm text-slate-600">
            نظام قانوني مبسط لممارسة نشاط فردي بدون سجل تجاري وبدون محل. مثالي للخدمات الرقمية
            والحرف والبيع أونلاين. أنشئ بالقانون 22-23.
          </p>

          <div className="space-y-2">
            <h3 className="font-black text-sm">الشروط الأساسية:</h3>
            <ul className="text-sm text-slate-600 space-y-1 list-disc pr-5">
              <li>الجنسية الجزائرية أو الإقامة القانونية في الجزائر.</li>
              <li>النشاط ضمن قائمة الأنشطة المؤهلة (متوفرة في anae.dz).</li>
              <li>لا يحق للموظف العمومي ممارسة نشاط مربح آخر.</li>
              <li>المهن المقننة (طبيب، محامي، مهندس معماري...) غير مؤهلة.</li>
              <li>لا يحق لصاحب بطاقة الحرفي التسجيل في المقاول الذاتي.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-black text-sm">الوثائق المطلوبة:</h3>
            <ul className="text-sm text-slate-600 space-y-1 list-disc pr-5">
              <li>بطاقة التعريف الوطنية البيومترية.</li>
              <li>صورة شمسية رقمية.</li>
              <li>بريد إلكتروني ورقم هاتف.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-black text-sm">خطوات التسجيل (إلكتروني بالكامل):</h3>
            <ol className="text-sm text-slate-600 space-y-1 list-decimal pr-5">
              <li>إنشاء حساب على المنصة الرسمية anae.dz.</li>
              <li>اختيار النشاط الرئيسي (يمكن إضافة 4 أنشطة فرعية في نفس المجال).</li>
              <li>إدخال المعلومات الشخصية ورفع الوثائق.</li>
              <li>استلام البطاقة (تُرسل عبر البريد — رسوم حوالي 1200 دج).</li>
              <li>الحصول على الرقم الجبائي NIF تلقائياً من المنصة.</li>
              <li>التصريح بالوجود (G8) وتوثيق الرقم الجبائي لدى مصلحة الضرائب.</li>
              <li>التسجيل في الضمان الاجتماعي CASNOS.</li>
              <li>التصريح برقم الأعمال التقديري قبل 30 جوان، والنهائي قبل 20 جانفي من السنة الموالية.</li>
            </ol>
          </div>

          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
            ⚠️ بطاقة المقاول الذاتي لا تسمح بفتح محل تجاري (فقط مكتب خدمات). إذا تجاوز رقم أعمالك
            الحد الأقصى 3 سنوات متتالية، يجب التسجيل في السجل التجاري.
          </p>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-xl font-black">2. السجل التجاري (CNRC)</h2>
          <p className="text-sm text-slate-600">
            إلزامي لأي نشاط تجاري منتظم بمحل (متجر، مطعم، ورشة، تجارة بالجملة...).
            التسجيل إلكتروني عبر منصة Sidjilcom أو حضورياً لدى المركز الوطني للسجل التجاري.
          </p>

          <div className="space-y-2">
            <h3 className="font-black text-sm">الوثائق المطلوبة (للتاجر الفرد):</h3>
            <ul className="text-sm text-slate-600 space-y-1 list-disc pr-5">
              <li>بطاقة التعريف الوطنية.</li>
              <li>مستخرج الميلاد أو الرقم التعريفي NIN.</li>
              <li>صحيفة السوابق العدلية (القسيمة رقم 3).</li>
              <li>شهادة الإقامة.</li>
              <li>إثبات وجود محل: عقد ملكية أو عقد إيجار أو مقرر تخصيص.</li>
              <li>وصل دفع حقوق القيد + حقوق الطابع (4000 دج).</li>
              <li>للأنشطة المقننة: رخصة أو اعتماد من الإدارة المختصة.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="font-black text-sm">خطوات التسجيل:</h3>
            <ol className="text-sm text-slate-600 space-y-1 list-decimal pr-5">
              <li>التسجيل في منصة sidjilcom.cnrc.dz أو التوجه لفرع CNRC.</li>
              <li>ملء الاستمارة واختيار رمز النشاط والتسمية التجارية.</li>
              <li>رفع الوثائق ودفع الرسوم إلكترونياً (بطاقة CIB أو الذهبية).</li>
              <li>استلام السجل التجاري (عادة 3-7 أيام عمل).</li>
              <li>التسجيل الجبائي والحصول على NIF لدى مديرية الضرائب.</li>
              <li>التصريح لدى CASNOS خلال 10 أيام من بدء النشاط.</li>
              <li>فتح حساب بنكي مهني.</li>
            </ol>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
          <h2 className="text-xl font-black">3. التزامات بعد التسجيل</h2>
          <ul className="text-sm text-slate-600 space-y-1 list-disc pr-5">
            <li>عرض رقم السجل التجاري والرقم الجبائي في واجهة المحل أو المتجر.</li>
            <li>التصريح الجبائي السنوي والالتزام بمواعيد الضرائب.</li>
            <li>التسجيل في الضمان الاجتماعي (CASNOS) ودفع الاشتراكات.</li>
            <li>الالتزام بشروط النظافة والسلامة للأنشطة الغذائية والصحية.</li>
          </ul>
        </section>

        <section className="bg-slate-900 rounded-2xl p-6 space-y-3">
          <h2 className="text-xl font-black text-white">الروابط الرسمية</h2>
          <div className="space-y-2">
            <a href="https://www.anae.dz" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-sm text-indigo-300 hover:text-white bg-slate-800 rounded-xl px-4 py-3">
              الوكالة الوطنية للمقاول الذاتي (ANAE)
              <ExternalLink className="w-4 h-4" />
            </a>
            <a href="https://sidjilcom.cnrc.dz" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-sm text-indigo-300 hover:text-white bg-slate-800 rounded-xl px-4 py-3">
              المركز الوطني للسجل التجاري (Sidjilcom)
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </section>

        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 leading-relaxed">
          <p className="font-bold mb-1">إخلاء مسؤولية قانونية</p>
          <p>
            جميع المعلومات في هذا الدليل استرشادية وتعليمية فقط، ولا تُعد استشارة قانونية.
            القوانين والإجراءات قد تتغير، والمصدر الرسمي الوحيد هو الجهات المختصة.
            لا تتحمل منصة NABDA أي مسؤولية عن أي قرار يتخذه المستخدم بناءً على هذا المحتوى.
            يتحمل المستخدم وحده مسؤولية التحقق من المتطلبات القانونية والإدارية والضريبية مع الجهات الرسمية.
          </p>
        </div>

      </div>
    </main>
  );
}
