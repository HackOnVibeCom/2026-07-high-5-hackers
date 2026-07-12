// functions/api/dashboard.ts
import { corsHeaders, handleOptions } from "./utils";

export const onRequestOptions = handleOptions;

export const onRequestGet: PagesFunction = async () => {
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
          audience: "Indie hackers and productivity enthusiasts, 25–40",
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
          name: "Instagram Reels — 7 Habits",
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
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders()
    });
  }
};
