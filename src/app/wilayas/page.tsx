"use client";

import { useEffect, useState } from "react";

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

export default function WilayasPage() {
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [selectedWilaya, setSelectedWilaya] = useState("");
  const [loading, setLoading] = useState(true);
  const [communesLoading, setCommunesLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadWilayas() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/wilayas");

        if (!response.ok) {
          throw new Error("فشل تحميل الولايات");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "فشل تحميل الولايات");
        }

        setWilayas(data.wilayas || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "حدث خطأ غير معروف"
        );
      } finally {
        setLoading(false);
      }
    }

    loadWilayas();
  }, []);

  useEffect(() => {
    if (!selectedWilaya) {
      setCommunes([]);
      return;
    }

    async function loadCommunes() {
      try {
        setCommunesLoading(true);
        setError("");

        const response = await fetch(
          `/api/wilayas?wilayaId=${selectedWilaya}`
        );

        if (!response.ok) {
          throw new Error("فشل تحميل البلديات");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "فشل تحميل البلديات");
        }

        setCommunes(data.communes || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "حدث خطأ غير معروف"
        );
        setCommunes([]);
      } finally {
        setCommunesLoading(false);
      }
    }

    loadCommunes();
  }, [selectedWilaya]);

  const selected = wilayas.find(
    (wilaya) => String(wilaya.id) === selectedWilaya
  );

  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        background: "#f5f7fa",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "#ffffff",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "700",
            marginBottom: "10px",
          }}
        >
          ولايات وبلديات الجزائر
        </h1>

        <p
          style={{
            color: "#666",
            marginBottom: "30px",
          }}
        >
          69 ولاية و1541 بلدية
        </p>

        {loading && <p>جاري تحميل الولايات...</p>}

        {error && (
          <div
            style={{
              padding: "15px",
              marginBottom: "20px",
              background: "#fee2e2",
              color: "#991b1b",
              borderRadius: "8px",
            }}
          >
            {error}
          </div>
        )}

        {!loading && (
          <>
            <label
              htmlFor="wilaya"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
              }}
            >
              اختر الولاية
            </label>

            <select
              id="wilaya"
              value={selectedWilaya}
              onChange={(e) =>
                setSelectedWilaya(e.target.value)
              }
              style={{
                width: "100%",
                padding: "14px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                fontSize: "16px",
                background: "#fff",
              }}
            >
              <option value="">
                اختر الولاية...
              </option>

              {wilayas.map((wilaya) => (
                <option
                  key={wilaya.id}
                  value={wilaya.id}
                >
                  {wilaya.code} - {wilaya.nameAr}
                </option>
              ))}
            </select>
          </>
        )}

        {selected && (
          <div style={{ marginTop: "30px" }}>
            <h2
              style={{
                fontSize: "24px",
                marginBottom: "20px",
              }}
            >
              بلديات {selected.nameAr}
            </h2>

            {communesLoading && (
              <p>جاري تحميل البلديات...</p>
            )}

            {!communesLoading &&
              communes.length === 0 && (
                <p style={{ color: "#777" }}>
                  لا توجد بلديات لعرضها.
                </p>
              )}

            {!communesLoading &&
              communes.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: "12px",
                  }}
                >
                  {communes.map((commune) => (
                    <div
                      key={commune.id}
                      style={{
                        padding: "15px",
                        border: "1px solid #e5e7eb",
                        borderRadius: "10px",
                        background: "#fafafa",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "600",
                        }}
                      >
                        {commune.nameAr}
                      </div>

                      <div
                        style={{
                          marginTop: "5px",
                          color: "#777",
                          fontSize: "14px",
                        }}
                      >
                        {commune.nameFr}
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        )}
      </div>
    </main>
  );
}
