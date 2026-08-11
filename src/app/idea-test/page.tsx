"use client";

import { useState } from "react";
import { Lightbulb, Sparkles, CheckCircle2, AlertTriangle, ArrowLeft, RotateCcw, ShieldCheck } from "lucide-react";

export default function IdeaTestPage() {
  const [ideaTitle, setIdeaTitle] = useState("");
  const [category, setCategory] = useState("تجارة");
  const [capital, setCapital] = useState<number>(100000);
  const [workspace, setWorkspace] = useState("من المنزل");
  const [riskLevel, setRiskLevel] = useState("متوسط");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaTitle.trim()) {
      setErrorMsg("يرجى كتابة اسم أو عنوان الفكرة أولاً.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/idea-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ideaTitle,
          category,
          capital,
          workspace,
          riskLevel,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResult(data.analysis);
      } else {
        setErrorMsg(data.error || "حدث خطأ أثناء تحليل الفكرة.");
      }
    } catch (e: any) {
      setErrorMsg("خطأ في الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
          <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
          <span>مُختبر الأفكار الخاصة في الجزائر</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          هل لديك فكرة مشروع خاصة في رأسك؟
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          اكتب فكرتك وسنقوم بتفكيكها مالياً، تحليل نقاط قوتها وضعفها، وحساب مدى ملاءمتها لرأس مالك الحالي.
        </p>
      </div>

      {/* Input Form Box */}
      <form onSubmit={handleAnalyze} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800">
              عنوان الفكرة التي تفكر بها:
            </label>
            <input
              type="text"
              placeholder="مثال: بيع الأواني المنزلية أونلاين، فتح ورشة خياطة صغيرة، قاعة شاي..."
              value={ideaTitle}
              onChange={(e) => setIdeaTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 font-bold text-sm text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold">
            <div className="space-y-1">
              <label className="text-slate-700">التصنيف:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white"
              >
                <option value="تجارة">تجارة</option>
                <option value="خدمات">خدمات</option>
                <option value="أونلاين">أونلاين</option>
                <option value="صناعة تقليدية">صناعة تقليدية / حرف</option>
                <option value="زراعة">زراعة</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-700">رأس المال المتاح (دج):</label>
              <input
                type="number"
                value={capital}
                onChange={(e) => setCapital(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-mono text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-700">مكان العمل:</label>
              <select
                value={workspace}
                onChange={(e) => setWorkspace(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white"
              >
                <option value="من المنزل">من المنزل</option>
                <option value="محل أملكه">محل أملكه</option>
                <option value="محل بالإيجار">محل بالإيجار</option>
                <option value="أونلاين">أونلاين</option>
                <option value="متنقل">متنقل</option>
              </select>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-extrabold text-sm hover:from-indigo-700 hover:to-fuchsia-700 transition-all shadow-md flex items-center justify-center gap-2"
        >
          {loading ? (
            <span>جاري تحليل فكرتك...</span>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>قم بتحليل هذه الفكرة الآن</span>
            </>
          )}
        </button>
      </form>

      {/* Analysis Output Box */}
      {result && (
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl border border-slate-800 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold text-amber-400">تقرير تقييم الفكرة الخاصة</span>
              <h2 className="text-2xl font-black text-white mt-1">"{ideaTitle}"</h2>
            </div>

            <div className="text-center bg-slate-800 p-3 rounded-2xl border border-slate-700 shrink-0">
              <span className="text-[10px] text-slate-400 block font-bold">درجة ملاءمة الفكرة</span>
              <span className="text-3xl font-black text-indigo-400 font-mono">
                {result.score}/100
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs text-slate-200 font-bold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
            <span>{result.verdict}</span>
          </div>

          {/* Financial fit text */}
          <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 text-xs text-indigo-200 space-y-1">
            <span className="font-bold text-indigo-400 block">الملاءمة المالية لرأس مالك:</span>
            <p className="leading-relaxed">{result.financialFitText}</p>
          </div>

          {/* Strengths & Weaknesses Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-indigo-950/40 p-4 rounded-2xl border border-indigo-500/30 space-y-2">
              <h3 className="font-bold text-indigo-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                نقاط القوة والمزايا
              </h3>
              <ul className="space-y-1 text-slate-300 list-disc list-inside">
                {result.strengths?.map((str: string, idx: number) => (
                  <li key={idx}>{str}</li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-950/40 p-4 rounded-2xl border border-amber-500/30 space-y-2">
              <h3 className="font-bold text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                نقاط التحدي والمخاطر
              </h3>
              <p className="text-slate-300 leading-relaxed">{result.risksText}</p>
            </div>
          </div>

          {/* Recommended Next Steps */}
          <div className="space-y-2 pt-2">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              الخطوات العملية الموصى بها لبدء الفكرة
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {result.recommendedSteps?.map((step: string, idx: number) => (
                <li key={idx} className="p-3 rounded-xl bg-slate-800 border border-slate-700/80 flex items-start gap-2">
                  <span className="font-mono text-indigo-400 font-bold shrink-0">{idx + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
