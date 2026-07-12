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
