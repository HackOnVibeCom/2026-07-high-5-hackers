// functions/api/dashboard.ts
import { corsHeaders, handleOptions, predictLaunchPerformance, type CopyDraft } from "./utils";

export const onRequestOptions = handleOptions;

export const onRequestPost: PagesFunction = async (context) => {
  try {
    const data: any = await context.request.json().catch(() => ({}));
    const {
      name = "Fernly",
      description = "A habit tracker",
      category = "Health & Fitness",
      asoTitle = "",
      asoSubtitle = "",
      asoKeywords = [],
      socialDrafts = [],
      campaigns = []
    } = data;

    // Use ML model to forecast launch scores
    const forecast = predictLaunchPerformance(
      name,
      description,
      category,
      asoTitle,
      asoSubtitle,
      asoKeywords,
      socialDrafts
    );

    // Calculate dynamic installs based on campaigns
    let totalInstalls = forecast.predictedInstalls;
    let baseCtr = forecast.predictedCtr;
    
    // Adjust metrics based on active campaigns
    const runningCampaigns = campaigns.filter((c: any) => c.status === "running");
    const completedCampaigns = campaigns.filter((c: any) => c.status === "completed");
    
    runningCampaigns.forEach((c: any) => {
      const budgetWeight = c.budget ? Math.min(3, c.budget / 400) : 1;
      totalInstalls += Math.round(350 * budgetWeight * (forecast.combinedLaunchScore / 100));
    });

    completedCampaigns.forEach((c: any) => {
      const budgetWeight = c.budget ? Math.min(2, c.budget / 500) : 0.5;
      totalInstalls += Math.round(150 * budgetWeight);
    });

    // Dynamic CTR adjustment
    if (runningCampaigns.length > 0) {
      baseCtr = parseFloat((baseCtr * 1.15).toFixed(1));
    }

    // Dynamic Product Hunt Rank
    let productHuntRank = "N/A";
    const phCampaign = campaigns.find((c: any) => c.platforms && c.platforms.includes("Product Hunt"));
    if (phCampaign) {
      if (phCampaign.status === "running") {
        if (forecast.combinedLaunchScore >= 85) productHuntRank = "#2";
        else if (forecast.combinedLaunchScore >= 70) productHuntRank = "#4";
        else productHuntRank = "#7";
      } else if (phCampaign.status === "completed") {
        if (forecast.combinedLaunchScore >= 85) productHuntRank = "#3";
        else if (forecast.combinedLaunchScore >= 70) productHuntRank = "#5";
        else productHuntRank = "#10";
      } else if (phCampaign.status === "scheduled") {
        productHuntRank = "Scheduled";
      }
    }

    // Generate dynamic installs trend
    const installsTrend = [
      Math.round(totalInstalls * 0.08),
      Math.round(totalInstalls * 0.14),
      Math.round(totalInstalls * 0.11),
      Math.round(totalInstalls * 0.18),
      Math.round(totalInstalls * 0.15),
      Math.round(totalInstalls * 0.13),
      Math.round(totalInstalls * 0.21),
    ];

    // Dynamic sources value calculation
    let organicShare = 45;
    let phShare = phCampaign ? 30 : 5;
    let socialShare = socialDrafts.length > 0 ? 25 : 10;
    const totalShare = organicShare + phShare + socialShare;
    
    organicShare = Math.round((organicShare / totalShare) * 100);
    phShare = Math.round((phShare / totalShare) * 100);
    socialShare = 100 - organicShare - phShare;

    const sources = [
      { name: "Organic", value: organicShare, color: "#26AD87" },
      { name: "Product Hunt", value: phShare, color: "#DE8C21" },
      { name: "Reddit & Social", value: socialShare, color: "#3564CA" }
    ];

    const result = {
      installs: totalInstalls,
      ctr: baseCtr,
      activationRate: parseFloat((30 + (forecast.combinedLaunchScore / 100) * 20).toFixed(1)),
      productHuntRank,
      installsTrend,
      sources,
      campaigns
    };

    return new Response(JSON.stringify(result), {
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

// Fallback to post calculation if GET is called (returning default mockup)
export const onRequestGet: PagesFunction = async () => {
  try {
    const defaultData = {
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
      campaigns: []
    };
    return new Response(JSON.stringify(defaultData), {
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
