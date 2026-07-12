var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// api/utils.ts
async function callAgent(role, prompt, env) {
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
              parts: [{ text: `System Prompt: You are a helpful AI assistant playing the role of: ${role}.

User Prompt: ${prompt}` }]
            }
          ]
        })
      });
      if (response.ok) {
        const data = await response.json();
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
        const data = await response.json();
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
        const data = await response.json();
        const text = data.content?.[0]?.text;
        if (text) return text;
      }
    } catch (e) {
      console.error("Anthropic Claude API call failed, falling back to mock:", e);
    }
  }
  return simulateLLMResponse(role, prompt);
}
__name(callAgent, "callAgent");
function simulateLLMResponse(role, prompt) {
  console.log(`[Mock LLM] Role: ${role}, Prompt length: ${prompt.length}`);
  if (role.toLowerCase().includes("aso") || role.toLowerCase().includes("content")) {
    if (prompt.includes("social post drafts") || prompt.includes("aso")) {
      const appNameMatch = prompt.match(/App Name:\s*([^\n]+)/);
      const appName = appNameMatch ? appNameMatch[1].trim() : "Fictional App";
      const appDescMatch = prompt.match(/App Description:\s*([^\n]+)/);
      const appDesc = appDescMatch ? appDescMatch[1].trim() : "A mobile app";
      const categories = ["productivity", "health", "fitness", "finance", "wellness"];
      const matchedCat = categories.find((c) => appDesc.toLowerCase().includes(c) || prompt.toLowerCase().includes(c)) || "productivity";
      if (matchedCat === "productivity") {
        return JSON.stringify({
          aso: {
            title: `${appName} \u2014 Plan & Focus`,
            subtitle: "Beat procrastination, build clean daily momentum.",
            keywords: ["habit tracker", "productivity planner", "focus timer", "daily schedule", "routine builder"]
          },
          social: [
            {
              platform: "Reddit",
              text: `**I built a minimalist task planner to escape the shame-loop of rigid calendars.**

Hey r/productivity,

I\u2019ve tried almost every productivity app out there, from Todoist to rigid Google Calendar blocks. The issue? One missed task throws off my whole day, and I end up rage-quitting. 

So I spent 2 months building **${appName}**. It uses adaptive rescheduling\u2014if you miss a task, it auto-shuffles it into your next free slot without guilt-tripping you. 

It\u2019s completely free to try, private (no login needed), and runs on device. Let me know what you think!`
            },
            {
              platform: "LinkedIn",
              text: `Traditional productivity frameworks are broken. They assume humans are robots who follow rigid schedules perfectly. But real work is messy.

That's why we built **${appName}**. Instead of treating task management like a checklist of failures, we built a system that adapts to your work-flow in real-time.

\u{1F33F} No shame. Just momentum.

We're launching on Product Hunt next week! Would love to connect with other builders. #indiehacker #productivity #startups`
            },
            {
              platform: "Twitter",
              text: `1/ Productivity apps treat you like a machine. If you miss one task, your calendar shatters. It doesn't work.

2/ We built ${appName} to change that. Adaptive scheduling that bends, so your momentum doesn't break.

3/ No signups. Runs on device. 100% private. 

4/ Launching soon. Check it out here: link-in-bio \u{1F33F}`
            }
          ]
        }, null, 2);
      } else {
        return JSON.stringify({
          aso: {
            title: `${appName} \u2014 Adaptive Growth`,
            subtitle: "Sustainable habits without the shame loops.",
            keywords: ["habit tracker", "daily routine", "self care", "wellness tracker", "sustainable habit"]
          },
          social: [
            {
              platform: "Reddit",
              text: `**How I built a ${matchedCat} app that doesn't guilt-trip you.**

Hey Reddit,

Most apps in the ${matchedCat} space are designed like streak machines. Miss a day, lose your 100-day streak, feel like trash, delete the app.

I got tired of that, so I built **${appName}**. The streaks survive rest days or sick days, and it has a 90-second weekly review that helps you reflect rather than feel guilty. Private, no ads, built by an indie team. Check it out!`
            },
            {
              platform: "LinkedIn",
              text: `Streak-based habit apps are slot machines. They design for dopamine hits, not behavior change. 

With **${appName}**, we're proving that empathy-driven product design can drive higher retention than artificial shame loops. Real life has weekends, rest days, and sick days. Your software should reflect that.

#buildinginpublic #wellness #habits`
            },
            {
              platform: "Twitter",
              text: `1/ Missed a day and lost a 200-day streak? We've all been there. It's why we uninstall habit trackers.

2/ ${appName} features "flex streaks" that bend around real life, rest days, and sick days.

3/ Sustainable habit building is about staying in the game, not perfection. \u{1F33F}

4/ Open beta starts now!`
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
        finding: "Instagram Reels are driving 2.1\xD7 higher installs than LinkedIn posts.",
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
__name(simulateLLMResponse, "simulateLLMResponse");
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json"
  };
}
__name(corsHeaders, "corsHeaders");
function handleOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders()
  });
}
__name(handleOptions, "handleOptions");

// api/communities.ts
var onRequestOptions = handleOptions;
var onRequestGet = /* @__PURE__ */ __name(async () => {
  try {
    const communities = [
      {
        name: "r/getdisciplined",
        platform: "Reddit",
        size: "1.4M members",
        best: "Tue\u2013Thu, 9am PST",
        rules: "No self-promo without value. Story format works.",
        difficulty: 3,
        traffic: "High",
        cta: "Draft founder story"
      },
      {
        name: "Indie Hackers",
        platform: "Indie Hackers",
        size: "180K makers",
        best: "Weekdays, 8am EST",
        rules: "Milestones + revenue transparency get traction.",
        difficulty: 2,
        traffic: "Medium",
        cta: "Draft milestone post"
      },
      {
        name: "Product Hunt",
        platform: "Product Hunt",
        size: "5M visitors/mo",
        best: "Tuesday 12:01 PST",
        rules: "One shot per product. Hunters matter.",
        difficulty: 4,
        traffic: "High",
        cta: "Draft launch copy"
      },
      {
        name: "Hacker News",
        platform: "Hacker News",
        size: "5M readers",
        best: "Weekday mornings PST",
        rules: "Show HN posts only. Technical honesty wins.",
        difficulty: 5,
        traffic: "High",
        cta: "Draft Show HN"
      },
      {
        name: "r/productivity",
        platform: "Reddit",
        size: "2.1M members",
        best: "Sun\u2013Mon evenings",
        rules: "Discuss method, not product. Link in comments.",
        difficulty: 3,
        traffic: "Medium",
        cta: "Draft discussion"
      }
    ];
    return new Response(JSON.stringify(communities), {
      status: 200,
      headers: corsHeaders()
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders()
    });
  }
}, "onRequestGet");

// api/competitors.ts
var onRequestOptions2 = handleOptions;
var onRequestGet2 = /* @__PURE__ */ __name(async () => {
  try {
    const competitors = [
      {
        name: "Habitify",
        emoji: "\u2705",
        rating: 4.7,
        downloads: "1.2M",
        pricing: "Freemium",
        strengths: ["Clean UX", "Cross-device sync", "Rich charts"],
        weaknesses: ["Weak community", "Overwhelming for beginners"],
        channels: ["App Store", "Reddit", "Product Hunt"],
        keywords: ["habit tracker", "daily routine", "productivity"],
        complaint: '"Way too many settings \u2014 I just want to check off my morning walk."'
      },
      {
        name: "Streaks",
        emoji: "\u{1F525}",
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
        emoji: "\u{1F4C5}",
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
        emoji: "\u{1F305}",
        rating: 4.6,
        downloads: "10M+",
        pricing: "Subscription ($9.99/mo)",
        strengths: ["Coach-driven content", "Big brand", "Guided routines"],
        weaknesses: ["Expensive", "Aggressive paywall", "Feels bloated"],
        channels: ["TikTok", "YouTube ads", "Instagram"],
        keywords: ["morning routine", "wellness coach"],
        complaint: `"Free trial forced me into a $80/year plan I didn't want."`
      }
    ];
    return new Response(JSON.stringify(competitors), {
      status: 200,
      headers: corsHeaders()
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders()
    });
  }
}, "onRequestGet");

// api/dashboard.ts
var onRequestOptions3 = handleOptions;
var onRequestGet3 = /* @__PURE__ */ __name(async () => {
  try {
    const dashboardData = {
      installs: 1284,
      ctr: 4.6,
      activationRate: 42.6,
      productHuntRank: "#4",
      installsTrend: [82, 214, 168, 242, 198, 158, 222],
      sources: [
        { name: "Organic", value: 46, color: "#26AD87" },
        { name: "Product Hunt", value: 22, color: "#DE8C21" },
        { name: "Reddit", value: 18, color: "#3564CA" },
        { name: "Paid Meta", value: 14, color: "#BF4057" }
      ],
      campaigns: [
        {
          id: "c-1",
          name: "Product Hunt Launch Week",
          platforms: ["Product Hunt", "Twitter", "LinkedIn"],
          status: "running",
          launchDate: "2026-07-14",
          budget: 800,
          spark: [12, 18, 22, 31, 28, 42, 51, 47, 62, 71],
          audience: "Indie hackers and productivity enthusiasts, 25\u201340",
          asset: "Product Hunt Description"
        },
        {
          id: "c-2",
          name: "r/getdisciplined Founder Story",
          platforms: ["Reddit"],
          status: "completed",
          launchDate: "2026-07-02",
          budget: 0,
          spark: [4, 9, 14, 22, 19, 25, 30, 28, 33, 29],
          audience: "Reddit self-improvement community",
          asset: "Reddit Launch Post"
        },
        {
          id: "c-3",
          name: "Instagram Reels \u2014 7 Habits",
          platforms: ["Instagram", "TikTok"],
          status: "scheduled",
          launchDate: "2026-07-20",
          budget: 450,
          spark: [],
          audience: "Health-conscious millennials on social media",
          asset: "Instagram Caption"
        },
        {
          id: "c-4",
          name: "Micro-influencer Wave",
          platforms: ["Instagram", "TikTok"],
          status: "draft",
          launchDate: "2026-07-25",
          budget: 1200,
          spark: [],
          audience: "Gen-Z wellness and productivity audience"
        }
      ]
    };
    return new Response(JSON.stringify(dashboardData), {
      status: 200,
      headers: corsHeaders()
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders()
    });
  }
}, "onRequestGet");

// api/generate-content.ts
var onRequestOptions4 = handleOptions;
var onRequestPost = /* @__PURE__ */ __name(async (context) => {
  try {
    const data = await context.request.json();
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
    let cleanJson = responseText.trim();
    if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```json\s*/, "").replace(/```$/, "").trim();
    }
    let parsedData;
    try {
      parsedData = JSON.parse(cleanJson);
    } catch (parseErr) {
      console.error("Failed to parse JSON from LLM response:", responseText);
      parsedData = JSON.parse(await callAgent("LaunchOS Marketing AI Agent", `FALLBACK: ${prompt}`, {}));
    }
    return new Response(JSON.stringify(parsedData), {
      status: 200,
      headers: corsHeaders()
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders()
    });
  }
}, "onRequestPost");

// api/influencers.ts
var onRequestOptions5 = handleOptions;
var onRequestGet4 = /* @__PURE__ */ __name(async () => {
  try {
    const influencers = [
      {
        name: "Maya Okafor",
        handle: "@mayabuilds",
        platform: "Instagram",
        followers: "38.2K",
        engagement: "6.4%",
        installs: "420\u2013620",
        price: "$650",
        match: 92,
        tags: ["habits", "wellness", "solo founders"]
      },
      {
        name: "Devon Park",
        handle: "@devonpark",
        platform: "TikTok",
        followers: "112K",
        engagement: "8.1%",
        installs: "1.1K\u20131.6K",
        price: "$1,400",
        match: 88,
        tags: ["productivity", "gen-z", "morning routines"]
      },
      {
        name: "Rina Patel",
        handle: "@rina.reads",
        platform: "Instagram",
        followers: "22.5K",
        engagement: "5.9%",
        installs: "280\u2013410",
        price: "$400",
        match: 84,
        tags: ["mindfulness", "journaling"]
      },
      {
        name: "Alex Thorne",
        handle: "@alexbuildsapps",
        platform: "Twitter",
        followers: "48K",
        engagement: "3.2%",
        installs: "180\u2013260",
        price: "$250",
        match: 79,
        tags: ["indie dev", "launch", "iOS"]
      },
      {
        name: "Sana Ito",
        handle: "@sanaito",
        platform: "TikTok",
        followers: "215K",
        engagement: "9.4%",
        installs: "1.8K\u20132.4K",
        price: "$2,100",
        match: 76,
        tags: ["study", "aesthetic", "planner"]
      }
    ];
    return new Response(JSON.stringify(influencers), {
      status: 200,
      headers: corsHeaders()
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders()
    });
  }
}, "onRequestGet");

// api/launch-health-score.ts
var onRequestOptions6 = handleOptions;
var onRequestPost2 = /* @__PURE__ */ __name(async (context) => {
  try {
    const data = await context.request.json().catch(() => ({}));
    const { runningCampaigns = 1, completedStages = 2, hasAso = true } = data;
    const asoCompleteness = hasAso ? 95 : 30;
    const contentFreshness = Math.min(95, 45 + completedStages * 15);
    const campaignExecution = Math.min(100, 30 + runningCampaigns * 25);
    const engagementTrend = runningCampaigns > 0 ? 88 : 65;
    const score = Math.round(
      asoCompleteness * 0.3 + contentFreshness * 0.2 + campaignExecution * 0.3 + engagementTrend * 0.2
    );
    const result = {
      score,
      breakdown: {
        asoCompleteness,
        contentFreshness,
        campaignExecution,
        engagementTrend
      }
    };
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: corsHeaders()
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders()
    });
  }
}, "onRequestPost");

// api/recommendations.ts
var onRequestOptions7 = handleOptions;
var onRequestPost3 = /* @__PURE__ */ __name(async (context) => {
  try {
    const data = await context.request.json().catch(() => ({}));
    const { name, description, installsTrend, ctr } = data;
    const appName = name || "Fernly";
    const appDesc = description || "A calm habit tracker.";
    const currentCtr = ctr || 4.6;
    const currentInstalls = installsTrend ? installsTrend.reduce((a, b) => a + b, 0) : 1284;
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
      parsedData = JSON.parse(await callAgent("LaunchOS Growth Advisor Agent", `FALLBACK: ${prompt}`, {}));
    }
    return new Response(JSON.stringify(parsedData), {
      status: 200,
      headers: corsHeaders()
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders()
    });
  }
}, "onRequestPost");

// ../.wrangler/tmp/pages-94bsdz/functionsRoutes-0.16040469740427632.mjs
var routes = [
  {
    routePath: "/api/communities",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet]
  },
  {
    routePath: "/api/communities",
    mountPath: "/api",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions]
  },
  {
    routePath: "/api/competitors",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet2]
  },
  {
    routePath: "/api/competitors",
    mountPath: "/api",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions2]
  },
  {
    routePath: "/api/dashboard",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet3]
  },
  {
    routePath: "/api/dashboard",
    mountPath: "/api",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions3]
  },
  {
    routePath: "/api/generate-content",
    mountPath: "/api",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions4]
  },
  {
    routePath: "/api/generate-content",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost]
  },
  {
    routePath: "/api/influencers",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet4]
  },
  {
    routePath: "/api/influencers",
    mountPath: "/api",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions5]
  },
  {
    routePath: "/api/launch-health-score",
    mountPath: "/api",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions6]
  },
  {
    routePath: "/api/launch-health-score",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost2]
  },
  {
    routePath: "/api/recommendations",
    mountPath: "/api",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions7]
  },
  {
    routePath: "/api/recommendations",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost3]
  }
];

// C:/Users/hempr/AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// C:/Users/hempr/AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");

// C:/Users/hempr/AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// C:/Users/hempr/AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// ../.wrangler/tmp/bundle-jfl9du/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_template_worker_default;

// C:/Users/hempr/AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// ../.wrangler/tmp/bundle-jfl9du/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=functionsWorker-0.906710701291072.mjs.map
