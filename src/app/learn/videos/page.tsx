"use client";

import { useEffect, useState } from "react";
import { Loader2, Video, Inbox, Clock } from "lucide-react";

type VideoItem = {
  id: number;
  slug: string;
  title: string;
  description?: string;
  videoUrl?: string;
  embedUrl?: string;
  durationSeconds?: number;
  thumbnailUrl?: string;
};

export default function LearnVideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/learn/videos", { cache: "no-store" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error("failed");
        return data.videos as VideoItem[];
      })
      .then(setVideos)
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  }, []);

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "غير محدد";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        <div className="border-b border-slate-200 pb-6">
          <span className="text-xs font-black text-emerald-600 uppercase tracking-wider">
            الفيديوهات
          </span>

          <h1 className="text-2xl sm:text-4xl font-black mt-1">فيديوهات تطبيقية</h1>

          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            شرائط قصيرة تشرح مفاهيم عملية خطوة بخطوة.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-3 py-20 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <p className="text-sm font-bold">جاري تحميل الفيديوهات...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
              <Inbox className="w-7 h-7" />
            </div>

            <div>
              <h2 className="font-black text-lg">الفيديوهات قيد التحضير</h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                سنضيف فيديوهات قصيرة تشرح خطوات العمل العملية. إلى ذلك، استخدم
                خطة 90 يوماً كمرجع لك.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <div key={video.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
                {video.embedUrl ? (
                  <div className="aspect-video bg-slate-900">
                    <iframe
                      src={video.embedUrl}
                      title={video.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : video.videoUrl ? (
                  <video
                    src={video.videoUrl}
                    poster={video.thumbnailUrl ?? undefined}
                    controls
                    className="w-full aspect-video bg-slate-900 object-contain"
                  />
                ) : (
                  <div className="aspect-video bg-slate-900 flex items-center justify-center">
                    <Video className="w-8 h-8 text-slate-600" />
                  </div>
                )}

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="font-black text-sm">{video.title}</h2>

                    <span className="text-[10px] text-slate-400 flex items-center gap-1 shrink-0">
                      <Clock className="w-3 h-3" />
                      {formatDuration(video.durationSeconds)}
                    </span>
                  </div>

                  {video.description && (
                    <p className="text-xs text-slate-500 leading-relaxed">{video.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
