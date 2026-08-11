"use client";

import { useState } from "react";
import { Calculator, Sparkles, TrendingUp, RotateCcw } from "lucide-react";
import { calculateFinancials, calculateScenarios } from "@/lib/financialCalc";

export default function StandaloneCalculatorPage() {
  const [purchasePrice, setPurchasePrice] = useState<number>(1000);
  const [salePrice, setSalePrice] = useState<number>(2500);
  const [salesUnits, setSalesUnits] = useState<number>(40);
  const [deliveryCost, setDeliveryCost] = useState<number>(300);
  const [packagingCost, setPackagingCost] = useState<number>(100);
  const [adSpend, setAdSpend] = useState<number>(6000);
  const [fixedCosts, setFixedCosts] = useState<number>(4000);
  const [returnRate, setReturnRate] = useState<number>(5);

  const calc = calculateFinancials({
    purchasePrice,
    salePrice,
    monthlySalesUnits: salesUnits,
    deliveryCostPerUnit: deliveryCost,
    packagingCostPerUnit: packagingCost,
    adSpendMonthly: adSpend,
    fixedCostsMonthly: fixedCosts,
    returnRatePercent: returnRate,
  });

  const scenarios = calculateScenarios({
    purchasePrice,
    salePrice,
    monthlySalesUnits: salesUnits,
    deliveryCostPerUnit: deliveryCost,
    packagingCostPerUnit: packagingCost,
    adSpendMonthly: adSpend,
    fixedCostsMonthly: fixedCosts,
    returnRatePercent: returnRate,
  });

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
              onClick={() => {
                setPurchasePrice(1000);
                setSalePrice(2500);
                setSalesUnits(40);
                setDeliveryCost(300);
                setPackagingCost(100);
                setAdSpend(6000);
                setFixedCosts(4000);
                setReturnRate(5);
              }}
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
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-700">سعر البيع للزبون (دج):</label>
            <input
              type="number"
              value={salePrice}
              onChange={(e) => setSalePrice(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="text-slate-700">المبيعات المتوقعة شهرياً:</label>
              <span className="text-indigo-600 font-mono">{salesUnits} قطعة</span>
            </div>
            <input
              type="range"
              min="1"
              max="300"
              value={salesUnits}
              onChange={(e) => setSalesUnits(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-700">مصاريف التوصيل/الشحن للقطعة (دج):</label>
            <input
              type="number"
              value={deliveryCost}
              onChange={(e) => setDeliveryCost(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-700">مصاريف التغليف للقطعة (دج):</label>
            <input
              type="number"
              value={packagingCost}
              onChange={(e) => setPackagingCost(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-700">ميزانية الإعلانات شهرياً (دج):</label>
            <input
              type="number"
              value={adSpend}
              onChange={(e) => setAdSpend(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-700">المصاريف الثابتة (إيجار، إنترنت...) (دج):</label>
            <input
              type="number"
              value={fixedCosts}
              onChange={(e) => setFixedCosts(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-700">نسبة المرتجعات المتوقعة (%):</label>
            <input
              type="number"
              value={returnRate}
              onChange={(e) => setReturnRate(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm"
            />
          </div>
        </div>

        {/* Results Outputs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-2 border border-slate-800">
              <span className="text-slate-400 text-xs font-bold block">الإيرادات الإجمالية</span>
              <span className="text-3xl font-black font-mono text-white">
                {calc.grossRevenue.toLocaleString()} دج
              </span>
            </div>

            <div className="bg-indigo-600 text-white p-6 rounded-3xl space-y-2 shadow-lg">
              <span className="text-indigo-100 text-xs font-bold block">الربح الصافي التقريبي</span>
              <span className="text-3xl font-black font-mono text-white">
                {calc.netProfitMonthly.toLocaleString()} دج
              </span>
              <span className="text-xs text-indigo-100 block font-bold">
                هامش الربح الصافي: {calc.profitMarginPercent}%
              </span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-2">
              <span className="text-slate-400 text-xs font-bold block">إجمالي التكاليف والمصاريف</span>
              <span className="text-2xl font-black font-mono text-slate-900">
                {calc.totalExpenses.toLocaleString()} دج
              </span>
              <span className="text-xs text-slate-500 block">
                تكلفة الشراء: {calc.cogsTotal.toLocaleString()} دج
              </span>
            </div>

            <div className="bg-amber-500 text-slate-950 p-6 rounded-3xl space-y-2 shadow-md">
              <span className="text-slate-900 text-xs font-bold block">نقطة التعادل (Break-Even)</span>
              <span className="text-3xl font-black font-mono text-slate-950">
                {calc.breakEvenUnits} وحدة
              </span>
              <span className="text-xs text-slate-900 block font-bold">
                تساوي مبيعات بقيمة {calc.breakEvenRevenue.toLocaleString()} دج
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
              تحتاج إلى بيع <strong className="text-indigo-700 font-mono">{calc.breakEvenUnits} قطعة</strong> فقط لتغطية التكاليف الثابتة وميزانية الإعلانات بالكامل. كل قطعة تبيعها بعد ذلك تحقق لك فائدة صافية مقدرة بـ <strong className="text-indigo-700 font-mono">{calc.unitProfitMargin.toLocaleString()} دج</strong>.
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
        </div>
      </div>
    </div>
  );
}
