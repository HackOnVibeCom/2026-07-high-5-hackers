import { onRequestGet as __api_communities_ts_onRequestGet } from "D:\\Higher5Members\\2026-07-high-5-hackers\\functions\\api\\communities.ts"
import { onRequestOptions as __api_communities_ts_onRequestOptions } from "D:\\Higher5Members\\2026-07-high-5-hackers\\functions\\api\\communities.ts"
import { onRequestGet as __api_competitors_ts_onRequestGet } from "D:\\Higher5Members\\2026-07-high-5-hackers\\functions\\api\\competitors.ts"
import { onRequestOptions as __api_competitors_ts_onRequestOptions } from "D:\\Higher5Members\\2026-07-high-5-hackers\\functions\\api\\competitors.ts"
import { onRequestGet as __api_dashboard_ts_onRequestGet } from "D:\\Higher5Members\\2026-07-high-5-hackers\\functions\\api\\dashboard.ts"
import { onRequestOptions as __api_dashboard_ts_onRequestOptions } from "D:\\Higher5Members\\2026-07-high-5-hackers\\functions\\api\\dashboard.ts"
import { onRequestOptions as __api_generate_content_ts_onRequestOptions } from "D:\\Higher5Members\\2026-07-high-5-hackers\\functions\\api\\generate-content.ts"
import { onRequestPost as __api_generate_content_ts_onRequestPost } from "D:\\Higher5Members\\2026-07-high-5-hackers\\functions\\api\\generate-content.ts"
import { onRequestGet as __api_influencers_ts_onRequestGet } from "D:\\Higher5Members\\2026-07-high-5-hackers\\functions\\api\\influencers.ts"
import { onRequestOptions as __api_influencers_ts_onRequestOptions } from "D:\\Higher5Members\\2026-07-high-5-hackers\\functions\\api\\influencers.ts"
import { onRequestOptions as __api_launch_health_score_ts_onRequestOptions } from "D:\\Higher5Members\\2026-07-high-5-hackers\\functions\\api\\launch-health-score.ts"
import { onRequestPost as __api_launch_health_score_ts_onRequestPost } from "D:\\Higher5Members\\2026-07-high-5-hackers\\functions\\api\\launch-health-score.ts"
import { onRequestOptions as __api_recommendations_ts_onRequestOptions } from "D:\\Higher5Members\\2026-07-high-5-hackers\\functions\\api\\recommendations.ts"
import { onRequestPost as __api_recommendations_ts_onRequestPost } from "D:\\Higher5Members\\2026-07-high-5-hackers\\functions\\api\\recommendations.ts"

export const routes = [
    {
      routePath: "/api/communities",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_communities_ts_onRequestGet],
    },
  {
      routePath: "/api/communities",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_communities_ts_onRequestOptions],
    },
  {
      routePath: "/api/competitors",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_competitors_ts_onRequestGet],
    },
  {
      routePath: "/api/competitors",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_competitors_ts_onRequestOptions],
    },
  {
      routePath: "/api/dashboard",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_dashboard_ts_onRequestGet],
    },
  {
      routePath: "/api/dashboard",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_dashboard_ts_onRequestOptions],
    },
  {
      routePath: "/api/generate-content",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_generate_content_ts_onRequestOptions],
    },
  {
      routePath: "/api/generate-content",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_generate_content_ts_onRequestPost],
    },
  {
      routePath: "/api/influencers",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_influencers_ts_onRequestGet],
    },
  {
      routePath: "/api/influencers",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_influencers_ts_onRequestOptions],
    },
  {
      routePath: "/api/launch-health-score",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_launch_health_score_ts_onRequestOptions],
    },
  {
      routePath: "/api/launch-health-score",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_launch_health_score_ts_onRequestPost],
    },
  {
      routePath: "/api/recommendations",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_recommendations_ts_onRequestOptions],
    },
  {
      routePath: "/api/recommendations",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_recommendations_ts_onRequestPost],
    },
  ]