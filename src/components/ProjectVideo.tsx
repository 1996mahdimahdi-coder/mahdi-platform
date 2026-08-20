export default function ProjectVideo({ videoId, title }: { videoId: string; title: string }) {
  if (!videoId) return null;

  return (
    <section className="rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100">
        <span className="text-base">🎬</span>
        <h2 className="text-sm font-black text-slate-900">شاهد شرح المشروع بالفيديو</h2>
      </div>
      <div className="aspect-video w-full">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </section>
  );
}
