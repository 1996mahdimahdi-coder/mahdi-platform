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

export type BreakEvenStatus =
  | "AVAILABLE"
  | "NO_PROFITABLE_BREAK_EVEN"
  | "IMMEDIATELY_BREAK_EVEN";

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
  breakEvenStatus: BreakEvenStatus; // هل نقطة التعادل متوفرة
  breakEvenMessage: string;     // رسالة توضيحية لنقطة التعادل
  returnsCost: number;          // قيمة الخسائر من المرتجعات
}

export interface ScenarioSimulationResult {
  conservative: FinancialCalcResult; // سيناريو حذر (-30% sales)
  base: FinancialCalcResult;         // سيناريو أساسي (100% sales)
  optimistic: FinancialCalcResult;   // سيناريو متفائل (+40% sales)
}

function safeNumber(value: number | undefined | null, fallback: number = 0): number {
  if (value == null || !Number.isFinite(value)) return fallback;
  return value;
}

export function calculateFinancials(inputs: FinancialCalcInputs): FinancialCalcResult {
  const rawPurchase = safeNumber(inputs.purchasePrice);
  const rawSale = safeNumber(inputs.salePrice);
  const rawUnits = safeNumber(inputs.monthlySalesUnits);
  const rawDelivery = safeNumber(inputs.deliveryCostPerUnit);
  const rawPackaging = safeNumber(inputs.packagingCostPerUnit);
  const rawAdSpend = safeNumber(inputs.adSpendMonthly);
  const rawFixed = safeNumber(inputs.fixedCostsMonthly);
  const rawReturnRate = safeNumber(inputs.returnRatePercent);

  const purchase = Math.max(0, rawPurchase);
  const sale = Math.max(0, rawSale);
  const units = Math.max(0, rawUnits);
  const delivery = Math.max(0, rawDelivery);
  const packaging = Math.max(0, rawPackaging);
  const adSpend = Math.max(0, rawAdSpend);
  const fixed = Math.max(0, rawFixed);
  const returnRate = Math.min(100, Math.max(0, rawReturnRate));

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

  let breakEvenUnits: number;
  let breakEvenStatus: BreakEvenStatus;
  let breakEvenMessage: string;

  if (totalFixedOverheads === 0 && unitProfitMargin > 0) {
    breakEvenUnits = 0;
    breakEvenStatus = "IMMEDIATELY_BREAK_EVEN";
    breakEvenMessage = "بدون تكاليف ثابتة، المشروع يحقق التعادل فوراً.";
  } else if (unitProfitMargin > 0) {
    breakEvenUnits = Math.ceil(totalFixedOverheads / unitProfitMargin);
    breakEvenStatus = "AVAILABLE";
    breakEvenMessage = `تحتاج إلى بيع ${breakEvenUnits} وحدة لتغطية التكاليف الثابتة وميزانية الإعلانات بالكامل.`;
  } else if (unitProfitMargin === 0) {
    breakEvenUnits = 0;
    breakEvenStatus = "NO_PROFITABLE_BREAK_EVEN";
    breakEvenMessage = "لا توجد نقطة تعادل مربحة لأن هامش المساهمة يساوي صفر. بيع أي عدد إضافي من الوحدات لا يساهم في تغطية التكاليف الثابتة.";
  } else {
    breakEvenUnits = 0;
    breakEvenStatus = "NO_PROFITABLE_BREAK_EVEN";
    breakEvenMessage = "لا توجد نقطة تعادل مربحة بهذا السعر لأن هامش المساهمة سلبي. زيادة المبيعات ستزيد الخسارة. ارفع سعر البيع أو خفّض تكلفة الوحدة.";
  }

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
    breakEvenStatus,
    breakEvenMessage,
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
  monthlySales: number,
  breakEvenStatus?: BreakEvenStatus
): ShouldIStartVerdict {
  if (userCapital < minCapital) {
    return {
      verdict: "🔵 المشروع مناسب ولكن رأس المال غير كافٍ",
      badgeClass: "bg-sky-100 text-sky-800 border-sky-300",
      explanation: `رأس مالك الحالي (${userCapital.toLocaleString()} دج) أقل من أدنى حد للتأسيس (${minCapital.toLocaleString()} دج). ننصح بتجميع المبلغ المتبقي أو البدء بنصف الكمية فقط.`,
    };
  }

  if (breakEvenStatus === "NO_PROFITABLE_BREAK_EVEN") {
    return {
      verdict: "🔴 لا تبدأ بهذا الحجم",
      badgeClass: "bg-rose-100 text-rose-800 border-rose-300",
      explanation: netProfit < 0
        ? `الأرقام المدخلة تُظهر خسارة شهرية (${netProfit.toLocaleString()} دج). لا توجد نقطة تعادل مربحة — رفع السعر أو تخفيض التكاليف ضرورة قبل أي قرار.`
        : `هامش المساهمة لا يسمح بتغطية التكاليف الثابتة. لا توجد نقطة تعادل مربحة.`,
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
