import { DEFAULT_AI_CONFIG, type AIProviderConfig, type AIMessage } from "./types";

let config: AIProviderConfig = { ...DEFAULT_AI_CONFIG };

export function configureAI(overrides: Partial<AIProviderConfig>) {
  config = { ...config, ...overrides };
}

export function getAIConfig(): AIProviderConfig {
  return { ...config };
}

export function isAIConfigured(): boolean {
  return Boolean(config.apiKey && config.apiKey.length > 10);
}

export async function generateAIResponse(
  messages: AIMessage[],
  options?: { maxTokens?: number; temperature?: number }
): Promise<string> {
  if (!isAIConfigured()) {
    throw new Error("AI provider not configured. Set AI_API_KEY in environment.");
  }

  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      max_tokens: options?.maxTokens ?? config.maxTokens,
      temperature: options?.temperature ?? config.temperature,
    }),
  });

  if (!response.ok) {
    const safeStatus = response.status;
    console.error("AI API error: HTTP", safeStatus);
    throw new Error(`AI provider returned ${safeStatus}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (typeof content !== "string" || content.trim().length === 0) {
    throw new Error("AI provider returned empty response");
  }

  return content.trim();
}
