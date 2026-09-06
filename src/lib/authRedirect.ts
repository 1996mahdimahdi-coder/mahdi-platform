/**
 * Shared safe-redirect validation for the Google OAuth flow.
 *
 * We only ever redirect to a same-application internal path. This blocks open
 * redirects (external URLs, protocol-relative "//host"), scheme smuggling
 * ("javascript:", "http:"), backslashes, fragments and control characters.
 *
 * The returned value is a path on the current app only; authorization is NOT
 * bypassed — the proxy / admin & dashboard layouts re-check the session and
 * role on the redirected path.
 */
export function getSafeRedirectPath(
  raw: string | null | undefined
): string | null {
  if (!raw) return null;

  const value = raw.trim();
  if (value.length === 0) return null;

  // Must be an internal path, not an external/protocol-relative URL.
  if (!value.startsWith("/")) return null;
  if (value.startsWith("//")) return null;

  // Reject anything that could smuggle a scheme, traversal, fragment or
  // control characters in.
  if (/[:\\\s\r\n\t#]/.test(value)) return null;

  // Defense-in-depth: reject percent-encoded scheme/location smuggling or
  // control bytes (e.g. "/%2Fevil.com" -> "//evil.com", "/%00").
  let decoded: string;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    return null; // malformed percent-encoding
  }
  if (decoded !== value) {
    if (!decoded.startsWith("/")) return null;
    if (decoded.startsWith("//")) return null;
    if (/[:\\\s\r\n\t#]/.test(decoded)) return null;
  }
  if (/[\x00-\x1f\x7f]/.test(decoded)) return null;

  return value;
}
