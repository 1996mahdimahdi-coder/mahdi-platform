"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  DollarSign,
  Home,
  Building,
  Laptop,
  Car,
  Clock,
  Briefcase,
  AlertTriangle,
  Target,
  ShieldCheck,
  MapPin,
  HelpCircle
} from "lucide-react";

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
}

export default function TestPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // DB Data
  const [wilayasList, setWilayasList] = useState<WilayaItem[]>([]);
  const [communesList, setCommunesList] = useState<CommuneItem[]>([]);

  // Answers State
  const [selectedCapitalOption, setSelectedCapitalOption] = useState<number>(50000);
  const [customCapitalInput, setCustomCapitalInput] = useState<string>("");
  const [workspace, setWorkspace] = useState<string>("من المنزل");
  const [wilayaId, setWilayaId] = useState<number>(16); // Default 16 - Alger
  const [wilayaName, setWilayaName] = useState<string>("الجزائر العاصمة");
  const [communeName, setCommuneName] = useState<string>("الجزائر الوسطى");
  const [availableHours, setAvailableHours] = useState<string>("2–4 ساعات");
  const [skills, setSkills] = useState<string[]>([]);
  const [preferredMode, setPreferredMode] = useState<string>("لا أعرف");
  const [riskLevel, setRiskLevel] = useState<string>("متوسط");
  const [transport, setTransport] = useState<string>("لا أملك وسيلة نقل");
  const [existingIncome, setExistingIncome] = useState<string>("لا");
  const [objective, setObjective] = useState<string>("دخل إضافي");

  // Load Wilayas
  useEffect(() => {
    fetch("/api/wilayas")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.wilayas) {
          setWilayasList(data.wilayas);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Load Communes when Wilaya changes
  useEffect(() => {
    if (!wilayaId) return;
    fetch(`/api/wilayas?wilayaId=${wilayaId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.communes) {
          setCommunesList(data.communes);
          if (data.communes.length > 0) {
            setCommuneName(data.communes[0].nameAr);
          }
        }
      })
      .catch((err) => console.error(err));
  }, [wilayaId]);

  const toggleSkill = (skill: string) => {
    if (skill === "لا أملك خبرة محددة") {
      setSkills(["لا أملك خبرة محددة"]);
      return;
    }
    const filtered = skills.filter((s) => s !== "لا أملك خبرة محددة");
    if (filtered.includes(skill)) {
      setSkills(filtered.filter((s) => s !== skill));
    } else {
      setSkills([...filtered, skill]);
    }
  };

  const getEffectiveCapital = (): number => {
    if (customCapitalInput && !isNaN(Number(customCapitalInput)) && Number(customCapitalInput) > 0) {
      return Number(customCapitalInput);
    }
    return selectedCapitalOption;
  };

  const handleNext = () => {
    if (step < 11) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      submitAssessment();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const submitAssessment = async () => {
    setLoading(true);
    setErrorMsg("");

    const payload = {userId: JSON.parse(localStorage.getItem("nabda_user") || "null")?.id || null,
      capital: getEffectiveCapital(),
      workspace,
      wilayaId,
      wilayaName,
      communeName,
      availableHours,
      skills,
      preferredMode,
      riskLevel,
      transport,
      existingIncome,
      objective,
    };

    try {
      const res = await fetch("/api/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        // Save result in localStorage for display
        localStorage.setItem("nabda_last_result", JSON.stringify(data));
        router.push("/results");
      } else {
        setErrorMsg(data.error || "حدث خطأ أثناء تقييم البيانات.");
        setLoading(false);
      }
    } catch (err: any) {
      setErrorMsg("خطأ في الاتصال بالخادم.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      {/* Test Container Box */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Progress Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span className="font-extrabold text-lg text-white">اختبار الوضع المالي والمحلي</span>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800 text-indigo-400 border border-slate-700">
              السؤال {step} من 11
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-sky-400 h-full transition-all duration-300 ease-out"
              style={{ width: `${(step / 11) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6 sm:p-10 space-y-8">
          {/* QUESTION 1: CAPITAL */}
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
                {[
                  { label: "أقل من 20,000 دج (2 ملايين)", value: 15000 },
                  { label: "20,000 – 50,000 دج (2 إلى 5 ملايين)", value: 35000 },
                  { label: "50,000 – 100,000 دج (5 إلى 10 ملايين)", value: 75000 },
                  { label: "100,000 – 200,000 دج (10 إلى 20 مليون)", value: 150000 },
                  { label: "200,000 – 500,000 دج (20 إلى 50 مليون)", value: 350000 },
                  { label: "500,000 – 1,000,000 دج (50 إلى 100 مليون)", value: 750000 },
                  { label: "أكثر من 1,000,000 دج (أكثر من 100 مليون)", value: 1200000 },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setSelectedCapitalOption(item.value);
                      setCustomCapitalInput("");
                    }}
                    className={`p-4 rounded-2xl border text-right font-bold text-sm transition-all flex items-center justify-between ${
                      selectedCapitalOption === item.value && !customCapitalInput
                        ? "bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span>{item.label}</span>
                    {selectedCapitalOption === item.value && !customCapitalInput && (
                      <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                    )}
                  </button>
                ))}
              </div>

              {/* Custom Manual Capital Entry */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  أو أدخل مبلغاً مخصصاً بالدينار الجزائري (دج):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="مثال: 85000"
                    value={customCapitalInput}
                    onChange={(e) => setCustomCapitalInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 font-mono text-sm"
                  />
                  <span className="absolute left-4 top-3 text-xs text-slate-400 font-bold">دج</span>
                </div>
              </div>
            </div>
          )}

          {/* QUESTION 2: WORKSPACE */}
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
                {[
                  { label: "من المنزل", desc: "بدون مصاريف إيجار" },
                  { label: "محل أملكه", desc: "ملكية خاصة بالمبنى" },
                  { label: "محل بالإيجار", desc: "دفع بدل إيجار شهري" },
                  { label: "أونلاين", desc: "التشغيل عبر الإنترنت والشحن" },
                  { label: "متنقل", desc: "تقديم الخدمة في موقع الزبون" },
                  { label: "لا أعرف", desc: "الانفتاح على أي صيغة مناسبة" },
                ].map((item) => (
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
                      <span className="font-bold text-sm">{item.label}</span>
                      {workspace === item.label && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                    </div>
                    <span className="text-xs text-slate-500 font-normal">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* QUESTION 3: WILAYA */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-indigo-600" />
                  السؤال 3: في أي ولاية تقيم وتريد إطلاق المشروع؟
                </h2>
                <p className="text-xs text-slate-500">
                  حدد ولايتك لتطبيق شروط الطبيعة الجغرافية والسوق المحلي للـ 58 ولاية.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">اختر الولاية:</label>
                <select
                  value={wilayaId}
                  onChange={(e) => {
                    const idNum = Number(e.target.value);
                    setWilayaId(idNum);
                    const found = wilayasList.find((w) => w.id === idNum);
                    if (found) {
                      setWilayaName(found.nameAr);
                    }
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 text-sm font-bold bg-white"
                >
                  {wilayasList.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.code} - {w.nameAr} ({w.nameFr})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* QUESTION 4: COMMUNE */}
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
                <label className="block text-xs font-bold text-slate-700">اختر البلدية:</label>
                <select
                  value={communeName}
                  onChange={(e) => setCommuneName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 text-sm font-bold bg-white"
                >
                  {communesList.map((c) => (
                    <option key={c.id} value={c.nameAr}>
                      {c.nameAr}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* QUESTION 5: TIME */}
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
                {[
                  "أقل من ساعتين يوميًا",
                  "2–4 ساعات",
                  "4–6 ساعات",
                  "أكثر من 6 ساعات",
                  "دوام كامل",
                ].map((item) => (
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
                    {availableHours === item && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* QUESTION 6: SKILLS */}
          {step === 6 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-indigo-600" />
                  السؤال 6: ما هي الخبرات والمهارات التي تمتلكها؟
                </h2>
                <p className="text-xs text-slate-500">
                  يمكنك اختيار أكثر من خيار واحد (Multi-select).
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
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
                ].map((item) => {
                  const isSelected = skills.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleSkill(item)}
                      className={`p-3 rounded-xl border text-right font-bold text-xs transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span className="truncate">{item}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* QUESTION 7: PREFERRED MODE */}
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
                {[
                  "بيع منتجات",
                  "تقديم خدمات",
                  "مشروع أونلاين",
                  "مشروع محلي",
                  "مشروع من المنزل",
                  "مشروع يحتاج محل",
                  "لا أعرف",
                ].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setPreferredMode(item)}
                    className={`p-4 rounded-2xl border text-right font-bold text-sm transition-all flex items-center justify-between ${
                      preferredMode === item
                        ? "bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span>{item}</span>
                    {preferredMode === item && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* QUESTION 8: RISK LEVEL */}
          {step === 8 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-amber-500" />
                  السؤال 8: ما هو مستوى المخاطرة المالي المقبول بالنسبة لك؟
                </h2>
                <p className="text-xs text-slate-500">
                  قدرتك النفسية والمالية على تحمل احتمالية الخسارة في التجربة.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: "منخفض", desc: "الحفاظ الأقصى على رأس المال والأمان" },
                  { label: "متوسط", desc: "توازن معقول بين الأرباح والمخاطرة" },
                  { label: "مرتفع", desc: "الاستعداد لتجارب أسرع وأعلى ربحية" },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setRiskLevel(item.label)}
                    className={`p-5 rounded-2xl border text-right transition-all flex flex-col justify-between space-y-2 ${
                      riskLevel === item.label
                        ? "bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-base">{item.label}</span>
                      {riskLevel === item.label && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                    </div>
                    <span className="text-xs text-slate-500 leading-normal">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* QUESTION 9: TRANSPORT */}
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
                {[
                  "سيارة",
                  "دراجة نارية",
                  "نقل عمومي",
                  "لا أملك وسيلة نقل",
                ].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTransport(item)}
                    className={`p-4 rounded-2xl border text-right font-bold text-sm transition-all flex items-center justify-between ${
                      transport === item
                        ? "bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span>{item}</span>
                    {transport === item && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* QUESTION 10: EXISTING INCOME */}
          {step === 10 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-indigo-600" />
                  السؤال 10: هل لديك مصدر دخل آخر حاليًا؟
                </h2>
                <p className="text-xs text-slate-500">
                  وجود دخل آخر يقلل الضغط النفسي لمصروف المعيشة اليومي.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: "نعم", desc: "أملك وظيفة أو راتباً ثابتاً أو مداخيل أخرى" },
                  { label: "لا", desc: "المشروع سيكون المصدر الأساسي والوحيد للمعيشة" },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setExistingIncome(item.label)}
                    className={`p-5 rounded-2xl border text-right transition-all flex flex-col justify-between space-y-1 ${
                      existingIncome === item.label
                        ? "bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-base">{item.label}</span>
                      {existingIncome === item.label && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                    </div>
                    <span className="text-xs text-slate-500">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* QUESTION 11: OBJECTIVE */}
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
                {[
                  "دخل إضافي",
                  "مشروع رئيسي",
                  "ترك الوظيفة مستقبلًا",
                  "مشروع صغير قابل للتوسع",
                  "لا أعرف",
                ].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setObjective(item)}
                    className={`p-4 rounded-2xl border text-right font-bold text-sm transition-all flex items-center justify-between ${
                      objective === item
                        ? "bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span>{item}</span>
                    {objective === item && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          {/* Bottom Navigation Buttons */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1 || loading}
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
                <span>جاري تحليل البيانات...</span>
              ) : step === 11 ? (
                <>
                  <span>مشاهدة أفضل المشاريع المقترحة</span>
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
