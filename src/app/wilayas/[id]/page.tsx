"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  SourcedStatCard,
  DensityCard,
  type StatDetail,
  type DensityDetail,
} from "@/components/SourcedStatCard";

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
  const [population, setPopulation] = useState<StatDetail | null>(null);
  const [area, setArea] = useState<StatDetail | null>(null);
  const [density, setDensity] = useState<DensityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadWilaya() {
      try {
        const { id } = await params;

        const response = await fetch(`/api/wilayas/${id}`, {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "فشل تحميل الولاية");
        }

        setWilaya(data.wilaya);
        setCommunes(data.communes || []);
        setPopulation(data.population);
        setArea(data.area);
        setDensity(data.density);
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
          ← العودة إلى الولايات
        </Link>

        <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 mb-6">
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

        {/* Demographic & area data */}
        <section className="mb-6">
          <div className="mb-4">
            <h2 className="text-2xl font-black text-slate-900">
              البيانات الديموغرافية والجغرافية
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              كل رقم مرتبط بمصدر موثق وسنة، أو لا يُعرض أصلًا.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {population ? (
              <SourcedStatCard
                title="عدد السكان"
                detail={population}
                format={(value) =>
                  `${Number(value).toLocaleString("ar-DZ")} نسمة`
                }
              />
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <p className="text-sm text-slate-500 font-bold">عدد السكان</p>
                <p className="text-sm font-bold text-slate-400 mt-3 leading-6">
                  لا تتوفر حاليًا بيانات رسمية موثقة قابلة للتحقق.
                </p>
              </div>
            )}

            {area ? (
              <SourcedStatCard
                title="المساحة"
                detail={area}
                format={(value) => `${value} كم²`}
              />
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <p className="text-sm text-slate-500 font-bold">المساحة</p>
                <p className="text-sm font-bold text-slate-400 mt-3 leading-6">
                  لا تتوفر حاليًا بيانات رسمية موثقة قابلة للتحقق.
                </p>
              </div>
            )}

            {density ? (
              <DensityCard
                detail={density}
                populationValue={population?.value ?? null}
                areaValue={area?.value ?? null}
              />
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <p className="text-sm text-slate-500 font-bold">الكثافة السكانية</p>
                <p className="text-sm font-bold text-slate-400 mt-3 leading-6">
                  لا تتوفر حاليًا بيانات رسمية موثقة قابلة للتحقق.
                </p>
              </div>
            )}
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
