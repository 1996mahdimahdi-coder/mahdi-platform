import { NextResponse } from "next/server";
import { getSession, unauthorizedResponse, PRIVATE_NO_STORE_HEADERS } from "@/lib/auth";
import { csrfGuard } from "@/lib/csrf";
import { checkRateLimit, rateLimitExceededResponse } from "@/lib/rateLimit";
import { isAIConfigured, generateAIResponse } from "@/lib/ai/provider";
import { buildSystemPrompt } from "@/lib/ai/system-prompt";
import { retrieveKnowledge, buildKnowledgeContext } from "@/lib/ai/knowledge";
import { AI_RATE_LIMITS, AI_INPUT_LIMITS } from "@/lib/ai/types";
import type { AIMessage, AIChatRequest, AIChatResponse } from "@/lib/ai/types";

function safeLog(stage: string, extra?: Record<string, unknown>) {
  const safe: Record<string, unknown> = { t: new Date().toISOString(), s: stage };
  if (extra) Object.assign(safe, extra);
  console.log(JSON.stringify(safe));
}

async function rateLimitCheck(userId: number): Promise<{ allowed: boolean; response?: NextResponse }> {
  const userResult = await checkRateLimit({
    key: `ai:user:${userId}:daily`,
    limit: AI_RATE_LIMITS.daily.limit,
    windowSeconds: AI_RATE_LIMITS.daily.windowSeconds,
  });
  if (!userResult.allowed) {
    return { allowed: false, response: rateLimitExceededResponse(userResult) };
  }

  const perMinute = await checkRateLimit({
    key: `ai:user:${userId}:min`,
    limit: AI_RATE_LIMITS.perMinute.limit,
    windowSeconds: AI_RATE_LIMITS.perMinute.windowSeconds,
  });
  if (!perMinute.allowed) {
    return { allowed: false, response: rateLimitExceededResponse(perMinute) };
  }

  return { allowed: true };
}

function sanitizeInput(text: string): string {
  return text
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .trim()
    .slice(0, AI_INPUT_LIMITS.maxInputLength);
}

function trimHistory(messages: { role: string; content: string }[]): { role: "user" | "assistant"; content: string }[] {
  const trimmed = messages.slice(-AI_INPUT_LIMITS.maxMessages);
  return trimmed.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content.slice(0, 1000),
  }));
}

const SENSITIVE_PATTERNS = /password|secret|api.?key|token|database.?url|credential/i;

function containsSensitiveData(text: string): boolean {
  return SENSITIVE_PATTERNS.test(text);
}

export async function POST(request: Request) {
  const start = Date.now();

  if (!isAIConfigured()) {
    safeLog("ai.config_missing");
    return NextResponse.json(
      { success: false, error: "المساعد الذكي غير متاح حالياً." } satisfies AIChatResponse,
      { status: 503, ...PRIVATE_NO_STORE_HEADERS }
    );
  }

  const csrfErr = await csrfGuard(request);
  if (csrfErr) {
    safeLog("ai.csrf_blocked");
    return csrfErr;
  }

  const session = await getSession();
  if (!session) {
    safeLog("ai.auth_required");
    return unauthorizedResponse();
  }

  let body: AIChatRequest;
  try {
    body = await request.json();
  } catch {
    safeLog("ai.invalid_json", { uid: session.userId });
    return NextResponse.json(
      { success: false, error: "بيانات غير صالحة." } satisfies AIChatResponse,
      { status: 400, ...PRIVATE_NO_STORE_HEADERS }
    );
  }

  if (!body.messages?.length || !Array.isArray(body.messages)) {
    return NextResponse.json(
      { success: false, error: "الرسائل مطلوبة." } satisfies AIChatResponse,
      { status: 400, ...PRIVATE_NO_STORE_HEADERS }
    );
  }

  if (body.messages.length > AI_INPUT_LIMITS.maxMessages + 1) {
    body.messages = body.messages.slice(-(AI_INPUT_LIMITS.maxMessages + 1));
  }

  const rl = await rateLimitCheck(session.userId);
  if (!rl.allowed) return rl.response!;

  const lastUserMsg = body.messages.filter((m) => m.role === "user").pop();
  if (!lastUserMsg || lastUserMsg.content.trim().length < 2) {
    return NextResponse.json(
      { success: false, error: "اكتب سؤالك أولاً." } satisfies AIChatResponse,
      { status: 400, ...PRIVATE_NO_STORE_HEADERS }
    );
  }

  if (containsSensitiveData(lastUserMsg.content)) {
    safeLog("ai.sensitive_input_blocked", { uid: session.userId });
    return NextResponse.json(
      { success: false, error: "يحتوي رسالتك على معلومات حساسة. يُرجى إزالتها." } satisfies AIChatResponse,
      { status: 400, ...PRIVATE_NO_STORE_HEADERS }
    );
  }

  const cleanInput = sanitizeInput(lastUserMsg.content);
  if (cleanInput.length < 2) {
    return NextResponse.json(
      { success: false, error: "رسالتك قصيرة جداً." } satisfies AIChatResponse,
      { status: 400, ...PRIVATE_NO_STORE_HEADERS }
    );
  }

  let knowledgeItems: Awaited<ReturnType<typeof retrieveKnowledge>> = [];
  let knowledgeContext = "";
  try {
    knowledgeItems = await retrieveKnowledge(cleanInput, {
      currentProject: body.context?.currentProject,
      currentArticle: body.context?.currentArticle,
    });
    knowledgeContext = buildKnowledgeContext(knowledgeItems);
  } catch (err) {
    safeLog("ai.knowledge_error", { uid: session.userId });
  }

  const systemPrompt = buildSystemPrompt(body.context);
  const finalSystem = knowledgeContext
    ? `${systemPrompt}\n\n${knowledgeContext}`
    : systemPrompt;

  const messages: AIMessage[] = [
    { role: "system", content: finalSystem },
    ...trimHistory(body.messages.slice(0, -1)).map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: cleanInput },
  ];

  try {
    const reply = await generateAIResponse(messages, {
      maxTokens: 512,
      temperature: 0.3,
    });

    if (containsSensitiveData(reply)) {
      safeLog("ai.sensitive_output_blocked", { uid: session.userId });
      return NextResponse.json(
        { success: false, error: "حدث خطأ أثناء توليد الرد. حاول مرة أخرى." } satisfies AIChatResponse,
        { status: 500, ...PRIVATE_NO_STORE_HEADERS }
      );
    }

    const sources = knowledgeItems
      .filter((k) => k.relevance > 5)
      .slice(0, 5)
      .map((k) => ({
        type: k.type as "project" | "article" | "plan" | "course",
        title: k.title,
        slug: k.slug,
      }));

    const latency = Date.now() - start;
    safeLog("ai.success", { uid: session.userId, ms: latency, src: sources.length, model: process.env.AI_MODEL ?? "gpt-4o-mini" });

    return NextResponse.json(
      { success: true, reply, sources } satisfies AIChatResponse,
      { status: 200, ...PRIVATE_NO_STORE_HEADERS }
    );
  } catch (err) {
    const latency = Date.now() - start;
    const code = err instanceof Error ? err.message : "UNKNOWN";
    safeLog("ai.generation_error", { uid: session.userId, ms: latency, code });

    let errorMsg = "حدث خطأ أثناء توليد الرد. حاول مرة أخرى.";
    if (code.includes("TIMEOUT")) {
      errorMsg = "استغرق الرد وقتاً أطول من المعتاد. حاول مرة أخرى.";
    } else if (code.includes("NOT_CONFIGURED")) {
      errorMsg = "المساعد الذكي غير متاح حالياً.";
    }

    return NextResponse.json(
      { success: false, error: errorMsg } satisfies AIChatResponse,
      { status: 500, ...PRIVATE_NO_STORE_HEADERS }
    );
  }
}
