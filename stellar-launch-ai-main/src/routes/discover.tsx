import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { communities, influencers } from "../lib/mock-data";
import { Bookmark, MessageSquare, Plus } from "lucide-react";

export const Route = createFileRoute("/discover")({
  component: Discover,
});

const trafficStyle: Record<string, string> = {
  Low: "bg-neutral-100 text-neutral-700",
  Medium: "bg-blue-100 text-blue-800",
  High: "bg-teal-100 text-teal-800",
};

function Discover() {
  const [tab, setTab] = useState<"communities" | "influencers">("communities");
  const [contactOpen, setContactOpen] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm text-neutral-500">Discover</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-neutral-900">
          Where your first 10,000 users actually live.
        </h1>
      </header>

      <div className="flex gap-1 border-b border-neutral-200">
        {(["communities", "influencers"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative px-4 py-2.5 text-sm capitalize ${
              tab === t ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            {t}
            {tab === t && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-amber-500" />}
          </button>
        ))}
      </div>

      {tab === "communities" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {communities.map((c) => (
            <div key={c.name} className="rounded-xl border border-neutral-200 bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm text-neutral-500">{c.platform}</div>
                  <div className="mt-0.5 font-medium text-neutral-900">{c.name}</div>
                </div>
                <span className={`rounded px-2 py-0.5 text-[11px] font-medium ${trafficStyle[c.traffic]}`}>
                  {c.traffic} traffic
                </span>
              </div>
              <div className="mt-3 space-y-1 font-mono text-[11px] text-neutral-600">
                <div>size · {c.size}</div>
                <div>best · {c.best}</div>
              </div>
              <p className="mt-3 text-xs text-neutral-600">{c.rules}</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] uppercase tracking-wide text-neutral-500">Difficulty</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span key={n} className={`h-1.5 w-1.5 rounded-full ${n <= c.difficulty ? "bg-amber-500" : "bg-neutral-200"}`} />
                    ))}
                  </div>
                </div>
                <Link
                  to="/studio"
                  className="rounded-md bg-amber-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-600"
                >
                  {c.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {influencers.map((i) => (
            <div key={i.handle} className="rounded-xl border border-neutral-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <div
                  className="grid h-11 w-11 place-items-center rounded-full text-white"
                  style={{ backgroundColor: `hsl(${(i.name.charCodeAt(0) * 15) % 360} 40% 45%)` }}
                >
                  {i.name.split(" ").map((s) => s[0]).join("")}
                </div>
                <div className="min-w-0">
                  <div className="truncate font-medium text-neutral-900">{i.name}</div>
                  <div className="font-mono text-xs text-neutral-500">{i.handle} · {i.platform}</div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <Stat label="Followers" value={i.followers} />
                <Stat label="Engage" value={i.engagement} />
                <Stat label="Installs" value={i.installs} />
              </div>

              <div className="mt-4">
                <div className="mb-1 flex items-center justify-between text-[11px]">
                  <span className="text-neutral-500">Audience match</span>
                  <span className="font-mono text-neutral-700">{i.match}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-neutral-100">
                  <div className="h-full rounded-full bg-teal-500" style={{ width: `${i.match}%` }} />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1">
                {i.tags.map((t) => (
                  <span key={t} className="rounded bg-blue-50 px-2 py-0.5 font-mono text-[10px] text-blue-800">#{t}</span>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between gap-2">
                <div className="font-mono text-xs text-neutral-600">{i.price} avg</div>
                <div className="flex gap-1.5">
                  <button className="rounded-md border border-neutral-300 p-1.5 text-neutral-700 hover:bg-neutral-100" title="Save">
                    <Bookmark className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setContactOpen(i.name)}
                    className="rounded-md border border-neutral-300 p-1.5 text-neutral-700 hover:bg-neutral-100"
                    title="Contact"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                  </button>
                  <Link
                    to="/campaigns/new"
                    className="inline-flex items-center gap-1 rounded-md bg-amber-500 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-amber-600"
                  >
                    <Plus className="h-3 w-3" /> Add
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {contactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 px-4" onClick={() => setContactOpen(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-5">
            <div className="text-sm font-medium">Message {contactOpen}</div>
            <textarea
              defaultValue={`Hi ${contactOpen.split(" ")[0]},\n\nWe're launching Fernly — a calm habit tracker that doesn't punish rest days. Would love to send you an early build for a possible partnership. Open to it?\n\n— Ana`}
              rows={7}
              className="mt-3 w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm"
            />
            <div className="mt-3 flex justify-end gap-2">
              <button onClick={() => setContactOpen(null)} className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-800">Cancel</button>
              <button onClick={() => setContactOpen(null)} className="rounded-md bg-amber-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-600">Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-neutral-50 p-2">
      <div className="text-[10px] uppercase tracking-wide text-neutral-500">{label}</div>
      <div className="mt-0.5 font-mono text-xs text-neutral-900">{value}</div>
    </div>
  );
}
