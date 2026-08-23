export async function getCsrfToken(): Promise<string> {
  const res = await fetch("/api/csrf", {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to obtain CSRF token");
  }

  const data = await res.json();

  if (!data?.token || typeof data.token !== "string") {
    throw new Error("Invalid CSRF token response");
  }

  return data.token;
}
