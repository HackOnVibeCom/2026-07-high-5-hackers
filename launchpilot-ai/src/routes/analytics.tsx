import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "../lib/store";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import { Lock, TrendingUp, BarChart3, PieChart as PieIcon, Activity } from "lucide-react";
import { chartTooltipStyle, CHART_AXIS, CHART_GRID, CHART_DOT_STROKE } from "../lib/chart-theme";

export const Route = createFileRoute("/analytics")({
  component: Analytics,
});

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

// Shown only until the first /api/dashboard response lands.
const fallbackInstallsData = [
  { day: "Mon", installs: 82 },
  { day: "Tue", installs: 214 },
  { day: "Wed", installs: 168 },
  { day: "Thu", installs: 242 },
  { day: "Fri", installs: 198 },
  { day: "Sat", installs: 158 },
  { day: "Sun", installs: 222 },
];

const SOURCE_COLORS = ["#26AD87", "#DE8C21", "#3564CA", "#BF4057", "#7B828E"];

function Analytics() {
  const campaigns = useApp((s) => s.campaigns);
  const dashboardData = useApp((s) => s.dashboardData);
  const fetchDashboard = useApp((s) => s.fetchDashboard);
  const unlocked = campaigns.some((c) => c.status === "running" || c.status === "completed");
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    if (!dashboardData) fetchDashboard();
  }, [dashboardData, fetchDashboard]);

  const installsData: { day: string; installs: number }[] =
    dashboardData?.weeklyInstalls ?? fallbackInstallsData;
  const totalInstalls = installsData.reduce((sum, d) => sum + d.installs, 0);
  const peakDay = installsData.reduce((a, b) => (b.installs > a.installs ? b : a), installsData[0]);

  // Aggregate real campaign performance (spark points) per platform.
  const platforms = useMemo(() => {
    const totals = new Map<string, number>();
    for (const c of campaigns) {
      if (c.status === "draft") continue;
      const weight = c.spark.length
        ? c.spark.reduce((s, v) => s + v, 0)
        : Math.max(60, Math.round(c.budget / 10));
      for (const p of c.platforms) totals.set(p, (totals.get(p) ?? 0) + weight);
    }
    return [...totals.entries()]
      .map(([name, installs]) => ({ name, installs }))
      .sort((a, b) => b.installs - a.installs)
      .slice(0, 5);
  }, [campaigns]);

  const sources = useMemo(() => {
    const total = platforms.reduce((s, p) => s + p.installs, 0) || 1;
    return platforms.map((p, i) => ({
      name: p.name,
      value: Math.round((p.installs / total) * 100),
      color: SOURCE_COLORS[i % SOURCE_COLORS.length],
    }));
  }, [platforms]);

  const topPlatform = platforms[0]?.name ?? "Reddit";
  const runnerUp = platforms[1];
  const ratio =
    runnerUp && runnerUp.installs > 0
      ? Math.max(1, Math.round(platforms[0].installs / runnerUp.installs))
      : null;

  if (!unlocked) {
    return (
      <motion.div
        className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/5 border border-white/10 text-neutral-400">
          <Lock className="h-6 w-6" />
        </div>
        <h1 className="mt-5 font-display text-2xl font-semibold text-neutral-900">
          Analytics is warming up.
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Once a campaign is running or completed, this page fills with what worked and what didn't.
        </p>
        <Link
          to="/campaigns"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-amber-600 shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
        >
          Go to campaigns
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Activity className="h-4 w-4" />
          </div>
          <p className="text-sm text-neutral-500">Analytics</p>
        </div>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-neutral-900">
          What worked, why, and what to do next.
        </h1>
        {filter && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs text-amber-400">
            Filtered by: <span className="font-mono font-bold">{filter}</span>
            <button onClick={() => setFilter(null)} className="text-amber-300 hover:underline">
              clear
            </button>
          </div>
        )}
      </motion.header>

      {/* Metrics Row */}
      <motion.section
        className="grid grid-cols-2 gap-3 sm:grid-cols-5"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        <Metric
          icon={<TrendingUp className="h-3.5 w-3.5" />}
          label="Downloads"
          value={(dashboardData?.installs ?? totalInstalls).toLocaleString()}
          delta={dashboardData?.installsDelta ?? "+0.0%"}
          positive
        />
        <Metric icon={<BarChart3 className="h-3.5 w-3.5" />} label="Retention (D7)" value="38.1%" delta="+1.8%" positive />
        <Metric icon={<Activity className="h-3.5 w-3.5" />} label="CTR" value="4.6%" delta="-14.2%" />
        <Metric
          icon={<PieIcon className="h-3.5 w-3.5" />}
          label="Activation"
          value={dashboardData?.activationRate ?? "12.3%"}
          delta="+3.4%"
          positive
        />
        <Metric
          icon={<TrendingUp className="h-3.5 w-3.5" />}
          label="PH Rank"
          value={dashboardData?.productHuntRank ?? "—"}
          delta={dashboardData?.topChannel ? `top: ${dashboardData.topChannel}` : "+0.4×"}
          positive
        />
      </motion.section>

      {/* Charts Row */}
      <motion.section
        className="grid gap-4 lg:grid-cols-3"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 lg:col-span-2">
          <h3 className="text-sm font-semibold text-neutral-900">Installs — last 7 days</h3>
          <p className="text-xs text-neutral-500">
            Total {totalInstalls.toLocaleString()} · {peakDay?.day} was your strongest day.
          </p>
          <div className="mt-5 h-64">
            <ResponsiveContainer>
              <LineChart data={installsData}>
                <CartesianGrid stroke={CHART_GRID} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" stroke={CHART_AXIS} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={CHART_AXIS} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ stroke: "rgba(222,140,33,0.3)" }} contentStyle={chartTooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="installs"
                  stroke="#DE8C21"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#DE8C21", strokeWidth: 2, stroke: CHART_DOT_STROKE }}
                  activeDot={{ r: 6, fill: "#DE8C21", stroke: "#fff", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-neutral-900">Traffic sources</h3>
          <p className="text-xs text-neutral-500">Click a slice to drill down.</p>
          <div className="mt-4 h-48">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={sources}
                  dataKey="value"
                  innerRadius={44}
                  outerRadius={74}
                  paddingAngle={3}
                  onClick={(d: { name?: string }) => d?.name && setFilter(d.name)}
                >
                  {sources.map((s) => (
                    <Cell key={s.name} fill={s.color} stroke="none" style={{ cursor: "pointer" }} />
                  ))}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 space-y-1.5">
            {sources.map((s) => (
              <li key={s.name} className="flex items-center gap-2 text-xs">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="flex-1 text-neutral-700">{s.name}</span>
                <span className="font-mono text-neutral-500">{s.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.section>

      {/* Platforms */}
      <motion.section
        className="rounded-2xl border border-neutral-200 bg-white p-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <h3 className="text-sm font-semibold text-neutral-900">Top-performing platforms</h3>
        <p className="text-xs text-neutral-500">
          {ratio && ratio > 1
            ? `${topPlatform} is out-performing ${runnerUp!.name} ${ratio}:1 this week.`
            : `${topPlatform} is your strongest channel this week.`}
        </p>
        <div className="mt-5 h-64">
          <ResponsiveContainer>
            <BarChart data={platforms} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid stroke={CHART_GRID} strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" stroke={CHART_AXIS} fontSize={11} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" stroke={CHART_AXIS} fontSize={11} tickLine={false} axisLine={false} width={100} />
              <Tooltip cursor={{ fill: "rgba(222,140,33,0.05)" }} contentStyle={chartTooltipStyle} />
              <Bar
                dataKey="installs"
                fill="#DE8C21"
                radius={[0, 8, 8, 0]}
                onClick={(d: { name?: string }) => d?.name && setFilter(d.name)}
                style={{ cursor: "pointer" }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.section>
    </div>
  );
}

function Metric({
  label,
  value,
  delta,
  positive,
  icon,
}: {
  label: string;
  value: string;
  delta: string;
  positive?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl border border-neutral-200 bg-white p-4 transition-all hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5"
    >
      <div className="flex items-center gap-2">
        {icon && <span className="text-neutral-500">{icon}</span>}
        <span className="text-xs text-neutral-500">{label}</span>
      </div>
      <div className="mt-1.5 font-display text-2xl font-bold text-neutral-900">{value}</div>
      <div
        className={`mt-1.5 inline-flex rounded-md px-2 py-0.5 font-mono text-[11px] font-semibold ${positive ? "bg-teal-100 text-teal-800" : "bg-rose-100 text-rose-800"}`}
      >
        {delta}
      </div>
    </motion.div>
  );
}
