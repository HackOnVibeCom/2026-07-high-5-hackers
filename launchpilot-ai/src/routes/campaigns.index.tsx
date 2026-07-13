import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Calendar,
  DollarSign,
  Megaphone,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Activity,
  AlertCircle
} from "lucide-react";
import { useApp, type Campaign } from "../lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/campaigns/")({
  component: Campaigns,
});

const statusColors: Record<Campaign["status"], string> = {
  draft: "bg-neutral-100 text-neutral-600 border-neutral-200",
  scheduled: "bg-blue-50 text-blue-800 border-blue-200",
  running: "bg-teal-50 text-teal-800 border-teal-200",
  completed: "bg-neutral-100 text-neutral-800 border-neutral-300",
};

const STATUS_STEPS: Campaign["status"][] = ["draft", "scheduled", "running", "completed"];

function Sparkline({ data }: { data: number[] }) {
  if (!data.length) return <div className="h-8 text-xs text-neutral-400 font-mono flex items-center">NO DATA</div>;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((v - min) / Math.max(1, max - min)) * 100;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-8 w-24">
      <polyline
        points={points}
        fill="none"
        stroke="#14B8A6"
        strokeWidth="3"
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Campaigns() {
  const campaigns = useApp((s) => s.campaigns);
  const addCampaign = useApp((s) => s.addCampaign);
  const [filter, setFilter] = useState<Campaign["status"] | "all">("all");

  const filtered = filter === "all" ? campaigns : campaigns.filter((c) => c.status === filter);

  // AI Planner presets
  const handleAiPlan = (presetType: string) => {
    let newCamp: Campaign;
    if (presetType === "student") {
      newCamp = {
        id: `c-${Date.now()}`,
        name: "Student Focus Campaign",
        platforms: ["Reddit", "TikTok"],
        status: "scheduled",
        launchDate: "2026-07-20",
        budget: 300,
        spark: [],
        audience: "Gen-Z high school and university students seeking daily routines",
        impressions: 0,
        ctr: 0,
        cpi: 0.8,
        cpc: 0.15,
        expectedRoi: "2.4x",
        risk: "Low",
        platformsDetail: {
          "Reddit": { status: "scheduled", budget: 100, installs: 0 },
          "TikTok": { status: "scheduled", budget: 200, installs: 0 }
        }
      };
    } else if (presetType === "ph") {
      newCamp = {
        id: `c-${Date.now()}`,
        name: "Product Hunt Global Wave",
        platforms: ["Product Hunt", "Twitter", "LinkedIn"],
        status: "draft",
        launchDate: "2026-07-28",
        budget: 600,
        spark: [],
        audience: "Global tech adapters, SaaS makers, and product enthusiasts",
        impressions: 0,
        ctr: 0,
        cpi: 1.1,
        cpc: 0.35,
        expectedRoi: "2.9x",
        risk: "Medium",
        platformsDetail: {
          "Product Hunt": { status: "draft", budget: 300, installs: 0 },
          "Twitter": { status: "draft", budget: 150, installs: 0 },
          "LinkedIn": { status: "draft", budget: 150, installs: 0 }
        }
      };
    } else {
      newCamp = {
        id: `c-${Date.now()}`,
        name: "Organic Reddit Launch Drive",
        platforms: ["Reddit", "Hacker News"],
        status: "draft",
        launchDate: "2026-07-25",
        budget: 0,
        spark: [],
        audience: "Self-improvement makers and early developer teams",
        impressions: 0,
        ctr: 0,
        cpi: 0,
        cpc: 0,
        expectedRoi: "Infinite (Organic)",
        risk: "Low",
        platformsDetail: {
          "Reddit": { status: "draft", budget: 0, installs: 0 },
          "Hacker News": { status: "draft", budget: 0, installs: 0 }
        }
      };
    }

    addCampaign(newCamp);
    toast.success(`AI generated launch campaign: ${newCamp.name}`, {
      description: `Setup channels: ${newCamp.platforms.join(", ")} | Budget: $${newCamp.budget}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.header
        className="flex flex-wrap items-end justify-between gap-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Megaphone className="h-4 w-4" />
            </div>
            <p className="text-sm text-neutral-500">Campaigns Control</p>
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-neutral-900">
            Campaign Command Center
          </h1>
          <p className="text-sm text-neutral-500 mt-1 max-w-xl">
            Orchestrate launch stages, allocate budgets, review predictive conversions, and apply AI budget-shift optimizations.
          </p>
        </div>
        <Link
          to="/campaigns/new"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all hover:scale-[1.03] active:scale-[0.97]"
        >
          <Plus className="h-4 w-4" /> New campaign
        </Link>
      </motion.header>

      {/* AI Campaign Planner Prompt presets */}
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-neutral-800">
          <Sparkles className="h-4 w-4 text-amber-500" /> AI Launch Planner Console
        </div>
        <p className="text-xs text-neutral-500">Click a preset launch prompt to automatically generate an optimized campaign workflow plan:</p>
        
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => handleAiPlan("student")}
            className="bg-white border border-neutral-200 hover:border-amber-400 text-neutral-700 px-3 py-1.5 rounded-lg font-medium transition"
          >
            🚀 "Launch productivity app for students with $300 budget."
          </button>
          <button
            onClick={() => handleAiPlan("ph")}
            className="bg-white border border-neutral-200 hover:border-amber-400 text-neutral-700 px-3 py-1.5 rounded-lg font-medium transition"
          >
            🏆 "Prepare Product Hunt launch with $600 budget."
          </button>
          <button
            onClick={() => handleAiPlan("organic")}
            className="bg-white border border-neutral-200 hover:border-amber-400 text-neutral-700 px-3 py-1.5 rounded-lg font-medium transition"
          >
            🌱 "Deploy organic Reddit marketing campaign."
          </button>
        </div>
      </div>

      {/* Status Filter Tab links */}
      <div className="flex gap-1 border-b border-neutral-200 overflow-x-auto">
        {(["all", "draft", "scheduled", "running", "completed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`relative px-4 py-2.5 text-sm capitalize transition-colors shrink-0 ${
              filter === f ? "text-neutral-900 font-semibold" : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            {f}
            {filter === f && (
              <motion.span
                layoutId="campaign-tab"
                className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-amber-500"
              />
            )}
          </button>
        ))}
      </div>

      {/* Campaigns Listing Grid */}
      <div className="grid gap-4">
        {filtered.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            className="rounded-2xl border border-neutral-200 bg-white p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-amber-500/20 hover:shadow-lg transition-all"
          >
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase font-mono ${statusColors[c.status]}`}>
                  {c.status}
                </span>
                
                <div className="flex flex-wrap gap-1">
                  {c.platforms.map((p) => (
                    <span
                      key={p}
                      className="rounded bg-neutral-100 border border-neutral-200/50 px-2 py-0.5 font-mono text-[9px] text-neutral-600"
                    >
                      {p}
                    </span>
                  ))}
                </div>

                {/* Expected ROI Badge */}
                {c.expectedRoi && (
                  <span className="bg-teal-50 border border-teal-200 text-teal-700 rounded px-2 py-0.5 text-[10px] font-mono font-bold">
                    {c.expectedRoi} ROI
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-base font-bold text-neutral-800">{c.name}</h3>
                <p className="text-xs text-neutral-500 mt-1 truncate max-w-lg">{c.audience || "No target audience outlined."}</p>
              </div>

              {/* Status workflow stepper dot map */}
              <div className="flex items-center gap-2 pt-1.5 text-[9px] font-bold tracking-wider text-neutral-400 font-mono">
                {STATUS_STEPS.map((step, sIdx) => {
                  const activeIdx = STATUS_STEPS.indexOf(c.status);
                  const done = sIdx <= activeIdx;
                  return (
                    <div key={step} className="flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full border transition ${
                        done ? "bg-amber-500 border-amber-500" : "bg-neutral-100 border-neutral-300"
                      }`} />
                      <span className={c.status === step ? "text-neutral-800 font-black uppercase" : ""}>{step}</span>
                      {sIdx < STATUS_STEPS.length - 1 && <span className="text-neutral-300">→</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Performance Stats Sparkline & CTA */}
            <div className="flex items-center gap-6 shrink-0 justify-between md:justify-end border-t md:border-t-0 border-neutral-100 pt-3 md:pt-0">
              <div className="space-y-1 font-mono text-[10px] text-left">
                <div className="text-neutral-500 flex justify-between gap-4">
                  <span>Launches:</span>
                  <span className="text-neutral-800 font-bold">{c.launchDate}</span>
                </div>
                <div className="text-neutral-500 flex justify-between gap-4">
                  <span>Budget:</span>
                  <span className="text-neutral-800 font-bold">${c.budget.toLocaleString()}</span>
                </div>
              </div>

              <div className="hidden sm:block shrink-0">
                <Sparkline data={c.spark} />
              </div>

              <Link
                to="/campaigns/$id"
                params={{ id: c.id }}
                className="rounded-xl border border-neutral-300 px-4 py-2 text-xs font-bold text-neutral-800 hover:bg-neutral-50 hover:border-neutral-400 transition"
              >
                Mission Control
              </Link>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center space-y-2">
            <AlertCircle className="h-8 w-8 text-neutral-400 mx-auto" />
            <h3 className="font-display text-lg text-neutral-900 font-semibold">No active campaign targets found</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Choose one of the AI planner console suggestions or click 'New campaign' to spin up a launch track.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
