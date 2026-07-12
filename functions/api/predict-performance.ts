// functions/api/predict-performance.ts
import { corsHeaders, handleOptions, predictLaunchPerformance } from "./utils";

export const onRequestOptions = handleOptions;

export const onRequestPost: PagesFunction = async (context) => {
  try {
    const data: any = await context.request.json().catch(() => ({}));
    const {
      name = "",
      description = "",
      category = "",
      asoTitle = "",
      asoSubtitle = "",
      asoKeywords = [],
      socialDrafts = []
    } = data;

    const forecast = predictLaunchPerformance(
      name,
      description,
      category,
      asoTitle,
      asoSubtitle,
      asoKeywords,
      socialDrafts
    );

    return new Response(JSON.stringify(forecast), {
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
