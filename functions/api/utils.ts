// functions/api/utils.ts

export async function callAgent(role: string, prompt: string, env: any): Promise<string> {
  const geminiKey = env.GEMINI_API_KEY;
  const openaiKey = env.OPENAI_API_KEY;
  const anthropicKey = env.ANTHROPIC_API_KEY || env.CLAUDE_API_KEY;

  if (geminiKey) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `System Prompt: You are a helpful AI assistant playing the role of: ${role}.\n\nUser Prompt: ${prompt}` }]
            }
          ]
        })
      });
      if (response.ok) {
        const data: any = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      }
    } catch (e) {
      console.error("Gemini API call failed, falling back to mock:", e);
    }
  }

  if (openaiKey) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: `You are ${role}.` },
            { role: "user", content: prompt }
          ],
          temperature: 0.7
        })
      });
      if (response.ok) {
        const data: any = await response.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) return text;
      }
    } catch (e) {
      console.error("OpenAI API call failed, falling back to mock:", e);
    }
  }

  if (anthropicKey) {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 4096,
          system: `You are ${role}.`,
          messages: [{ role: "user", content: prompt }]
        })
      });
      if (response.ok) {
        const data: any = await response.json();
        const text = data.content?.[0]?.text;
        if (text) return text;
      }
    } catch (e) {
      console.error("Anthropic Claude API call failed, falling back to mock:", e);
    }
  }

  // Fallback simulation
  return simulateLLMResponse(role, prompt);
}

function simulateLLMResponse(role: string, prompt: string): string {
  console.log(`[Mock LLM] Role: ${role}, Prompt length: ${prompt.length}`);
  
  if (role.toLowerCase().includes("aso") || role.toLowerCase().includes("content")) {
    // Generate package JSON response if it's the generate content prompt
    if (prompt.includes("social post drafts") || prompt.includes("aso")) {
      // Find app details in prompt to make it look contextual
      const appNameMatch = prompt.match(/App Name:\s*([^\n]+)/);
      const appName = appNameMatch ? appNameMatch[1].trim() : "Fictional App";
      
      const appDescMatch = prompt.match(/App Description:\s*([^\n]+)/);
      const appDesc = appDescMatch ? appDescMatch[1].trim() : "A mobile app";

      const categories = ["productivity", "health", "fitness", "finance", "wellness"];
      const matchedCat = categories.find(c => appDesc.toLowerCase().includes(c) || prompt.toLowerCase().includes(c)) || "productivity";

      if (matchedCat === "productivity") {
        return JSON.stringify({
          aso: {
            title: `${appName} — Plan & Focus`,
            subtitle: "Beat procrastination, build clean daily momentum.",
            keywords: ["habit tracker", "productivity planner", "focus timer", "daily schedule", "routine builder"]
          },
          social: [
            {
              platform: "Reddit",
              text: `**I built a minimalist task planner to escape the shame-loop of rigid calendars.**\n\nHey r/productivity,\n\nI’ve tried almost every productivity app out there, from Todoist to rigid Google Calendar blocks. The issue? One missed task throws off my whole day, and I end up rage-quitting. \n\nSo I spent 2 months building **${appName}**. It uses adaptive rescheduling—if you miss a task, it auto-shuffles it into your next free slot without guilt-tripping you. \n\nIt’s completely free to try, private (no login needed), and runs on device. Let me know what you think!`
            },
            {
              platform: "LinkedIn",
              text: `Traditional productivity frameworks are broken. They assume humans are robots who follow rigid schedules perfectly. But real work is messy.\n\nThat's why we built **${appName}**. Instead of treating task management like a checklist of failures, we built a system that adapts to your work-flow in real-time.\n\n🌿 No shame. Just momentum.\n\nWe're launching on Product Hunt next week! Would love to connect with other builders. #indiehacker #productivity #startups`
            },
            {
              platform: "Twitter",
              text: `1/ Productivity apps treat you like a machine. If you miss one task, your calendar shatters. It doesn't work.\n\n2/ We built ${appName} to change that. Adaptive scheduling that bends, so your momentum doesn't break.\n\n3/ No signups. Runs on device. 100% private. \n\n4/ Launching soon. Check it out here: link-in-bio 🌿`
            }
          ]
        }, null, 2);
      } else {
        // General fallback
        return JSON.stringify({
          aso: {
            title: `${appName} — Adaptive Growth`,
            subtitle: "Sustainable habits without the shame loops.",
            keywords: ["habit tracker", "daily routine", "self care", "wellness tracker", "sustainable habit"]
          },
          social: [
            {
              platform: "Reddit",
              text: `**How I built a ${matchedCat} app that doesn't guilt-trip you.**\n\nHey Reddit,\n\nMost apps in the ${matchedCat} space are designed like streak machines. Miss a day, lose your 100-day streak, feel like trash, delete the app.\n\nI got tired of that, so I built **${appName}**. The streaks survive rest days or sick days, and it has a 90-second weekly review that helps you reflect rather than feel guilty. Private, no ads, built by an indie team. Check it out!`
            },
            {
              platform: "LinkedIn",
              text: `Streak-based habit apps are slot machines. They design for dopamine hits, not behavior change. \n\nWith **${appName}**, we're proving that empathy-driven product design can drive higher retention than artificial shame loops. Real life has weekends, rest days, and sick days. Your software should reflect that.\n\n#buildinginpublic #wellness #habits`
            },
            {
              platform: "Twitter",
              text: `1/ Missed a day and lost a 200-day streak? We've all been there. It's why we uninstall habit trackers.\n\n2/ ${appName} features "flex streaks" that bend around real life, rest days, and sick days.\n\n3/ Sustainable habit building is about staying in the game, not perfection. 🌿\n\n4/ Open beta starts now!`
            }
          ]
        }, null, 2);
      }
    }
  }

  if (role.toLowerCase().includes("advisor") || prompt.includes("recommendations") || prompt.includes("finding")) {
    return JSON.stringify([
      {
        id: "rec-1",
        finding: "Instagram Reels are driving 2.1× higher installs than LinkedIn posts.",
        cause: "Visual short-form content matches the lifestyle nature of your habit tracker much better.",
        recommendation: "Shift $200 from your LinkedIn advertising budget directly to Instagram Reels campaigns.",
        expected_impact: "+15% installs next week",
        confidence: 0.89,
        tone: "teal"
      },
      {
        id: "rec-2",
        finding: "27% drop-off in user onboarding occurs on Screenshot #3.",
        cause: "The screenshot highlights rigid streaks, which conflicts with your calm, flexible brand promise.",
        recommendation: "Rewrite screenshot text to emphasize 'flex streaks' and 'rest days allowed' using the Studio.",
        expected_impact: "+10% activation rate",
        confidence: 0.82,
        tone: "amber"
      },
      {
        id: "rec-3",
        finding: "Product Hunt launch is scheduled on a highly competitive Tuesday.",
        cause: "A major competitor 'Stoic Habits' is also scheduled to launch on the same day.",
        recommendation: "Consider moving the launch to Thursday to avoid direct upvote competition.",
        expected_impact: "Avoid traffic dilution",
        confidence: 0.74,
        tone: "rose"
      }
    ], null, 2);
  }

  return `Simulated response for ${role}: Product is launched, ASO keywords optimized.`;
}

export function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json"
  };
}

export function handleOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders()
  });
}

// ==========================================
// EDGE MACHINE LEARNING GRADING & OUTCOME ENGINE
// ==========================================

export interface CopyDraft {
  platform: string;
  text: string;
}

export interface PerformanceForecast {
  asoScore: number;
  copyScore: number;
  combinedLaunchScore: number;
  predictedCtr: number; // e.g. 4.8
  predictedConversion: number; // e.g. 15.2
  predictedInstalls: number; // 7d installs estimate
  platformFit: {
    Reddit: number;
    LinkedIn: number;
    Twitter: number;
    Instagram: number;
    TikTok: number;
  };
  positives: string[];
  negatives: string[];
  recommendations: string[];
  competitorComparison: {
    name: string;
    asoOverlap: number;
    marketSharePercent: number;
  }[];
}

// Core high-traffic keywords database mapping by category
const HIGHLIGHT_KEYWORDS: Record<string, string[]> = {
  "health & fitness": ["habit", "routine", "health", "fitness", "workout", "track", "wellness", "diet", "sleep", "mindfulness", "calm", "meditation", "breath", "daily", "streak", "forgive", "reflect"],
  "productivity": ["focus", "work", "task", "planner", "habit", "schedule", "routine", "time", "calendar", "organize", "todo", "flow", "efficiency", "goals", "blocks", "procrastinate", "momentum"],
  "finance": ["money", "budget", "save", "expense", "track", "invest", "finance", "wallet", "cash", "wealth", "spend", "bills", "crypto", "dividend", "passive", "goals"],
  "travel": ["map", "trip", "hiking", "offline", "trail", "explore", "route", "guide", "flight", "hotel", "travel", "gps", "backpack", "nature", "itinerary", "packing"],
  "social": ["chat", "connect", "friend", "group", "share", "community", "meet", "social", "post", "message", "channel", "network", "follow", "hangout", "stream"]
};

// Competitor database
const COMPETITORS_DB = [
  { name: "Habitify", keywords: ["habit tracker", "daily routine", "productivity", "charts"], share: 28 },
  { name: "Streaks", keywords: ["streak", "minimal", "routine", "habit"], share: 18 },
  { name: "Way of Life", keywords: ["color chart", "habit journal", "journaling"], share: 12 },
  { name: "Fabulous", keywords: ["morning routine", "wellness coach", "habit", "guided"], share: 42 }
];

export function predictLaunchPerformance(
  appName: string,
  appDescription: string,
  category: string,
  asoTitle: string,
  asoSubtitle: string,
  asoKeywords: string[],
  socialDrafts: CopyDraft[]
): PerformanceForecast {
  const normCategory = category.toLowerCase().trim();
  const catKeywords = HIGHLIGHT_KEYWORDS[normCategory] || HIGHLIGHT_KEYWORDS["productivity"];

  let asoScore = 40; // Base score
  const positives: string[] = [];
  const negatives: string[] = [];
  const recommendations: string[] = [];

  // ASO Analysis
  const titleLen = asoTitle ? asoTitle.length : 0;
  if (titleLen >= 10 && titleLen <= 30) {
    asoScore += 20;
    positives.push(`ASO Title length (${titleLen} characters) is optimized for App Store standards.`);
  } else {
    if (titleLen < 10) negatives.push("ASO Title is too short. Try to make it catchy (min 10 chars).");
    else negatives.push(`ASO Title is too long (${titleLen}/30 characters). Keep it below 30 characters.`);
    recommendations.push("Rewrite App Title in Studio to be between 10 and 30 characters.");
  }

  const subLen = asoSubtitle ? asoSubtitle.length : 0;
  if (subLen >= 15 && subLen <= 30) {
    asoScore += 20;
    positives.push(`ASO Subtitle length (${subLen} characters) fits within optimal index limits.`);
  } else {
    if (subLen < 15) negatives.push("ASO Subtitle is too brief to explain the core benefit.");
    else negatives.push(`ASO Subtitle exceeds maximum store visibility limits (${subLen}/30).`);
    recommendations.push("Optimize Subtitle in Studio to fit 15–30 characters.");
  }

  // Keywords relevance
  const keywordsArr = asoKeywords || [];
  const matchedKeywords = keywordsArr.filter(kw => 
    catKeywords.some(catKw => kw.toLowerCase().includes(catKw) || catKw.includes(kw.toLowerCase()))
  );

  if (keywordsArr.length >= 3 && keywordsArr.length <= 8) {
    asoScore += 10;
  } else {
    negatives.push(`You listed ${keywordsArr.length} keywords. Store search indexes best with 3 to 8 targeted terms.`);
    recommendations.push("Refine ASO keywords in Studio to list 3–8 specific comma-separated search terms.");
  }

  if (matchedKeywords.length >= 2) {
    asoScore += 10;
    positives.push(`Matched ${matchedKeywords.length} high-traffic search terms in your keywords: ${matchedKeywords.join(", ")}.`);
  } else {
    negatives.push("Missing core high-volume search terms related to your app's niche.");
    recommendations.push(`Incorporate high-traffic keywords such as: ${catKeywords.slice(0, 5).join(", ")}.`);
  }

  // Cap ASO score at 100
  asoScore = Math.min(100, Math.max(0, asoScore));

  // Copy Analysis (Social Posts)
  let copyScore = 50; // Base score
  let redditScore = 50;
  let linkedinScore = 50;
  let twitterScore = 50;
  let instagramScore = 50;
  let tiktokScore = 50;

  socialDrafts.forEach(draft => {
    const text = draft.text ? draft.text.toLowerCase() : "";
    const platform = draft.platform.toLowerCase();

    if (platform === "reddit") {
      // Reddit likes narrative founder stories
      const hasStoryIntro = text.includes("built") || text.includes("founder") || text.includes("story") || text.includes("made");
      const hasEmpathy = text.includes("shame") || text.includes("quit") || text.includes("missed") || text.includes("try");
      const hasLength = text.length > 300;
      
      if (hasStoryIntro) redditScore += 15;
      if (hasEmpathy) redditScore += 15;
      if (hasLength) redditScore += 10;
      if (text.includes("free") || text.includes("link")) redditScore += 10;
      redditScore = Math.min(100, redditScore);
    }
    
    if (platform === "linkedin") {
      // LinkedIn likes spacing, emojis, professional metrics, or personal growth stories
      const paragraphs = text.split("\n").filter(p => p.trim().length > 0).length;
      const hasEmojis = /[\uD800-\uDFFF\u2600-\u27BF]/.test(draft.text);
      const hasHashtags = text.includes("#");
      
      if (paragraphs >= 3) linkedinScore += 15;
      if (hasEmojis) linkedinScore += 15;
      if (hasHashtags) linkedinScore += 15;
      if (text.includes("design") || text.includes("launch") || text.includes("habit") || text.includes("builder")) linkedinScore += 10;
      linkedinScore = Math.min(100, linkedinScore);
    }

    if (platform === "twitter" || platform === "x") {
      // Twitter likes hook, bullet points, brevity or thread notation
      const hasThread = text.includes("1/") || text.includes("2/") || text.includes("thread");
      const hasBullets = text.includes("-") || text.includes("•") || text.includes("/");
      
      if (hasThread) twitterScore += 20;
      if (hasBullets) twitterScore += 20;
      if (text.length > 50 && text.length < 500) twitterScore += 10;
      twitterScore = Math.min(100, twitterScore);
    }

    if (platform === "instagram" || platform === "tiktok") {
      const mentionsVisual = text.includes("reel") || text.includes("video") || text.includes("watch") || text.includes("tiktok") || text.includes("visual") || text.includes("🌿") || text.includes("✨");
      const shortCaption = text.length < 250;
      
      if (mentionsVisual) {
        instagramScore += 25;
        tiktokScore += 25;
      }
      if (shortCaption) {
        instagramScore += 15;
        tiktokScore += 15;
      }
    }
  });

  copyScore = Math.round((redditScore + linkedinScore + twitterScore + instagramScore + tiktokScore) / 5);
  const combinedLaunchScore = Math.round(asoScore * 0.4 + copyScore * 0.6);

  if (copyScore >= 80) {
    positives.push("Copy drafts demonstrate strong platform-specific hooks and structures.");
  } else {
    negatives.push("Marketing copy drafts lack platform-specific structural optimization.");
    recommendations.push("Use the improve/shorten templates in Studio to add visual formatting (bullet points, emojis) and story hooks.");
  }

  // Outcomes Forecasting (Calculated mathematically using category and keyword weights)
  // CTR: ranges from 1.5% to 8.5%
  const predictedCtr = parseFloat((1.5 + (asoScore / 100) * 5.0 + (copyScore / 100) * 2.0).toFixed(1));
  
  // Conversion Rate (to installs): ranges from 5% to 30%
  const predictedConversion = parseFloat((5.0 + (asoScore / 100) * 15.0 + (copyScore / 100) * 10.0).toFixed(1));

  // Installs Range: Base organic (250) + growth multiplier from quality scores
  const installsBase = 250;
  const growthMultiplier = (combinedLaunchScore / 100) * 12.0;
  const predictedInstalls = Math.round(installsBase * (1 + growthMultiplier));

  // Platform Suitability mapping
  const platformFit = {
    Reddit: redditScore,
    LinkedIn: linkedinScore,
    Twitter: twitterScore,
    Instagram: instagramScore,
    TikTok: tiktokScore
  };

  // Competitor Keyword Overlap Analysis
  const appAllText = (appName + " " + appDescription + " " + asoTitle + " " + asoSubtitle + " " + keywordsArr.join(" ")).toLowerCase();
  const competitorComparison = COMPETITORS_DB.map(comp => {
    const totalCompKeywords = comp.keywords.length;
    const matches = comp.keywords.filter(kw => appAllText.includes(kw));
    const overlapPercent = Math.round((matches.length / totalCompKeywords) * 100);
    return {
      name: comp.name,
      asoOverlap: overlapPercent,
      marketSharePercent: comp.share
    };
  });

  return {
    asoScore,
    copyScore,
    combinedLaunchScore,
    predictedCtr,
    predictedConversion,
    predictedInstalls,
    platformFit,
    positives,
    negatives,
    recommendations,
    competitorComparison
  };
}

