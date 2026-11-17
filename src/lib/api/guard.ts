import "server-only";

/** Max accepted JSON body for public API routes (orders, subscribe). */
const MAX_BODY_BYTES = 16 * 1024;

/**
 * Reads a JSON body with a hard size limit and same-origin check.
 * Returns null when the request should be rejected.
 */
export async function readJsonBody<T>(request: Request): Promise<T | null> {
  if (!request.headers.get("content-type")?.includes("application/json")) return null;

  // Browsers always send Origin on POST; reject cross-site form/script posts.
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) return null;

  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > MAX_BODY_BYTES) return null;

  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export const isNonEmptyString = (v: unknown, max = 200): v is string =>
  typeof v === "string" && v.trim().length > 0 && v.length <= max;
