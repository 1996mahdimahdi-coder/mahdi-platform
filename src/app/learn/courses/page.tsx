"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, BookOpen, Clock, ChevronLeft, Inbox } from "lucide-react";
import type { CourseItem } from "@/lib/noCapital/types";

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/learn/courses", { cache: "no-store" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error("failed");
        return data.courses as CourseItem[];
      })
      .then(setCourses)
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        <div className="border-b border-slate-200 pb-6">
          <span className="text-xs font-black text-emerald-600 uppercase tracking-wider">
            الدورات
          </span>

          <h1 className="text-2xl sm:text-4xl font-black mt-1">الدورات المجانية</h1>

          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            دروس مبسطة خطوة بخطوة للمبتدئين في البيع والتسويق وبدء الخدمات.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-3 py-20 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <p className="text-sm font-bold">جاري تحميل الدورات...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
              <Inbox className="w-7 h-7" />
            </div>

            <div>
              <h2 className="font-black text-lg">الدورات قيد التحضير</h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                نضيف دورات عملية محلية قريباً. أنشئ محتواك وتابعنا لمشاهدة أول
                دورة كاملة.
              </p>
            </div>

            <Link
              href="/learn/content"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 text-white font-extrabold text-xs hover:bg-slate-800"
            >
              أنشئ محتواك الآن
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <Link
                key={course.slug}
                href={`/learn/courses/${course.slug}`}
                className="bg-white rounded-3xl border border-slate-200 p-6 hover:border-emerald-400 hover:shadow-lg transition-all group"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <BookOpen className="w-5 h-5" />
                </div>

                <h2 className="font-black text-sm sm:text-base mb-1.5">{course.title}</h2>

                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {course.summary}
                </p>

                <div className="mt-4 flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-bold text-slate-600">
                    {course.level}
                  </span>

                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {course.durationMinutes} دقيقة
                  </span>

                  <span>{course.lessonsCount} درساً</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
