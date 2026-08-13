import { NextResponse } from "next/server";
import { analyzeCustomIdea } from "@/lib/aiExplanation";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ideaTitle, category, capital, workspace, skills, riskLevel } = body;

    if (!ideaTitle) {
      return NextResponse.json({ success: false, error: "عنوان الفكرة مطلوب" }, { status: 400 });
    }

    const numCapital = Number(capital) || 50000;
    const ws = workspace || "من المنزل";
    const skillList = Array.isArray(skills) ? skills : [];
    const risk = riskLevel || "متوسط";

    const result = await analyzeCustomIdea(
      ideaTitle,
      category || "تجارة خفيفة",
      numCapital,
      ws,
      skillList,
      risk
    );

    return NextResponse.json({
      success: true,
      ideaTitle,
      category,
      capital: numCapital,
      analysis: result,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: "\u062d\u062f\u062b \u062e\u0637\u0623 \u062f\u0627\u062e\u0644\u064a. \u062d\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649 \u0644\u0627\u062d\u0642\u064b\u0627." }, { status: 500 });
  }
}
