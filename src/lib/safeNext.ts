/** Returns the ?next= path from the current URL if it is a safe, same-site path. */
export function getSafeNext(fallback = "/account"): string {
  if (typeof window === "undefined") return fallback;
  const next = new URLSearchParams(window.location.search).get("next") || "";
  return next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : fallback;
}
