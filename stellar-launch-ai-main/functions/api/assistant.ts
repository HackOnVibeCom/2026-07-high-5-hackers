import { json, preflight, readJSON } from "../_lib/http";
import { chatJSON, type Env } from "../_lib/openrouter";

export const onRequestOptions = () => preflight();

// Routes the assistant is allowed to deep-link to via its action button.
const VALID_ROUTES = new Set([
  "/",
  "/strategy",
  "/studio",
  "/studio/reddit",
  "/studio/twitter",
  "/studio/linkedin",
  "/studio/instagram",
  "/studio/app-store",
  "/campaigns",
  "/campaigns/new",
  "/simulator",
  "/discover",
  "/analytics",
]);

interface AssistantBody {
  question?: string;
  screen?: string;
  app?: { name?: string; category?: string; description?: string };
  history?: { role: "user" | "ai"; text: string }[];
}

interface AssistantReply {
  text: string;
  action?: { label: string; to: string } | null;
  source: "openrouter" | "engine";
}

/** Deterministic answers so the assistant still helps with no API key. */
function engineReply(q: string, screen: string, app: AssistantBody["app"]): AssistantReply {
  const name = app?.name || "your app";
  if (/reddit|post/i.test(q))
    return {
      text: `For ${name}, lead the Reddit post with a founder story — the problem you hit yourself — and keep the pitch to a single last line. Community posts convert 2–3× better than paid social at launch.`,
      action: { label: "Open in Studio", to: "/studio/reddit" },
      source: "engine",
    };
  if (/campaign|launch|when/i.test(q))
    return {
      text: "Tuesday around 12:00 PST is the strongest launch slot for most categories — high Product Hunt traffic and low competitor overlap. Schedule the announcement thread the same morning.",
      action: { label: "Go to Campaigns", to: "/campaigns" },
      source: "engine",
    };
  if (/ctr|why|drop/i.test(q))
    return {
      text: "When CTR dips mid-week it's almost always creative fatigue. Rotate a fresh hook (video beats static ~2:1) and re-check in 48h before touching budget.",
      action: { label: "See Analytics", to: "/analytics" },
      source: "engine",
    };
  if (/influencer|community|subreddit/i.test(q))
    return {
      text: `Start with micro-influencers (10–50k) in ${app?.category || "your category"} — replies and saves matter more than follower count. Discover has a curated shortlist to bookmark.`,
      action: { label: "Open Discover", to: "/discover" },
      source: "engine",
    };
  return {
    text: `Working from your ${screen || "Home"} context — the sharpest next step for ${name} is to ship the one asset with the highest expected impact this week. Want me to draft it?`,
    action: { label: "Open Studio", to: "/studio" },
    source: "engine",
  };
}

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  const body = await readJSON<AssistantBody>(request);
  const question = (body.question || "").slice(0, 2000);
  const screen = body.screen || "Home";
  const fallback = engineReply(question, screen, body.app);
  if (!question.trim()) return json(fallback);

  const history = (body.history || [])
    .slice(-6)
    .map((m) => `${m.role === "user" ? "User" : "You"}: ${m.text}`)
    .join("\n");

  const llm = await chatJSON<{ text?: string; action?: { label?: string; to?: string } | null }>(
    env,
    [
      {
        role: "system",
        content:
          "You are LaunchPilot's in-app Growth Agent: a sharp, concise mobile-app launch strategist. " +
          "The user is inside the LaunchPilot dashboard. Answer in 2-4 sentences, specific and actionable, no fluff. " +
          'Return ONLY JSON: {"text": string, "action": {"label": string, "to": string} | null}. ' +
          `"to" must be one of: ${[...VALID_ROUTES].join(", ")} — pick the screen that helps the user act on your advice, or null.`,
      },
      {
        role: "user",
        content:
          `App: ${body.app?.name || "unknown"} (${body.app?.category || "unknown category"})\n` +
          `Pitch: ${body.app?.description || "n/a"}\n` +
          `Current screen: ${screen}\n` +
          (history ? `Recent conversation:\n${history}\n` : "") +
          `Question: ${question}`,
      },
    ],
    { temperature: 0.7, maxTokens: 400 },
  );

  if (llm?.text) {
    const to = llm.action?.to;
    const reply: AssistantReply = {
      text: llm.text,
      action:
        to && VALID_ROUTES.has(to)
          ? { label: llm.action?.label || "Take me there", to }
          : null,
      source: "openrouter",
    };
    return json(reply);
  }

  return json(fallback);
};
