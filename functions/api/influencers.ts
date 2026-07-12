// functions/api/influencers.ts
import { corsHeaders, handleOptions } from "./utils";

export const onRequestOptions = handleOptions;

export const onRequestGet: PagesFunction = async () => {
  try {
    const influencers = [
      {
        name: "Maya Okafor",
        handle: "@mayabuilds",
        platform: "Instagram",
        followers: "38.2K",
        engagement: "6.4%",
        installs: "420–620",
        price: "$650",
        campaignCost: "$650",
        roiPrediction: "2.1x",
        predictedInstalls: 520,
        collaborationsCount: 14,
        match: 92,
        tags: ["habits", "wellness", "solo founders"],
        category: "Health & Fitness",
        description: "Focuses on daily journaling, mental health, habit trackers, and visual aesthetic setups.",
        fakeFollowerRisk: "Low (1.4%)",
        collaborationType: "Visual Story Setup + Link",
        installsForecast: "+520 downloads",
        growthScore: 89
      },
      {
        name: "Devon Park",
        handle: "@devonpark",
        platform: "TikTok",
        followers: "112K",
        engagement: "8.1%",
        installs: "1.1K–1.6K",
        price: "$1,400",
        campaignCost: "$1,400",
        roiPrediction: "2.6x",
        predictedInstalls: 1350,
        collaborationsCount: 22,
        match: 88,
        tags: ["productivity", "gen-z", "morning routines"],
        category: "Productivity",
        description: "Dynamic video formats mapping morning routine challenges and student focus schedules.",
        fakeFollowerRisk: "Very Low (0.8%)",
        collaborationType: "1-Min Challenge Review",
        installsForecast: "+1,350 downloads",
        growthScore: 94
      },
      {
        name: "Rina Patel",
        handle: "@rina.reads",
        platform: "Instagram",
        followers: "22.5K",
        engagement: "5.9%",
        installs: "280–410",
        price: "$400",
        campaignCost: "$400",
        roiPrediction: "1.8x",
        predictedInstalls: 340,
        collaborationsCount: 9,
        match: 84,
        tags: ["mindfulness", "journaling", "calm"],
        category: "Health & Fitness",
        description: "Creates quiet content focused on slow living, daily reading reflections, and wellness apps.",
        fakeFollowerRisk: "Medium (4.2%)",
        collaborationType: "Story Integration + Q&A",
        installsForecast: "+340 downloads",
        growthScore: 81
      },
      {
        name: "Alex Thorne",
        handle: "@alexbuildsapps",
        platform: "Twitter",
        followers: "48K",
        engagement: "3.2%",
        installs: "180–260",
        price: "$250",
        campaignCost: "$250",
        roiPrediction: "2.3x",
        predictedInstalls: 220,
        collaborationsCount: 31,
        match: 79,
        tags: ["indie dev", "launch", "iOS", "buildinpublic"],
        category: "Productivity",
        description: "Indie software developer sharing launch stories, code tools, and tech productivity tips.",
        fakeFollowerRisk: "Low (2.1%)",
        collaborationType: "Thread mention + newsletter",
        installsForecast: "+220 downloads",
        growthScore: 85
      },
      {
        name: "Sana Ito",
        handle: "@sanaito",
        platform: "TikTok",
        followers: "215K",
        engagement: "9.4%",
        installs: "1.8K–2.4K",
        price: "$2,100",
        campaignCost: "$2,100",
        roiPrediction: "1.9x",
        predictedInstalls: 2100,
        collaborationsCount: 18,
        match: 76,
        tags: ["study", "aesthetic", "planner"],
        category: "Productivity",
        description: "Aesthetic bullet-journal layouts, study vlog routines, and digital planning templates.",
        fakeFollowerRisk: "Very Low (1.1%)",
        collaborationType: "Video integration (Day in life)",
        installsForecast: "+2,100 downloads",
        growthScore: 87
      },
      {
        name: "Liam O'Connor",
        handle: "@liamfinance",
        platform: "Instagram",
        followers: "64K",
        engagement: "4.8%",
        installs: "500-750",
        price: "$850",
        campaignCost: "$850",
        roiPrediction: "2.4x",
        predictedInstalls: 620,
        collaborationsCount: 11,
        match: 89,
        tags: ["saving", "budget", "financetips"],
        category: "Finance",
        description: "Simple budget templates, expense tracking strategies, and minimalist wealth building.",
        fakeFollowerRisk: "Low (1.9%)",
        collaborationType: "Reel demonstration",
        installsForecast: "+620 downloads",
        growthScore: 91
      },
      {
        name: "Emma Watson",
        handle: "@emmatravels",
        platform: "TikTok",
        followers: "82K",
        engagement: "7.5%",
        installs: "900-1.2K",
        price: "$950",
        campaignCost: "$950",
        roiPrediction: "2.2x",
        predictedInstalls: 1050,
        collaborationsCount: 15,
        match: 91,
        tags: ["backpacking", "hiking", "guides"],
        category: "Travel",
        description: "Offline route reviews, hiking tips, and packing list check-in vlogs.",
        fakeFollowerRisk: "Low (2.3%)",
        collaborationType: "Video review (on trail)",
        installsForecast: "+1,050 downloads",
        growthScore: 90
      }
    ];

    return new Response(JSON.stringify(influencers), {
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
