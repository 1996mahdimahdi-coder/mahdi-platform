import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Content-Security-Policy (H3)
// Follows the official Next.js "Without Nonces" pattern (static generation is
// used across the app, and nonce-based CSP would force every page to render
// dynamically). 'unsafe-inline' is required by the Next.js App Router for its
// inline bootstrap/RSC scripts and inline style attributes. React's dev overlay
// needs 'unsafe-eval' in development only; it is never shipped in production.
// No wildcard sources are used.
const cspHeader = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://*.profitableratecpmnetwork.com${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https: http://cdn.storageimagedisplay.com",
  // preconnect links to the Google Fonts hosts live in src/app/layout.tsx
  "connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com https:",
  "frame-ancestors 'none'",
  "frame-src https://*.profitableratecpmnetwork.com https://cdn.cloudvideosa.com https://www.youtube.com https://www.youtube-nocookie.com",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
]
  .join("; ")
  .replace(/\s{2,}/g, " ")
  .trim();

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // HSTS is HTTPS-only and thus production-only so local development is unaffected.
  ...(isDev
    ? []
    : [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }]),
  { key: "Content-Security-Policy", value: cspHeader },
];

const nextConfig: NextConfig = {
  headers: () => [{ source: "/:path*", headers: securityHeaders }],
};

export default nextConfig;