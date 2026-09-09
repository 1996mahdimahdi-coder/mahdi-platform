// Administrative-status helper for the NABDA wilaya catalog.
//
// The platform intentionally keeps the extended 69-wilaya division (codes 1-69).
// Codes 1-58 match the classical 1984 subdivision; codes 59-69 are the 11 new /
// proposed divisions of the 2025-2026 subdivision. This module only labels the
// new ones so users are never misled into thinking every entry shares the same
// administrative history. It never changes IDs, names, or relationships.

export const NEW_DIVISION_WILAYA_CODES = [
  59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69,
] as const;

export const NEW_DIVISION_LABEL = "تقسيم جديد";

export const NEW_DIVISION_HINT =
  "التقسيمات المضافة حديثاً حسب النظام الإداري المعتمد في قاعدة بيانات NABDA.";

export function isNewProposedWilaya(code: string | number): boolean {
  const n = Number(code);
  return NEW_DIVISION_WILAYA_CODES.includes(
    n as (typeof NEW_DIVISION_WILAYA_CODES)[number],
  );
}