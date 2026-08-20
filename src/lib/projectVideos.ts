// خريطة فيديوهات المشاريع (بدون رأس مال)
// المفتاح = slug المشروع، القيمة = رقم فيديو يوتيوب (ID فقط، ليس الرابط كاملاً)
// مثال لاستخراج الـ ID: https://www.youtube.com/watch?v=AbCdEfGhIjK  →  AbCdEfGhIjK

export const NO_CAPITAL_VIDEOS: Record<string, string> = {
  // "content-writing": "AbCdEfGhIjK",      ← مثال: أضيفي الفيديو الحقيقي هكذا
  // "graphic-design": "AbCdEfGhIjK",
  // "video-editing": "AbCdEfGhIjK",
  // "web-development": "AbCdEfGhIjK",
  // "social-media-management": "AbCdEfGhIjK",
  // "programming": "AbCdEfGhIjK",
};

export function getProjectVideoId(slug: string): string | null {
  return NO_CAPITAL_VIDEOS[slug] ?? null;
}

// خريطة فيديوهات مشاريع رأس المال (المفتاح = projectId)
export const CAPITAL_VIDEOS: Record<string, string> = {
  // "phone-accessories": "AbCdEfGhIjK",   ← مثال: أضيفي الفيديو الحقيقي هكذا
};

export function getCapitalProjectVideoId(projectId: string): string | null {
  return CAPITAL_VIDEOS[projectId] ?? null;
}
