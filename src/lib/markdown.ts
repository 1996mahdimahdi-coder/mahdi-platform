type Token =
  | { type: "heading"; level: 1 | 2 | 3 | 4; text: string }
  | { type: "paragraph"; text: string }
  | { type: "blockquote"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "hr" }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "code"; language: string; text: string }
  | { type: "bold_paragraph"; parts: { text: string; bold: boolean }[] };

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function isSafeUrl(url: string): boolean {
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return true;
  if (/^#\w/.test(trimmed)) return true;
  if (/^\/\//.test(trimmed)) return true;
  if (/^[a-z0-9._~:/?#\[\]@!$&'()*+,;=%-]+$/i.test(trimmed) && !/^[a-z]+:/i.test(trimmed)) return true;
  return false;
}

function parseInline(text: string): string {
  const escaped = escapeHtml(text);

  return escaped
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-extrabold text-slate-900">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 rounded-lg bg-slate-100 text-slate-800 text-[13px] font-mono">$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, (_match, linkText: string, url: string) => {
      if (!isSafeUrl(url)) {
        return `<span class="text-slate-500">${linkText}</span>`;
      }
      const safeUrl = url.replace(/"/g, "%22");
      return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="text-indigo-600 underline decoration-indigo-300 hover:decoration-indigo-600 transition-colors">${linkText}</a>`;
    });
}

function tokenize(markdown: string): Token[] {
  const lines = markdown.split("\n");
  const tokens: Token[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "") {
      i++;
      continue;
    }

    const hrMatch = line.trim().match(/^(-{3,}|\*{3,}|_{3,})$/);
    if (hrMatch) {
      tokens.push({ type: "hr" });
      i++;
      continue;
    }

    const headingMatch = line.trim().match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length as 1 | 2 | 3 | 4;
      tokens.push({ type: "heading", level, text: headingMatch[2].trim() });
      i++;
      continue;
    }

    const blockquoteMatch = line.trim().match(/^>\s*(.+)$/);
    if (blockquoteMatch) {
      const quoteLines: string[] = [blockquoteMatch[1]];
      i++;
      while (i < lines.length && lines[i].trim().match(/^>\s*(.+)$/)) {
        quoteLines.push(lines[i].trim().replace(/^>\s*/, ""));
        i++;
      }
      tokens.push({ type: "blockquote", text: quoteLines.join("\n") });
      continue;
    }

    if (line.trim().match(/^\d+\.\s/)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().match(/^\d+\.\s/)) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
        i++;
      }
      tokens.push({ type: "ol", items });
      continue;
    }

    if (line.trim().match(/^[-*+]\s/)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().match(/^[-*+]\s/)) {
        items.push(lines[i].trim().replace(/^[-*+]\s+/, ""));
        i++;
      }
      tokens.push({ type: "ul", items });
      continue;
    }

    const tableMatch = line.trim().match(/^\|(.+)\|$/);
    if (tableMatch) {
      const headers = tableMatch[1].split("|").map((h) => h.trim());
      i++;
      if (i < lines.length && lines[i].trim().match(/^\|[\s\-:|]+\|$/)) {
        i++;
      }
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().match(/^\|(.+)\|$/)) {
        const rowMatch = lines[i].trim().match(/^\|(.+)\|$/);
        if (rowMatch) {
          rows.push(rowMatch[1].split("|").map((c) => c.trim()));
        }
        i++;
      }
      tokens.push({ type: "table", headers, rows });
      continue;
    }

    if (line.trim().match(/^```/)) {
      const lang = line.trim().replace(/^```/, "").trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().match(/^```$/)) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      tokens.push({ type: "code", language: lang, text: codeLines.join("\n") });
      continue;
    }

    const paraLines: string[] = [];
    while (i < lines.length && lines[i].trim() !== "" && !lines[i].trim().match(/^(#{1,4}\s|>\s|[-*+]\s|\d+\.\s|\||```|(-{3,}|\*{3,}|_{3,})$)/)) {
      paraLines.push(lines[i].trim());
      i++;
    }
    if (paraLines.length > 0) {
      tokens.push({ type: "paragraph", text: paraLines.join(" ") });
    }
  }

  return tokens;
}

function tokensToHtml(tokens: Token[]): string {
  return tokens
    .map((token) => {
      switch (token.type) {
        case "heading": {
          const tag = `h${token.level}`;
          const cls =
            token.level === 1
              ? "text-2xl sm:text-4xl font-black text-slate-900 leading-tight mt-10 mb-4 first:mt-0"
              : token.level === 2
                ? "text-xl sm:text-2xl font-black text-slate-900 mt-8 mb-3 border-b border-slate-200 pb-2"
                : token.level === 3
                  ? "text-lg sm:text-xl font-extrabold text-slate-800 mt-6 mb-2"
                  : "text-base font-extrabold text-slate-700 mt-4 mb-2";
          return `<${tag} class="${cls}">${parseInline(token.text)}</${tag}>`;
        }

        case "paragraph":
          return `<p class="text-sm sm:text-[15px] leading-[1.9] text-slate-700 mb-4">${parseInline(token.text)}</p>`;

        case "blockquote":
          return `<blockquote class="my-6 mr-4 pr-4 border-r-4 border-indigo-400 bg-indigo-50/60 rounded-l-2xl p-4 sm:p-5 text-sm text-indigo-900 leading-relaxed italic">${parseInline(token.text)}</blockquote>`;

        case "ul":
          return `<ul class="my-4 space-y-2 pr-6">${token.items
            .map((item) => `<li class="text-sm sm:text-[15px] leading-relaxed text-slate-700 relative pl-4 before:content-[''] before:absolute before:right-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-indigo-400">${parseInline(item)}</li>`)
            .join("")}</ul>`;

        case "ol":
          return `<ol class="my-4 space-y-2 pr-6 list-decimal">${token.items
            .map((item) => `<li class="text-sm sm:text-[15px] leading-relaxed text-slate-700 marker:font-extrabold marker:text-indigo-600">${parseInline(item)}</li>`)
            .join("")}</ol>`;

        case "hr":
          return `<hr class="my-8 border-t border-slate-200" />`;

        case "table":
          return `<div class="my-6 overflow-x-auto rounded-xl border border-slate-200"><table class="w-full text-sm"><thead><tr class="bg-slate-50">${token.headers
            .map((h) => `<th class="px-4 py-3 text-right font-extrabold text-slate-700 border-b border-slate-200">${parseInline(h)}</th>`)
            .join("")}</tr></thead><tbody>${token.rows
            .map(
              (row) => `<tr class="border-b border-slate-100 hover:bg-slate-50/50">${row
                .map((cell) => `<td class="px-4 py-2.5 text-slate-600">${parseInline(cell)}</td>`)
                .join("")}</tr>`
            )
            .join("")}</tbody></table></div>`;

        case "code":
          return `<div class="my-4 rounded-xl overflow-hidden border border-slate-200"><div class="bg-slate-800 text-slate-400 text-xs px-4 py-2 font-mono">${token.language || "code"}</div><pre class="p-4 bg-slate-900 text-slate-200 text-sm font-mono overflow-x-auto leading-relaxed"><code>${token.text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre></div>`;

        default:
          return "";
      }
    })
    .join("\n");
}

export function renderMarkdown(markdown: string): string {
  if (!markdown) return "";
  const tokens = tokenize(markdown);
  return tokensToHtml(tokens);
}
