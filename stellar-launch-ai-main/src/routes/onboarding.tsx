import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { ONBOARDING_STAGES, useApp, type OnboardingStage } from "../lib/store";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
});

const stepQuestions = [
  { q: "Who is your ideal user?", a: "Busy professionals aged 25–40 who've tried and quit at least one habit tracker." },
  { q: "What problem does your app solve?", a: "It removes the shame loop of streak apps so people actually stick with new habits." },
  { q: "Who are your main competitors?", a: "Habitify, Streaks, Fabulous, and Way of Life." },
  { q: "How do users currently solve this?", a: "Notion templates, paper journals, or streak-based apps that eventually punish them." },
  { q: "How will you make money?", a: "Freemium with a $4/mo Pro tier for weekly reviews and unlimited habits." },
];

function Onboarding() {
  const nav = useNavigate();
  const { activeStage, completedStages, setActiveStage, completeStage, setOnboarded, updateWorkspace, workspaces, activeWorkspaceId } =
    useApp();
  const active = workspaces.find((w) => w.id === activeWorkspaceId)!;

  const currentIdx = ONBOARDING_STAGES.findIndex((s) => s.id === activeStage);

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="rounded-xl border border-neutral-200 bg-white p-4">
        <div className="mb-3 text-xs font-medium uppercase tracking-wide text-neutral-500">Launch plan</div>
        <ol className="space-y-1">
          {ONBOARDING_STAGES.map((s, idx) => {
            const done = completedStages.includes(s.id);
            const isActive = s.id === activeStage;
            const locked = !done && idx > currentIdx;
            return (
              <li key={s.id}>
                <button
                  disabled={locked}
                  onClick={() => setActiveStage(s.id)}
                  className={`flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm ${
                    isActive
                      ? "bg-amber-50 text-amber-900"
                      : locked
                        ? "text-neutral-400"
                        : "text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  <span
                    className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-mono ${
                      done
                        ? "bg-teal-500 text-white"
                        : isActive
                          ? "border-2 border-amber-500 text-amber-800"
                          : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {done ? <Check className="h-3.5 w-3.5" /> : idx + 1}
                  </span>
                  <span className="truncate">{s.label}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </aside>

      <div className="rounded-xl border border-neutral-200 bg-white p-6 sm:p-8">
        {activeStage === "app-info" && (
          <AppInfoStep
            name={active.name}
            description={active.description}
            onSave={(v) => {
              updateWorkspace(v);
              completeStage("app-info");
              setActiveStage("audience");
            }}
          />
        )}
        {activeStage === "audience" && (
          <ChatStep
            onDone={() => {
              completeStage("audience");
              setActiveStage("competitors");
            }}
          />
        )}
        {activeStage !== "app-info" && activeStage !== "audience" && (
          <SimpleStep
            stage={activeStage}
            onDone={() => {
              completeStage(activeStage);
              const next = ONBOARDING_STAGES[currentIdx + 1];
              if (next) setActiveStage(next.id);
              else {
                setOnboarded(true);
                nav({ to: "/" });
              }
            }}
            onFinish={() => {
              completeStage(activeStage);
              setOnboarded(true);
              nav({ to: "/" });
            }}
            isLast={currentIdx === ONBOARDING_STAGES.length - 1}
          />
        )}
      </div>
    </div>
  );
}

function AppInfoStep({
  name,
  description,
  onSave,
}: {
  name: string;
  description: string;
  onSave: (v: { name: string; description: string; category: string; platform: "iOS" | "Android" | "Both" }) => void;
}) {
  const [n, setN] = useState(name);
  const [d, setD] = useState(description);
  const [platform, setPlatform] = useState<"iOS" | "Android" | "Both">("Both");
  const [category, setCategory] = useState("Health & Fitness");

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-neutral-900">Tell us about your app</h2>
      <p className="mt-1 text-sm text-neutral-600">
        This becomes the backbone your growth agent uses for every asset and campaign.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field label="App name">
          <input
            value={n}
            onChange={(e) => setN(e.target.value)}
            className="w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />
        </Field>
        <Field label="Category">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          >
            <option>Health & Fitness</option>
            <option>Productivity</option>
            <option>Finance</option>
            <option>Travel</option>
            <option>Social</option>
          </select>
        </Field>
        <Field label="Platform">
          <div className="inline-flex rounded-md border border-neutral-200 bg-neutral-50 p-0.5">
            {(["iOS", "Android", "Both"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={`rounded px-3 py-1.5 text-sm ${
                  platform === p ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-600"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Logo">
          <div className="flex items-center gap-3 rounded-md border border-dashed border-neutral-300 bg-neutral-50 px-3 py-2 text-sm text-neutral-500">
            <div className="grid h-9 w-9 place-items-center rounded bg-teal-100 text-teal-800">🌿</div>
            Drag & drop or click to upload
          </div>
        </Field>
        <div className="sm:col-span-2">
          <Field label="Short description">
            <textarea
              rows={3}
              value={d}
              onChange={(e) => setD(e.target.value)}
              className="w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </Field>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={() => onSave({ name: n, description: d, category, platform })}
          className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
        >
          Continue <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-neutral-500">
        {label}
      </span>
      {children}
    </label>
  );
}

function ChatStep({ onDone }: { onDone: () => void }) {
  const [turns, setTurns] = useState<{ role: "ai" | "user"; text: string }[]>([
    { role: "ai", text: stepQuestions[0].q },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [step, setStep] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns, typing]);

  const submit = () => {
    if (!input.trim()) return;
    setTurns((t) => [...t, { role: "user", text: input }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const next = step + 1;
      if (next < stepQuestions.length) {
        setTurns((t) => [...t, { role: "ai", text: stepQuestions[next].q }]);
        setStep(next);
      } else {
        setShowSummary(true);
      }
      setTyping(false);
    }, 700);
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-neutral-900">Business understanding</h2>
      <p className="mt-1 text-sm text-neutral-600">
        A quick conversation so your agent knows what you're really building.
      </p>

      <div className="mt-6 space-y-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
        {turns.map((t, i) => (
          <div key={i} className={t.role === "user" ? "flex justify-end" : ""}>
            <div
              className={
                t.role === "user"
                  ? "max-w-[85%] rounded-lg rounded-br-sm bg-neutral-900 px-3 py-2 text-sm text-white"
                  : "max-w-[85%] rounded-lg rounded-bl-sm bg-white px-3 py-2 text-sm text-neutral-800 shadow-sm"
              }
            >
              {t.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex items-center gap-1 text-xs text-neutral-500">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500 [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500 [animation-delay:300ms]" />
          </div>
        )}
        <div ref={endRef} />

        {!showSummary && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="flex gap-2 pt-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={stepQuestions[step].a}
              className="flex-1 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
            <button className="rounded-md bg-amber-500 px-3 py-2 text-sm font-medium text-white hover:bg-amber-600">
              Send
            </button>
          </form>
        )}
      </div>

      <AnimatePresence>
        {showSummary && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-5"
          >
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-amber-800">
              <Sparkles className="h-3.5 w-3.5" /> Product summary
            </div>
            <p className="mt-2 text-sm text-amber-900">
              You're building a calm, forgiving habit tracker for busy 25–40 year-olds who bounced off streak-based apps.
              You beat competitors like Habitify and Streaks by removing the shame loop and adding a 1-minute weekly review.
              Monetization is freemium with a $4/month Pro tier — a clear path from free habit to paid reflection.
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={onDone}
                className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
              >
                Looks right — continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SimpleStep({
  stage,
  onDone,
  onFinish,
  isLast,
}: {
  stage: OnboardingStage;
  onDone: () => void;
  onFinish: () => void;
  isLast: boolean;
}) {
  const meta: Record<OnboardingStage, { title: string; body: string }> = {
    "app-info": { title: "", body: "" },
    audience: { title: "", body: "" },
    competitors: {
      title: "Competitor analysis",
      body: "We scanned 6 direct competitors and found 3 clean opportunities — see the Strategy screen for the full breakdown.",
    },
    assets: {
      title: "Marketing assets",
      body: "Nine asset templates are ready to draft on your behalf in the Studio — App Store copy, Reddit launch post, Product Hunt description and more.",
    },
    "launch-plan": {
      title: "4-week launch plan",
      body: "Your agent built a week-by-week roadmap with 16 tasks. You can send any task straight to Studio or Campaigns.",
    },
    "launch-campaign": {
      title: "First campaign",
      body: "A draft Product Hunt Launch Week campaign is waiting in Campaigns. Review the platforms, budget, and launch date, then schedule it.",
    },
    growth: {
      title: "Growth monitoring",
      body: "Once your first campaign is running, your agent will surface priority insights on Home every morning.",
    },
  };
  const m = meta[stage];
  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-neutral-900">{m.title}</h2>
      <p className="mt-2 max-w-lg text-sm text-neutral-600">{m.body}</p>
      <div className="mt-8 flex justify-end gap-2">
        <button
          onClick={isLast ? onFinish : onDone}
          className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
        >
          {isLast ? "Enter LaunchPilot" : "Continue"} <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
