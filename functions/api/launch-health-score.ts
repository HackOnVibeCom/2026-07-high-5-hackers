// functions/api/launch-health-score.ts
import { corsHeaders, handleOptions, predictLaunchPerformance } from "./utils";

export const onRequestOptions = handleOptions;

export const onRequestPost: PagesFunction = async (context) => {
  try {
    const data: any = await context.request.json().catch(() => ({}));
    const {
      name = "Fernly",
      description = "A calm habit tracker",
      category = "Health & Fitness",
      asoTitle = "",
      asoSubtitle = "",
      asoKeywords = [],
      socialDrafts = [],
      campaigns = [],
      completedStages = []
    } = data;

    // Call ML predictor to get copy and ASO scores
    const forecast = predictLaunchPerformance(
      name,
      description,
      category,
      asoTitle,
      asoSubtitle,
      asoKeywords,
      socialDrafts
    );

    const asoCompleteness = forecast.asoScore;
    const contentFreshness = forecast.copyScore;

    // Campaign execution: 30% base, +25% per running campaign up to 100%
    const runningCampaignsCount = campaigns.filter((c: any) => c.status === "running").length;
    const campaignExecution = Math.min(100, 30 + runningCampaignsCount * 25);

    // Engagement Trend: calculated from forecast conversion and ctr relative to benchmarks
    // Benchmark CTR: 4%, Benchmark Conversion: 15%
    const ctrRatio = forecast.predictedCtr / 4.0;
    const convRatio = forecast.predictedConversion / 15.0;
    const engagementTrend = Math.min(100, Math.round(50 + (ctrRatio * 25) + (convRatio * 25)));

    // Combined Weighted average
    // ASO completeness: 30%, Content freshness: 20%, Campaign execution: 30%, Engagement trend: 20%
    const score = Math.round(
      asoCompleteness * 0.3 +
      contentFreshness * 0.2 +
      campaignExecution * 0.3 +
      engagementTrend * 0.2
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
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders()
    });
  }
};
