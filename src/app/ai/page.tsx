import type { Metadata } from "next";
import AiChat from "@/components/ai/AiChat";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "مساعد NABDA الذكي — اسأل عن المشاريع والتسويق",
  description: "اسأل مساعد NABDA الذكي عن المشاريع بدون رأس مال، التسويق، التعلم، وخطط العمل. مساعدتك مبنية على محتوى NABDA.",
  openGraph: {
    title: "مساعد NABDA الذكي",
    description: "اسأل عن المشاريع والتسويق والتعلم",
    type: "website",
  },
};

const SAFE_SLUG_RE = /^[a-zA-Z0-9_-]+$/;

type ContextType = {
  currentProject?: string;
  currentArticle?: string;
};

function parseContextParam(raw: string | undefined): ContextType | undefined {
  if (!raw || typeof raw !== "string") return undefined;

  const match = raw.match(/^(project|article):([a-zA-Z0-9_-]+)$/);
  if (!match) return undefined;

  const [, type, slug] = match;
  if (!slug || !SAFE_SLUG_RE.test(slug) || slug.length > 100) return undefined;

  if (type === "project") return { currentProject: slug };
  if (type === "article") return { currentArticle: slug };
  return undefined;
}

export default async function AiPage(props: {
  searchParams: Promise<{ context?: string }>;
}) {
  const sp = await props.searchParams;
  const context = parseContextParam(sp.context);

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            مساعد NABDA الذكي
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            اسأل عن أي موضوع: مشاريع، تسويق، تعلم، خطط عمل، أو أي شيء تريده.
          </p>
        </div>

        <AiChat context={context} />
      </div>
    </main>
  );
}
