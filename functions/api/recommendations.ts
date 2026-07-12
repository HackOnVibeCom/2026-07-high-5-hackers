// functions/api/recommendations.ts
import { callAgent, corsHeaders, handleOptions } from "./utils";

export const onRequestOptions = handleOptions;

export const onRequestPost: PagesFunction<{
  GEMINI_API_KEY?: string;
  OPENAI_API_KEY?: string;
  ANTHROPIC_API_KEY?: string;
  CLAUDE_API_KEY?: string;
}> = async (context) => {
  try {
    const data: any = await context.request.json().catch(() => ({}));
    const { name, description, installsTrend, ctr } = data;

    const appName = name || "Fernly";
    const appDesc = description || "A calm habit tracker.";
    const currentCtr = ctr || 4.6;
    const currentInstalls = installsTrend ? installsTrend.reduce((a: number, b: number) => a + b, 0) : 1284;

    const prompt = `
Context:
App Name: ${appName}
App Description: ${appDesc}
Performance Metrics:
- Installs (7d): ${currentInstalls}
- Click-Through Rate (CTR): ${currentCtr}%

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

Available tones are: "teal" (for budget/positive observations), "amber" (for mid-priority optimizations), "rose" (for high-risk alerts/timing issues), "blue" (for audience outreach suggestions). Make sure you have one of each or vary them appropriately.
`;

    const responseText = await callAgent("LaunchOS Growth Advisor Agent", prompt, context.env);
    
    let cleanJson = responseText.trim();
    if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```json\s*/, "").replace(/```$/, "").trim();
    }

    let parsedData;
    try {
      parsedData = JSON.parse(cleanJson);
    } catch (parseErr) {
      console.error("Failed to parse JSON from LLM response:", responseText);
      // Fallback
      parsedData = JSON.parse(await callAgent("LaunchOS Growth Advisor Agent", `FALLBACK: ${prompt}`, {}));
    }

    return new Response(JSON.stringify(parsedData), {
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
