"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Plus,
  Edit,
  Trash2,
  BarChart3,
  Sliders,
  Users,
  Compass,
  CheckCircle2,
  X,
  FileText,
  Library,
  FileBadge2
} from "lucide-react";
import { getCsrfToken } from "@/lib/clientCsrf";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"stats" | "projects" | "weights">("stats");

  // Stats State
  const [stats, setStats] = useState<any>(null);

  // Projects State
  const [projects, setProjects] = useState<any[]>([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);

  // Weights State
  const [weights, setWeights] = useState<any>({
    financialWeight: 25,
    personalWeight: 15,
    workspaceWeight: 10,
    locationWeight: 15,
    riskWeight: 10,
    startabilityWeight: 10,
    scalabilityWeight: 10,
    timeWeight: 5,
  });
  const [weightsSaved, setWeightsSaved] = useState(false);

  // Form State for Project Add/Edit
  const [projForm, setProjForm] = useState({
    projectId: "",
    projectName: "",
    category: "تجارة",
    description: "",
    minCapital: 30000,
    recommendedCapital: 100000,
    maxCapital: 300000,
    riskLevel: "متوسطة",
    homeBased: true,
    requiresShop: false,
    onlinePossible: true,
    transportRequired: false,
    timeRequired: "2-4 ساعات",
    difficulty: "سهل",
    scalability: "مرتفعة",
  });

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const meRes = await fetch("/api/auth/me", {
          cache: "no-store",
        });

        if (meRes.status === 401 || !meRes.ok) {
          router.replace("/login");
          return;
        }

        const meData = await meRes.json();

        if (!meData.success || !meData.user) {
          router.replace("/login");
          return;
        }

        if (meData.user.role !== "admin") {
          router.replace("/dashboard");
          return;
        }

        if (cancelled) return;
        setUser(meData.user);
        fetchStats();
        fetchProjects();
        fetchWeights();
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          router.replace("/login");
        }
      }
    };

    init();

    return () => {
      cancelled = true;
    };
  }, [router]);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.status === 401) {
        router.replace("/login");
        return;
      }
      if (res.status === 403) {
        router.replace("/dashboard");
        return;
      }
      const data = await res.json();
      if (data.success) setStats(data.stats);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.status === 401) {
        router.replace("/login");
        return;
      }
      if (res.status === 403) {
        router.replace("/dashboard");
        return;
      }
      const data = await res.json();
      if (data.success) setProjects(data.projects || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchWeights = async () => {
    try {
      const res = await fetch("/api/admin/weights");
      if (res.status === 401) {
        router.replace("/login");
        return;
      }
      if (res.status === 403) {
        router.replace("/dashboard");
        return;
      }
      const data = await res.json();
      if (data.success && data.weights) setWeights(data.weights);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveWeights = async () => {
    try {
      const csrfToken = await getCsrfToken();
      const res = await fetch("/api/admin/weights", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-csrf-token": csrfToken },
        body: JSON.stringify(weights),
      });
      if (res.status === 401) {
        router.replace("/login");
        return;
      }
      if (res.status === 403) {
        router.replace("/dashboard");
        return;
      }
      const data = await res.json();
      if (data.success) {
        setWeightsSaved(true);
        setTimeout(() => setWeightsSaved(false), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm("هل أنت تأكد من إرادة حذف هذا المشروع؟")) return;
    try {
      const csrfToken = await getCsrfToken();
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE", headers: { "x-csrf-token": csrfToken } });
      if (res.status === 401) {
        router.replace("/login");
        return;
      }
      if (res.status === 403) {
        router.replace("/dashboard");
        return;
      }
      const data = await res.json();
      if (data.success) fetchProjects();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveProjectForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingProject ? "PUT" : "POST";
      const url = editingProject ? `/api/projects/${editingProject.id}` : "/api/projects";

      const payload = {
        ...projForm,
        skillsRequired: ["البيع", "التسويق"],
        equipment: [{ item: "أدوات أساسية", cost: 10000 }],
        initialStock: 20000,
        fixedCosts: 3000,
        variableCostsPercent: 10,
        pricingMethod: "هامش ربح ثابت",
        profitFormula: "الإيرادات - التكاليف",
        breakEvenFormula: "التكاليف / هامش القطعة",
        risks: ["المنافسة المحلية"],
        advantages: ["سهولة البداية"],
        disadvantages: ["تطلب الجهد"],
        launchPlan: [
          { week: "الأسبوع 1", title: "دراسة السوق", tasks: ["حصر الموردين"] },
        ],
      };

      const csrfToken = await getCsrfToken();
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "x-csrf-token": csrfToken },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        router.replace("/login");
        return;
      }
      if (res.status === 403) {
        router.replace("/dashboard");
        return;
      }

      const data = await res.json();
      if (data.success) {
        setShowProjectModal(false);
        setEditingProject(null);
        fetchProjects();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">لوحة تحكم Admin – NABDA</h1>
            <p className="text-xs text-slate-400">إدارة المشاريع، تعديل أوزان خوارزمية التقييم والإحصائيات</p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-2xl border border-slate-700 text-xs font-bold">
          <button
            onClick={() => setActiveTab("stats")}
            className={`px-4 py-2 rounded-xl transition-colors ${
              activeTab === "stats" ? "bg-amber-500 text-slate-950 font-black" : "text-slate-300 hover:text-white"
            }`}
          >
            الإحصائيات
          </button>

          <button
            onClick={() => setActiveTab("projects")}
            className={`px-4 py-2 rounded-xl transition-colors ${
              activeTab === "projects" ? "bg-amber-500 text-slate-950 font-black" : "text-slate-300 hover:text-white"
            }`}
          >
            إدارة المشاريع
          </button>

          <button
            onClick={() => setActiveTab("weights")}
            className={`px-4 py-2 rounded-xl transition-colors ${
              activeTab === "weights" ? "bg-amber-500 text-slate-950 font-black" : "text-slate-300 hover:text-white"
            }`}
          >
            أوزان التقييم (Weights)
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/admin/library"
            className="px-4 py-2.5 rounded-xl bg-slate-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md hover:bg-slate-600 transition-colors"
          >
            <Library className="w-4 h-4" />
            📚 مكتبة NABDA
          </Link>

          <Link
            href="/admin/sources"
            className="px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md hover:bg-amber-400 transition-colors"
          >
            <FileText className="w-4 h-4" />
            إدارة المصادر
          </Link>

          <Link
            href="/admin/no-capital/studies"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md hover:bg-indigo-700 transition-colors"
          >
            <FileBadge2 className="w-4 h-4" />
            📚 الدراسات المدفوعة
          </Link>

          <Link
            href="/admin/projects/studies"
            className="px-4 py-2.5 rounded-xl bg-fuchsia-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md hover:bg-fuchsia-700 transition-colors"
          >
            <FileBadge2 className="w-4 h-4" />
            دراسات مشاريع رأس المال
          </Link>
        </div>
      </div>

      {/* TAB 1: STATS OVERVIEW */}
      {activeTab === "stats" && stats && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-xs font-bold">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-slate-400 block">إجمالي الزوار المسجلين</span>
              <span className="text-3xl font-black text-indigo-600 font-mono">{stats.visitorsTotal || 0}</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-slate-400 block">إجمالي المستخدمين</span>
              <span className="text-3xl font-black text-slate-900 font-mono">{stats.usersTotal}</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-slate-400 block">إجمالي التقييمات</span>
              <span className="text-3xl font-black text-slate-900 font-mono">{stats.testsTotal}</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-slate-400 block">عدد المشاريع</span>
              <span className="text-3xl font-black text-slate-900 font-mono">{stats.projectsTotal}</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-slate-400 block">عدد الولايات المغطاة</span>
              <span className="text-3xl font-black text-slate-900 font-mono">{stats.wilayasTotal}</span>
            </div>
          </div>

          {/* VISITOR DEMOGRAPHICS */}
          {(stats.ageStats && Object.keys(stats.ageStats).length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Age Groups */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  توزيع الفئات العمرية للزوار
                </h3>
                <div className="space-y-2 text-xs">
                  {Object.entries(stats.ageStats || {}).map(([key, val]: any) => (
                    <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 font-bold">
                      <span className="text-slate-800">{key}</span>
                      <span className="text-indigo-600 font-mono">{val} زائر</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Wilayas */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3">
                  أكثر الولايات تسجيلاً للزوار
                </h3>
                <div className="space-y-2 text-xs">
                  {Object.entries(stats.wilayaStats || {})
                    .sort((a: any, b: any) => b[1] - a[1])
                    .slice(0, 8)
                    .map(([key, val]: any) => (
                      <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 font-bold">
                        <span className="text-slate-800">{key}</span>
                        <span className="text-amber-600 font-mono">{val} زائر</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Searched Capital Categories */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3">
                أكثر فئات رؤوس الأموال إقبالاً بالاختبارات
              </h3>

              <div className="space-y-2 text-xs">
                {Object.entries(stats.capitalStats || {}).map(([key, val]: any) => (
                  <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 font-bold">
                    <span className="text-slate-800">{key}</span>
                    <span className="text-indigo-600 font-mono">{val} اختبار</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Most Suggested Top Projects */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3">
                أكثر المشاريع المقترحة في المرتبة الأولى
              </h3>

              <div className="space-y-2 text-xs">
                {Object.entries(stats.topProjectStats || {}).map(([key, val]: any) => (
                  <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 font-bold">
                    <span className="text-slate-800">{key}</span>
                    <span className="text-amber-600 font-mono">{val} مرة (#1)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROJECTS MANAGEMENT */}
      {activeTab === "projects" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900">
              قائمة المشاريع ({projects.length})
            </h2>

            <button
              onClick={() => {
                setEditingProject(null);
                setProjForm({
                  projectId: `proj-${Date.now()}`,
                  projectName: "",
                  category: "تجارة",
                  description: "",
                  minCapital: 30000,
                  recommendedCapital: 100000,
                  maxCapital: 300000,
                  riskLevel: "متوسطة",
                  homeBased: true,
                  requiresShop: false,
                  onlinePossible: true,
                  transportRequired: false,
                  timeRequired: "2-4 ساعات",
                  difficulty: "سهل",
                  scalability: "مرتفعة",
                });
                setShowProjectModal(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              إضافة مشروع جديد
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-4">اسم المشروع</th>
                  <th className="p-4">التصنيف</th>
                  <th className="p-4">رأس المال الموصى به</th>
                  <th className="p-4">المخاطرة</th>
                  <th className="p-4">من المنزل؟</th>
                  <th className="p-4 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-900">{p.projectName}</td>
                    <td className="p-4">{p.category}</td>
                    <td className="p-4 font-mono font-bold text-indigo-700">
                      {p.recommendedCapital?.toLocaleString()} دج
                    </td>
                    <td className="p-4">{p.riskLevel}</td>
                    <td className="p-4">{p.homeBased ? "نعم" : "لا"}</td>
                    <td className="p-4 text-center space-x-2 space-x-reverse">
                      <button
                        onClick={() => {
                          setEditingProject(p);
                          setProjForm({ ...p });
                          setShowProjectModal(true);
                        }}
                        className="p-1.5 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100"
                        title="تعديل"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteProject(p.id)}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-800 hover:bg-rose-100"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SCORING WEIGHTS EDITOR */}
      {activeTab === "weights" && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 max-w-2xl">
          <div className="space-y-1 border-b border-slate-100 pb-4">
            <h2 className="text-xl font-black text-slate-900">تعديل أوزان معايير التقييم الـ 8</h2>
            <p className="text-xs text-slate-500">
              يمكنك تغيير أوزان المحاور المباشرة بدون الحاجة لإعادة كتابة الكود البرمجي للموقع. (المجموع = 100)
            </p>
          </div>

          <div className="space-y-4 text-xs font-bold">
            <div className="grid grid-cols-2 items-center gap-4">
              <label className="text-slate-800">1. الملاءمة المالية (Financial Weight):</label>
              <input
                type="number"
                value={weights.financialWeight}
                onChange={(e) => setWeights({ ...weights, financialWeight: Number(e.target.value) })}
                className="px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-2 items-center gap-4">
              <label className="text-slate-800">2. الملاءمة الشخصية والخبرة (Personal Weight):</label>
              <input
                type="number"
                value={weights.personalWeight}
                onChange={(e) => setWeights({ ...weights, personalWeight: Number(e.target.value) })}
                className="px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-2 items-center gap-4">
              <label className="text-slate-800">3. ملاءمة مكان العمل (Workspace Weight):</label>
              <input
                type="number"
                value={weights.workspaceWeight}
                onChange={(e) => setWeights({ ...weights, workspaceWeight: Number(e.target.value) })}
                className="px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-2 items-center gap-4">
              <label className="text-slate-800">4. ملاءمة المنطقة والولاية (Location Weight):</label>
              <input
                type="number"
                value={weights.locationWeight}
                onChange={(e) => setWeights({ ...weights, locationWeight: Number(e.target.value) })}
                className="px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-2 items-center gap-4">
              <label className="text-slate-800">5. ملاءمة المخاطرة (Risk Weight):</label>
              <input
                type="number"
                value={weights.riskWeight}
                onChange={(e) => setWeights({ ...weights, riskWeight: Number(e.target.value) })}
                className="px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-2 items-center gap-4">
              <label className="text-slate-800">6. سهولة الانطلاق والبداية (Startability Weight):</label>
              <input
                type="number"
                value={weights.startabilityWeight}
                onChange={(e) => setWeights({ ...weights, startabilityWeight: Number(e.target.value) })}
                className="px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-2 items-center gap-4">
              <label className="text-slate-800">7. قابلية التوسع والنمو (Scalability Weight):</label>
              <input
                type="number"
                value={weights.scalabilityWeight}
                onChange={(e) => setWeights({ ...weights, scalabilityWeight: Number(e.target.value) })}
                className="px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-2 items-center gap-4">
              <label className="text-slate-800">8. توافق الساعات والوقت (Time Weight):</label>
              <input
                type="number"
                value={weights.timeWeight}
                onChange={(e) => setWeights({ ...weights, timeWeight: Number(e.target.value) })}
                className="px-3 py-2 rounded-xl border border-slate-300 font-mono text-sm"
              />
            </div>

            {weightsSaved && (
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                <span>تم حفظ الأوزان الجديدة بنجاح!</span>
              </div>
            )}

            <button
              onClick={handleSaveWeights}
              className="w-full py-3 rounded-xl bg-slate-900 text-white font-extrabold text-xs hover:bg-slate-800 transition-colors shadow-md"
            >
              حفظ وتطبيق الأوزان الجديدة
            </button>
          </div>
        </div>
      )}

      {/* PROJECT ADD / EDIT MODAL */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">
                {editingProject ? "تعديل بيانات المشروع" : "إضافة مشروع جديد لقاعدة البيانات"}
              </h3>
              <button
                onClick={() => setShowProjectModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProjectForm} className="space-y-4 text-xs font-bold">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700">معرف المشروع (Slug):</label>
                  <input
                    type="text"
                    required
                    value={projForm.projectId}
                    onChange={(e) => setProjForm({ ...projForm, projectId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700">اسم المشروع بالعربية:</label>
                  <input
                    type="text"
                    required
                    value={projForm.projectName}
                    onChange={(e) => setProjForm({ ...projForm, projectName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700">التصنيف الرئيسي:</label>
                  <select
                    value={projForm.category}
                    onChange={(e) => setProjForm({ ...projForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="تجارة">تجارة</option>
                    <option value="خدمات">خدمات</option>
                    <option value="أونلاين">أونلاين</option>
                    <option value="صناعة تقليدية">صناعة تقليدية</option>
                    <option value="زراعة">زراعة</option>
                    <option value="تعليم">تعليم</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700">مستوى المخاطرة:</label>
                  <select
                    value={projForm.riskLevel}
                    onChange={(e) => setProjForm({ ...projForm, riskLevel: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="منخفض">منخفض</option>
                    <option value="متوسطة">متوسطة</option>
                    <option value="مرتفع">مرتفع</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700">الوصف الشامل للمشروع:</label>
                <textarea
                  rows={3}
                  required
                  value={projForm.description}
                  onChange={(e) => setProjForm({ ...projForm, description: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700">رأس المال الأدنى (دج):</label>
                  <input
                    type="number"
                    value={projForm.minCapital}
                    onChange={(e) => setProjForm({ ...projForm, minCapital: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700">رأس المال الموصى به (دج):</label>
                  <input
                    type="number"
                    value={projForm.recommendedCapital}
                    onChange={(e) => setProjForm({ ...projForm, recommendedCapital: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700">رأس المال الموسع (دج):</label>
                  <input
                    type="number"
                    value={projForm.maxCapital}
                    onChange={(e) => setProjForm({ ...projForm, maxCapital: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={projForm.homeBased}
                    onChange={(e) => setProjForm({ ...projForm, homeBased: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <span>يمكن البدء من المنزل</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={projForm.onlinePossible}
                    onChange={(e) => setProjForm({ ...projForm, onlinePossible: e.target.checked })}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <span>ممكن أونلاين</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-slate-900 text-white font-extrabold shadow-md"
                >
                  حفظ المشروع
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
