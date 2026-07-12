import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Check, X, Sparkles, ArrowRight } from "lucide-react";
import { competitors as mockCompetitors, roadmap } from "../lib/mock-data";
import { useActiveWorkspace, useApp } from "../lib/store";

export const Route = createFileRoute("/strategy")({
  component: Strategy,
});

type Tab = "overview" | "competitors" | "roadmap";

function Strategy() {
  const [tab, setTab] = useState<Tab>("overview");
  const ws = useActiveWorkspace();

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm text-neutral-500">Strategy</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-neutral-900">
          What we know about {ws?.name}, and what to do about it.
        </h1>
      </header>

      <div className="flex gap-1 border-b border-neutral-200">
        {(["overview", "competitors", "roadmap"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative px-4 py-2.5 text-sm capitalize ${
              tab === t ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            {t}
            {tab === t && (
              <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-amber-500" />
            )}
          </button>
        ))}
      </div>

      {tab === "overview" && <Overview />}
      {tab === "competitors" && <Competitors />}
      {tab === "roadmap" && <Roadmap />}
    </div>
  );
}

function Overview() {
  const ws = useActiveWorkspace();
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 lg:col-span-2">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-amber-800">
          <Sparkles className="h-3.5 w-3.5" /> Product summary
        </div>
        <p className="mt-3 text-amber-900">
          {ws?.name} is a calm, forgiving habit tracker for busy 25–40 year-olds who bounced off
          streak-based apps. It wins by removing the shame loop and adding a 1-minute weekly review.
          Freemium with a $4/month Pro tier — clean path from free habit to paid reflection.
        </p>
      </div>
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <div className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          Positioning
        </div>
        <ul className="mt-3 space-y-2 text-sm text-neutral-800">
          <li className="flex gap-2">
            <Check className="mt-0.5 h-4 w-4 text-teal-600" /> Adaptive streaks
          </li>
          <li className="flex gap-2">
            <Check className="mt-0.5 h-4 w-4 text-teal-600" /> 90-second daily check-in
          </li>
          <li className="flex gap-2">
            <Check className="mt-0.5 h-4 w-4 text-teal-600" /> Private by default
          </li>
        </ul>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-6 lg:col-span-3">
        <h3 className="text-sm font-medium text-neutral-900">
          Opportunities available for your app
        </h3>
        <ul className="mt-3 space-y-3 text-sm text-neutral-700">
          <li className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" /> No competitor
            talks about "streaks that flex" — own that phrase in App Store and Product Hunt copy.
          </li>
          <li className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" /> Fabulous is
            losing users to its aggressive paywall — target churned users in r/productivity threads.
          </li>
          <li className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" /> Streaks is
            iOS-only; Android is a 40% opportunity gap in this segment.
          </li>
        </ul>
      </div>
    </div>
  );
}

function Competitors() {
  const fetchCompetitors = useApp((s) => s.fetchCompetitors);
  const competitorsData = useApp((s) => s.competitorsData);

  useEffect(() => {
    fetchCompetitors();
  }, [fetchCompetitors]);

  const competitors = competitorsData.length > 0 ? competitorsData : mockCompetitors;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-amber-800">
          <Sparkles className="h-3.5 w-3.5" /> Opportunities available for your app
        </div>
        <ul className="mt-2 grid gap-1 text-sm text-amber-900 sm:grid-cols-3">
          <li>· Own the phrase "streaks that flex"</li>
          <li>· Attack Fabulous churn in r/productivity</li>
          <li>· 40% Android gap vs. Streaks</li>
        </ul>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {competitors.map((c) => (
          <div key={c.name} className="rounded-xl border border-neutral-200 bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-md bg-neutral-100 text-lg">
                  {c.emoji}
                </div>
                <div>
                  <div className="font-medium text-neutral-900">{c.name}</div>
                  <div className="font-mono text-xs text-neutral-500">
                    ★ {c.rating} · {c.downloads}
                  </div>
                </div>
              </div>
              <span className="rounded bg-blue-100 px-2 py-0.5 text-[11px] font-medium text-blue-800">
                {c.pricing}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <ul className="space-y-1.5">
                {c.strengths.map((s) => (
                  <li key={s} className="flex gap-1.5 text-neutral-700">
                    <Check className="mt-0.5 h-3.5 w-3.5 text-teal-600" />
                    {s}
                  </li>
                ))}
              </ul>
              <ul className="space-y-1.5">
                {c.weaknesses.map((s) => (
                  <li key={s} className="flex gap-1.5 text-neutral-700">
                    <X className="mt-0.5 h-3.5 w-3.5 text-rose-500" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {c.channels.map((ch) => (
                  <span
                    key={ch}
                    className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-[11px] text-neutral-700"
                  >
                    {ch}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {c.keywords.map((k) => (
                  <span
                    key={k}
                    className="rounded bg-blue-50 px-2 py-0.5 font-mono text-[11px] text-blue-800"
                  >
                    #{k}
                  </span>
                ))}
              </div>
            </div>

            <p className="mt-4 border-l-2 border-rose-300 pl-3 text-xs italic text-neutral-600">
              {c.complaint}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Roadmap() {
  const done = useApp((s) => s.roadmapDone);
  const setDone = useApp((s) => s.setRoadmapDone);
  const toggle = (k: string) => setDone(k, !done[k]);

  const allTasks = roadmap.flatMap((w) => w.tasks.map((t) => `${w.week}-${t.title}`));
  const completed = allTasks.filter((k) => done[k]).length;
  const pct = Math.round((completed / allTasks.length) * 100);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-neutral-900">4-week launch plan</span>
          <span className="font-mono text-xs text-neutral-500">
            {completed}/{allTasks.length} done · {pct}%
          </span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
          <div
            className="h-full rounded-full bg-teal-500 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {roadmap.map((w) => (
          <div key={w.week} className="rounded-xl border border-neutral-200 bg-white p-4">
            <div className="mb-3 flex items-baseline justify-between">
              <div>
                <div className="font-display text-lg font-semibold text-neutral-900">{w.week}</div>
                <div className="text-xs text-neutral-500">{w.subtitle}</div>
              </div>
              <span className="font-mono text-[11px] text-neutral-500">{w.tasks.length} tasks</span>
            </div>
            <ul className="space-y-2">
              {w.tasks.map((t) => {
                const key = `${w.week}-${t.title}`;
                const isDone = done[key];
                return (
                  <li
                    key={key}
                    className={`rounded-lg border p-3 transition ${isDone ? "border-teal-200 bg-teal-50" : "border-neutral-200 bg-neutral-50"}`}
                  >
                    <label className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={!!isDone}
                        onChange={() => toggle(key)}
                        className="mt-0.5 h-4 w-4 accent-teal-500"
                      />
                      <div className="min-w-0 flex-1">
                        <div
                          className={`text-sm ${isDone ? "text-neutral-500 line-through" : "text-neutral-900"}`}
                        >
                          {t.title}
                        </div>
                        <div className="mt-1 flex items-center justify-between gap-2">
                          <span className="rounded bg-white px-1.5 py-0.5 font-mono text-[10px] text-neutral-600">
                            {t.platform}
                          </span>
                          <Link
                            to={
                              t.target === "campaigns"
                                ? "/campaigns"
                                : t.target === "discover"
                                  ? "/discover"
                                  : "/studio"
                            }
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-800 hover:underline"
                          >
                            {t.target === "campaigns"
                              ? "Send to Campaigns"
                              : t.target === "discover"
                                ? "Open Discover"
                                : "Send to Studio"}
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
