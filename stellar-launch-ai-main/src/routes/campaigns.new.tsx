import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { useApp, type Campaign } from "../lib/store";
import { sampleAssetContent } from "../lib/mock-data";

export const Route = createFileRoute("/campaigns/new")({
  component: NewCampaign,
});

const PLATFORMS = ["Instagram", "Reddit", "Product Hunt", "LinkedIn", "TikTok", "Email", "Twitter"] as const;

function NewCampaign() {
  const nav = useNavigate();
  const add = useApp((s) => s.addCampaign);
  const [name, setName] = useState("New launch push");
  const [selected, setSelected] = useState<string[]>(["Instagram", "Reddit"]);
  const [audience, setAudience] = useState("Busy 25–40 pros who quit streak apps");
  const [budget, setBudget] = useState(600);
  const [launchDate, setLaunchDate] = useState("2026-07-22");
  const [asset, setAsset] = useState<string | null>("Reddit — founder story draft");
  const [pickerOpen, setPickerOpen] = useState(false);

  const toggle = (p: string) =>
    setSelected((s) => (s.includes(p) ? s.filter((x) => x !== p) : [...s, p]));

  const save = () => {
    const c: Campaign = {
      id: `c-${Date.now()}`,
      name,
      platforms: selected,
      status: "scheduled",
      launchDate,
      budget,
      spark: [],
    };
    add(c);
    nav({ to: "/campaigns" });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link to="/campaigns" className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900">
          <ArrowLeft className="h-4 w-4" /> All campaigns
        </Link>
        <h1 className="mt-2 font-display text-2xl font-semibold text-neutral-900">New campaign</h1>
      </div>

      <div className="space-y-6 rounded-xl border border-neutral-200 bg-white p-6">
        <Section n={1} title="Name your campaign">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />
        </Section>

        <Section n={2} title="Platforms">
          <div className="flex flex-wrap gap-1.5">
            {PLATFORMS.map((p) => {
              const on = selected.includes(p);
              return (
                <button
                  key={p}
                  onClick={() => toggle(p)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs ${
                    on
                      ? "border-amber-500 bg-amber-50 text-amber-900"
                      : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300"
                  }`}
                >
                  {on && <Check className="h-3 w-3" />}
                  {p}
                </button>
              );
            })}
          </div>
        </Section>

        <Section n={3} title="Audience">
          <input
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm"
          />
        </Section>

        <Section n={4} title={`Budget · $${budget}`}>
          <input
            type="range"
            min={0}
            max={5000}
            step={50}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full accent-amber-500"
          />
        </Section>

        <Section n={5} title="Launch date">
          <input
            type="date"
            value={launchDate}
            onChange={(e) => setLaunchDate(e.target.value)}
            className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm"
          />
        </Section>

        <Section n={6} title="Content">
          <div className="flex flex-wrap items-center gap-3">
            <div className="min-w-0 flex-1 truncate rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-700">
              {asset ?? "No asset selected"}
            </div>
            <button
              onClick={() => setPickerOpen(true)}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-800 hover:bg-neutral-100"
            >
              Pick from Studio
            </button>
          </div>
        </Section>

        <div className="flex justify-end gap-2 pt-2">
          <Link to="/campaigns" className="rounded-md border border-neutral-300 px-4 py-2 text-sm text-neutral-800 hover:bg-neutral-100">
            Cancel
          </Link>
          <button onClick={save} className="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600">
            Schedule campaign
          </button>
        </div>
      </div>

      {pickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 px-4" onClick={() => setPickerOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-xl border border-neutral-200 bg-white p-5">
            <div className="text-sm font-medium">Pick a Studio asset</div>
            <ul className="mt-3 divide-y divide-neutral-100">
              {Object.entries(sampleAssetContent).slice(0, 5).map(([k, v]) => (
                <li key={k}>
                  <button
                    onClick={() => {
                      setAsset(`${k} — draft`);
                      setPickerOpen(false);
                    }}
                    className="w-full px-2 py-3 text-left hover:bg-neutral-50"
                  >
                    <div className="text-sm font-medium capitalize">{k.replace("-", " ")}</div>
                    <div className="mt-0.5 line-clamp-2 text-xs text-neutral-600">{v}</div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-neutral-500">
        <span className="grid h-5 w-5 place-items-center rounded-full bg-neutral-100 font-mono text-[11px] text-neutral-600">{n}</span>
        {title}
      </div>
      {children}
    </div>
  );
}
