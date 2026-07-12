// functions/api/recommendations.ts
import { callAgent, corsHeaders, handleOptions, predictLaunchPerformance } from "./utils";

export const onRequestOptions = handleOptions;

export const onRequestPost: PagesFunction<{
  GEMINI_API_KEY?: string;
  OPENAI_API_KEY?: string;
  ANTHROPIC_API_KEY?: string;
  CLAUDE_API_KEY?: string;
}> = async (context) => {
  try {
    const data: any = await context.request.json().catch(() => ({}));
    const {
      name = "Fernly",
      description = "A calm habit tracker.",
      category = "Health & Fitness",
      asoTitle = "",
      asoSubtitle = "",
      asoKeywords = [],
      socialDrafts = [],
      campaigns = []
    } = data;

    // First attempt calling LLM if keys exist
    const hasKeys = !!(context.env.GEMINI_API_KEY || context.env.OPENAI_API_KEY || context.env.ANTHROPIC_API_KEY || context.env.CLAUDE_API_KEY);
    
    if (hasKeys) {
      const installs = campaigns.length * 150 + 1284;
      const prompt = `
Context:
App Name: ${name}
App Description: ${description}
Category: ${category}
Performance Metrics:
- Estimated Installs: ${installs}
- ASO Title: "${asoTitle}"
- ASO Subtitle: "${asoSubtitle}"

As the Growth Advisor Agent, output exactly 3 recommendations based on these metrics. Follow the "What happened? Why? What next?" framework for mobile growth. 

You must return ONLY a valid JSON array of objects (no markdown wrappers, no backticks, no prose). Each object must match this structure:
[
  {
    "id": "rec-1",
    "finding": "What happened (metric-driven observation)",
    "cause": "Why did it happen (diagnostic analysis)",
    "recommendation": "What next (clear actionable recommendation)",
    "expected_impact": "Estimated outcome (e.g. +12% CTR)",
    "confidence": 0.85,
    "tone": "teal"
  }
]

Available tones are: "teal" (for budget/positive observations), "amber" (for mid-priority optimizations), "rose" (for high-risk alerts/timing issues), "blue" (for audience outreach suggestions).
`;
      try {
        const responseText = await callAgent("LaunchOS Growth Advisor Agent", prompt, context.env);
        let cleanJson = responseText.trim();
        if (cleanJson.startsWith("```")) {
          cleanJson = cleanJson.replace(/^```json\s*/, "").replace(/```$/, "").trim();
        }
        const parsed = JSON.parse(cleanJson);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return new Response(JSON.stringify(parsed), {
            status: 200,
            headers: corsHeaders()
          });
        }
      } catch (err) {
        console.error("LLM Call failed inside recommendations API, falling back to ML Engine:", err);
      }
    }

    // Dynamic Fallback using Edge ML predictor
    const forecast = predictLaunchPerformance(
      name,
      description,
      category,
      asoTitle,
      asoSubtitle,
      asoKeywords,
      socialDrafts
    );

    const recs: any[] = [];

    // Rec 1: ASO optimization
    if (forecast.asoScore < 80) {
      recs.push({
        id: "rec-aso",
        finding: `ASO Indexing Health is sub-optimal at ${forecast.asoScore}%.`,
        cause: forecast.negatives[0] || "Metadata limits or search keyword density do not match index criteria.",
        recommendation: forecast.recommendations[0] || "Refine ASO titles and subtitles inside the Studio.",
        expected_impact: "+15% app store visibility",
        confidence: 0.88,
        tone: "amber"
      });
    } else {
      recs.push({
        id: "rec-aso-ok",
        finding: `App Store Optimization score is high (${forecast.asoScore}%).`,
        cause: "ASO metadata lengths and keyword counts are well-aligned with store indexing guidelines.",
        recommendation: "Maintain this metadata. Run a live Launch Simulation to test organic search performance.",
        expected_impact: "+25% conversion indexing",
        confidence: 0.92,
        tone: "teal"
      });
    }

    // Rec 2: Copy optimizations
    if (forecast.copyScore < 80) {
      recs.push({
        id: "rec-copy",
        finding: `Social copy platforms fit score is moderate (${forecast.copyScore}%).`,
        cause: "Reddit/LinkedIn/Twitter drafts are missing paragraph splits, visual emojis, or founder story narratives.",
        recommendation: "Click on Studio tools, open your platform posts, and choose 'Regenerate' or 'Improve' to polish tone.",
        expected_impact: "+10% social click-through-rate",
        confidence: 0.81,
        tone: "blue"
      });
    } else {
      recs.push({
        id: "rec-copy-ok",
        finding: `Social posts copywriting fits platform formats (${forecast.copyScore}%).`,
        cause: "Posts feature targeted formatting, hooks, and narratives ideal for communities.",
        recommendation: "Approve and publish your draft posts to initiate simulated launch campaigns.",
        expected_impact: "Faster validation cycles",
        confidence: 0.86,
        tone: "teal"
      });
    }

    // Rec 3: Campaign state
    const runningCampaigns = campaigns.filter((c: any) => c.status === "running");
    if (runningCampaigns.length === 0) {
      recs.push({
        id: "rec-campaigns",
        finding: "No active campaigns currently driving download traffic.",
        cause: "Your launch campaigns are either in draft status or scheduled for future dates.",
        recommendation: "Activate the 'Product Hunt Launch Week' or approve content posts in the Studio to launch campaigns.",
        expected_impact: "+200% install growth rate",
        confidence: 0.94,
        tone: "rose"
      });
    } else {
      recs.push({
        id: "rec-campaigns-ok",
        finding: `${runningCampaigns.length} launch campaign(s) actively running.`,
        cause: "Campaign distributions are driving traffic across Product Hunt or social platforms.",
        recommendation: "Head over to the Analytics page to review conversion rate breakdowns and top channels.",
        expected_impact: "Optimal budget efficiency",
        confidence: 0.89,
        tone: "teal"
      });
    }

    return new Response(JSON.stringify(recs), {
      status: 200,
      headers: corsHeaders()
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders()
    });
  }
};
