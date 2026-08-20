"use client";

import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import {
  FolderOpen,
  HelpCircle,
  Briefcase,
  ShieldCheck,
  BookOpen,
  Sparkles,
  Video,
  LayoutGrid,
  CalendarClock,
  SlidersHorizontal,
  ChevronLeft,
} from "lucide-react";

const sections = [
  { icon: FolderOpen, title: "المجالات والتصنيفات", desc: "إدارة المجالات والتصنيفات الفرعية", href: "/admin/categories", color: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white" },
  { icon: HelpCircle, title: "أسئلة اختبار بدون رأس مال", desc: "بنك الأسئلة والخيارات", href: "/admin/no-capital/questions", color: "bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white" },
  { icon: Briefcase, title: "مشاريع بدون رأس مال", desc: "ملفات المشاريع المقترحة", href: "/admin/no-capital/projects", color: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white" },
  { icon: SlidersHorizontal, title: "قواعد التوصية", desc: "تحكم في أوزان المحرك حسب السؤال والخيار", href: "/admin/no-capital/rules", color: "bg-pink-50 text-pink-600 group-hover:bg-pink-600 group-hover:text-white" },
  { icon: ShieldCheck, title: "شروط الموافقة (Consent)", desc: "إصدارات نص الموافقة القانونية", href: "/admin/consent", color: "bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white" },
  { icon: BookOpen, title: "الدورات", desc: "دورات مجانية مع الدروس", href: "/admin/courses", color: "bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white" },
  { icon: Sparkles, title: "مكتبة hooks", desc: "أكثر من 100 hook فيديو", href: "/admin/hooks", color: "bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white" },
  { icon: Video, title: "الفيديوهات", desc: "فيديوهات تعليمية قصيرة", href: "/admin/videos", color: "bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white" },
  { icon: LayoutGrid, title: "أنواع المحتوى", desc: "أنواع المحتوى وأفضل الممارسات", href: "/admin/content/types", color: "bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white" },
  { icon: CalendarClock, title: "خطط النشر", desc: "إيقاع النشر وأفضل الأوقات لكل منصة", href: "/admin/content/publishing", color: "bg-cyan-50 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white" },
];

export default function AdminNoCapitalHubPage() {
  return (
    <AdminShell
      title="محتوى نابدا (CMS)"
      subtitle="إدارة محتوى الوحدة الجديدة: مجالات، اختبارات، hooks، دورات..."
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group bg-white rounded-3xl border border-slate-200 p-6 hover:border-emerald-400 hover:shadow-lg transition-all flex items-start gap-4"
          >
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${section.color}`}>
              <section.icon className="w-5 h-5" />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-black text-sm">{section.title}</h2>
                <ChevronLeft className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors shrink-0" />
              </div>

              <p className="text-[11px] text-slate-500 mt-1">{section.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
