import { createHmac } from "node:crypto";

export function hashForLog(value: string): string {
  const secret = process.env.AUTH_SECRET || "nabda-security-log-fallback";
  return createHmac("sha256", secret).update(value).digest("hex").slice(0, 16);
}

export function logSecurity(event: string, fields?: Record<string, unknown>): void {
  const entry: Record<string, unknown> = {
    t: new Date().toISOString(),
    kind: "security",
    event,
  };

  if (fields) {
    for (const [key, value] of Object.entries(fields)) {
      if (key && typeof value !== "function") entry[key] = value;
    }
  }

  console.log(JSON.stringify(entry));
}