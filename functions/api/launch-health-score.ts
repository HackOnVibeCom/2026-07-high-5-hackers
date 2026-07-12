// functions/api/launch-health-score.ts
import { corsHeaders, handleOptions } from "./utils";

export const onRequestOptions = handleOptions;

export const onRequestPost: PagesFunction = async (context) => {
  try {
    const data: any = await context.request.json().catch(() => ({}));
    const { runningCampaigns = 1, completedStages = 2, hasAso = true } = data;

    // ASO completeness: 90% if hasAso, 30% otherwise
    const asoCompleteness = hasAso ? 95 : 30;
    
    // Content freshness: 50% base, +15% per completed stage up to 95%
    const contentFreshness = Math.min(95, 45 + completedStages * 15);

    // Campaign execution: 40% base, +20% per running campaign up to 100%
    const campaignExecution = Math.min(100, 30 + runningCampaigns * 25);

    // Engagement trend: standard score that scales with campaigns
    const engagementTrend = runningCampaigns > 0 ? 88 : 65;

    // Simple weighted average formula
    // ASO: 30%, Content: 20%, Campaign: 30%, Engagement: 20%
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
