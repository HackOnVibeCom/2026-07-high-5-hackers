import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Calendar, DollarSign } from "lucide-react";
import { useApp, type Campaign } from "../lib/store";

export const Route = createFileRoute("/campaigns/")({
  component: Campaigns,
});

const statusColors: Record<Campaign["status"], string> = {
  draft: "bg-neutral-100 text-neutral-600",
  scheduled: "bg-blue-100 text-blue-800",
  running: "bg-teal-100 text-teal-800",
  completed: "bg-neutral-200 text-neutral-800",
};

function Sparkline({ data }: { data: number[] }) {
  if (!data.length) return <div className="h-8 text-xs text-neutral-400">—</div>;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((v - min) / Math.max(1, max - min)) * 100;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-8 w-24">
      <polyline points={points} fill="none" stroke="#26AD87" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Campaigns() {
  const campaigns = useApp((s) => s.campaigns);
  const [filter, setFilter] = useState<Campaign["status"] | "all">("all");

  const filtered = filter === "all" ? campaigns : campaigns.filter((c) => c.status === filter);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-neutral-500">Campaigns</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-neutral-900">
            Every launch, in one place.
          </h1>
        </div>
        <Link
          to="/campaigns/new"
          className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
        >
          <Plus className="h-4 w-4" /> New campaign
        </Link>
      </header>

      <div className="flex gap-1 border-b border-neutral-200">
        {(["all", "draft", "scheduled", "running", "completed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`relative px-3 py-2 text-sm capitalize ${
              filter === f ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            {f}
            {filter === f && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-amber-500" />}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {filtered.map((c) => (
          <div key={c.id} className="rounded-xl border border-neutral-200 bg-white p-5">
            <div className="flex flex-wrap items-center gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`rounded px-2 py-0.5 text-[11px] font-medium capitalize ${statusColors[c.status]}`}>
                    {c.status}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {c.platforms.map((p) => (
                      <span key={p} className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-[10px] text-neutral-700">{p}</span>
                    ))}
                  </div>
                </div>
                <div className="mt-1.5 text-base font-medium text-neutral-900">{c.name}</div>
                <div className="mt-1 flex items-center gap-3 text-xs text-neutral-500">
                  <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> Launches {c.launchDate}</span>
                  <span className="inline-flex items-center gap-1"><DollarSign className="h-3 w-3" /> ${c.budget.toLocaleString()}</span>
                </div>
              </div>
              <div className="shrink-0">
                <Sparkline data={c.spark} />
              </div>
              <button className="shrink-0 rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-800 hover:bg-neutral-100">
                Open
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-10 text-center">
            <div className="font-display text-lg text-neutral-900">Nothing here yet — that's an opportunity.</div>
            <p className="mt-1 text-sm text-neutral-500">Spin up a {filter} campaign to see how it'd perform.</p>
            <Link
              to="/campaigns/new"
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
            >
              <Plus className="h-4 w-4" /> New campaign
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
