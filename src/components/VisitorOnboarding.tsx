"use client";

import { useEffect, useState } from "react";
import { User, MapPin, Phone, Mail, Sparkles, ShieldCheck, Lock, ChevronLeft, CheckCircle2 } from "lucide-react";

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
  const [age, setAge] = useState<string>("");
  const [wilayaId, setWilayaId] = useState<number | null>(null);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [wilayasList, setWilayasList] = useState<WilayaItem[]>([]);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    // Check if visitor has already onboarded
    try {
      const stored = localStorage.getItem("nabda_visitor");
      if (!stored) {
        setIsOpen(true);
        document.body.style.overflow = "hidden";
        // Load wilayas list
        fetch("/api/wilayas")
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.wilayas) {
              setWilayasList(data.wilayas);
            }
          })
          .catch(console.error);
      }
    } catch (e) {
      console.error(e);
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const validateStep1 = () => {
    if (!firstName.trim() || firstName.trim().length < 2) {
      setErrorMsg("الرجاء إدخال الاسم الأول (حرفين على الأقل)");
      return false;
    }
    if (!lastName.trim() || lastName.trim().length < 2) {
      setErrorMsg("الرجاء إدخال اللقب (حرفين على الأقل)");
      return false;
    }
    const ageNum = Number(age);
    if (!ageNum || ageNum < 14 || ageNum > 90) {
      setErrorMsg("الرجاء إدخال عمر صحيح بين 14 و 90 سنة");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!wilayaId) {
      setErrorMsg("الرجاء اختيار ولايتك من القائمة");
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
    } else if (step === 2) {
      if (validateStep2()) {
        setStep(3);
      }
    }
  };

  const handleBack = () => {
    setErrorMsg("");
    if (step > 1) {
      setStep((step - 1) as 1 | 2);
    }
  };

  const handleSubmit = async () => {
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/visitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          age: Number(age),
          wilayaId,
          phone: phone.trim() || undefined,
          email: email.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.visitor) {
        // Save visitor to localStorage
        localStorage.setItem("nabda_visitor", JSON.stringify(data.visitor));
        setIsOpen(false);
        document.body.style.overflow = "";
      } else {
        setErrorMsg(data.error || "حدث خطأ أثناء حفظ البيانات");
      }
    } catch (e: any) {
      setErrorMsg("خطأ في الاتصال بالخادم. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[95vh] overflow-y-auto border-2 border-indigo-500/30">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 space-y-3 border-b-4 border-indigo-500">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-fuchsia-500 text-white flex items-center justify-center font-black shadow-md text-xs">
              NB
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black">مرحباً بك في NABDA</h1>
              <p className="text-xs text-slate-300">ساعدنا في تقديم تجربة مخصصة لك</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden pt-2">
            <div
              className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 h-full transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          <div className="text-[10px] text-slate-400 font-mono text-center">
            الخطوة {step} من 3
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* STEP 1: NAME & AGE */}
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
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">الاسم الأول</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="محمد"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm font-bold"
                    autoFocus
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">اللقب</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="بن علي"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">العمر</label>
                <input
                  type="number"
                  min="14"
                  max="90"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="مثال: 28"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm font-bold font-mono"
                />
                <p className="text-[11px] text-slate-400">
                  العمر يساعدنا في تقديم مشاريع تتناسب مع مرحلتك العمرية
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: WILAYA */}
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
                <label className="text-xs font-bold text-slate-700">اختر الولاية:</label>
                <select
                  value={wilayaId || ""}
                  onChange={(e) => setWilayaId(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm font-bold bg-white max-h-60"
                  size={Math.min(8, wilayasList.length)}
                >
                  <option value="" disabled>
                    -- اختر ولايتك --
                  </option>
                  {wilayasList.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.code} - {w.nameAr} ({w.nameFr})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400">
                  تم تغطية جميع الولايات الـ 58 رسمياً
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: CONTACT (OPTIONAL) */}
          {step === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="text-center space-y-1">
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  معلومات إضافية (اختيارية)
                </h2>
                <p className="text-xs text-slate-500">
                  بريدك أو رقم هاتفك يساعدان في حفظ نتائجك بشكل آمن
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    رقم الهاتف (اختياري)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0555 123 456"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm font-bold font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    البريد الإلكتروني (اختياري)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-sm font-bold"
                  />
                </div>

                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-[11px] text-indigo-800 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>
                    بياناتك مشفّرة ومحمية بالكامل. لن نشاركها مع أي طرف ثالث.
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
                  <Lock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <span>
                    يمكنك تخطي هذه الخطوة والمتابعة مباشرة. سنحفظ نتائجك في متصفحك.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold animate-fadeIn">
              {errorMsg}
            </div>
          )}

          {/* Success Summary at step 3 */}
          {step === 3 && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-500 block">ملخص بياناتك:</span>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <div className="flex items-center gap-1 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>الاسم: {firstName} {lastName}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>العمر: {age} سنة</span>
                </div>
                <div className="flex items-center gap-1 text-slate-700 col-span-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>
                    الولاية: {wilayasList.find((w) => w.id === wilayaId)?.nameAr}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors"
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
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-extrabold text-sm hover:from-indigo-700 hover:to-fuchsia-700 transition-all shadow-md flex items-center gap-1.5"
              >
                <span>التالي</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-extrabold text-sm hover:from-indigo-700 hover:to-fuchsia-700 transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50"
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
