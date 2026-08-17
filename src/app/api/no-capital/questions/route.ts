import { NextResponse } from "next/server";
import { loadQuestions } from "@/lib/noCapital/publicData";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { questions, source } = await loadQuestions();
    return NextResponse.json({ success: true, count: questions.length, source, questions });
  } catch (error) {
    console.error("no-capital questions GET error:", error);
    return NextResponse.json({ success: false, error: "حدث خطأ داخلي. حاول مرة أخرى لاحقًا." }, { status: 500 });
  }
}
