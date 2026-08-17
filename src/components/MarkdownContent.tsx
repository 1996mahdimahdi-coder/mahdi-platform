"use client";

import { useMemo } from "react";
import { renderMarkdown } from "@/lib/markdown";

export default function MarkdownContent({ content }: { content: string }) {
  const html = useMemo(() => renderMarkdown(content), [content]);

  if (!content) return null;

  const hasMarkdown = /(?:^#{1,4}\s|^\s*[-*+]\s|^\s*\d+\.\s|^>\s|^```|^\|.*\||\*\*|\[.+\]\(.+\))/m.test(content);

  if (!hasMarkdown) {
    return (
      <div className="text-sm sm:text-[15px] leading-[1.9] text-slate-700 whitespace-pre-line">
        {content}
      </div>
    );
  }

  return (
    <div
      className="article-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
