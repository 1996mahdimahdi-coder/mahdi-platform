// Session identity helper for anonymous consent recording and test results.
// Uses localStorage when available, falls back to a per-page id otherwise.

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let id = window.localStorage.getItem("nabda_session_id");
    if (!id) {
      id = `v-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      window.localStorage.setItem("nabda_session_id", id);
    }
    return id;
  } catch {
    return `v-${Date.now()}`;
  }
}
