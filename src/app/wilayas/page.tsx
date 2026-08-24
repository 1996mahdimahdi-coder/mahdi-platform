import Link from "next/link";
import { db } from "@/db";
import { wilayas } from "@/db/schema";
import WilayaExplorer from "@/components/WilayaExplorer";

export const dynamic = "force-dynamic";

async function getWilayas() {
  try {
    const rows = await db.select().from(wilayas);
    rows.sort((a, b) => parseInt(a.code, 10) - parseInt(b.code, 10));
    return rows;
  } catch {
    return [];
  }
}

export default async function WilayasPage() {
  const allWilayas = await getWilayas();

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <h1 className="text-3xl font-black mb-2">ولايات وبلديات الجزائر</h1>
        <p className="text-slate-500 mb-8">{allWilayas.length} ولاية</p>

        <WilayaExplorer wilayas={allWilayas} />

        <div className="mt-10 border-t border-slate-100 pt-6">
          <h2 className="text-xl font-black mb-4">جميع الولايات</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {allWilayas.map((w) => (
              <Link key={w.id} href={`/wilayas/${w.id}`}
                className="p-3 border border-slate-200 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 transition text-center">
                <div className="text-xs text-slate-400 font-bold">{w.code}</div>
                <div className="font-bold text-sm">{w.nameAr}</div>
                <div className="text-[11px] text-slate-500">{w.nameFr}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}