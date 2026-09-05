// @ts-nocheck
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { calculateFinancials, evaluateShouldIStart } from "./financialCalc";

describe("calculateFinancials — break-even", () => {
  it("CASE 1: positive contribution margin → AVAILABLE", () => {
    const r = calculateFinancials({
      purchasePrice: 1000,
      salePrice: 1500,
      monthlySalesUnits: 40,
      fixedCostsMonthly: 100000,
    });
    assert.equal(r.breakEvenStatus, "AVAILABLE");
    assert.ok(r.breakEvenUnits > 0, `expected breakEvenUnits > 0, got ${r.breakEvenUnits}`);
    assert.equal(r.breakEvenRevenue, r.breakEvenUnits * 1500);
  });

  it("CASE 2: contribution margin = 0 → NO_PROFITABLE_BREAK_EVEN", () => {
    const r = calculateFinancials({
      purchasePrice: 1000,
      salePrice: 1000,
      monthlySalesUnits: 40,
      fixedCostsMonthly: 100000,
    });
    assert.equal(r.breakEvenStatus, "NO_PROFITABLE_BREAK_EVEN");
    assert.equal(r.breakEvenUnits, 0);
  });

  it("CASE 3: negative contribution margin → NO_PROFITABLE_BREAK_EVEN", () => {
    const r = calculateFinancials({
      purchasePrice: 1000,
      salePrice: 500,
      monthlySalesUnits: 40,
      fixedCostsMonthly: 100000,
    });
    assert.equal(r.breakEvenStatus, "NO_PROFITABLE_BREAK_EVEN");
    assert.equal(r.breakEvenUnits, 0);
    assert.ok(r.unitProfitMargin < 0, `expected negative margin, got ${r.unitProfitMargin}`);
  });

  it("CASE 4: fixedCosts=0 with positive margin → IMMEDIATELY_BREAK_EVEN", () => {
    const r = calculateFinancials({
      purchasePrice: 1000,
      salePrice: 1500,
      monthlySalesUnits: 40,
      fixedCostsMonthly: 0,
    });
    assert.equal(r.breakEvenStatus, "IMMEDIATELY_BREAK_EVEN");
    assert.equal(r.breakEvenUnits, 0);
  });

  it("CASE 5: quantity=0 → no NaN/Infinity", () => {
    const r = calculateFinancials({
      purchasePrice: 1000,
      salePrice: 1500,
      monthlySalesUnits: 0,
      fixedCostsMonthly: 100000,
    });
    assert.ok(Number.isFinite(r.grossRevenue));
    assert.ok(Number.isFinite(r.netProfitMonthly));
    assert.ok(Number.isFinite(r.breakEvenUnits));
  });

  it("CASE 6: returnRate=100 → no NaN/Infinity", () => {
    const r = calculateFinancials({
      purchasePrice: 1000,
      salePrice: 1500,
      monthlySalesUnits: 40,
      fixedCostsMonthly: 100000,
      returnRatePercent: 100,
    });
    assert.ok(Number.isFinite(r.grossRevenue));
    assert.ok(Number.isFinite(r.netProfitMonthly));
    assert.ok(Number.isFinite(r.breakEvenUnits));
  });

  it("CASE 7: returnRate=-1 → clamped to 0", () => {
    const r = calculateFinancials({
      purchasePrice: 1000,
      salePrice: 1500,
      monthlySalesUnits: 40,
      returnRatePercent: -1,
    });
    assert.equal(r.returnsCost, 0);
    assert.ok(Number.isFinite(r.netProfitMonthly));
  });

  it("CASE 8: returnRate=101 → clamped to 100", () => {
    const r = calculateFinancials({
      purchasePrice: 1000,
      salePrice: 1500,
      monthlySalesUnits: 40,
      returnRatePercent: 101,
    });
    assert.ok(Number.isFinite(r.netProfitMonthly));
  });

  it("CASE 9: negative sellingPrice → clamped to 0", () => {
    const r = calculateFinancials({
      purchasePrice: 1000,
      salePrice: -500,
      monthlySalesUnits: 40,
    });
    assert.equal(r.salePrice, 0);
    assert.ok(Number.isFinite(r.netProfitMonthly));
  });

  it("CASE 10: negative unit cost → clamped to 0", () => {
    const r = calculateFinancials({
      purchasePrice: -500,
      salePrice: 1500,
      monthlySalesUnits: 40,
    });
    assert.equal(r.purchasePrice, 0);
    assert.ok(Number.isFinite(r.netProfitMonthly));
  });

  it("CASE 11: negative fixed costs → clamped to 0", () => {
    const r = calculateFinancials({
      purchasePrice: 1000,
      salePrice: 1500,
      monthlySalesUnits: 40,
      fixedCostsMonthly: -5000,
    });
    assert.equal(r.fixedCostsMonthly, 0);
    assert.ok(Number.isFinite(r.netProfitMonthly));
  });

  it("CASE 12: NaN/Infinity inputs → no NaN/Infinity in output", () => {
    const r = calculateFinancials({
      purchasePrice: NaN,
      salePrice: Infinity,
      monthlySalesUnits: -Infinity,
    });
    assert.ok(Number.isFinite(r.grossRevenue));
    assert.ok(Number.isFinite(r.netProfitMonthly));
    assert.ok(Number.isFinite(r.breakEvenUnits));
    assert.ok(Number.isFinite(r.breakEvenRevenue));
  });
});

describe("evaluateShouldIStart — break-even edge cases", () => {
  it("NO_PROFITABLE_BREAK_EVEN → verdict is don't start", () => {
    const v = evaluateShouldIStart(
      50000, 30000, 100000, -5000, 0, 100, "NO_PROFITABLE_BREAK_EVEN"
    );
    assert.ok(v.verdict.includes("لا تبدأ"), v.verdict);
  });

  it("AVAILABLE but sales < breakEven → verdict is don't start", () => {
    const v = evaluateShouldIStart(
      50000, 30000, 100000, -2000, 200, 50, "AVAILABLE"
    );
    assert.ok(v.verdict.includes("لا تبدأ"), v.verdict);
  });

  it("capital < min → verdict is insufficient capital", () => {
    const v = evaluateShouldIStart(
      5000, 30000, 100000, 5000, 100, 200, "AVAILABLE"
    );
    assert.ok(v.verdict.includes("رأس المال غير كافٍ"), v.verdict);
  });
});
