import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp, Users, Rocket } from "lucide-react";
import { useApp, useActiveWorkspace } from "../lib/store";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: Home,
});

const toneMap: Record<string, string> = {
  teal: "border-teal-200 bg-teal-50",
  amber: "border-amber-200 bg-amber-50",
  blue: "border-blue-200 bg-blue-50",
  rose: "border-rose-200 bg-rose-50",
};
const toneText: Record<string, string> = {
  teal: "text-teal-800",
  amber: "text-amber-800",
  blue: "text-blue-800",
  rose: "text-rose-800",
};

function Home() {
  const onboarded = useApp((s) => s.onboarded);
  const nav = useNavigate();
  const ws = useActiveWorkspace();
  const campaigns = useApp((s) => s.campaigns);

  const fetchDashboard = useApp((s) => s.fetchDashboard);
  const fetchRecommendations = useApp((s) => s.fetchRecommendations);
  const fetchHealthScore = useApp((s) => s.fetchHealthScore);
  const recommendations = useApp((s) => s.recommendations);
  const healthScore = useApp((s) => s.healthScore);
  const dashboardData = useApp((s) => s.dashboardData);

  useEffect(() => {
    if (onboarded) {
      fetchDashboard();
      fetchRecommendations();
      fetchHealthScore();
    }
  }, [onboarded, fetchDashboard, fetchRecommendations, fetchHealthScore]);

  if (!onboarded) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">
          <Sparkles className="h-3 w-3" /> Your AI Growth Agent
        </span>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
          Welcome to LaunchPilot AI.
          <br />
          Let's launch your app.
        </h1>
        <p className="mt-4 max-w-md text-neutral-600">
          Take {ws?.name ?? "your app"} from day one to its first 10,000 users — strategy, assets,
          campaigns and growth insights, on autopilot.
        </p>
        <button
          onClick={() => nav({ to: "/onboarding" })}
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-amber-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-amber-600"
        >
          Get started <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  const running = campaigns.filter((c) => c.status === "running").length;
  const drafts = campaigns.filter((c) => c.status === "draft").length;

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const dateLabel = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="space-y-10">
      <section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-neutral-500">Growth report — {dateLabel}</p>
            <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-neutral-900">
              {greeting}. Here's what {ws?.name} should do next.
            </h1>
          </div>
          <Link
            to="/campaigns"
            className="hidden shrink-0 rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-800 hover:bg-neutral-100 sm:inline-block"
          >
            View all campaigns
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Health Score Card */}
          <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm lg:col-span-1">
            <h3 className="text-sm font-medium text-neutral-500">Launch Health Score</h3>
            {healthScore ? (
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <div className="font-display text-4xl font-semibold tracking-tight text-neutral-900">
                    {healthScore.score}%
                  </div>
                  <p className="mt-1 text-xs text-neutral-500">
                    {healthScore.score >= 80
                      ? "Healthy & ready to scale"
                      : healthScore.score >= 50
                        ? "Needs optimization"
                        : "Critical attention needed"}
                  </p>
                </div>
                <div className="relative h-16 w-16">
                  <svg className="h-full w-full" viewBox="0 0 36 36">
                    <path
                      className="text-neutral-100"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-amber-500 transition-all duration-500"
                      strokeDasharray={`${healthScore.score}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                </div>
              </div>
            ) : (
              <div className="mt-3 text-sm text-neutral-400">Loading health score...</div>
            )}
            
            {healthScore?.breakdown && (
              <div className="mt-4 border-t border-neutral-100 pt-3 space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-neutral-500">ASO Completeness</span>
                  <span className="font-mono text-neutral-800">{healthScore.breakdown.asoCompleteness}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Content Freshness</span>
                  <span className="font-mono text-neutral-800">{healthScore.breakdown.contentFreshness}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Campaign Execution</span>
                  <span className="font-mono text-neutral-800">{healthScore.breakdown.campaignExecution}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Engagement Trend</span>
                  <span className="font-mono text-neutral-800">{healthScore.breakdown.engagementTrend}%</span>
                </div>
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 lg:col-span-2">
            <MiniStat
              label="New installs (7d)"
              value={dashboardData ? String(dashboardData.installs) : "1,284"}
              delta="+18.2%"
              positive
            />
            <MiniStat
              label="Activation rate"
              value={dashboardData ? `${dashboardData.activationRate}%` : "42.6%"}
              delta="-2.1%"
            />
            <MiniStat label="Running campaigns" value={String(running)} delta={`${drafts} drafts`} />
            <MiniStat
              label="Product Hunt rank"
              value={dashboardData ? dashboardData.productHuntRank : "#4"}
              delta="Top 5 today"
              positive
            />
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-md bg-amber-500 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <h2 className="text-lg font-semibold text-neutral-900">Growth Advisor</h2>
          <span className="ml-1 text-sm text-neutral-500">— ranked by impact this week</span>
        </div>
        <div className="grid gap-3">
          {recommendations.length > 0 ? (
            recommendations.map((i: any, idx: number) => {
              const isStudio = i.finding.toLowerCase().includes("screenshot") || i.recommendation.toLowerCase().includes("studio");
              const to = isStudio ? "/studio" : "/campaigns";
              const actionLabel = isStudio ? "Optimize in Studio" : "Adjust Campaigns";
              return (
                <motion.div
                  key={i.id || idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className={`flex flex-col gap-4 rounded-xl border ${toneMap[i.tone || "teal"]} p-5 sm:flex-row sm:items-center`}
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/80 ${toneText[i.tone || "teal"]}`}>
                        Finding
                      </span>
                      <p className={`text-sm font-semibold ${toneText[i.tone || "teal"]}`}>{i.finding}</p>
                    </div>
                    <p className="text-xs text-neutral-600 pl-0 sm:pl-16">
                      <strong className="text-neutral-700">Cause:</strong> {i.cause}
                    </p>
                    <p className="text-xs text-neutral-800 pl-0 sm:pl-16 font-medium">
                      <strong className="text-neutral-900">Recommendation:</strong> {i.recommendation}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 pl-0 sm:pl-16">
                      <span className="rounded-full bg-white/60 px-2 py-0.5 font-mono text-[11px] text-neutral-700">
                        {Math.round((i.confidence || 0.8) * 100)}% confidence
                      </span>
                      <span className="rounded-full bg-white/60 px-2 py-0.5 font-mono text-[11px] text-neutral-700">
                        {i.expected_impact || i.impact}
                      </span>
                    </div>
                  </div>
                  <Link
                    to={to}
                    className="shrink-0 rounded-md bg-white px-3 py-1.5 text-sm font-medium text-neutral-900 shadow-sm hover:bg-neutral-100 self-start sm:self-center"
                  >
                    {actionLabel}
                  </Link>
                </motion.div>
              );
            })
          ) : (
            <div className="rounded-xl border border-dashed border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500">
              Generating Growth Advisor insights...
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <QuickCard
          icon={<Rocket className="h-4 w-4" />}
          title="Launch checklist"
          body="4 of 7 items ready for your Product Hunt push."
          to="/strategy"
        />
        <QuickCard
          icon={<Users className="h-4 w-4" />}
          title="Influencer shortlist"
          body="6 creators at 84%+ audience match."
          to="/discover"
        />
        <QuickCard
          icon={<TrendingUp className="h-4 w-4" />}
          title="Analytics"
          body="Reddit is out-performing paid Meta 3:1."
          to="/analytics"
        />
      </section>
    </div>
  );
}

function MiniStat({
  label,
  value,
  delta,
  positive,
}: {
  label: string;
  value: string;
  delta: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <div className="text-xs text-neutral-500">{label}</div>
      <div className="mt-1 font-display text-2xl font-semibold text-neutral-900">{value}</div>
      <div
        className={`mt-1 inline-flex rounded px-1.5 py-0.5 font-mono text-[11px] ${
          positive ? "bg-teal-100 text-teal-800" : "bg-neutral-100 text-neutral-600"
        }`}
      >
        {delta}
      </div>
    </div>
  );
}

function QuickCard({
  icon,
  title,
  body,
  to,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="group rounded-xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-300 hover:shadow-sm"
    >
      <div className="flex items-center gap-2 text-sm font-medium text-neutral-900">
        <span className="grid h-7 w-7 place-items-center rounded-md bg-neutral-100 text-neutral-700 group-hover:bg-amber-50 group-hover:text-amber-800">
          {icon}
        </span>
        {title}
      </div>
      <p className="mt-2 text-sm text-neutral-600">{body}</p>
    </Link>
  );
}
