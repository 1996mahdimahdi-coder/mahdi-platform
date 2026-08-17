export type AIMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type AIChatRequest = {
  messages: { role: "user" | "assistant"; content: string }[];
  context?: {
    currentProject?: string;
    currentArticle?: string;
    testResult?: {
      recommendations: { slug: string; nameAr: string; score: number; reasons: string[] }[];
    };
    userName?: string;
  };
};

export type AIChatResponse = {
  success: boolean;
  reply?: string;
  sources?: { type: "project" | "article" | "plan" | "course"; title: string; slug?: string }[];
  error?: string;
};

export type AIProviderConfig = {
  apiKey: string;
  baseUrl: string;
  model: string;
  maxTokens: number;
  temperature: number;
};

export const DEFAULT_AI_CONFIG: AIProviderConfig = {
  apiKey: process.env.AI_API_KEY ?? "",
  baseUrl: process.env.AI_BASE_URL ?? "https://api.openai.com/v1",
  model: process.env.AI_MODEL ?? "gpt-4o-mini",
  maxTokens: 1024,
  temperature: 0.7,
};

export const AI_RATE_LIMITS = {
  daily: { limit: 50, windowSeconds: 24 * 60 * 60 },
  perMinute: { limit: 5, windowSeconds: 60 },
} as const;

export const AI_INPUT_LIMITS = {
  maxMessages: 20,
  maxInputLength: 2000,
  maxContextLength: 4000,
} as const;
