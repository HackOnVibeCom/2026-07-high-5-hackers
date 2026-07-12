// functions/api/generate-content.ts
import { callAgent, corsHeaders, handleOptions } from "./utils";

export const onRequestOptions = handleOptions;

export const onRequestPost: PagesFunction<{
  GEMINI_API_KEY?: string;
  OPENAI_API_KEY?: string;
  ANTHROPIC_API_KEY?: string;
  CLAUDE_API_KEY?: string;
}> = async (context) => {
  try {
    const data: any = await context.request.json();
    const { name, category, description } = data;

    if (!name || !description) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: name and description" }),
        { status: 400, headers: corsHeaders() }
      );
    }

    const prompt = `
Generate launching marketing package for a mobile app.
App Name: ${name}
App Category: ${category || "General"}
App Description: ${description}

We need:
1. App Store Optimization (ASO) Metadata:
   - A catchy App Title (max 30 chars)
   - A compelling Subtitle (max 30 chars)
   - 5 relevant keywords for store search

2. Social Media Launch Post Drafts (3 channels):
   - Reddit Launch Post (a founder story style, engaging, structured, value-first)
   - LinkedIn Post (professional tone, talking about behavior change, empathetic design, or startup launch story)
   - Twitter Thread (starts with hook, brief bullet points, and call to action)

Return ONLY a valid JSON object matching this structure (no markdown wrappers, no backticks, no prose):
{
  "aso": {
    "title": "App Title",
    "subtitle": "App Subtitle",
    "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
  },
  "social": [
    { "platform": "Reddit", "text": "Post content" },
    { "platform": "LinkedIn", "text": "Post content" },
    { "platform": "Twitter", "text": "Post content" }
  ]
}
`;

    const responseText = await callAgent("LaunchOS Marketing AI Agent", prompt, context.env);
    
    // Clean potential markdown backticks from LLM output
    let cleanJson = responseText.trim();
    if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```json\s*/, "").replace(/```$/, "").trim();
    }

    let parsedData;
    try {
      parsedData = JSON.parse(cleanJson);
    } catch (parseErr) {
      console.error("Failed to parse JSON from LLM response:", responseText);
      // Fallback to calling simulator if parsing fails
      parsedData = JSON.parse(await callAgent("LaunchOS Marketing AI Agent", `FALLBACK: ${prompt}`, {}));
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
