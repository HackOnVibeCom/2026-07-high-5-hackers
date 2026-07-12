// functions/api/competitors.ts
import { corsHeaders, handleOptions } from "./utils";

export const onRequestOptions = handleOptions;

export const onRequestGet: PagesFunction = async () => {
  try {
    const competitors = [
      {
        name: "Habitify",
        emoji: "✅",
        rating: 4.7,
        downloads: "1.2M",
        pricing: "Freemium",
        strengths: ["Clean UX", "Cross-device sync", "Rich charts"],
        weaknesses: ["Weak community", "Overwhelming for beginners"],
        channels: ["App Store", "Reddit", "Product Hunt"],
        keywords: ["habit tracker", "daily routine", "productivity"],
        complaint: '"Way too many settings — I just want to check off my morning walk."'
      },
      {
        name: "Streaks",
        emoji: "🔥",
        rating: 4.8,
        downloads: "800K",
        pricing: "Paid ($4.99)",
        strengths: ["Beautiful design", "Apple Watch", "Loyal fanbase"],
        weaknesses: ["iOS only", "No social features", "Rigid streak logic"],
        channels: ["App Store Features", "Twitter"],
        keywords: ["streak", "iOS habit", "minimal"],
        complaint: '"One missed day and my 200-day streak is gone. Brutal."'
      },
      {
        name: "Way of Life",
        emoji: "📅",
        rating: 4.4,
        downloads: "600K",
        pricing: "Freemium",
        strengths: ["Long history", "Simple color grid", "Export data"],
        weaknesses: ["Dated UI", "Slow updates", "Poor onboarding"],
        channels: ["App Store", "Blogs"],
        keywords: ["color chart", "habit journal"],
        complaint: '"Looks like it was designed in 2013 because it was."'
      },
      {
        name: "Fabulous",
        emoji: "🌅",
        rating: 4.6,
        downloads: "10M+",
        pricing: "Subscription ($9.99/mo)",
        strengths: ["Coach-driven content", "Big brand", "Guided routines"],
        weaknesses: ["Expensive", "Aggressive paywall", "Feels bloated"],
        channels: ["TikTok", "YouTube ads", "Instagram"],
        keywords: ["morning routine", "wellness coach"],
        complaint: '"Free trial forced me into a $80/year plan I didn\'t want."'
      }
    ];

    return new Response(JSON.stringify(competitors), {
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
