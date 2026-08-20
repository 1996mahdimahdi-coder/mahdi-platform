import { TRUST_META, type ProjectVideoItem } from "@/lib/projectVideos";

export default function ProjectVideo({ videos, title }: { videos: ProjectVideoItem[]; title: string }) {
  if (!videos || videos.length === 0) return null;

  return (
    <section className="rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm space-y-4">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-100">
        <span className="text-base">🎬</span>
        <h2 className="text-sm font-black text-slate-900">فيديوهات تطبيق المشروع</h2>
      </div>

      <div className="px-5 pb-5 space-y-4">
        {videos.map((v) => (
          <div key={v.id + v.label} className="space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-sm font-bold text-slate-800">{v.label}</span>
              <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full ${TRUST_META[v.trust]?.className ?? ""}`} title={TRUST_META[v.trust]?.desc}>
                {TRUST_META[v.trust]?.label ?? v.trust}
              </span>
            </div>
            <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-100">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${v.id}`}
                title={`${title} — ${v.label}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
            {v.note && (
              <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 font-bold">
                ⚠️ ملاحظة NABDA: {v.note}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
