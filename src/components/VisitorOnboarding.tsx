```tsx
"use client";

import { useEffect, useState } from "react";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Sparkles,
  ShieldCheck,
  Lock,
  ChevronLeft,
  CheckCircle2,
} from "lucide-react";

interface WilayaItem {
  id: number;
  code: string;
  nameAr: string;
  nameFr: string;
  areaType: string;
}

export default function VisitorOnboarding() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [wilayaId, setWilayaId] = useState<number | null>(null);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [wilayasList, setWilayasList] = useState<WilayaItem[]>([]);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("nabda_visitor");

      if (!stored) {
        setIsOpen(true);
        document.body.style.overflow = "hidden";

        fetch("/api/wilayas")
          .then((res) => {
            if (!res.ok) {
              throw new Error("Failed to load wilayas");
            }
            return res.json();
          })
          .then((data) => {
            if (data?.success && Array.isArray(data.wilayas)) {
              setWilayasList(data.wilayas);
            }
          })
          .catch((error) => {
            console.error("Wilayas loading error:", error);
          });
      }
    } catch (error) {
      console.error("Visitor onboarding error:", error);
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const validateStep1 = () => {
    setErrorMsg("");

    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const ageNumber = Number(age);

    if (cleanFirstName.length < 2) {
      setErrorMsg("الرجاء إدخال الاسم الأول بشكل صحيح");
      return false;
    }

    if (cleanLastName.length < 2) {
      setErrorMsg("الرجاء إدخال اللقب بشكل صحيح");
      return false;
    }

    if (!Number.isInteger(ageNumber) || ageNumber < 14 || ageNumber > 90) {
      setErrorMsg("الرجاء إدخال عمر صحيح بين 14 و90 سنة");
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    setErrorMsg("");

    if (wilayaId === null || wilayaId <= 0) {
      setErrorMsg("الرجاء اختيار ولايتك من القائمة");
      return false;
    }

    return true;
  };

  const validateStep3 = () => {
    setErrorMsg("");

    const cleanPhone = phone.trim();

    if (!cleanPhone) {
      setErrorMsg("رقم الهاتف إجباري لإكمال التسجيل");
      return false;
    }

    /*
      أرقام المحمول الجزائرية:
      05XXXXXXXX
      06XXXXXXXX
      07XXXXXXXX

      المجموع = 10 أرقام
      بدون مسافات أو رموز.
    */
    if (!/^0[567][0-9]{8}$/.test(cleanPhone)) {
      setErrorMsg(
        "أدخل رقم هاتف جزائري صحيح من 10 أرقام بدون مسافات، مثال: 0555123456"
      );
      return false;
    }

    return true;
  };

  const handleNext = () => {
    setErrorMsg("");

    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
      return;
    }

    if (step === 2) {
      if (validateStep2()) {
        setStep(3);
      }
    }
  };

  const handleBack = () => {
    setErrorMsg("");

    if (step === 2) {
      setStep(1);
      return;
    }

    if (step === 3) {
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    setErrorMsg("");

    if (!validateStep3()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/visitor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          age: Number(age),
          wilayaId,
          phone: phone.trim(),
          email: email.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data?.error || "حدث خطأ أثناء حفظ البيانات");
        return;
      }

      if (data?.success && data?.visitor) {
        localStorage.setItem(
          "nabda_visitor",
          JSON.stringify(data.visitor)
        );

        setIsOpen(false);
        document.body.style.overflow = "";
        return;
      }

      setErrorMsg(data?.error || "حدث خطأ أثناء حفظ البيانات");
    } catch (error) {
      console.error("Visitor submit error:", error);
      setErrorMsg("خطأ في الاتصال بالخادم. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  const selectedWilaya = wilayasList.find(
    (wilaya) => wilaya.id === wilayaId
  );

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn"
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[95vh] overflow-y-auto border-2 border-indigo-500/30">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 space-y-4 border-b-4 border-indigo-500">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-fuchsia-500 text-white flex items-center justify-center font-black shadow-md text-xs">
              NB
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-black">
                مرحباً بك في NABDA
              </h1>

              <p className="text-xs text-slate-300">
                ساعدنا في تقديم تجربة مخصصة لك
              </p>
            </div>
          </div>

          {/* PROGRESS */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 h-full transition-all duration-500"
              style={{
                width: `${(step / 3) * 100}%`,
              }}
            />
          </div>

          <div className="text-[10px] text-slate-400 font-mono text-center">
            الخطوة {step} من 3
          </div>
        </div>

        {/* BODY */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="text-center space-y-1">
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center justify-center gap-2">
                  <User className="w-5 h-5 text-indigo-600" />
                  أخبرنا عن نفسك
                </h2>

                <p className="text-xs text-slate-500">
                  نحتاج لمعلوماتك الأساسية لبناء تجربة مخصصة لك
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* FIRST NAME */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    الاسم الأول *
                  </label>

                  <input
                    type="text"
                    value={firstName}
                    onChange={(event) => {
                      setFirstName(event.target.value);
                      setErrorMsg("");
                    }}
                    placeholder="محمد"
                    autoComplete="given-name"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold"
                    autoFocus
                  />
                </div>

                {/* LAST NAME */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    اللقب *
                  </label>

                  <input
                    type="text"
                    value={lastName}
                    onChange={(event) => {
                      setLastName(event.target.value);
                      setErrorMsg("");
                    }}
                    placeholder="بن علي"
                    autoComplete="family-name"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold"
                  />
                </div>
              </div>

              {/* AGE */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  العمر *
                </label>

                <input
                  type="number"
                  min={14}
                  max={90}
                  step={1}
                  value={age}
                  onChange={(event) => {
                    setAge(event.target.value);
                    setErrorMsg("");
                  }}
                  placeholder="مثال: 28"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold font-mono"
                />

                <p className="text-[11px] text-slate-400">
                  العمر يساعدنا في تقديم مشاريع تتناسب مع مرحلتك العمرية
                </p>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="text-center space-y-1">
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center justify-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                  من أي ولاية أنت؟
                </h2>

                <p className="text-xs text-slate-500">
                  موقعك الجغرافي يساعدنا في اقتراح المشاريع المناسبة لولايتك
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">
                  اختر الولاية *
                </label>

                {wilayasList.length > 0 ? (
                  <select
                    value={wilayaId ?? ""}
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      setWilayaId(value > 0 ? value : null);
                      setErrorMsg("");
                    }}
                    className="w-full px-3 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold bg-white"
                  >
                    <option value="" disabled>
                      -- اختر ولايتك --
                    </option>

                    {wilayasList.map((wilaya) => (
                      <option key={wilaya.id} value={wilaya.id}>
                        {wilaya.code} - {wilaya.nameAr}
                        {wilaya.nameFr ? ` (${wilaya.nameFr})` : ""}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                    جاري تحميل قائمة الولايات...
                  </div>
                )}

                <p className="text-[11px] text-slate-400">
                  اختر ولايتك من القائمة
                </p>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="text-center space-y-1">
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  معلومات التواصل
                </h2>

                <p className="text-xs text-slate-500">
                  رقم الهاتف إجباري، والبريد الإلكتروني اختياري
                </p>
              </div>

              <div className="space-y-4">
                {/* PHONE */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-indigo-600" />
                    رقم الهاتف
                    <span className="text-rose-600">*</span>
                  </label>

                  <input
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={(event) => {
                      const onlyNumbers = event.target.value.replace(
                        /[^0-9]/g,
                        ""
                      );

                      setPhone(onlyNumbers.slice(0, 10));
                      setErrorMsg("");
                    }}
                    placeholder="0555123456"
                    maxLength={10}
                    autoComplete="tel"
                    className="w-full px-3 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold font-mono tracking-wider"
                    required
                  />

                  <p className="text-[11px] text-slate-400">
                    10 أرقام بدون مسافات — مثال: 0555123456
                  </p>

                  {phone.length > 0 && phone.length < 10 && (
                    <p className="text-[11px] text-amber-600 font-bold">
                      أدخل {10 - phone.length} أرقام إضافية
                    </p>
                  )}
                </div>

                {/* EMAIL */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-indigo-600" />
                    البريد الإلكتروني
                    <span className="text-slate-400">(اختياري)</span>
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setErrorMsg("");
                    }}
                    placeholder="name@example.com"
                    autoComplete="email"
                    className="w-full px-3 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold"
                  />
                </div>

                {/* SECURITY */}
                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-[11px] text-indigo-800 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />

                  <span>
                    بياناتك محمية ونستخدمها فقط لتخصيص تجربتك داخل NABDA.
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
                  <Lock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />

                  <span>
                    رقم الهاتف مطلوب لإكمال التسجيل، أما البريد الإلكتروني
                    فهو اختياري ويمكنك تركه فارغاً.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ERROR */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold animate-fadeIn">
              {errorMsg}
            </div>
          )}

          {/* SUMMARY */}
          {step === 3 && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-500 block">
                ملخص بياناتك:
              </span>

              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <div className="flex items-center gap-1 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>
                    الاسم: {firstName} {lastName}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>العمر: {age} سنة</span>
                </div>

                <div className="flex items-center gap-1 text-slate-700 col-span-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />

                  <span>
                    الولاية:{" "}
                    {selectedWilaya?.nameAr || "غير محددة"}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-slate-700 col-span-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />

                  <span>الهاتف: {phone || "غير محدد"}</span>
                </div>

                {email.trim() && (
                  <div className="flex items-center gap-1 text-slate-700 col-span-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />

                    <span>البريد: {email}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* NAVIGATION */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors disabled:opacity-50"
              >
                السابق
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={step === 2 && wilayasList.length === 0}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-extrabold text-sm hover:from-indigo-700 hover:to-fuchsia-700 transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>التالي</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-extrabold text-sm hover:from-indigo-700 hover:to-fuchsia-700 transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span>جاري الحفظ...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>دخول NABDA مجاناً</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```
