// Shared HTTP helpers for LaunchPilot Pages Functions.

export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function json(data: unknown, init: number | ResponseInit = 200): Response {
  const responseInit: ResponseInit = typeof init === "number" ? { status: init } : init;
  return new Response(JSON.stringify(data), {
    ...responseInit,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...CORS_HEADERS,
      ...(responseInit.headers || {}),
    },
  });
}

/** Preflight handler — export as `onRequestOptions` from any function that needs it. */
export function preflight(): Response {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

/** Parse a JSON request body, returning {} on any error so handlers never throw. */
export async function readJSON<T = Record<string, unknown>>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    return {} as T;
  }
}

/** The app-context payload the frontend store sends to POST endpoints. */
export interface AppContext {
  name?: string;
  description?: string;
  category?: string;
  asoTitle?: string;
  asoSubtitle?: string;
  asoKeywords?: string[];
  socialDrafts?: { platform: string; text: string }[];
  campaigns?: {
    id: string;
    name: string;
    status: string;
    platforms: string[];
    budget: number;
  }[];
  completedStages?: string[];
}
