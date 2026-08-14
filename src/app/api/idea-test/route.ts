import { NextResponse } from "next/server";
import { analyzeCustomIdea } from "@/lib/aiExplanation";
import {
  checkRateLimit,
  clientIpKey,
  RATE_LIMITS,
  rateLimitExceededResponse,
} from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = {
  "Cache-Control": "private, no-store",
};

const ALLOWED_CATEGORIES = new Set([
  "\u062a\u062c\u0627\u0631\u0629",
  "\u062e\u062f\u0645\u0627\u062a",
  "\u0623\u0648\u0646\u0644\u0627\u064a\u0646",
  "\u0635\u0646\u0627\u0639\u0629 \u062a\u0642\u0644\u064a\u062f\u064a\u0629",
  "\u0632\u0631\u0627\u0639\u0629",
]);

const ALLOWED_WORKSPACES = new Set([
  "\u0645\u0646 \u0627\u0644\u0645\u0646\u0632\u0644",
  "\u0645\u062d\u0644 \u0623\u0645\u0644\u0643\u0647",
  "\u0645\u062d\u0644 \u0628\u0627\u0644\u0625\u064a\u062c\u0627\u0631",
  "\u0623\u0648\u0646\u0644\u0627\u064a\u0646",
  "\u0645\u062a\u0646\u0642\u0644",
]);

const ALLOWED_RISK_LEVELS = new Set([
  "\u0645\u0646\u062e\u0641\u0636",
  "\u0645\u062a\u0648\u0633\u0637",
  "\u0645\u0631\u062a\u0641\u0639",
]);

function badRequest(error: string) {
  return NextResponse.json(
    { success: false, error },
    {
      status: 400,
      headers: NO_STORE_HEADERS,
    }
  );
}

export async function POST(request: Request) {
  // H1 rate limiting: this endpoint can call OpenAI when a key is set,
  // so anonymous bursts are bounded per IP.
  const ipLimit = RATE_LIMITS.ideaTest.ip;

  const ipCheck = await checkRateLimit({
    key: clientIpKey(request, "idea-test"),
    limit: ipLimit.limit,
    windowSeconds: ipLimit.windowSeconds,
  });

  if (!ipCheck.allowed) {
    return rateLimitExceededResponse(ipCheck);
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return badRequest(
      "\u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u0637\u0644\u0628 \u063a\u064a\u0631 \u0635\u0627\u0644\u062d\u0629."
    );
  }

  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body)
  ) {
    return badRequest(
      "\u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u0637\u0644\u0628 \u063a\u064a\u0631 \u0635\u0627\u0644\u062d\u0629."
    );
  }

  const input = body as Record<string, unknown>;

  const ideaTitle =
    typeof input.ideaTitle === "string"
      ? input.ideaTitle.trim()
      : "";

  if (!ideaTitle) {
    return badRequest(
      "\u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u0641\u0643\u0631\u0629 \u0645\u0637\u0644\u0648\u0628."
    );
  }

  if (ideaTitle.length < 5) {
    return badRequest(
      "\u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u0641\u0643\u0631\u0629 \u064a\u062c\u0628 \u0623\u0646 \u064a\u062d\u062a\u0648\u064a \u0639\u0644\u0649 5 \u0623\u062d\u0631\u0641 \u0639\u0644\u0649 \u0627\u0644\u0623\u0642\u0644."
    );
  }

  if (ideaTitle.length > 120) {
    return badRequest(
      "\u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u0641\u0643\u0631\u0629 \u0637\u0648\u064a\u0644 \u062c\u062f\u064b\u0627."
    );
  }

  const category =
    typeof input.category === "string"
      ? input.category.trim()
      : "";

  if (!ALLOWED_CATEGORIES.has(category)) {
    return badRequest(
      "\u0627\u0644\u062a\u0635\u0646\u064a\u0641 \u063a\u064a\u0631 \u0635\u0627\u0644\u062d."
    );
  }

  const capital = Number(input.capital);

  if (!Number.isFinite(capital) || capital <= 0) {
    return badRequest(
      "\u0631\u0623\u0633 \u0627\u0644\u0645\u0627\u0644 \u064a\u062c\u0628 \u0623\u0646 \u064a\u0643\u0648\u0646 \u0631\u0642\u0645\u064b\u0627 \u0645\u0648\u062c\u0628\u064b\u0627."
    );
  }

  if (capital > 100_000_000) {
    return badRequest(
      "\u0631\u0623\u0633 \u0627\u0644\u0645\u0627\u0644 \u064a\u062a\u062c\u0627\u0648\u0632 \u0627\u0644\u062d\u062f \u0627\u0644\u0645\u0633\u0645\u0648\u062d."
    );
  }

  const workspace =
    typeof input.workspace === "string"
      ? input.workspace.trim()
      : "";

  if (!ALLOWED_WORKSPACES.has(workspace)) {
    return badRequest(
      "\u0645\u0643\u0627\u0646 \u0627\u0644\u0639\u0645\u0644 \u063a\u064a\u0631 \u0635\u0627\u0644\u062d."
    );
  }

  const riskLevel =
    typeof input.riskLevel === "string"
      ? input.riskLevel.trim()
      : "";

  if (!ALLOWED_RISK_LEVELS.has(riskLevel)) {
    return badRequest(
      "\u0645\u0633\u062a\u0648\u0649 \u0627\u0644\u0645\u062e\u0627\u0637\u0631\u0629 \u063a\u064a\u0631 \u0635\u0627\u0644\u062d."
    );
  }

  const rawSkills = input.skills ?? [];

  if (
    !Array.isArray(rawSkills) ||
    rawSkills.length > 20 ||
    rawSkills.some(
      (skill) =>
        typeof skill !== "string" ||
        skill.trim().length === 0 ||
        skill.trim().length > 60
    )
  ) {
    return badRequest(
      "\u0627\u0644\u0645\u0647\u0627\u0631\u0627\u062a \u063a\u064a\u0631 \u0635\u0627\u0644\u062d\u0629."
    );
  }

  const skills = Array.from(
    new Set(
      rawSkills.map((skill) =>
        (skill as string).trim()
      )
    )
  );

  try {
    const result = await analyzeCustomIdea(
      ideaTitle,
      category,
      capital,
      workspace,
      skills,
      riskLevel
    );

    return NextResponse.json(
      {
        success: true,
        ideaTitle,
        category,
        capital,
        analysis: result,
      },
      {
        headers: NO_STORE_HEADERS,
      }
    );
  } catch (error) {
    console.error("Idea test error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          "\u062d\u062f\u062b \u062e\u0637\u0623 \u062f\u0627\u062e\u0644\u064a. \u062d\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649 \u0644\u0627\u062d\u0642\u064b\u0627.",
      },
      {
        status: 500,
        headers: NO_STORE_HEADERS,
      }
    );
  }
}
