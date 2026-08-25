"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import AiChat from "@/components/ai/AiChat";

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    function handleClickOutside(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay backdrop — only on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 sm:hidden"
          aria-hidden="true"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Chat panel */}
      {isOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="مساعد NABDA الذكي"
          className={[
            "fixed z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col",
            "bottom-20 start-4",
            "w-[calc(100vw-2rem)] h-[60vh] max-h-[560px]",
            "sm:w-[380px] sm:h-[500px] sm:start-6",
            "origin-bottom-start",
            "animate-floatPanel",
          ].join(" ")}
        >
          <AiChat compact />
        </div>
      )}

      {/* Floating trigger button */}
      <button
        ref={triggerRef}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "إغلاق المساعد الذكي" : "فتح المساعد الذكي"}
        aria-expanded={isOpen}
        aria-controls="ai-chat-panel"
        className={[
          "fixed z-50 flex items-center justify-center rounded-full",
          "bottom-6 start-6",
          "w-14 h-14 sm:w-14 sm:h-14",
          "text-white shadow-lg transition-all duration-200",
          "hover:scale-105 active:scale-95",
          "focus:outline-none focus:ring-4 focus:ring-indigo-300",
          isOpen
            ? "bg-slate-700 hover:bg-slate-600"
            : "bg-gradient-to-br from-indigo-600 to-fuchsia-600 hover:from-indigo-700 hover:to-fuchsia-700",
        ].join(" ")}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>
    </>
  );
}
