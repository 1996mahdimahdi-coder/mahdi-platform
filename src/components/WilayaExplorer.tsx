"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Commune = { id: number; wilayaId: number; nameAr: string; nameFr: string; };

export default function WilayaExplorer({ wilayas }: { wilayas: { id: number; code: string; nameAr: string; nameFr: string; }[] }) {
  const [selectedWilaya, setSelectedWilaya] = useState("");
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedWilaya) { setCommunes([]); return; }
    setLoading(true);
    fetch(`/api/wilayas?wilayaId=${selectedWilaya}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setCommunes(d.communes || []); })
      .catch(() => setCommunes([]))
      .finally(() => setLoading(false));
  }, [selectedWilaya]);

  const selected = wilayas.find((w) => String(w.id) === selectedWilaya);

  return (
    <>
      <label htmlFor="wilaya" className="block mb-2 font-bold">اختر الولاية</label>
      <select id="wilaya" value={selectedWilaya} onChange={(e) => setSelectedWilaya(e.target.value)}
        className="w-full p-3 border border-slate-300 rounded-xl text-base font-bold bg-white">
        <option value="">اختر الولاية...</option>
        {wilayas.map((w) => (
          <option key={w.id} value={w.id}>{w.code} - {w.nameAr}</option>
        ))}
      </select>

      {selected && (
        <div className="mt-8">
          <h2 className="text-2xl font-black mb-4">بلديات {selected.nameAr}</h2>
          {loading && <p>جاري تحميل البلديات...</p>}
          {!loading && communes.length === 0 && <p className="text-slate-500">لا توجد بلديات لعرضها.</p>}
          {!loading && communes.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {communes.map((c) => (
                <Link key={c.id} href={`/communes/${c.id}`}
                  className="p-4 border border-slate-200 rounded-xl bg-slate-50 hover:bg-white hover:shadow-sm transition">
                  <div className="font-bold">{c.nameAr}</div>
                  <div className="text-sm text-slate-500 mt-1">{c.nameFr}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}