import { NextResponse } from "next/server";
import { loadCategories } from "@/lib/noCapital/publicData";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { categories: items, source } = await loadCategories();
    return NextResponse.json({ success: true, count: items.length, source, categories: items });
  } catch (error) {
    console.error("categories GET error:", error);
    return NextResponse.json({ success: false, error: "حدث خطأ داخلي. حاول مرة أخرى لاحقًا." }, { status: 500 });
  }
}
