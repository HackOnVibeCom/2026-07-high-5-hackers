import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Trash2,
  Play,
  Pause,
  CheckCircle2,
  Sparkles,
  Award,
  AlertTriangle,
  Info,
  TrendingUp,
  Activity,
  Layers,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import { useApp, type Campaign } from "../lib/store";

export const Route = createFileRoute("/campaigns/$id")({
  component: CampaignDetail,
});

const statusColors: Record<Campaign["status"], string> = {
  draft: "bg-neutral-100 text-neutral-600 border-neutral-200",
  scheduled: "bg-blue-50 text-blue-800 border-blue-200",
  running: "bg-teal-50 text-teal-800 border-teal-200",
  completed: "bg-neutral-100 text-neutral-800 border-neutral-300",
};

const STATUS_FLOW: Campaign["status"][] = ["draft", "scheduled", "running", "completed"];

function Sparkline({ data }: { data: number[] }) {
  if (!data.length)
    return (
      <div className="grid h-40 place-items-center rounded-lg border border-dashed border-neutral-200 bg-neutral-50 text-sm text-neutral-400">
        No performance data yet — launch this campaign to start tracking.
      </div>
    );
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
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-32 w-full">
      <polyline
        points={points}
        fill="none"
        stroke="#14B8A6"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CampaignDetail() {
  const { id } = useParams({ from: "/campaigns/$id" });
  const nav = useNavigate();
  const campaign = useApp((s) => s.campaigns.find((c) => c.id === id));
  const updateCampaign = useApp((s) => s.updateCampaign);
  const deleteCampaign = useApp((s) => s.deleteCampaign);
  const optimizeBudget = useApp((s) => s.optimizeCampaignBudget);
  
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [optimizerApplied, setOptimizerApplied] = useState(false);

  if (!campaign) {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <h1 className="font-display text-xl font-semibold text-neutral-900">Campaign not found</h1>
        <p className="mt-2 text-sm text-neutral-600">It may have been deleted.</p>
        <Link
          to="/campaigns"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
        >
          Back to campaigns
        </Link>
      </div>
    );
  }

  const setStatus = (status: Campaign["status"]) => {
    // Stage updates
    const updates: Partial<Campaign> = { status };
    
    // Auto-populate simulated metrics on transition to Running/Completed
    if (status === "running") {
      updates.impressions = campaign.impressions || 45000;
      updates.ctr = campaign.ctr || 4.2;
      updates.cpi = campaign.cpi || 1.2;
      updates.cpc = campaign.cpc || 0.45;
      updates.spark = campaign.spark.length ? campaign.spark : [12, 18, 25, 32, 28, 45, 52];
    } else if (status === "completed") {
      updates.spark = [...campaign.spark, 60, 68, 71];
    }

    updateCampaign(campaign.id, updates);
    toast.success(`Campaign transitioned to ${status.toUpperCase()}`, {
      description: `Updates propagated to Launch Health Score & AI Advisor.`,
    });
  };

  const handleApplyShift = () => {
    if (campaign.platforms.length < 2) return;
    const fromP = campaign.platforms[1]; // e.g. Twitter
    const toP = campaign.platforms[0]; // e.g. Product Hunt
    optimizeBudget(campaign.id, fromP, toP, 150);
    setOptimizerApplied(true);
    toast.success("AI budget shift applied successfully!", {
      description: `Reallocated $150 from ${fromP} to ${toP} to optimize ROI.`,
    });
  };

  // Metrics fallbacks
  const impressions = campaign.impressions ?? 0;
  const ctr = campaign.ctr ?? 0;
  const cpi = campaign.cpi ?? 0;
  const cpc = campaign.cpc ?? 0;
  const expectedRoi = campaign.expectedRoi ?? "2.4x";
  const risk = campaign.risk ?? "Low";
  const details = campaign.platformsDetail || {};

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        to="/campaigns"
        className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900"
      >
        <ArrowLeft className="h-4 w-4" /> All campaigns
      </Link>

      {/* Hero Mission Control Header */}
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-neutral-100 pb-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-md border px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase ${statusColors[campaign.status]}`}
            >
              {campaign.status}
            </span>
            {campaign.platforms.map((p) => (
              <span
                key={p}
                className="rounded bg-neutral-100 border border-neutral-200 px-2 py-0.5 font-mono text-[9px] text-neutral-700"
              >
                {p}
              </span>
            ))}
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold text-neutral-900">
            {campaign.name}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">{campaign.audience || "Standard target audience details."}</p>
        </div>
        
        {/* Stage controls */}
        <div className="flex items-center gap-2 text-xs font-bold">
          {(campaign.status === "draft" || campaign.status === "scheduled") && (
            <button
              onClick={() => setStatus("running")}
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2.5 text-white hover:bg-amber-600 transition shadow"
            >
              <Play className="h-4 w-4" /> Launch Campaign
            </button>
          )}
          {campaign.status === "running" && (
            <>
              <button
                onClick={() => setStatus("scheduled")}
                className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-300 px-3.5 py-2.5 text-neutral-800 hover:bg-neutral-100"
              >
                <Pause className="h-4 w-4" /> Pause
              </button>
              <button
                onClick={() => setStatus("completed")}
                className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2.5 text-white hover:bg-teal-700 transition"
              >
                <CheckCircle2 className="h-4 w-4" /> Mark Complete
              </button>
            </>
          )}
          <button
            onClick={() => setConfirmDelete(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-300 p-2.5 text-rose-600 hover:bg-rose-50"
          >
            <Trash2 className="h-4.5 w-4.5" />
          </button>
        </div>
      </header>

      {/* 1. Campaign Lifecycle Timeline Stepper */}
      <section className="rounded-xl border border-neutral-200 bg-white p-5 space-y-3">
        <span className="text-[10px] text-neutral-500 uppercase font-semibold font-mono">Campaign Lifecycle Tracker</span>
        <div className="flex items-center justify-between text-xs font-bold pt-2 border-t border-neutral-100">
          {STATUS_FLOW.map((s, idx) => {
            const activeIdx = STATUS_FLOW.indexOf(campaign.status);
            const done = idx <= activeIdx;
            return (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`flex-1 text-center py-2 border-b-2 transition ${
                  campaign.status === s 
                    ? "border-amber-500 text-neutral-900" 
                    : done 
                      ? "border-teal-500 text-teal-700" 
                      : "border-neutral-200 text-neutral-400 hover:border-neutral-300"
                }`}
              >
                <span className="block font-mono text-[9px] text-neutral-400">Step {idx + 1}</span>
                <span className="capitalize">{s}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Grid: Platform details + Success Predictions */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* 3. Multi-Channel Platform Cards Grid */}
        <div className="rounded-xl border border-neutral-200 bg-white p-5 space-y-4">
          <span className="text-[10px] text-neutral-500 uppercase font-semibold font-mono block">Multi-Channel Distribution</span>
          
          <div className="space-y-3">
            {campaign.platforms.map((p) => {
              const item = details[p] || { status: campaign.status, budget: Math.round(campaign.budget / campaign.platforms.length), installs: campaign.status === "completed" ? 180 : 0 };
              return (
                <div key={p} className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/60 text-xs">
                  <div>
                    <span className="font-bold text-neutral-800 block">{p}</span>
                    <span className="text-[10px] text-neutral-400 font-mono mt-0.5 capitalize block">{item.status}</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-neutral-500 block text-[9px] uppercase font-sans">Allocated</span>
                    <span className="text-neutral-800 font-bold">${item.budget}</span>
                    <span className="text-teal-600 font-bold block text-[10px]">+{item.installs} installs</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 10. AI Success Predictions Before Launch */}
        <div className="rounded-xl border border-neutral-200 bg-white p-5 space-y-4">
          <span className="text-[10px] text-neutral-500 uppercase font-semibold font-mono block">AI Pre-Launch KPI Forecast</span>
          
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100 font-mono">
              <span className="text-neutral-500 font-sans block text-[9px] uppercase">Est. ROI Outcome</span>
              <span className="text-teal-600 font-bold text-sm">{expectedRoi}</span>
            </div>
            <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100 font-mono">
              <span className="text-neutral-500 font-sans block text-[9px] uppercase">Risk Level</span>
              <span className="text-neutral-800 font-bold text-sm">{risk}</span>
            </div>
            <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100 font-mono">
              <span className="text-neutral-500 font-sans block text-[9px] uppercase">Audience Overlap</span>
              <span className="text-amber-500 font-bold text-sm">86% match</span>
            </div>
            <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100 font-mono">
              <span className="text-neutral-500 font-sans block text-[9px] uppercase">Market Competition</span>
              <span className="text-neutral-800 font-bold text-sm">Moderate (45%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Budget Intelligence Spent vs Remaining */}
      <section className="rounded-xl border border-neutral-200 bg-white p-5 space-y-4">
        <span className="text-[10px] text-neutral-500 uppercase font-semibold font-mono block">Budget Analytics & Spend Gauges</span>
        
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-4 text-xs font-mono text-center">
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
            <span className="text-[9px] text-neutral-400 font-sans block uppercase">Total Pool</span>
            <span className="text-neutral-800 font-bold text-sm">${campaign.budget}</span>
          </div>
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
            <span className="text-[9px] text-neutral-400 font-sans block uppercase">Cost-Per-Install (CPI)</span>
            <span className="text-neutral-800 font-bold text-sm">${cpi}</span>
          </div>
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
            <span className="text-[9px] text-neutral-400 font-sans block uppercase">Cost-Per-Click (CPC)</span>
            <span className="text-neutral-800 font-bold text-sm">${cpc}</span>
          </div>
          <div className="p-3 bg-teal-50 rounded-xl border border-teal-100">
            <span className="text-[9px] text-teal-600 font-sans block uppercase">Spent vs remaining</span>
            <span className="text-teal-700 font-bold text-sm">100% Remaining</span>
          </div>
        </div>
      </section>

      {/* 7. AI Campaign Optimization Alert Feed */}
      {campaign.status === "running" && campaign.platforms.length >= 2 && (
        <section className="rounded-xl border border-amber-200 bg-amber-50/30 p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-800">
            <AlertTriangle className="h-4 w-4 text-amber-500" /> AI Optimization Recommendation
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed">
            We detected that <strong>{campaign.platforms[0]}</strong> has a 3.5x higher conversion coefficient than <strong>{campaign.platforms[1]}</strong> in your category.
            Recommend shifting <strong>$150</strong> to maximize downloads velocity.
          </p>

          <div className="pt-2 flex justify-between items-center text-xs">
            <span className="text-teal-600 font-mono font-bold">+18% expected installs boost</span>
            <button
              disabled={optimizerApplied}
              onClick={handleApplyShift}
              className={`rounded-lg px-4 py-2 font-bold transition text-xs ${
                optimizerApplied 
                  ? "bg-teal-50 text-teal-700 cursor-default" 
                  : "bg-amber-500 text-white hover:bg-amber-600"
              }`}
            >
              {optimizerApplied ? "Applied Shift" : "Apply Shift"}
            </button>
          </div>
        </section>
      )}

      {/* Performance Output */}
      <div className="rounded-xl border border-neutral-200 bg-white p-5">
        <h3 className="text-sm font-semibold text-neutral-900">Campaign Performance Attribution</h3>
        <p className="text-xs text-neutral-500">Live installs attributed directly to marketing links.</p>
        <div className="mt-4">
          <Sparkline data={campaign.spark} />
        </div>
      </div>

      {campaign.asset && (
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500 font-mono">
            Linked Asset Preview
          </div>
          <div className="mt-2.5 flex items-center justify-between gap-3 text-xs">
            <p className="text-neutral-800 font-mono truncate">{campaign.asset}</p>
            <Link
              to="/studio"
              className="shrink-0 rounded-lg border border-neutral-300 px-3 py-1.5 font-bold text-neutral-800 hover:bg-neutral-50"
            >
              Edit in Studio
            </Link>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 px-4"
          onClick={() => setConfirmDelete(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-5"
          >
            <div className="text-sm font-medium text-neutral-900">Delete this campaign?</div>
            <p className="mt-1 text-sm text-neutral-600 font-sans">This operation can't be undone.</p>
            <div className="mt-4 flex justify-end gap-2 text-xs font-bold">
              <button
                onClick={() => setConfirmDelete(false)}
                className="rounded-md border border-neutral-300 px-3 py-1.5 text-neutral-800 hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteCampaign(campaign.id);
                  toast.success("Campaign deleted");
                  nav({ to: "/campaigns" });
                }}
                className="rounded-md bg-rose-500 px-3 py-1.5 text-white hover:bg-rose-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
