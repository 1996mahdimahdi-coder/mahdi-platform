"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Loader2, MessageCircle, Sparkles, Trash2, ExternalLink } from "lucide-react";

type Source = { type: string; title: string; slug?: string };

type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  timestamp: Date;
};

type ChatState = {
  messages: Message[];
  isLoading: boolean;
  input: string;
  error: string | null;
};

type AiChatProps = {
  context?: {
    currentProject?: string;
    currentArticle?: string;
    testResult?: {
      recommendations: { slug: string; nameAr: string; score: number; reasons: string[] }[];
    };
    userName?: string;
  };
  suggestedPrompts?: string[];
  compact?: boolean;
};

const DEFAULT_SUGGESTIONS = [
  "كيف أبدأ مشروع بدون رأس مال؟",
  "ما هي أفضل المشاريع للطلاب؟",
  "كيف أحصل على أول عميل؟",
  "أريد بدء مشروع من المنزل",
];

const SAFE_SLUG_RE = /^[a-zA-Z0-9_-]+$/;

function SourceHref({ source }: { source: Source }) {
  const typeRoutes: Record<string, string> = {
    project: "/no-capital/projects/",
    article: "/blog/",
    plan: "/no-capital/plans/",
    course: "/learn/courses/",
  };

  const prefix = typeRoutes[source.type];
  if (!prefix || !source.slug || !SAFE_SLUG_RE.test(source.slug)) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold">
        <span>{source.title}</span>
      </span>
    );
  }

  return (
    <a
      href={`${prefix}${source.slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold hover:bg-indigo-100 transition-colors"
    >
      <span>{source.title}</span>
      <ExternalLink className="w-2.5 h-2.5" />
    </a>
  );
}

function SourcesBadge({ sources }: { sources: Source[] }) {
  if (!sources?.length) return null;

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {sources.map((s, i) => (
        <SourceHref key={i} source={s} />
      ))}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 text-slate-500 text-xs py-3 px-4">
      <Loader2 className="w-4 h-4 animate-spin" />
      <span>يكتب...</span>
      <span className="flex gap-0.5">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]" />
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
      </span>
    </div>
  );
}

export default function AiChat({ context, suggestedPrompts, compact = false }: AiChatProps) {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    input: "",
    error: null,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [state.messages, state.isLoading, scrollToBottom]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (trimmed.length < 2 || state.isLoading) return;

    const userMsg: Message = {
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMsg],
      input: "",
      isLoading: true,
      error: null,
    }));

    try {
      const history = [...state.messages, userMsg].slice(-20).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, context }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "حدث خطأ");
      }

      const assistantMsg: Message = {
        role: "assistant",
        content: data.reply,
        sources: data.sources,
        timestamp: new Date(),
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMsg],
        isLoading: false,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : "حدث خطأ غير متوقع",
      }));
    }
  }, [state.messages, state.isLoading, context]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(state.input);
    }
  };

  const clearChat = () => {
    setState((prev) => ({ ...prev, messages: [], error: null }));
  };

  const prompts = suggestedPrompts?.length ? suggestedPrompts : DEFAULT_SUGGESTIONS;

  if (compact) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Compact header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-l from-emerald-50 to-teal-50 border-b border-emerald-100">
          <div className="flex items-center gap-2">
            <span className="text-lg">🤖</span>
            <h3 className="text-sm font-black text-slate-900">مساعد NABDA</h3>
          </div>
          <span className="text-[10px] text-slate-500 font-bold px-2 py-1 bg-white rounded-full border border-slate-200">
            {state.messages.length > 0 ? `${state.messages.length} رسالة` : "جاهز للمساعدة"}
          </span>
        </div>

        {/* Messages area */}
        <div className="h-[400px] overflow-y-auto p-4 space-y-3">
          {state.messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-slate-900">اسأل مساعد NABDA</p>
                <p className="text-xs text-slate-500 mt-1">أجب عن أسئلتك حول المشاريع والتسويق والتعلم</p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 max-w-md">
                {prompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(p)}
                    className="px-3 py-1.5 rounded-full border border-slate-200 text-xs font-bold text-slate-700 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50 transition-all"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {state.messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white rounded-br-md"
                    : "bg-slate-100 text-slate-800 rounded-bl-md"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                {msg.role === "assistant" && msg.sources && <SourcesBadge sources={msg.sources} />}
              </div>
            </div>
          ))}

          {state.isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 rounded-2xl rounded-bl-md">
                <TypingIndicator />
              </div>
            </div>
          )}

          {state.error && (
            <div className="flex justify-center">
              <div className="px-4 py-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
                {state.error}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-slate-100 p-3 bg-slate-50">
          <div className="flex items-end gap-2">
            {state.messages.length > 0 && (
              <button
                onClick={clearChat}
                className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                title="مسح المحادثة"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={state.input}
                onChange={(e) => setState((prev) => ({ ...prev, input: e.target.value }))}
                onKeyDown={handleKeyDown}
                placeholder="اكتب سؤالك هنا..."
                rows={1}
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
                style={{ minHeight: "42px", maxHeight: "120px" }}
              />
            </div>
            <button
              onClick={() => sendMessage(state.input)}
              disabled={state.isLoading || state.input.trim().length < 2}
              className="p-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
            >
              {state.isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Full-page layout (used on /ai page)
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[70vh] min-h-[500px]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-l from-emerald-50 to-teal-50 border-b border-emerald-100 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900">مساعد NABDA الذكي</h2>
            <p className="text-[11px] text-slate-500">اسأل عن المشاريع والتسويق والتعلم</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 font-bold px-2.5 py-1 bg-white rounded-full border border-slate-200">
            {state.messages.length > 0 ? `${state.messages.length} رسالة` : "جاهز للمساعدة"}
          </span>
          {state.messages.length > 0 && (
            <button
              onClick={clearChat}
              className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="مسح المحادثة"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {state.messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">أهلاً بك في مساعد NABDA</h3>
              <p className="text-sm text-slate-500 mt-2 max-w-md">
                اسأل عن أي موضوع: مشاريع، تسويق، تعلم، خطط عمل، أو أي شيء تريده
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 max-w-lg">
              {prompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(p)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50 transition-all shadow-sm"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {state.messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-br-md"
                  : "bg-slate-100 text-slate-800 rounded-bl-md"
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
              {msg.role === "assistant" && msg.sources && <SourcesBadge sources={msg.sources} />}
            </div>
          </div>
        ))}

        {state.isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 rounded-2xl rounded-bl-md">
              <TypingIndicator />
            </div>
          </div>
        )}

        {state.error && (
          <div className="flex justify-center">
            <div className="px-5 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
              {state.error}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-slate-100 p-4 bg-slate-50 shrink-0">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={state.input}
              onChange={(e) => setState((prev) => ({ ...prev, input: e.target.value }))}
              onKeyDown={handleKeyDown}
              placeholder="اكتب سؤالك هنا... (Shift+Enter لسطر جديد)"
              rows={1}
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
              style={{ minHeight: "46px", maxHeight: "120px" }}
            />
          </div>
          <button
            onClick={() => sendMessage(state.input)}
            disabled={state.isLoading || state.input.trim().length < 2}
            className="p-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0 shadow-md"
          >
            {state.isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mt-2 text-center">
          المساعد يعتمد على محتوى NABDA. لا يغني عن استشارة المتخصصين.
        </p>
      </div>
    </div>
  );
}
