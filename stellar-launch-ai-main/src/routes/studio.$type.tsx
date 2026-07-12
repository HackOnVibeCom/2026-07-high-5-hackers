import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Copy, RefreshCcw, Scissors, Wand2, Check, History, Rocket } from "lucide-react";
import { sampleAssetContent, studioTools } from "../lib/mock-data";
import { useApp } from "../lib/store";

export const Route = createFileRoute("/studio/$type")({
  component: AssetWorkspace,
});

const variants: Record<string, string[]> = {
  regen: [
    "Fresh angle: lead with the shame loop insight, then the product.",
    "Sharper hook, tighter close, same core message.",
    "Contrarian framing — 'streak apps are slot machines' as the opener.",
  ],
  improve: [" Polished for tone and cadence — same length, sharper verbs."],
  shorten: [" Cut roughly 40% while keeping the strongest sentence at the top."],
};

function AssetWorkspace() {
  const { type } = useParams({ from: "/studio/$type" });
  const tool = studioTools.find((t) => t.slug === type);
  const savedDraft = useApp((s) => s.studioDrafts[type]);
  const saveStudioDraft = useApp((s) => s.saveStudioDraft);

  const [text, setText] = useState(
    savedDraft?.text ?? sampleAssetContent[type] ?? "Draft your asset here.",
  );
  const [loading, setLoading] = useState<null | "regen" | "improve" | "shorten">(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useState<{ label: string; text: string }[]>(
    savedDraft?.history?.map((h) => ({ label: h.label, text: h.text })) ?? [
      { label: "v1 — original draft", text: sampleAssetContent[type] ?? "" },
    ],
  );

  const persist = (nextText: string, nextHistory: { label: string; text: string }[]) => {
    saveStudioDraft(type, {
      text: nextText,
      history: nextHistory.map((h, i) => ({
        id: `${type}-${i}`,
        label: h.label,
        text: h.text,
        ts: Date.now(),
      })),
    });
  };

  const mutate = (kind: "regen" | "improve" | "shorten") => {
    setLoading(kind);
    setTimeout(() => {
      const stamp = variants[kind][Math.floor(Math.random() * variants[kind].length)];
      const next =
        kind === "shorten"
          ? text
              .split("\n")
              .slice(0, Math.max(2, Math.floor(text.split("\n").length * 0.6)))
              .join("\n")
          : `${text}\n\n— (${kind}) ${stamp}`;
      const nextHistory = [{ label: `v${history.length + 1} — ${kind}`, text: next }, ...history];
      setText(next);
      setHistory(nextHistory);
      persist(next, nextHistory);
      setLoading(null);
    }, 900);
  };

  const save = () => {
    persist(text, history);
    setSaved(true);
    setTimeout(() => setSaved(false), 1400);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link
            to="/studio"
            className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-neutral-900"
          >
            <ArrowLeft className="h-4 w-4" /> All tools
          </Link>
          <h1 className="mt-2 font-display text-2xl font-semibold text-neutral-900">
            {tool?.name ?? "Asset"}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Draft in your voice, preview where it lands, and keep every version.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={save}
            className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-800 hover:bg-neutral-100"
          >
            {saved ? <Check className="h-4 w-4 text-teal-600" /> : null}
            {saved ? "Saved" : "Save draft"}
          </button>
          <Link
            to="/campaigns/new"
            className="inline-flex items-center gap-1.5 rounded-md bg-amber-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-600"
          >
            <Rocket className="h-4 w-4" /> Use in campaign
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Toolbar
              disabled={!!loading}
              loadingKind={loading}
              onRegen={() => mutate("regen")}
              onImprove={() => mutate("improve")}
              onShorten={() => mutate("shorten")}
            />
            <div className="ml-auto">
              <button
                onClick={copy}
                className="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-800 hover:bg-neutral-100"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-teal-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          <PreviewFrame type={type}>
            {loading ? (
              <div className="space-y-2">
                <div className="h-3 w-3/4 animate-pulse rounded bg-neutral-200" />
                <div className="h-3 w-full animate-pulse rounded bg-neutral-200" />
                <div className="h-3 w-5/6 animate-pulse rounded bg-neutral-200" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-neutral-200" />
              </div>
            ) : (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={16}
                className="w-full resize-none bg-transparent text-sm leading-relaxed text-neutral-900 focus:outline-none"
              />
            )}
          </PreviewFrame>
        </div>

        <aside className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-neutral-900">
            <History className="h-4 w-4 text-neutral-500" /> Version history
          </div>
          <ul className="mt-3 space-y-1">
            {history.map((h, i) => (
              <li key={i}>
                <button
                  onClick={() => setText(h.text)}
                  className="w-full rounded-md px-2 py-1.5 text-left text-sm text-neutral-700 hover:bg-neutral-100"
                >
                  <span className="font-mono text-[11px] text-neutral-500">{h.label}</span>
                  <p className="mt-0.5 line-clamp-2 text-xs text-neutral-600">{h.text}</p>
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}

function Toolbar({
  disabled,
  loadingKind,
  onRegen,
  onImprove,
  onShorten,
}: {
  disabled: boolean;
  loadingKind: null | "regen" | "improve" | "shorten";
  onRegen: () => void;
  onImprove: () => void;
  onShorten: () => void;
}) {
  const B = ({
    onClick,
    icon,
    label,
    kind,
    primary,
  }: {
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    kind: "regen" | "improve" | "shorten";
    primary?: boolean;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm disabled:opacity-60 ${
        primary
          ? "bg-amber-500 text-white hover:bg-amber-600"
          : "border border-neutral-300 text-neutral-800 hover:bg-neutral-100"
      }`}
    >
      {loadingKind === kind ? (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        icon
      )}
      {label}
    </button>
  );
  return (
    <>
      <B
        onClick={onRegen}
        icon={<RefreshCcw className="h-4 w-4" />}
        label="Regenerate"
        kind="regen"
        primary
      />
      <B onClick={onImprove} icon={<Wand2 className="h-4 w-4" />} label="Improve" kind="improve" />
      <B
        onClick={onShorten}
        icon={<Scissors className="h-4 w-4" />}
        label="Shorten"
        kind="shorten"
      />
    </>
  );
}

function PreviewFrame({ type, children }: { type: string; children: React.ReactNode }) {
  if (type === "instagram") {
    return (
      <div className="mx-auto max-w-[420px] rounded-xl border border-neutral-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-neutral-200 px-3 py-2">
          <div className="grid h-7 w-7 place-items-center rounded-full bg-teal-100 text-sm">🌿</div>
          <div>
            <div className="text-xs font-medium">fernly.app</div>
            <div className="text-[10px] text-neutral-500">Sponsored</div>
          </div>
        </div>
        <div className="aspect-square bg-gradient-to-br from-teal-100 via-amber-50 to-rose-100" />
        <div className="p-3 text-sm text-neutral-900">{children}</div>
      </div>
    );
  }
  if (type === "app-store" || type === "google-play") {
    return (
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
        <div className="flex items-center gap-3">
          <div className="grid h-14 w-14 place-items-center rounded-xl bg-teal-100 text-2xl">
            🌿
          </div>
          <div>
            <div className="font-display text-lg font-semibold">Fernly</div>
            <div className="text-xs text-neutral-500">Health & Fitness · 4.8 ★</div>
          </div>
          <button className="ml-auto rounded-full bg-amber-500 px-4 py-1.5 text-xs font-medium text-white">
            Get
          </button>
        </div>
        <div className="mt-4 rounded-lg bg-white p-4">{children}</div>
      </div>
    );
  }
  if (type === "twitter") {
    return (
      <div className="mx-auto max-w-[520px] rounded-xl border border-neutral-200 bg-white p-4">
        <div className="flex gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-neutral-800 text-sm text-white">
            AN
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm">
              <span className="font-medium">Ana Ng</span>{" "}
              <span className="text-neutral-500">@anabuilds · now</span>
            </div>
            <div className="mt-1 whitespace-pre-line text-sm">{children}</div>
          </div>
        </div>
      </div>
    );
  }
  if (type === "linkedin") {
    return (
      <div className="mx-auto max-w-[560px] rounded-xl border border-neutral-200 bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-full bg-blue-100 text-blue-800">
            AN
          </div>
          <div>
            <div className="text-sm font-medium">Ana Ng</div>
            <div className="text-xs text-neutral-500">Founder, Fernly · 1st</div>
          </div>
        </div>
        <div className="mt-3">{children}</div>
      </div>
    );
  }
  return <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">{children}</div>;
}
