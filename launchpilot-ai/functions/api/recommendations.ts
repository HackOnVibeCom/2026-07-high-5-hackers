import { json, preflight, readJSON, type AppContext } from "../_lib/http";
import { computeRecommendations, computeHealthScore, type Recommendation } from "../_lib/engine";
import { chatJSON, type Env } from "../_lib/openrouter";

export const onRequestOptions = () => preflight();

const TONES = ["teal", "amber", "rose", "blue"] as const;

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  const ctx = await readJSON<AppContext>(request);

  // Deterministic result is the guaranteed baseline / fallback.
  const fallback = computeRecommendations(ctx);

  const health = computeHealthScore(ctx);
  const llm = await chatJSON<{ recommendations: Partial<Recommendation>[] }>(env, [
    {
      role: "system",
      content:
        "You are LaunchPilot's AI Growth Advisor for mobile-app launches. Return ONLY JSON: " +
        '{"recommendations":[{"finding":string,"cause":string,"recommendation":string,' +
        '"confidence":number(0-1),"expected_impact":string}]}. ' +
        "Give 3-4 specific, non-generic recommendations. 'finding' is a short problem statement, " +
        "'cause' explains why, 'recommendation' is a concrete next action, 'expected_impact' is a " +
        "quantified estimate like '+18% installs'.",
    },
    {
      role: "user",
      content: JSON.stringify({
        app: { name: ctx.name, category: ctx.category, description: ctx.description },
        aso: { title: ctx.asoTitle, subtitle: ctx.asoSubtitle, keywords: ctx.asoKeywords },
        socialDrafts: (ctx.socialDrafts || []).map((d) => d.platform),
        campaigns: (ctx.campaigns || []).map((c) => ({ status: c.status, platforms: c.platforms })),
        launchHealth: health,
      }),
    },
  ]);

  if (llm?.recommendations?.length) {
    const enriched: Recommendation[] = llm.recommendations.slice(0, 4).map((r, i) => ({
      id: `rec-ai-${i}`,
      finding: r.finding || fallback[i]?.finding || "Growth opportunity identified",
      cause: r.cause || fallback[i]?.cause || "",
      recommendation: r.recommendation || fallback[i]?.recommendation || "",
      confidence: typeof r.confidence === "number" ? Math.round(r.confidence * 100) / 100 : 0.82,
      expected_impact: r.expected_impact || fallback[i]?.expected_impact || "positive",
      tone: TONES[i % TONES.length],
    }));
    return json(enriched);
  }

  return json(fallback);
};
