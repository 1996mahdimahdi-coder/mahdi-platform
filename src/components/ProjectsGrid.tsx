"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  DollarSign,
  Home,
  Laptop,
  AlertTriangle,
  ChevronLeft,
  Trophy,
  TrendingUp,
  CheckCircle2,
  Award,
} from "lucide-react";

type Project = {
  id: number;
  projectId: string;
  projectName: string;
  category: string;
  description: string;
  riskLevel: string;
  minCapital: number;
  recommendedCapital: number;
  homeBased: boolean;
  onlinePossible: boolean;
  workLocation: string;
  skillLevel: string;
  legalStatus: string;
};

const BEST_PROJECTS_DZ = [
  {
    projectId: "phone-accessories",
    title: "تجارة إكسسوارات الهواتف",
    category: "تجارة",
    successRate: "93%",
    avgProfit: "40,000 - 80,000 دج شهرياً",
    reason: "الطلب الأكثر استقراراً",
    emoji: "📱",
    stat: "60M+ مستخدم في الجزائر",
  },
  {
    projectId: "home-sweets-bakery",
    title: "صناعة الحلويات والمنسف المنزلي",
    category: "صناعة تقليدية",
    successRate: "88%",
    avgProfit: "30,000 - 70,000 دج شهرياً",
    reason: "مواسم قوية (رمضان، أعراس)",
    emoji: "🧁",
    stat: "كاش مباشر لا يحتاج رأس مال ضخم",
  },
  {
    projectId: "perfume-oils-refill",
    title: "تركيب وبيع العطور الفاخرة",
    category: "تجارة",
    successRate: "91%",
    avgProfit: "50,000 - 100,000 دج شهرياً",
    reason: "هامش ربح يتجاوز 150%",
    emoji: "🧴",
    stat: "سوق متنامٍ بقوة",
  },
  {
    projectId: "custom-printing-gifts",
    title: "الطباعة الحرارية وتخصيص الهدايا",
    category: "صناعة تقليدية",
    successRate: "89%",
    avgProfit: "40,000 - 90,000 دج شهرياً",
    reason: "طلبيات بالجملة من المؤسسات",
    emoji: "🎁",
    stat: "طلبيات بالجملة من المؤسسات",
  },
  {
    projectId: "car-detailing-mobile",
    title: "غسيل السيارات المتنقل",
    category: "خدمات",
    successRate: "87%",
    avgProfit: "35,000 - 75,000 دج شهرياً",
    reason: "خدمة مطلوبة أمام المنازل",
    emoji: "🚗",
    stat: "هامش ربح صافي 70%",
  },
  {
    projectId: "product-photography",
    title: "تصوير المنتجات للمتاجر",
    category: "خدمات",
    successRate: "92%",
    avgProfit: "50,000 - 120,000 دج شهرياً",
    reason: "اشتراكات شهرية ثابتة",
    emoji: "📸",
    stat: "بدون مخزون وبدون مخاطرة",
  },
];

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ProjectsGridInner projects={projects} />
    </Suspense>
  );
}

function ProjectsGridInner({ projects }: { projects: Project[] }) {
  const searchParams = useSearchParams();
  const qParam = searchParams.get("q") ?? "";
  const [searchTerm, setSearchTerm] = useState(qParam);
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [selectedRisk, setSelectedRisk] = useState("الكل");
  const [maxCapital, setMaxCapital] = useState<string>("");
  const [homeBasedOnly, setHomeBasedOnly] = useState(false);
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [workLocation, setWorkLocation] = useState("الكل");
  const [skillLevel, setSkillLevel] = useState("الكل");
  const [legalStatus, setLegalStatus] = useState("الكل");

  const filteredProjects = projects
    .filter((p) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        p.projectName.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
      );
    })
    .filter((p) => {
      if (selectedCategory !== "الكل" && p.category !== selectedCategory) return false;
      if (selectedRisk !== "الكل" && p.riskLevel !== selectedRisk) return false;
      if (maxCapital) {
        const capNum = parseInt(maxCapital, 10);
        if (!isNaN(capNum) && p.minCapital > capNum) return false;
      }
      if (workLocation !== "الكل" && p.workLocation !== workLocation) return false;
      if (skillLevel !== "الكل" && p.skillLevel !== skillLevel) return false;
      if (legalStatus !== "الكل" && p.legalStatus !== legalStatus) return false;
      if (homeBasedOnly && !p.homeBased) return false;
      if (onlineOnly && !p.onlinePossible) return false;
      return true;
    });

  return (
    <div className="space-y-8">
      {!qParam && !searchTerm && (
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 text-white space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>الأكثر نجاحاً في السوق الجزائري 2026</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black mt-2 leading-tight">
                أفضل مشاريع ناجحة في الجزائر
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                قائمة منتقاة من المشاريع التي حققت أعلى معدلات نجاح فعلية على أرض الواقع لدى الشباب الجزائري، مع متوسط الأرباح المتوقعة
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <Award className="w-4 h-4 text-amber-400" />
              <span>مرتبة حسب: % نسبة النجاح + سرعة الدوران</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BEST_PROJECTS_DZ.map((item) => (
              <Link
                key={item.projectId}
                href={`/projects/${item.projectId}`}
                className="group bg-slate-800/80 p-5 rounded-2xl border border-slate-700 hover:border-amber-500 hover:bg-slate-800 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{item.emoji}</span>
                    <span className="text-[10px] font-bold text-slate-300 bg-slate-900/80 border border-slate-700 px-2 py-0.5 rounded-full">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-amber-300 group-hover:text-amber-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {item.reason}
                  </p>
                </div>
                <div className="space-y-2 pt-3 border-t border-slate-700/60">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="flex items-center gap-1 text-indigo-300">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      نسبة النجاح
                    </span>
                    <span className="text-indigo-300 font-mono">{item.successRate}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="flex items-center gap-1 text-amber-300">
                      <TrendingUp className="w-3.5 h-3.5" />
                      متوسط الربح
                    </span>
                    <span className="text-amber-300 font-mono">{item.avgProfit}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 italic pt-1">{item.stat}</p>
                </div>
                <div className="pt-2 flex items-center gap-1 text-xs font-extrabold text-indigo-400 group-hover:text-indigo-300">
                  <span>مشاهدة دراسة الجدوى الكاملة</span>
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-[11px] text-slate-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              نسب النجاح ومعدلات الأرباح المذكورة أعلاه مبنية على متوسط دراسات ميدانية وتجارب ناجحة في عدة ولايات جزائرية، ولا تُعد ضماناً فردياً. النتيجة تعتمد على الالتزام والتسويق المحلي.
            </span>
          </div>
        </section>
      )}

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
            <input
              type="text"
              placeholder="ابحث عن اسم مشروع (مثال: إكسسوارات، غسيل، ملابس...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm font-bold"
            />
          </div>
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm font-bold bg-white"
            >
              <option value="الكل">كل التصنيفات</option>
              <option value="تجارة">تجارة</option>
              <option value="خدمات">خدمات</option>
              <option value="أونلاين">أونلاين</option>
              <option value="صناعة تقليدية">صناعة تقليدية / حرف</option>
              <option value="زراعة">زراعة</option>
              <option value="تعليم">تعليم وتدريب</option>
            </select>
          </div>
          <div>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-xs sm:text-sm font-bold bg-white"
            >
              <option value="الكل">كل مستويات المخاطرة</option>
              <option value="منخفض">منخفضة</option>
              <option value="متوسطة">متوسطة</option>
              <option value="مرتفع">مرتفعة</option>
            </select>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs font-bold text-slate-700">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={homeBasedOnly}
              onChange={(e) => setHomeBasedOnly(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span className="flex items-center gap-1">
              <Home className="w-3.5 h-3.5 text-slate-500" />
              مشاريع من المنزل فقط
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={onlineOnly}
              onChange={(e) => setOnlineOnly(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span className="flex items-center gap-1">
              <Laptop className="w-3.5 h-3.5 text-slate-500" />
              مشاريع أونلاين فقط
            </span>
          </label>
          <select
            value={workLocation}
            onChange={(e) => setWorkLocation(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
          >
            <option value="الكل">كل الأماكن</option>
            <option value="من المنزل">من المنزل</option>
            <option value="محل">محل</option>
            <option value="ورشة">ورشة</option>
            <option value="مكتب">مكتب</option>
            <option value="متنقل">متنقل</option>
            <option value="أونلاين">أونلاين</option>
          </select>
          <select
            value={skillLevel}
            onChange={(e) => setSkillLevel(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
          >
            <option value="الكل">كل مستويات المهارة</option>
            <option value="بدون مهارة">بدون مهارة</option>
            <option value="بسيطة">مهارة بسيطة</option>
            <option value="متوسطة">مهارة متوسطة</option>
            <option value="احترافية">مهارة احترافية</option>
            <option value="شهادة/تأهيل مطلوب">شهادة/تأهيل مطلوب</option>
          </select>
          <select
            value={legalStatus}
            onChange={(e) => setLegalStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
          >
            <option value="الكل">كل الأوضاع القانونية</option>
            <option value="غير مقنن">غير مقنن</option>
            <option value="سجل تجاري">سجل تجاري مطلوب</option>
            <option value="ترخيص/اعتماد">ترخيص/اعتماد</option>
            <option value="مهنة منظمة">مهنة منظمة</option>
            <option value="شروط صحية">شروط صحية</option>
            <option value="شروط بيئية">شروط بيئية</option>
          </select>
          <div className="flex items-center gap-2 ms-auto">
            <span className="text-slate-400">الحد الأقصى لرأس المال:</span>
            <input
              type="number"
              placeholder="مثال: 100000"
              value={maxCapital}
              onChange={(e) => setMaxCapital(e.target.value)}
              className="w-32 px-3 py-1.5 rounded-lg border border-slate-300 font-mono text-xs"
            />
            <span className="text-slate-400">دج</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
        <span>النتائج: {filteredProjects.length} مشروع</span>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
          <p className="text-slate-600 text-sm font-bold">لم نجد مشاريع تتطابق مع خيارات التصفية الحالية.</p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("الكل");
              setSelectedRisk("الكل");
              setMaxCapital("");
              setHomeBasedOnly(false);
              setOnlineOnly(false);
              setWorkLocation("الكل");
              setSkillLevel("الكل");
              setLegalStatus("الكل");
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
          >
            إعادة ضبط الفلاتر
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-xl hover:border-indigo-400 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-bold">
                    {p.category}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      p.riskLevel === "منخفض"
                        ? "bg-indigo-100 text-indigo-800"
                        : p.riskLevel === "متوسطة"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    مخاطرة: {p.riskLevel}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {p.projectName}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {p.description}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">رأس المال الموصى به:</span>
                  <span className="font-extrabold text-indigo-700 text-sm font-mono">
                    {p.recommendedCapital?.toLocaleString()} دج
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>الأدنى للبداية: {p.minCapital?.toLocaleString()} دج</span>
                  <span>{p.homeBased ? "من المنزل" : "محل / خروج"}</span>
                </div>
                <Link
                  href={`/projects/${p.projectId}`}
                  className="w-full py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold text-xs hover:bg-indigo-600 hover:text-white transition-colors flex items-center justify-center gap-1 mt-2"
                >
                  <span>عرض التحليل الكامل والحاسبة</span>
                  <ChevronLeft className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
