"use client";

import { useState } from "react";
import { CalendarCheck, CheckCircle2, Sparkles, Printer, ArrowLeft } from "lucide-react";

export default function ExecutionPlanPage() {
  const [projectTitle, setProjectTitle] = useState("تجارة إكسسوارات الهواتف أونلاين");
  const [startDate, setSetStartDate] = useState(new Date().toISOString().split("T")[0]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6 print:hidden">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold">
            <CalendarCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>خطة تنفيذ 30 يوم للانطلاق</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
            خطة التنفيذ والافتتاح التجريبي (30 يوم)
          </h1>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-2 transition-colors"
        >
          <Printer className="w-4 h-4 text-slate-500" />
          طباعة الخطة PDF
        </button>
      </div>

      {/* Title Form */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-end gap-4 text-xs font-bold print:hidden">
        <div className="flex-1 space-y-1 w-full">
          <label className="text-slate-800">اسم مشروعك الحالي:</label>
          <input
            type="text"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold"
          />
        </div>

        <div className="space-y-1 w-full sm:w-auto">
          <label className="text-slate-800">تاريخ الانطلاق المحدد:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setSetStartDate(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-mono"
          />
        </div>
      </div>

      {/* Print-Only Header - shown only when printing */}
      <div className="hidden print:block print-header">
        <h1>NABDA – خطة تنفيذ 30 يوم</h1>
        <p>قبل ما تبدأ مشروعك... اختبره.</p>
        <p>التاريخ: {new Date().toLocaleDateString("en-GB")}</p>
      </div>

      {/* Plan Card Display */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl space-y-8 shadow-xl border border-slate-800">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-indigo-400 font-extrabold text-xs">خارطة التنفيذ الميداني لمشروع:</span>
          <h2 className="text-2xl font-black text-white mt-1">"{projectTitle}"</h2>
          <span className="text-slate-400 text-xs font-mono">تاريخ الانطلاق: {startDate}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Week 1 */}
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 font-bold text-xs">
                الأسبوع الأول
              </span>
              <h3 className="font-extrabold text-sm text-white">دراسة السوق وتحديد الموردين</h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>زيارة أسواق الجملة والاتصال بـ 3 موردي بضاعة موثوقين.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>حساب التكلفة الدقيقة للقطعة وتحديد جدول الأسعار التنافسية.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>إنشاء الهوية البصرية وإطلاق صفحات التواصل الاجتماعي (TikTok & Instagram).</span>
              </li>
            </ul>
          </div>

          {/* Week 2 */}
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 font-bold text-xs">
                الأسبوع الثاني
              </span>
              <h3 className="font-extrabold text-sm text-white">شراء المخزون وتجهيز المحتوى</h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>شراء دفعة تجريبية لا تتجاوز 50% من رأس المال المتاح.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>تصوير المنتجات بصور وفيديوهات قصيرة جذابة وعالية الجودة.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>الارتباط مع شركة توصيل سريع (Yalidine, Express...) للعمل بها.</span>
              </li>
            </ul>
          </div>

          {/* Week 3 */}
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-bold text-xs">
                الأسبوع الثالث
              </span>
              <h3 className="font-extrabold text-sm text-white">بدء الإعلانات واستقبال الطلبات</h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>إطلاق إعلان ممول تجريبي بميزانية خفيفة لقياس الاستجابة.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>الرد السريع على الاستفسارات وتأكيد المبيعات هاتفياً.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>تسليم الشحنات الأولى ومتابعة العميل بعد الاستلام لضمان الرضا.</span>
              </li>
            </ul>
          </div>

          {/* Week 4 */}
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <span className="px-2.5 py-1 rounded bg-sky-500/20 text-sky-300 font-bold text-xs">
                الأسبوع الرابع
              </span>
              <h3 className="font-extrabold text-sm text-white">تقييم النتائج والتوسع</h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>تحليل أكثر الموديلات مبيعًا وحساب صافي أرباح الشهر الأول.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>إيقاف المنتجات المتبقية أو عمل تخفيضات لتصفيتها.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>إعادة استثمار الأرباح لشراء كميات أكبر من الأجهزة الأكثر طلبًا.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Print-Only Footer - shown only when printing */}
      <div className="hidden print:block mt-8 pt-4 border-t-2 border-slate-300 text-center text-xs text-slate-500">
        <p className="font-bold">منصة NABDA – نابدا | قبل ما تبدأ مشروعك... اختبره</p>
        <p>هذه خطة استرشادية مقترحة من NABDA. النتائج الفعلية تعتمد على التزامك وظروف السوق المحلية.</p>
        <p>© {new Date().getFullYear()} NABDA - جميع الحقوق محفوظة.</p>
      </div>
    </div>
  );
}
