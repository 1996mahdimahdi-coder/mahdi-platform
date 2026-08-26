import { NextResponse } from "next/server";
import { calculateFinancials, calculateScenarios, calculateCapitalAllocation, evaluateShouldIStart } from "@/lib/financialCalc";
import {
  checkRateLimit,
  clientIpKey,
  RATE_LIMITS,
  rateLimitExceededResponse,
} from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  // H1 rate limiting: cheap computation but fully public, bounded per IP.
  const ipLimit = RATE_LIMITS.calculator.ip;

  const ipCheck = await checkRateLimit({
    key: clientIpKey(request, "calculator"),
    limit: ipLimit.limit,
    windowSeconds: ipLimit.windowSeconds,
  });

  if (!ipCheck.allowed) {
    return rateLimitExceededResponse(ipCheck);
  }

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
      baseCalc.monthlySalesUnits,
      baseCalc.breakEvenStatus
    );

    return NextResponse.json({
      success: true,
      calc: baseCalc,
      scenarios,
      capitalAllocation,
      verdict,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "\u062d\u062f\u062b \u062e\u0637\u0623 \u062f\u0627\u062e\u0644\u064a. \u062d\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649 \u0644\u0627\u062d\u0642\u064b\u0627." }, { status: 500 });
  }
}
