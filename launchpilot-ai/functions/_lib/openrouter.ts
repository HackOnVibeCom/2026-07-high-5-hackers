// OpenRouter LLM client for LaunchPilot AI backend (Cloudflare Pages Functions).
//
// Runs on the Cloudflare Workers runtime — Web-standard `fetch` only, no Node APIs.
// If OPENROUTER_API_KEY is absent (e.g. a judge running the demo with no key), every
// call returns null and the caller falls back to the deterministic engine, so the
// product NEVER breaks. When the key IS present, we get real LLM-generated copy.

export interface Env {
  OPENROUTER_API_KEY?: string;
  OPENROUTER_MODEL?: string;
}

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
// A capable, inexpensive default. Override with OPENROUTER_MODEL if desired.
const DEFAULT_MODEL = "anthropic/claude-3.5-sonnet";

type ChatMessage = { role: "system" | "user"; content: string };

/**
 * Call OpenRouter and return the assistant's raw text, or null on any failure
 * (missing key, network error, non-200, empty body). Never throws.
 */
export async function chat(
  env: Env,
  messages: ChatMessage[],
  opts: { temperature?: number; maxTokens?: number; json?: boolean } = {},
): Promise<string | null> {
  const key = env?.OPENROUTER_API_KEY;
  if (!key) return null;

  const model = env.OPENROUTER_MODEL || DEFAULT_MODEL;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20_000);

    const res = await fetch(OPENROUTER_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        // Recommended by OpenRouter for attribution / rankings.
        "HTTP-Referer": "https://launchpilot.hackonvibe.com",
        "X-Title": "LaunchPilot AI",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: opts.temperature ?? 0.7,
        max_tokens: opts.maxTokens ?? 1200,
        ...(opts.json ? { response_format: { type: "json_object" } } : {}),
      }),
    }).finally(() => clearTimeout(timeout));

    if (!res.ok) {
      console.error(`OpenRouter ${res.status}: ${await res.text().catch(() => "")}`);
      return null;
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = data?.choices?.[0]?.message?.content;
    return typeof text === "string" && text.trim().length > 0 ? text : null;
  } catch (err) {
    console.error("OpenRouter call failed:", err);
    return null;
  }
}

/**
 * Ask the model for JSON and parse it. Tolerates ```json fences and leading prose.
 * Returns null if the model is unavailable or the output can't be parsed.
 */
export async function chatJSON<T>(
  env: Env,
  messages: ChatMessage[],
  opts: { temperature?: number; maxTokens?: number } = {},
): Promise<T | null> {
  const raw = await chat(env, messages, { ...opts, json: true });
  if (!raw) return null;
  return extractJSON<T>(raw);
}

/** Best-effort JSON extraction from a possibly-fenced / prose-wrapped LLM reply. */
export function extractJSON<T>(raw: string): T | null {
  const cleaned = raw
    .replace(/^```(?:json)?/i, "")
    .replace(/```\s*$/, "")
    .trim();

  // Try the whole thing first, then the first balanced {...} or [...] block.
  const candidates = [cleaned];
  const objMatch = cleaned.match(/\{[\s\S]*\}/);
  const arrMatch = cleaned.match(/\[[\s\S]*\]/);
  if (objMatch) candidates.push(objMatch[0]);
  if (arrMatch) candidates.push(arrMatch[0]);

  for (const c of candidates) {
    try {
      return JSON.parse(c) as T;
    } catch {
      /* try next */
    }
  }
  return null;
}
