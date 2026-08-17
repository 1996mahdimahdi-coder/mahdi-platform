"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";

type ArticleImageProps = {
  src: string;
  alt: string;
  caption?: string;
  source?: string;
  className?: string;
};

export default function ArticleImage({ src, alt, caption, source, className = "" }: ArticleImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src) return null;

  return (
    <figure className={`my-6 ${className}`}>
      <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-100">
        {hasError ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400 gap-2">
            <ImageIcon className="w-10 h-10" />
            <span className="text-xs font-bold">صورة غير متوفرة</span>
          </div>
        ) : (
          <img
            src={src}
            alt={alt}
            className="w-full h-auto object-cover max-h-[500px]"
            loading="lazy"
            onError={() => setHasError(true)}
          />
        )}
      </div>
      {(caption || source) && (
        <figcaption className="mt-2 px-1 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          {caption && <span>{caption}</span>}
          {source && (
            <span className="text-slate-400">
              مصدر الصورة: {source}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}
