"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Loader2, BookOpen, Clock, ChevronDown, ChevronRight, PlayCircle } from "lucide-react";
import type { CourseItem, CourseLessonItem } from "@/lib/noCapital/types";

export default function CourseDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [course, setCourse] = useState<CourseItem | null>(null);
  const [lessons, setLessons] = useState<CourseLessonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openLesson, setOpenLesson] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/learn/courses/${slug}`, { cache: "no-store" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "failed");
        setCourse(data.course as CourseItem);
        setLessons(data.lessons as CourseLessonItem[]);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "الدورة غير متاحة حالياً."))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <main dir="rtl" className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-600">جاري تحميل الدورة...</p>
        </div>
      </main>
    );
  }

  if (error || !course) {
    return (
      <main dir="rtl" className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 max-w-md">
          <p className="text-sm font-bold text-red-600">{error}</p>
          <Link
            href="/learn/courses"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-extrabold text-xs"
          >
            العودة للدورات
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-extrabold">
            <BookOpen className="w-3.5 h-3.5" />
            دورة مجانية - مستوى {course.level}
          </span>

          <h1 className="text-2xl sm:text-4xl font-black">{course.title}</h1>

          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">{course.summary}</p>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {course.durationMinutes} دقيقة
            </span>
            <span>{lessons.length} درساً</span>
          </div>
        </div>

        {course.description && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {course.description}
          </div>
        )}

        <div className="space-y-3">
          <h2 className="text-lg font-black">دروس الدورة</h2>

          {lessons.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center">
              <p className="text-xs font-bold text-slate-500">دروس الدورة قيد الإضافة.</p>
            </div>
          ) : (
            lessons.map((lesson) => {
              const isOpen = openLesson === lesson.id;

              return (
                <div key={lesson.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  <button
                    onClick={() => setOpenLesson(isOpen ? null : lesson.id)}
                    className="w-full flex items-center justify-between gap-3 p-4 sm:p-5 hover:bg-slate-50 transition-colors text-right"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                        <PlayCircle className="w-4 h-4" />
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 block">
                          الدرس {lesson.order}
                        </span>

                        <h3 className="font-bold text-sm">{lesson.title}</h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {lesson.durationMinutes} د
                      </span>

                      {isOpen ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 border-t border-slate-100 pt-4 space-y-3">
                      {lesson.summary && (
                        <p className="text-xs text-slate-600 leading-relaxed">{lesson.summary}</p>
                      )}

                      {lesson.content && (
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                          {lesson.content}
                        </p>
                      )}

                      {lesson.videoUrl && (
                        <a
                          href={lesson.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-extrabold hover:bg-emerald-700"
                        >
                          <PlayCircle className="w-4 h-4" />
                          مشاهدة الدرس
                        </a>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
