"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Wilaya = {
  id: number;
  code: string;
  nameAr: string;
  nameFr: string;
};

type Commune = {
  id: number;
  wilayaId: number;
  nameAr: string;
  nameFr: string;
};

export default function WilayaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [wilaya, setWilaya] = useState<Wilaya | null>(null);
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadWilaya() {
      try {
        const { id } = await params;

        const response = await fetch("/api/wilayas");
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "فشل تحميل الولايات");
        }

        const found = data.wilayas?.find(
          (item: Wilaya) =>
            String(item.id) === String(id) ||
            String(item.code) === String(id)
        );

        if (!found) {
          setError("الولاية غير موجودة");
          setLoading(false);
          return;
        }

        setWilaya(found);

        const communesResponse = await fetch(
          `/api/wilayas?wilayaId=${found.id}`
        );

        const communesData = await communesResponse.json();

        if (communesData.success) {
          setCommunes(communesData.communes || []);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "حدث خطأ أثناء تحميل الولاية"
        );
      } finally {
        setLoading(false);
      }
    }

    loadWilaya();
  }, [params]);

  if (loading) {
    return (
      <main dir="rtl" className="min-h-screen flex items-center justify-center">
        <p className="font-bold text-slate-700">
          جاري تحميل معلومات الولاية...
        </p>
      </main>
    );
  }

  if (error || !wilaya) {
    return (
      <main dir="rtl" className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-black text-red-600 mb-4">
            {error || "الولاية غير موجودة"}
          </h1>

          <Link
            href="/wilayas"
            className="inline-block px-6 py-3 rounded-xl bg-slate-900 text-white font-bold"
          >
            العودة إلى قائمة الولايات
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-50 py-10 px-4"
    >
      <div className="max-w-5xl mx-auto">

        <Link
          href="/wilayas"
          className="inline-block mb-6 text-indigo-600 font-bold"
        >
          ? العودة إلى الولايات
        </Link>

        <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex flex-col gap-2">
            <span className="text-sm text-slate-500">
              الولاية رقم {wilaya.code}
            </span>

            <h1 className="text-3xl font-black text-slate-900">
              {wilaya.nameAr}
            </h1>

            <p className="text-slate-500">
              {wilaya.nameFr}
            </p>
          </div>
        </section>

        <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-slate-900">
              بلديات {wilaya.nameAr}
            </h2>

            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold text-sm">
              {communes.length} بلدية
            </span>
          </div>

          {communes.length === 0 ? (
            <p className="text-slate-500">
              لا توجد بلديات مسجلة لهذه الولاية.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {communes.map((commune) => (
                <Link
                  key={commune.id}
                  href={`/communes/${commune.id}`}
                  className="block border border-slate-200 rounded-2xl p-4 bg-slate-50 hover:bg-white hover:shadow-sm transition"
                >
                  <h3 className="font-black text-slate-900">
                    {commune.nameAr}
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    {commune.nameFr}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
