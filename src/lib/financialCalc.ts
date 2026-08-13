export interface FinancialCalcInputs {
  purchasePrice: number; // سعر الشراء للقطعة أو الخدمة
  salePrice: number;     // سعر البيع للقطعة أو الخدمة
  monthlySalesUnits: number; // عدد المبيعات المتوقعة شهرياً
  deliveryCostPerUnit?: number; // مصاريف الشحن للقطعة
  packagingCostPerUnit?: number; // مصاريف التغليف للقطعة
  adSpendMonthly?: number; // ميزانية الإعلانات التسويقية شهرياً
  fixedCostsMonthly?: number; // مصاريف ثابتة (إنترنت، كهرباء، إيجار)
  returnRatePercent?: number; // نسبة المرتجعات %
}

export interface FinancialCalcResult {
  purchasePrice: number;
  salePrice: number;
  monthlySalesUnits: number;
  grossRevenue: number;         // الإيرادات الإجمالية
  cogsTotal: number;            // تكلفة المنتجات الإجمالية
  variableCostsTotal: number;   // مصاريف متغيرة (شحن + تغليف + مرتجعات)
  adSpendMonthly: number;
  fixedCostsMonthly: number;
  totalExpenses: number;        // إجمالي المصاريف
  netProfitMonthly: number;     // الربح التقريبي الصافي شهرياً
  profitMarginPercent: number;  // هامش الربح الصافي %
  unitProfitMargin: number;     // هامش ربح القطعة الواحدة
  breakEvenUnits: number;       // نقطة التعادل بالوحدات
  breakEvenRevenue: number;     // نقطة التعادل بالإيرادات دج
  returnsCost: number;          // قيمة الخسائر من المرتجعات
}

export interface ScenarioSimulationResult {
  conservative: FinancialCalcResult; // سيناريو حذر (-30% sales)
  base: FinancialCalcResult;         // سيناريو أساسي (100% sales)
  optimistic: FinancialCalcResult;   // سيناريو متفائل (+40% sales)
}

export function calculateFinancials(inputs: FinancialCalcInputs): FinancialCalcResult {
  const purchase = Math.max(0, inputs.purchasePrice || 0);
  const sale = Math.max(0, inputs.salePrice || 0);
  const units = Math.max(0, inputs.monthlySalesUnits || 0);
  const delivery = Math.max(0, inputs.deliveryCostPerUnit || 0);
  const packaging = Math.max(0, inputs.packagingCostPerUnit || 0);
  const adSpend = Math.max(0, inputs.adSpendMonthly || 0);
  const fixed = Math.max(0, inputs.fixedCostsMonthly || 0);
  const returnRate = Math.min(100, Math.max(0, inputs.returnRatePercent || 0));

  const grossRevenue = sale * units;
  const cogsTotal = purchase * units;

  const returnUnits = Math.round(units * (returnRate / 100));
  const returnsCost = returnUnits * (delivery + packaging + purchase * 0.2); // partial loss on returns

  const variableCostsTotal = (delivery + packaging) * units + returnsCost;
  const totalExpenses = cogsTotal + variableCostsTotal + adSpend + fixed;

  const netProfitMonthly = grossRevenue - totalExpenses;
  const profitMarginPercent = grossRevenue > 0 ? Math.round((netProfitMonthly / grossRevenue) * 100) : 0;

  // Expected return cost per sold unit.
  // This keeps profit and break-even calculations consistent.
  const expectedReturnCostPerUnit =
    returnRate > 0
      ? (delivery + packaging + purchase * 0.2) * (returnRate / 100)
      : 0;

  // Real contribution margin per sold unit.
  const unitProfitMargin =
    sale -
    purchase -
    delivery -
    packaging -
    expectedReturnCostPerUnit;

  // Break-even must use the same contribution margin used by the
  // monthly profit calculation.
  const totalFixedOverheads = adSpend + fixed;

  const breakEvenUnits =
    unitProfitMargin > 0
      ? Math.ceil(totalFixedOverheads / unitProfitMargin)
      : 0;

  const breakEvenRevenue =
    breakEvenUnits * sale;

  return {
    purchasePrice: purchase,
    salePrice: sale,
    monthlySalesUnits: units,
    grossRevenue,
    cogsTotal,
    variableCostsTotal,
    adSpendMonthly: adSpend,
    fixedCostsMonthly: fixed,
    totalExpenses,
    netProfitMonthly,
    profitMarginPercent,
    unitProfitMargin,
    breakEvenUnits,
    breakEvenRevenue,
    returnsCost,
  };
}

export function calculateScenarios(inputs: FinancialCalcInputs): ScenarioSimulationResult {
  const baseUnits = inputs.monthlySalesUnits || 1;
  const conservativeUnits = Math.max(1, Math.round(baseUnits * 0.7));
  const optimisticUnits = Math.round(baseUnits * 1.4);

  return {
    conservative: calculateFinancials({ ...inputs, monthlySalesUnits: conservativeUnits }),
    base: calculateFinancials({ ...inputs, monthlySalesUnits: baseUnits }),
    optimistic: calculateFinancials({ ...inputs, monthlySalesUnits: optimisticUnits }),
  };
}

export interface CapitalAllocationBreakdown {
  totalCapital: number;
  stock: { amount: number; percent: number };
  marketing: { amount: number; percent: number };
  equipment: { amount: number; percent: number };
  operations: { amount: number; percent: number };
  reserve: { amount: number; percent: number };
}

export function calculateCapitalAllocation(totalCapital: number): CapitalAllocationBreakdown {
  const cap = Math.max(10000, totalCapital);
  // Suggested Algerian breakdown: 60% Stock, 10% Marketing, 10% Equipment/Tools, 5% Operations, 15% Reserve
  const stockAmount = Math.round(cap * 0.55);
  const marketingAmount = Math.round(cap * 0.12);
  const equipmentAmount = Math.round(cap * 0.13);
  const operationsAmount = Math.round(cap * 0.05);
  const reserveAmount = Math.round(cap * 0.15);

  return {
    totalCapital: cap,
    stock: { amount: stockAmount, percent: 55 },
    marketing: { amount: marketingAmount, percent: 12 },
    equipment: { amount: equipmentAmount, percent: 13 },
    operations: { amount: operationsAmount, percent: 5 },
    reserve: { amount: reserveAmount, percent: 15 },
  };
}

export interface ShouldIStartVerdict {
  verdict: "🟢 ابدأ باختبار صغير" | "🟡 ادرس السوق أولًا" | "🔴 لا تبدأ بهذا الحجم" | "🔵 المشروع مناسب ولكن رأس المال غير كافٍ";
  badgeClass: string;
  explanation: string;
}

export function evaluateShouldIStart(
  userCapital: number,
  minCapital: number,
  recommendedCapital: number,
  netProfit: number,
  breakEvenUnits: number,
  monthlySales: number
): ShouldIStartVerdict {
  if (userCapital < minCapital) {
    return {
      verdict: "🔵 المشروع مناسب ولكن رأس المال غير كافٍ",
      badgeClass: "bg-sky-100 text-sky-800 border-sky-300",
      explanation: `رأس مالك الحالي (${userCapital.toLocaleString()} دج) أقل من أدنى حد للتأسيس (${minCapital.toLocaleString()} دج). ننصح بتجميع المبلغ المتبقي أو البدء بنصف الكمية فقط.`,
    };
  }

  if (monthlySales < breakEvenUnits) {
    return {
      verdict: "🔴 لا تبدأ بهذا الحجم",
      badgeClass: "bg-rose-100 text-rose-800 border-rose-300",
      explanation: `وفق الأرقام المدخلة، مبيعاتك المتوقعة (${monthlySales} وحدة) أقل من نقطة التعادل (${breakEvenUnits} وحدة)، مما يعني تحقيق خسارة. ننصح بتخفيض التكاليف أو زيادة المبيعات.`,
    };
  }

  if (netProfit > 0 && monthlySales >= breakEvenUnits * 1.5) {
    return {
      verdict: "🟢 ابدأ باختبار صغير",
      badgeClass: "bg-indigo-100 text-indigo-800 border-indigo-300",
      explanation: `المشروع يحقق هامش أمان ممتاز وفائدة صافية تقارب ${netProfit.toLocaleString()} دج شهرياً. ابدأ بشراء دفعة تجريبية صغيرة كخطوة أولى.`,
    };
  }

  return {
    verdict: "🟡 ادرس السوق أولًا",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-300",
    explanation: `الأرقام متقاربة مع نقطة التعادل. ننصح بالتحقق من أسعار المنافسين والطلب الفعلي قبل الالتزام الكامل بالطلب الكلي.`,
  };
}
