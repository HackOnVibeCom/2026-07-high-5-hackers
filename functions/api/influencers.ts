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
        match: 92,
        tags: ["habits", "wellness", "solo founders"]
      },
      {
        name: "Devon Park",
        handle: "@devonpark",
        platform: "TikTok",
        followers: "112K",
        engagement: "8.1%",
        installs: "1.1K–1.6K",
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
        installs: "280–410",
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
        installs: "180–260",
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
        installs: "1.8K–2.4K",
        price: "$2,100",
        match: 76,
        tags: ["study", "aesthetic", "planner"]
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
