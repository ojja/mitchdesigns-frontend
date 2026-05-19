/**
 * Pure URL helpers — safe in client components.
 * Keep this file free of `server-only` imports so the barrel doesn't drag
 * the Strapi fetch layer into client bundles.
 */

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

/** Resolve a Strapi media URL — handles both absolute and relative cases. */
export function strapiMedia(path: string | undefined | null): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${STRAPI_URL}${path}`;
}
