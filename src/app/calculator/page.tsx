"use client";

import { useState } from "react";
import { Calculator, Sparkles, TrendingUp, RotateCcw } from "lucide-react";
import {
  calculateFinancials,
  calculateScenarios,
  type FinancialCalcResult,
  type ScenarioSimulationResult,
} from "@/lib/financialCalc";

type OptionalFields = {
  deliveryCost: string;
  packagingCost: string;
  adSpend: string;
  fixedCosts: string;
  returnRate: string;
};

export default function StandaloneCalculatorPage() {
  const [purchasePrice, setPurchasePrice] = useState<string>("");
  const [salePrice, setSalePrice] = useState<string>("");
  const [salesUnits, setSalesUnits] = useState<string>("");
  const [optional, setOptional] = useState<OptionalFields>({
    deliveryCost: "",
    packagingCost: "",
    adSpend: "",
    fixedCosts: "",
    returnRate: "",
  });
  const [result, setResult] = useState<FinancialCalcResult | null>(null);
  const [scenarios, setScenarios] = useState<ScenarioSimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const setOptionalField = (key: keyof OptionalFields, value: string) => {
    setOptional((prev) => ({ ...prev, [key]: value }));
  };

  const REQUIRED_FIELDS: { key: string; label: string; value: string }[] = [
    { key: "سعر الشراء", label: "سعر الشراء للوحدة", value: purchasePrice },
    { key: "سعر البيع", label: "سعر البيع للزبون", value: salePrice },
    { key: "المبيعات", label: "المبيعات المتوقعة شهرياً", value: salesUnits },
  ];

  const OPTIONAL_FIELDS: { key: string; label: string; value: string }[] = [
    { key: "deliveryCost", label: "مصاريف التوصيل", value: optional.deliveryCost },
    { key: "packagingCost", label: "مصاريف التغليف", value: optional.packagingCost },
    { key: "adSpend", label: "ميزانية الإعلانات", value: optional.adSpend },
    { key: "fixedCosts", label: "المصاريف الثابتة", value: optional.fixedCosts },
    { key: "returnRate", label: "نسبة المرتجعات", value: optional.returnRate },
  ];

  const parseOptionalNumber = (value: string): number | null => {
    // An empty optional field means "not provided" -> treated as 0 by the formula.
    if (value.trim() === "") return 0;
    const num = Number(value);
    return Number.isFinite(num) && num >= 0 ? num : null;
  };

  const calculate = () => {
    let message: string | null = null;

    // Core fields: required and must be positive numbers.
    for (const field of REQUIRED_FIELDS) {
      const trimmed = field.value.trim();
      const num = Number(trimmed);
      if (trimmed === "" || !Number.isFinite(num) || num <= 0) {
        message = `يرجى إدخال قيمة رقمية صحيحة أكبر من صفر في ${field.label}.`;
        break;
      }
    }

    if (message === null) {
      // Optional fields: when provided, must be valid non-negative numbers.
      for (const field of OPTIONAL_FIELDS) {
        if (parseOptionalNumber(field.value) === null) {
          message = `قيمة ${field.label} غير صحيحة. أدخل رقماً موجباً أو اتركه فارغاً.`;
          break;
        }
      }
    }

    if (message === null) {
      const parsedReturnRate = Number(optional.returnRate.trim() === "" ? 0 : optional.returnRate);
      if (parsedReturnRate > 100) {
        message = "نسبة المرتجعات لا يمكن أن تتجاوز 100%.";
      }
    }

    if (message !== null) {
      setError(message);
      setResult(null);
      setScenarios(null);
      return;
    }

    const inputs = {
      purchasePrice: Number(purchasePrice),
      salePrice: Number(salePrice),
      monthlySalesUnits: Number(salesUnits),
      deliveryCostPerUnit: parseOptionalNumber(optional.deliveryCost)!,
      packagingCostPerUnit: parseOptionalNumber(optional.packagingCost)!,
      adSpendMonthly: parseOptionalNumber(optional.adSpend)!,
      fixedCostsMonthly: parseOptionalNumber(optional.fixedCosts)!,
      returnRatePercent: parseOptionalNumber(optional.returnRate)!,
    };

    setResult(calculateFinancials(inputs));
    setScenarios(calculateScenarios(inputs));
    setError(null);
  };

  const reset = () => {
    setPurchasePrice("");
    setSalePrice("");
    setSalesUnits("");
    setOptional({
      deliveryCost: "",
      packagingCost: "",
      adSpend: "",
      fixedCosts: "",
      returnRate: "",
    });
    setResult(null);
    setScenarios(null);
    setError(null);
  };

  const handleRequiredChange = (setter: (v: string) => void, e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold">
          <Calculator className="w-3.5 h-3.5 text-indigo-600" />
          <span>حاسبة الأرباح ونقطة التعادل المستقلة</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          حاسبة الأرباح ونقطة التعادل (Break-Even)
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          أدخل تكاليف منتجك، أسعار البيع والتكاليف الثابتة لمعرفة صافي ربحك التقديري بالدينار الجزائري.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Inputs */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs font-bold">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-extrabold text-slate-900">مدخلات المشروع</h2>
            <button
              onClick={reset}
              className="text-slate-400 hover:text-slate-600 flex items-center gap-1 font-normal"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              إعادة ضبط
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-slate-700">سعر الشراء للوحدة (دج):</label>
            <input
              type="number"
              min="0"
              step="1"
              inputMode="decimal"
              value={purchasePrice}
              onChange={(e) => handleRequiredChange(setPurchasePrice, e)}
              placeholder="مثال: 1000"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-700">سعر البيع للزبون (دج):</label>
            <input
              type="number"
              min="0"
              step="1"
              inputMode="decimal"
              value={salePrice}
              onChange={(e) => handleRequiredChange(setSalePrice, e)}
              placeholder="مثال: 2500"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="text-slate-700">المبيعات المتوقعة شهرياً (قطعة):</label>
              {salesUnits.trim() !== "" && (
                <span className="text-indigo-600 font-mono">{salesUnits} قطعة</span>
              )}
            </div>
            <input
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              value={salesUnits}
              onChange={(e) => handleRequiredChange(setSalesUnits, e)}
              placeholder="مثال: 40"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-700">مصاريف التوصيل/الشحن للقطعة (دج) — اختياري:</label>
            <input
              type="number"
              min="0"
              step="1"
              inputMode="decimal"
              value={optional.deliveryCost}
              onChange={(e) => setOptionalField("deliveryCost", e.target.value)}
              placeholder="مثال: 300"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-700">مصاريف التغليف للقطعة (دج) — اختياري:</label>
            <input
              type="number"
              min="0"
              step="1"
              inputMode="decimal"
              value={optional.packagingCost}
              onChange={(e) => setOptionalField("packagingCost", e.target.value)}
              placeholder="مثال: 100"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-700">ميزانية الإعلانات شهرياً (دج) — اختياري:</label>
            <input
              type="number"
              min="0"
              step="1"
              inputMode="decimal"
              value={optional.adSpend}
              onChange={(e) => setOptionalField("adSpend", e.target.value)}
              placeholder="مثال: 6000"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-700">المصاريف الثابتة (إيجار، إنترنت...) (دج) — اختياري:</label>
            <input
              type="number"
              min="0"
              step="1"
              inputMode="decimal"
              value={optional.fixedCosts}
              onChange={(e) => setOptionalField("fixedCosts", e.target.value)}
              placeholder="مثال: 4000"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-700">نسبة المرتجعات المتوقعة (%) — اختياري (0-100):</label>
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              inputMode="decimal"
              value={optional.returnRate}
              onChange={(e) => setOptionalField("returnRate", e.target.value)}
              placeholder="مثال: 5"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm"
            />
          </div>

          <button
            onClick={calculate}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white font-extrabold text-sm hover:bg-indigo-700 transition-colors shadow-md"
          >
            <Calculator className="w-4 h-4" />
            احسب الأرباح ونقطة التعادل
          </button>

          <p className="text-[10px] text-slate-400 leading-snug font-normal">
            الحقول الاختيارية تُعتبر 0 دج إذا تُركت فارغة. أدخل قيم مشروعك الفعلية للحصول على نتيجة صادقة.
          </p>
        </div>

        {/* Results Outputs */}
        <div className="lg:col-span-2 space-y-6">
          {error ? (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-3xl space-y-2">
              <span className="block text-sm font-extrabold">⚠️ تعذر حساب النتائج</span>
              <p className="text-xs leading-relaxed">{error}</p>
            </div>
          ) : result && scenarios ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-2 border border-slate-800">
                  <span className="text-slate-400 text-xs font-bold block">الإيرادات الإجمالية</span>
                  <span className="text-3xl font-black font-mono text-white">
                    {result.grossRevenue.toLocaleString()} دج
                  </span>
                </div>

                <div className="bg-indigo-600 text-white p-6 rounded-3xl space-y-2 shadow-lg">
                  <span className="text-indigo-100 text-xs font-bold block">الربح الصافي التقريبي</span>
                  <span className="text-3xl font-black font-mono text-white">
                    {result.netProfitMonthly.toLocaleString()} دج
                  </span>
                  <span className="text-xs text-indigo-100 block font-bold">
                    هامش الربح الصافي: {result.profitMarginPercent}%
                  </span>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-2">
                  <span className="text-slate-400 text-xs font-bold block">إجمالي التكاليف والمصاريف</span>
                  <span className="text-2xl font-black font-mono text-slate-900">
                    {result.totalExpenses.toLocaleString()} دج
                  </span>
                  <span className="text-xs text-slate-500 block">
                    تكلفة الشراء: {result.cogsTotal.toLocaleString()} دج
                  </span>
                </div>

                <div className={`p-6 rounded-3xl space-y-2 shadow-md ${
                  result.breakEvenStatus === "NO_PROFITABLE_BREAK_EVEN"
                    ? "bg-rose-500 text-white"
                    : "bg-amber-500 text-slate-950"
                }`}>
                  <span className={`text-xs font-bold block ${
                    result.breakEvenStatus === "NO_PROFITABLE_BREAK_EVEN"
                      ? "text-rose-100" : "text-slate-900"
                  }`}>نقطة التعادل (Break-Even)</span>
                  <span className="text-3xl font-black font-mono">
                    {result.breakEvenStatus === "NO_PROFITABLE_BREAK_EVEN"
                      ? "—"
                      : `${result.breakEvenUnits} وحدة`}
                  </span>
                  <span className={`text-xs block font-bold ${
                    result.breakEvenStatus === "NO_PROFITABLE_BREAK_EVEN"
                      ? "text-rose-100" : "text-slate-900"
                  }`}>
                    {result.breakEvenStatus === "NO_PROFITABLE_BREAK_EVEN"
                      ? result.breakEvenMessage
                      : `تساوي مبيعات بقيمة ${result.breakEvenRevenue.toLocaleString()} دج`}
                  </span>
                </div>
              </div>

              {/* Detailed Arabic Explanation */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-3">
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  قراءة سريعة لنتيجتك المالية
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {result.breakEvenStatus === "NO_PROFITABLE_BREAK_EVEN" ? (
                    <span className="text-rose-700 font-bold">{result.breakEvenMessage}</span>
                  ) : result.breakEvenStatus === "IMMEDIATELY_BREAK_EVEN" ? (
                    <span>{result.breakEvenMessage}</span>
                  ) : (
                    <>
                      تحتاج إلى بيع <strong className="text-indigo-700 font-mono">{result.breakEvenUnits} قطعة</strong> فقط لتغطية التكاليف الثابتة وميزانية الإعلانات بالكامل. كل قطعة تبيعها بعد ذلك تحقق لك فائدة صافية مقدرة بـ <strong className="text-indigo-700 font-mono">{result.unitProfitMargin.toLocaleString()} دج</strong>.
                    </>
                  )}
                </p>
              </div>

              {/* 3 Scenarios */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  مقارنة السيناريوهات الـ 3
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
                    <span className="font-bold text-rose-900 block">🔴 حذر (-30% مبيعات)</span>
                    <p className="text-slate-600 text-[11px]">{scenarios.conservative.monthlySalesUnits} قطعة</p>
                    <p className="font-mono font-bold text-rose-700 text-sm">
                      {scenarios.conservative.netProfitMonthly.toLocaleString()} دج
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                    <span className="font-bold text-amber-900 block">🟡 أساسي (متوقع)</span>
                    <p className="text-slate-600 text-[11px]">{scenarios.base.monthlySalesUnits} قطعة</p>
                    <p className="font-mono font-bold text-amber-800 text-sm">
                      {scenarios.base.netProfitMonthly.toLocaleString()} دج
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-1">
                    <span className="font-bold text-indigo-900 block">🟢 متفائل (+40% مبيعات)</span>
                    <p className="text-slate-600 text-[11px]">{scenarios.optimistic.monthlySalesUnits} قطعة</p>
                    <p className="font-mono font-bold text-indigo-800 text-sm">
                      {scenarios.optimistic.netProfitMonthly.toLocaleString()} دج
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-3xl p-10 text-center space-y-3">
              <Calculator className="w-10 h-10 text-indigo-300 mx-auto" />
              <p className="text-sm font-extrabold text-slate-600">لم تُحسب النتائج بعد</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                أدخل سعر الشراء وسعر البيع والمبيعات المتوقعة شهرياً، ثم اضغط «احسب الأرباح ونقطة التعادل» لعرض النتائج المالية.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}