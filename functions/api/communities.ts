// functions/api/communities.ts
import { corsHeaders, handleOptions } from "./utils";

export const onRequestOptions = handleOptions;

export const onRequestGet: PagesFunction = async () => {
  try {
    const communities = [
      {
        name: "r/getdisciplined",
        platform: "Reddit",
        size: "1.4M members",
        best: "Tue–Thu, 9am PST",
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
        best: "Sun–Mon evenings",
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
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders()
    });
  }
};
