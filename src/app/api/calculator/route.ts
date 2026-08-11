import { NextResponse } from "next/server";
import { calculateFinancials, calculateScenarios, calculateCapitalAllocation, evaluateShouldIStart } from "@/lib/financialCalc";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const purchasePrice = Number(body.purchasePrice) || 0;
    const salePrice = Number(body.salePrice) || 0;
    const monthlySalesUnits = Number(body.monthlySalesUnits) || 0;
    const deliveryCostPerUnit = Number(body.deliveryCostPerUnit) || 0;
    const packagingCostPerUnit = Number(body.packagingCostPerUnit) || 0;
    const adSpendMonthly = Number(body.adSpendMonthly) || 0;
    const fixedCostsMonthly = Number(body.fixedCostsMonthly) || 0;
    const returnRatePercent = Number(body.returnRatePercent) || 0;
    const totalCapital = Number(body.totalCapital) || 50000;
    const minCapital = Number(body.minCapital) || 30000;

    const baseCalc = calculateFinancials({
      purchasePrice,
      salePrice,
      monthlySalesUnits,
      deliveryCostPerUnit,
      packagingCostPerUnit,
      adSpendMonthly,
      fixedCostsMonthly,
      returnRatePercent,
    });

    const scenarios = calculateScenarios({
      purchasePrice,
      salePrice,
      monthlySalesUnits,
      deliveryCostPerUnit,
      packagingCostPerUnit,
      adSpendMonthly,
      fixedCostsMonthly,
      returnRatePercent,
    });

    const capitalAllocation = calculateCapitalAllocation(totalCapital);

    const verdict = evaluateShouldIStart(
      totalCapital,
      minCapital,
      minCapital * 2,
      baseCalc.netProfitMonthly,
      baseCalc.breakEvenUnits,
      baseCalc.monthlySalesUnits
    );

    return NextResponse.json({
      success: true,
      calc: baseCalc,
      scenarios,
      capitalAllocation,
      verdict,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
