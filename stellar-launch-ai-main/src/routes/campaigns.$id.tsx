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
} from "lucide-react";
import { toast } from "sonner";
import { useApp, type Campaign } from "../lib/store";

export const Route = createFileRoute("/campaigns/$id")({
  component: CampaignDetail,
});

const statusColors: Record<Campaign["status"], string> = {
  draft: "bg-neutral-100 text-neutral-600",
  scheduled: "bg-blue-100 text-blue-800",
  running: "bg-teal-100 text-teal-800",
  completed: "bg-neutral-200 text-neutral-800",
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
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-40 w-full">
      <polyline
        points={points}
        fill="none"
        stroke="#26AD87"
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
  const [confirmDelete, setConfirmDelete] = useState(false);

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
    updateCampaign(campaign.id, { status });
    toast.success(`Campaign marked ${status}`);
  };

  const primaryAction = () => {
    if (campaign.status === "draft" || campaign.status === "scheduled")
      return { label: "Launch now", icon: Play, next: "running" as const };
    if (campaign.status === "running")
      return { label: "Pause campaign", icon: Pause, next: "scheduled" as const };
    return null;
  };
  const action = primaryAction();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        to="/campaigns"
        className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900"
      >
        <ArrowLeft className="h-4 w-4" /> All campaigns
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded px-2 py-0.5 text-[11px] font-medium capitalize ${statusColors[campaign.status]}`}
            >
              {campaign.status}
            </span>
            {campaign.platforms.map((p) => (
              <span
                key={p}
                className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-[10px] text-neutral-700"
              >
                {p}
              </span>
            ))}
          </div>
          <h1 className="mt-2 font-display text-2xl font-semibold text-neutral-900">
            {campaign.name}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {action && (
            <button
              onClick={() => setStatus(action.next)}
              className="inline-flex items-center gap-1.5 rounded-md bg-amber-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-600"
            >
              <action.icon className="h-4 w-4" /> {action.label}
            </button>
          )}
          {campaign.status === "running" && (
            <button
              onClick={() => setStatus("completed")}
              className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-800 hover:bg-neutral-100"
            >
              <CheckCircle2 className="h-4 w-4" /> Complete
            </button>
          )}
          <button
            onClick={() => setConfirmDelete(true)}
            className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-rose-600 hover:bg-rose-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Detail
          icon={<Calendar className="h-4 w-4" />}
          label="Launch date"
          value={campaign.launchDate}
        />
        <Detail
          icon={<DollarSign className="h-4 w-4" />}
          label="Budget"
          value={`$${campaign.budget.toLocaleString()}`}
        />
        <Detail
          icon={<Sparkles className="h-4 w-4" />}
          label="Platforms"
          value={`${campaign.platforms.length}`}
        />
      </div>

      {campaign.audience && (
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Audience
          </div>
          <p className="mt-2 text-sm text-neutral-800">{campaign.audience}</p>
        </div>
      )}

      {campaign.asset && (
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Linked asset
          </div>
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-sm text-neutral-800">{campaign.asset}</p>
            <Link
              to="/studio"
              className="shrink-0 rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-800 hover:bg-neutral-100"
            >
              Edit in Studio
            </Link>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-neutral-200 bg-white p-5">
        <h3 className="text-sm font-medium text-neutral-900">Performance</h3>
        <p className="text-xs text-neutral-500">Installs attributed to this campaign.</p>
        <div className="mt-4">
          <Sparkline data={campaign.spark} />
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-5">
        <h3 className="text-sm font-medium text-neutral-900">Move status</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {STATUS_FLOW.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`rounded-full border px-3 py-1.5 text-xs capitalize transition ${
                campaign.status === s
                  ? "border-amber-500 bg-amber-50 text-amber-900"
                  : "border-neutral-200 text-neutral-700 hover:border-neutral-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

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
            <p className="mt-1 text-sm text-neutral-600">This can't be undone.</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(false)}
                className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-800 hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteCampaign(campaign.id);
                  toast.success("Campaign deleted");
                  nav({ to: "/campaigns" });
                }}
                className="rounded-md bg-rose-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-600"
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

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <div className="flex items-center gap-1.5 text-xs text-neutral-500">
        {icon}
        {label}
      </div>
      <div className="mt-1.5 font-display text-lg font-semibold text-neutral-900">{value}</div>
    </div>
  );
}
