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

const REQUEST_TIMEOUT_MS = 30_000;
const MAX_RETRIES = 2;
const RETRY_BASE_DELAY_MS = 1_000;

function isRetryable(status: number): boolean {
  return status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function generateAIResponse(
  messages: AIMessage[],
  options?: { maxTokens?: number; temperature?: number }
): Promise<string> {
  if (!isAIConfigured()) {
    throw new Error("AI_NOT_CONFIGURED");
  }

  const body = JSON.stringify({
    model: config.model,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
    max_tokens: options?.maxTokens ?? config.maxTokens,
    temperature: options?.temperature ?? config.temperature,
  });

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetchWithTimeout(
        `${config.baseUrl}/chat/completions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.apiKey}`,
          },
          body,
        },
        REQUEST_TIMEOUT_MS
      );

      if (!response.ok) {
        const status = response.status;
        if (isRetryable(status) && attempt < MAX_RETRIES) {
          const delay = RETRY_BASE_DELAY_MS * Math.pow(2, attempt);
          await new Promise((r) => setTimeout(r, delay));
          continue;
        }
        throw new Error(`AI_PROVIDER_HTTP_${status}`);
      }

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content;

      if (typeof content !== "string" || content.trim().length === 0) {
        throw new Error("AI_PROVIDER_EMPTY_RESPONSE");
      }

      return content.trim();
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        lastError = new Error("AI_PROVIDER_TIMEOUT");
      } else {
        lastError = err instanceof Error ? err : new Error("AI_PROVIDER_UNKNOWN");
      }
      if (attempt < MAX_RETRIES) {
        const delay = RETRY_BASE_DELAY_MS * Math.pow(2, attempt);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
    }
  }

  throw lastError ?? new Error("AI_PROVIDER_FAILED");
}
