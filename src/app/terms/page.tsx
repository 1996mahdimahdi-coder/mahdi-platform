export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <h1 className="text-2xl font-black text-slate-900 border-b border-slate-100 pb-3">
          الشروط والأحكام الاستخدام
        </h1>

        <div className="space-y-4">
          <p>
            مرحباً بك في منصة <strong>NABDA</strong>. باستعمالك للموقع، فإنك توافق على الالتزام بالشروط والأحكام التالية:
          </p>

          <h2 className="font-extrabold text-slate-900">1. طبيعة النتائج والمحاكاة المالية</h2>
          <p>
            جميع نتائج التقييم، درجات الملاءمة، وحسابات نقطة التعادل المقدمة عبر منصة NABDA هي عبارة عن تقديرات ومحاكاة رقمية خاضعة لمعطيات السوق، وليست ضماناً قانونياً أو ماليًا للربح المؤكد.
          </p>

          <h2 className="font-extrabold text-slate-900">2. المسؤولية الاستثمارية</h2>
          <p>
            قرار إطلاق المشروع، شراء البضائع، أو إبرام العقود التجارية هو مسؤولية كاملة للمستخدم وحده.
          </p>

          <h2 className="font-extrabold text-slate-900">3. الملكية الفكرية</h2>
          <p>
            جميع قواعد البيانات، النصوص، وخوارزمية Scoring System هي ملك حصري لمنصة NABDA.
          </p>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900">إخلاء المسؤولية القانونية</h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              جميع المشاريع والدراسات والمعلومات المنشورة على منصة NABDA هي محتوى استرشادي وتعليمي فقط،
              ولا تُعد استشارة قانونية أو مالية أو ضماناً للربح. النشاط الاقتصادي في الجزائر خاضع
              لقوانين وتنظيمات قد تتغير، وبعض الأنشطة تتطلب سجلاً تجارياً أو بطاقة مقاول ذاتي
              (القانون 22-23) أو تراخيص خاصة (صحية، بيئية، أمنية) أو تندرج ضمن المهن المنظمة.
            </p>
            <p className="text-sm text-slate-700 leading-relaxed">
              يتحمل المستخدم وحده مسؤولية التحقق من جميع المتطلبات القانونية والإدارية والضريبية
              الخاصة بأي نشاط ينوي ممارسته، مع الجهات الرسمية المختصة (المركز الوطني للسجل التجاري CNRC،
              الوكالة الوطنية للمقاول الذاتي ANAE، مصالح حفظ الصحة، البلدية...).
              لا تتحمل منصة NABDA أي مسؤولية عن أي قرار أو تصرف أو خسارة تنشأ عن استخدام هذا المحتوى.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
