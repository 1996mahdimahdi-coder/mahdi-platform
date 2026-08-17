"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  DollarSign,
  Home,
  Laptop,
  Car,
  Clock,
  Briefcase,
  AlertTriangle,
  Target,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import ConsentGate from "@/components/ConsentGate";
import { getOrCreateSessionId } from "@/lib/session";

interface WilayaItem {
  id: number;
  code: string;
  nameAr: string;
  nameFr: string;
  areaType: string;
}

interface CommuneItem {
  id: number;
  nameAr: string;
  nameFr?: string;
  wilayaId?: number;
  populationDensity?: string;
}

interface WilayasResponse {
  success: boolean;
  wilayas?: WilayaItem[];
  communes?: CommuneItem[];
  error?: string;
}

interface AssessResponse {
  success: boolean;
  error?: string;
  [key: string]: unknown;
}

export default function TestPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showConsent, setShowConsent] = useState(false);
  const sessionId = getOrCreateSessionId();

  const [wilayasList, setWilayasList] = useState<WilayaItem[]>([]);
  const [communesList, setCommunesList] = useState<CommuneItem[]>([]);

  const [selectedCapitalOption, setSelectedCapitalOption] =
    useState<number>(50000);

  const [customCapitalInput, setCustomCapitalInput] =
    useState<string>("");

  const [workspace, setWorkspace] =
    useState<string>("من المنزل");

  const [wilayaId, setWilayaId] =
    useState<number>(16);

  const [wilayaName, setWilayaName] =
    useState<string>("الجزائر العاصمة");

  const [communeId, setCommuneId] =
    useState<number>(0);

  const [communeName, setCommuneName] =
    useState<string>("");

  const [availableHours, setAvailableHours] =
    useState<string>("2–4 ساعات");

  const [skills, setSkills] =
    useState<string[]>([]);

  const [preferredMode, setPreferredMode] =
    useState<string>("لا أعرف");

  const [riskLevel, setRiskLevel] =
    useState<string>("متوسط");

  const [transport, setTransport] =
    useState<string>("لا أملك وسيلة نقل");

  const [existingIncome, setExistingIncome] =
    useState<string>("لا");

  const [objective, setObjective] =
    useState<string>("دخل إضافي");

  // ============================================================
  // تحميل الولايات
  // ============================================================

  useEffect(() => {
    let cancelled = false;

    const loadWilayas = async () => {
      setErrorMsg("");

      try {
        const response = await fetch("/api/wilayas", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data: WilayasResponse =
          await response.json();

        if (
          !data.success ||
          !Array.isArray(data.wilayas)
        ) {
          throw new Error(
            data.error ||
              "تعذر تحميل قائمة الولايات."
          );
        }

        if (!cancelled) {
          const sortedWilayas = [
            ...data.wilayas,
          ].sort((a, b) => a.id - b.id);

          setWilayasList(sortedWilayas);

          const defaultWilaya =
            sortedWilayas.find(
              (wilaya) => wilaya.id === 16
            );

          if (defaultWilaya) {
            setWilayaId(defaultWilaya.id);
            setWilayaName(defaultWilaya.nameAr);
          } else if (sortedWilayas.length > 0) {
            setWilayaId(sortedWilayas[0].id);
            setWilayaName(
              sortedWilayas[0].nameAr
            );
          }
        }
      } catch (error) {
        console.error(
          "Load wilayas error:",
          error
        );

        if (!cancelled) {
          setErrorMsg(
            "تعذر تحميل قائمة الولايات."
          );
        }
      }
    };

    loadWilayas();

    return () => {
      cancelled = true;
    };
  }, []);

  // ============================================================
  // تحميل البلديات عند تغيير الولاية
  // ============================================================

  useEffect(() => {
    if (!wilayaId) {
      setCommunesList([]);
      setCommuneId(0);
      setCommuneName("");
      return;
    }

    let cancelled = false;

    const loadCommunes = async () => {
      setErrorMsg("");

      try {
        const response = await fetch(
          `/api/wilayas?wilayaId=${encodeURIComponent(
            wilayaId
          )}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `HTTP ${response.status}`
          );
        }

        const data: WilayasResponse =
          await response.json();

        if (
          !data.success ||
          !Array.isArray(data.communes)
        ) {
          throw new Error(
            data.error ||
              "تعذر تحميل قائمة البلديات."
          );
        }

        if (!cancelled) {
          setCommunesList(data.communes);

          if (data.communes.length > 0) {
            const firstCommune =
              data.communes[0];

            setCommuneId(firstCommune.id);
            setCommuneName(
              firstCommune.nameAr
            );
          } else {
            setCommuneId(0);
            setCommuneName("");
          }
        }
      } catch (error) {
        console.error(
          "Load communes error:",
          error
        );

        if (!cancelled) {
          setCommunesList([]);
          setCommuneId(0);
          setCommuneName("");
          setErrorMsg(
            "تعذر تحميل بلديات الولاية المحددة."
          );
        }
      }
    };

    loadCommunes();

    return () => {
      cancelled = true;
    };
  }, [wilayaId]);

  // ============================================================
  // اختيار المهارات
  // ============================================================

  const toggleSkill = (skill: string) => {
    if (skill === "لا أملك خبرة محددة") {
      setSkills(["لا أملك خبرة محددة"]);
      return;
    }

    const filtered = skills.filter(
      (item) => item !== "لا أملك خبرة محددة"
    );

    if (filtered.includes(skill)) {
      setSkills(
        filtered.filter(
          (item) => item !== skill
        )
      );
    } else {
      setSkills([...filtered, skill]);
    }
  };

  // ============================================================
  // رأس المال النهائي
  // ============================================================

  const getEffectiveCapital = (): number => {
    const customValue = Number(
      customCapitalInput
    );

    if (
      customCapitalInput.trim() !== "" &&
      Number.isFinite(customValue) &&
      customValue > 0
    ) {
      return customValue;
    }

    return selectedCapitalOption;
  };

  // ============================================================
  // التحقق من السؤال الحالي
  // ============================================================

  const validateCurrentStep = (): boolean => {
    setErrorMsg("");

    if (step === 1) {
      const capital = getEffectiveCapital();

      if (
        !Number.isFinite(capital) ||
        capital <= 0
      ) {
        setErrorMsg(
          "يرجى إدخال رأس مال صحيح أكبر من صفر."
        );
        return false;
      }
    }

    if (step === 3) {
      if (!wilayaId) {
        setErrorMsg(
          "يرجى اختيار الولاية."
        );
        return false;
      }
    }

    if (step === 4) {
      if (!communeId) {
        setErrorMsg(
          "يرجى اختيار البلدية."
        );
        return false;
      }
    }

    if (step === 6) {
      if (skills.length === 0) {
        setErrorMsg(
          "يرجى اختيار مهارة واحدة على الأقل."
        );
        return false;
      }
    }

    return true;
  };

  // ============================================================
  // التالي
  // ============================================================

  const handleNext = () => {
    if (!validateCurrentStep()) {
      return;
    }

    if (step < 11) {
      setStep(
        (currentStep) => currentStep + 1
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    setShowConsent(true);
  };

  // ============================================================
  // السابق
  // ============================================================

  const handleBack = () => {
    if (step <= 1 || loading) {
      return;
    }

    setErrorMsg("");

    setStep(
      (currentStep) => currentStep - 1
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ============================================================
  // إرسال التقييم
  // ============================================================

  const submitAssessment = async (consentVersion: string) => {
    if (!validateCurrentStep()) {
      return;
    }

    if (!wilayaId) {
      setErrorMsg(
        "الولاية غير محددة."
      );
      return;
    }

    if (!communeId) {
      setErrorMsg(
        "البلدية غير محددة."
      );
      return;
    }

    setLoading(true);
    setErrorMsg("");

    let sessionUser:
      | { id?: number | string }
      | null = null;

    try {
      const meRes = await fetch(
        "/api/auth/me",
        { cache: "no-store" }
      );

      if (meRes.status === 401) {
        sessionUser = null;
      } else if (meRes.ok) {
        const meData = await meRes.json();
        if (meData.success && meData.user) {
          sessionUser = meData.user;
        }
      }
    } catch {
      sessionUser = null;
    }

    try {
      const payload = {
        userId: sessionUser?.id ?? null,

        capital: getEffectiveCapital(),

        workspace,

        wilayaId,
        wilayaName,

        communeId,
        communeName,

        availableHours,

        skills,

        preferredMode,

        riskLevel,

        transport,

        existingIncome,

        objective,

        sessionId,

        consentVersion,
      };

      const response = await fetch(
        "/api/assess",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            payload
          ),
        }
      );

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}`
        );
      }

      const data: AssessResponse =
        await response.json();

      if (!data.success) {
        throw new Error(
          data.error ||
            "حدث خطأ أثناء تقييم البيانات."
        );
      }

      localStorage.setItem(
        "nabda_last_result",
        JSON.stringify(data)
      );

      router.push("/results");
    } catch (error) {
      console.error(
        "Assessment submission error:",
        error
      );

      setErrorMsg(
        error instanceof Error &&
          error.message.startsWith("HTTP")
          ? "حدث خطأ في الخادم أثناء إرسال التقييم."
          : error instanceof Error
            ? error.message
            : "خطأ في الاتصال بالخادم."
      );

      setLoading(false);
    }
  };

  const handleConsentGranted = (version: string) => {
    setShowConsent(false);
    submitAssessment(version);
  };

  const handleConsentCancel = () => {
    setShowConsent(false);
  };

  const capitalOptions = [
    {
      label: "أقل من 20,000 دج (2 ملايين)",
      value: 15000,
    },
    {
      label: "20,000 – 50,000 دج (2 إلى 5 ملايين)",
      value: 35000,
    },
    {
      label: "50,000 – 100,000 دج (5 إلى 10 ملايين)",
      value: 75000,
    },
    {
      label: "100,000 – 200,000 دج (10 إلى 20 مليون)",
      value: 150000,
    },
    {
      label: "200,000 – 500,000 دج (20 إلى 50 مليون)",
      value: 350000,
    },
    {
      label: "500,000 – 1,000,000 دج (50 إلى 100 مليون)",
      value: 750000,
    },
    {
      label: "أكثر من 1,000,000 دج (أكثر من 100 مليون)",
      value: 1200000,
    },
  ];

  const workspaceOptions = [
    {
      label: "من المنزل",
      desc: "بدون مصاريف إيجار",
    },
    {
      label: "محل أملكه",
      desc: "ملكية خاصة بالمبنى",
    },
    {
      label: "محل بالإيجار",
      desc: "دفع بدل إيجار شهري",
    },
    {
      label: "أونلاين",
      desc: "التشغيل عبر الإنترنت والشحن",
    },
    {
      label: "متنقل",
      desc: "تقديم الخدمة في موقع الزبون",
    },
    {
      label: "لا أعرف",
      desc: "الانفتاح على أي صيغة مناسبة",
    },
  ];

  const hourOptions = [
    "أقل من ساعتين يوميًا",
    "2–4 ساعات",
    "4–6 ساعات",
    "أكثر من 6 ساعات",
    "دوام كامل",
  ];

  const skillOptions = [
    "البيع",
    "التسويق",
    "الطبخ",
    "الهواتف والإلكترونيات",
    "الملابس",
    "السيارات",
    "الحرف",
    "التعليم",
    "التصميم",
    "البرمجة",
    "التصوير",
    "صناعة المحتوى",
    "الزراعة",
    "الخدمات المنزلية",
    "الإدارة",
    "لا أملك خبرة محددة",
  ];

  const preferredModeOptions = [
    "بيع منتجات",
    "تقديم خدمات",
    "مشروع أونلاين",
    "مشروع محلي",
    "مشروع من المنزل",
    "مشروع يحتاج محل",
    "لا أعرف",
  ];

  const riskOptions = [
    {
      label: "منخفض",
      desc: "الحفاظ الأقصى على رأس المال والأمان",
    },
    {
      label: "متوسط",
      desc: "توازن معقول بين الأرباح والمخاطرة",
    },
    {
      label: "مرتفع",
      desc: "الاستعداد لتجارب أسرع وأعلى ربحية",
    },
  ];

  const transportOptions = [
    "سيارة",
    "دراجة نارية",
    "نقل عمومي",
    "لا أملك وسيلة نقل",
  ];

  const incomeOptions = [
    {
      label: "نعم",
      desc: "أملك وظيفة أو راتباً ثابتاً أو مداخيل أخرى",
    },
    {
      label: "لا",
      desc: "المشروع سيكون المصدر الأساسي والوحيد للمعيشة",
    },
  ];

  const objectiveOptions = [
    "دخل إضافي",
    "مشروع رئيسي",
    "ترك الوظيفة مستقبلًا",
    "مشروع صغير قابل للتوسع",
    "لا أعرف",
  ];

  if (showConsent) {
    return (
      <ConsentGate
        purpose="assessment"
        sessionId={sessionId}
        onGranted={handleConsentGranted}
        onCancel={handleConsentCancel}
      />
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto"
    >
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">

        <div className="bg-slate-900 text-white p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />

              <span className="font-extrabold text-lg text-white">
                اختبار الوضع المالي والمحلي
              </span>
            </div>

            <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800 text-indigo-400 border border-slate-700 whitespace-nowrap">
              السؤال {step} من 11
            </span>
          </div>

          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-sky-400 h-full transition-all duration-300 ease-out"
              style={{
                width: `${(step / 11) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="p-6 sm:p-10 space-y-8">

          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-indigo-600" />
                  السؤال 1: كم هو رأس المال المتوفر لديك بالدينار (دج)؟
                </h2>

                <p className="text-xs text-slate-500">
                  اختر الفئة أو أدخل المبلغ الدقيق المتوفر لديك حالياً للاستثمار.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {capitalOptions.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setSelectedCapitalOption(item.value);
                      setCustomCapitalInput("");
                    }}
                    className={`p-4 rounded-2xl border text-right font-bold text-sm transition-all flex items-center justify-between ${
                      selectedCapitalOption === item.value &&
                      !customCapitalInput
                        ? "bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span>{item.label}</span>

                    {selectedCapitalOption === item.value &&
                      !customCapitalInput && (
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                      )}
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  أو أدخل مبلغاً مخصصاً بالدينار الجزائري (دج):
                </label>

                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    inputMode="numeric"
                    placeholder="مثال: 85000"
                    value={customCapitalInput}
                    onChange={(e) =>
                      setCustomCapitalInput(e.target.value)
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 font-mono text-sm"
                  />

                  <span className="absolute left-4 top-3 text-xs text-slate-400 font-bold">
                    دج
                  </span>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <Home className="w-6 h-6 text-indigo-600" />
                  السؤال 2: ما هو مكان العمل المتاح لديك؟
                </h2>

                <p className="text-xs text-slate-500">
                  هل تملك خيار العمل من المنزل أو المحل أم يستهويك العمل أونلاين؟
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {workspaceOptions.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setWorkspace(item.label)}
                    className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between space-y-1 ${
                      workspace === item.label
                        ? "bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">
                        {item.label}
                      </span>

                      {workspace === item.label && (
                        <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                      )}
                    </div>

                    <span className="text-xs text-slate-500 font-normal">
                      {item.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-indigo-600" />
                  السؤال 3: في أي ولاية تقيم وتريد إطلاق المشروع؟
                </h2>

                <p className="text-xs text-slate-500">
                  حدد ولايتك لتطبيق شروط الطبيعة الجغرافية والسوق المحلي.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  اختر الولاية:
                </label>

                <select
                  value={wilayaId}
                  onChange={(e) => {
                    const idNum = Number(e.target.value);

                    const found = wilayasList.find(
                      (wilaya) => wilaya.id === idNum
                    );

                    setWilayaId(idNum);

                    if (found) {
                      setWilayaName(found.nameAr);
                    }

                    setCommuneId(0);
                    setCommuneName("");
                  }}
                  disabled={wilayasList.length === 0}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 text-sm font-bold bg-white disabled:bg-slate-100"
                >
                  {wilayasList.length === 0 ? (
                    <option value={16}>
                      جاري تحميل الولايات...
                    </option>
                  ) : (
                    wilayasList.map((wilaya) => (
                      <option
                        key={wilaya.id}
                        value={wilaya.id}
                      >
                        {wilaya.code} - {wilaya.nameAr} ({wilaya.nameFr})
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-indigo-600" />
                  السؤال 4: ما هي البلدية التابعة لولاية {wilayaName}؟
                </h2>

                <p className="text-xs text-slate-500">
                  اختر بلدية الإقامة لمطابقة العرض التجاري والكثافة السكانية.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  اختر البلدية:
                </label>

                <select
                  value={communeId}
                  onChange={(e) => {
                    const idNum = Number(e.target.value);

                    const found = communesList.find(
                      (commune) => commune.id === idNum
                    );

                    setCommuneId(idNum);
                    setCommuneName(
                      found?.nameAr || ""
                    );
                  }}
                  disabled={communesList.length === 0}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 text-sm font-bold bg-white disabled:bg-slate-100"
                >
                  {communesList.length === 0 ? (
                    <option value={0}>
                      جاري تحميل البلديات...
                    </option>
                  ) : (
                    communesList.map((commune) => (
                      <option
                        key={commune.id}
                        value={commune.id}
                      >
                        {commune.nameAr}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-indigo-600" />
                  السؤال 5: كم عدد الساعات المتاحة لديك يوميًا؟
                </h2>

                <p className="text-xs text-slate-500">
                  التفرغ اليومي يحدد نمط التشغيل الممكن للمشروع.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {hourOptions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setAvailableHours(item)}
                    className={`p-4 rounded-2xl border text-right font-bold text-sm transition-all flex items-center justify-between ${
                      availableHours === item
                        ? "bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span>{item}</span>

                    {availableHours === item && (
                      <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-indigo-600" />
                  السؤال 6: ما هي الخبرات والمهارات التي تمتلكها؟
                </h2>

                <p className="text-xs text-slate-500">
                  يمكنك اختيار أكثر من خيار واحد.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {skillOptions.map((item) => {
                  const isSelected =
                    skills.includes(item);

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        toggleSkill(item)
                      }
                      className={`p-3 rounded-xl border text-right font-bold text-xs transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span className="truncate">
                        {item}
                      </span>

                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <Laptop className="w-6 h-6 text-indigo-600" />
                  السؤال 7: ما هي طريقة العمل المفضلة لديك؟
                </h2>

                <p className="text-xs text-slate-500">
                  حدد التوجه الذي يستهويك أكثر.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {preferredModeOptions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      setPreferredMode(item)
                    }
                    className={`p-4 rounded-2xl border text-right font-bold text-sm transition-all flex items-center justify-between ${
                      preferredMode === item
                        ? "bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span>{item}</span>

                    {preferredMode === item && (
                      <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 8 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-amber-500" />
                  السؤال 8: ما هو مستوى المخاطرة المالي المقبول بالنسبة لك؟
                </h2>

                <p className="text-xs text-slate-500">
                  قدرتك على تحمل احتمالية الخسارة في التجربة.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {riskOptions.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() =>
                      setRiskLevel(item.label)
                    }
                    className={`p-5 rounded-2xl border text-right transition-all flex flex-col justify-between space-y-2 ${
                      riskLevel === item.label
                        ? "bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-base">
                        {item.label}
                      </span>

                      {riskLevel === item.label && (
                        <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                      )}
                    </div>

                    <span className="text-xs text-slate-500 leading-normal">
                      {item.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 9 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <Car className="w-6 h-6 text-indigo-600" />
                  السؤال 9: ما هي وسيلة النقل المتوفرة لديك؟
                </h2>

                <p className="text-xs text-slate-500">
                  تساعد في معرفة إمكانية المشاريع التي تتطلب التوزيع والتنقل.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {transportOptions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      setTransport(item)
                    }
                    className={`p-4 rounded-2xl border text-right font-bold text-sm transition-all flex items-center justify-between ${
                      transport === item
                        ? "bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span>{item}</span>

                    {transport === item && (
                      <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 10 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-indigo-600" />
                  السؤال 10: هل لديك مصدر دخل آخر حاليًا؟
                </h2>

                <p className="text-xs text-slate-500">
                  وجود دخل آخر يقلل الضغط المالي على المشروع.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {incomeOptions.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() =>
                      setExistingIncome(item.label)
                    }
                    className={`p-5 rounded-2xl border text-right transition-all flex flex-col justify-between space-y-1 ${
                      existingIncome === item.label
                        ? "bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-base">
                        {item.label}
                      </span>

                      {existingIncome === item.label && (
                        <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                      )}
                    </div>

                    <span className="text-xs text-slate-500">
                      {item.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 11 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <Target className="w-6 h-6 text-indigo-600" />
                  السؤال 11: ما هو هدفك المباشر من إطلاق هذا المشروع؟
                </h2>

                <p className="text-xs text-slate-500">
                  ما هي النتيجة التي ترغب بتطويرها وتنميتها في الأشهر القادمة؟
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {objectiveOptions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      setObjective(item)
                    }
                    className={`p-4 rounded-2xl border text-right font-bold text-sm transition-all flex items-center justify-between ${
                      objective === item
                        ? "bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span>{item}</span>

                    {objective === item && (
                      <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {errorMsg && (
            <div
              role="alert"
              className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold"
            >
              {errorMsg}
            </div>
          )}

          <div className="pt-6 border-t border-slate-200 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleBack}
              disabled={
                step === 1 || loading
              }
              className={`px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors ${
                step === 1 || loading
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-slate-200 text-slate-800 hover:bg-slate-300"
              }`}
            >
              <ArrowRight className="w-4 h-4" />
              السابق
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={loading}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-extrabold text-sm hover:from-indigo-700 hover:to-fuchsia-700 shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span>
                  جاري تحليل البيانات...
                </span>
              ) : step === 11 ? (
                <>
                  <span>
                    مشاهدة أفضل المشاريع المقترحة
                  </span>

                  <Sparkles className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>التالي</span>
                  <ArrowLeft className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
