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
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
