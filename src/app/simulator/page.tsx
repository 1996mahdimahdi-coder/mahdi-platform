"use client";

import { useState } from "react";
import { TrendingUp, Sliders, Sparkles, AlertTriangle, CheckCircle2 } from "lucide-react";
import { calculateFinancials, calculateScenarios } from "@/lib/financialCalc";

export default function SimulatorPage() {
  const [salesMultiplier, setSalesMultiplier] = useState<number>(100);
  const [adSpend, setAdSpend] = useState<number>(8000);
  const [returnRate, setReturnRate] = useState<number>(8);
  const [unitCost, setUnitCost] = useState<number>(1200);
  const [salePrice, setSalePrice] = useState<number>(2800);
  const [baseSales, setBaseSales] = useState<number>(60);

  const currentSalesUnits = Math.max(1, Math.round(baseSales * (salesMultiplier / 100)));

  const calc = calculateFinancials({
    purchasePrice: unitCost,
    salePrice: salePrice,
    monthlySalesUnits: currentSalesUnits,
    deliveryCostPerUnit: 350,
    packagingCostPerUnit: 100,
    adSpendMonthly: adSpend,
    fixedCostsMonthly: 5000,
    returnRatePercent: returnRate,
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold">
          <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
          <span>محاكي السيناريوهات وميزة "ماذا لو؟"</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          محاكي المتغيرات والسيناريوهات المالية
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          ماذا يحدث إذا انخفضت المبيعات 30% أو ارتفعت نسبة المرتجعات؟ حرك المؤشرات وشاهد التغير الفوري في صافي الربح وهامش الأمان.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sliders */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-xs font-bold">
          <h2 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-600" />
            تحكم في المتغيرات
          </h2>

          {/* Sales Change Slider */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-slate-700">تغير حجم المبيعات (%):</label>
              <span className="font-mono text-indigo-600 font-extrabold">{salesMultiplier}% ({currentSalesUnits} قطعة)</span>
            </div>
            <input
              type="range"
              min="30"
              max="200"
              step="5"
              value={salesMultiplier}
              onChange={(e) => setSalesMultiplier(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Return Rate Slider */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-slate-700">نسبة المرتجعات (Retour %):</label>
              <span className="font-mono text-rose-600 font-extrabold">{returnRate}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={returnRate}
              onChange={(e) => setReturnRate(Number(e.target.value))}
              className="w-full accent-rose-600 cursor-pointer"
            />
          </div>

          {/* Ad Spend Slider */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-slate-700">ميزانية الإعلانات:</label>
              <span className="font-mono text-indigo-600 font-extrabold">{adSpend.toLocaleString()} دج</span>
            </div>
            <input
              type="range"
              min="1000"
              max="30000"
              step="1000"
              value={adSpend}
              onChange={(e) => setAdSpend(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Sale Price Slider */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-slate-700">سعر البيع للوحدة:</label>
              <span className="font-mono text-indigo-600 font-extrabold">{salePrice.toLocaleString()} دج</span>
            </div>
            <input
              type="range"
              min="1500"
              max="5000"
              step="100"
              value={salePrice}
              onChange={(e) => setSalePrice(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Live Simulation Display */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl border border-slate-800">
            <h2 className="text-lg font-bold border-b border-slate-800 pb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              النتيجة المباشرة للسيناريو الحالي
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-1">
                <span className="text-slate-400 text-xs block">الإيرادات الشهرية الحالية</span>
                <span className="text-2xl font-black text-white font-mono">
                  {calc.grossRevenue.toLocaleString()} دج
                </span>
              </div>

              <div className="bg-indigo-950/80 p-5 rounded-2xl border border-indigo-500/50 space-y-1">
                <span className="text-indigo-300 text-xs font-bold block">الربح الصافي النهائي</span>
                <span className="text-3xl font-black text-indigo-400 font-mono">
                  {calc.netProfitMonthly.toLocaleString()} دج
                </span>
                <span className="text-xs text-indigo-300 block font-bold">
                  هامش الربح: {calc.profitMarginPercent}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
                <span className="text-slate-400 block mb-1">خسائر المرتجعات:</span>
                <span className="font-mono text-rose-400 font-bold">
                  {calc.returnsCost.toLocaleString()} دج
                </span>
              </div>

              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
                <span className="text-slate-400 block mb-1">نقطة التعادل المطلوبة:</span>
                <span className="font-mono text-amber-300 font-bold">
                  {calc.breakEvenUnits} قطعة
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 text-xs text-slate-700 space-y-2">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              تحليل الحساسية والمخاطرة للسيناريو
            </h3>
            {calc.netProfitMonthly > 0 ? (
              <p className="leading-relaxed text-slate-700">
                المشروع يحافظ على ربحية إيجابية بـ <strong className="text-indigo-700 font-mono">{calc.netProfitMonthly.toLocaleString()} دج</strong> حتى مع تغيير الخيارات. هامش الأمان مريح.
              </p>
            ) : (
              <p className="leading-relaxed text-rose-700 font-bold">
                ⚠️ تحذير: في هذا السيناريو، تنخفض المبيعات أو ترتفع التكاليف إلى حد يسبب خسارة صافية قدرها {-calc.netProfitMonthly.toLocaleString()} دج. ننصح بزيادة سعر البيع أو تخفيض المرتجعات.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
