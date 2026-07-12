import { AnimatePresence, motion } from "framer-motion";
import { Link, useRouterState } from "@tanstack/react-router";
import { Bot, Send, X, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useApp, type AssistantMessage } from "../../lib/store";

type Msg = AssistantMessage;

const WELCOME: Msg = {
  role: "ai",
  text: "Hey — I'm your growth agent. I can see what you're looking at. Ask me anything, or try one of these:",
};

const contextLabel = (path: string) => {
  if (path.startsWith("/strategy")) return "Strategy";
  if (path.startsWith("/studio")) return "Studio";
  if (path.startsWith("/campaigns")) return "Campaigns";
  if (path.startsWith("/discover")) return "Discover";
  if (path.startsWith("/analytics")) return "Analytics";
  if (path.startsWith("/onboarding")) return "Onboarding";
  return "Home";
};

const suggestionsFor = (ctx: string): string[] => {
  switch (ctx) {
    case "Campaigns":
      return ["Improve this campaign", "When should I launch?", "Draft copy for Reddit"];
    case "Studio":
      return ["Shorten this caption", "Rewrite in a warmer voice", "Turn this into a thread"];
    case "Analytics":
      return ["Why is CTR decreasing?", "What's my best channel?", "Where should I spend next?"];
    case "Discover":
      return ["Match me with 5 influencers", "Best subreddit for launch?", "Draft an outreach DM"];
    case "Strategy":
      return ["Summarize my top competitor", "Rewrite my positioning", "Plan next 2 weeks"];
    default:
      return ["What should I do today?", "Draft my Product Hunt copy", "Rank my competitors"];
  }
};

const canned = (q: string, ctx: string): Msg => {
  if (/reddit|post/i.test(q))
    return {
      role: "ai",
      text: "Drafted a founder-story angle for r/getdisciplined that leads with the failure of streak apps and skips the pitch until the last line.",
      action: { label: "Open in Studio", to: "/studio/reddit" },
    };
  if (/campaign|launch/i.test(q))
    return {
      role: "ai",
      text: "Based on your last 3 weeks of engagement, Tuesday 12:01 PST still looks strongest — no direct competitor slotted that day.",
      action: { label: "Go to Campaigns", to: "/campaigns" },
    };
  if (/ctr|why/i.test(q))
    return {
      role: "ai",
      text: "CTR dropped 14% because Instagram Reels shifted to a static image on Tue. Reverting to video should recover it within 48h.",
      action: { label: "See Analytics", to: "/analytics" },
    };
  return {
    role: "ai",
    text: `Working from your ${ctx} context — here's the sharpest next step: focus on the one asset with the highest expected impact this week. Want me to draft it?`,
    action: { label: "Open Studio", to: "/studio" },
  };
};

export function AssistantPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const ctx = contextLabel(path);
  const stored = useApp((s) => s.assistantMessages);
  const setStored = useApp((s) => s.setAssistantMessages);
  const messages = stored.length ? stored : [WELCOME];
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking, open]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const base = stored.length ? stored : [WELCOME];
    setStored([...base, { role: "user", text }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      setStored([...base, { role: "user", text }, canned(text, ctx)]);
      setThinking(false);
    }, 900);
  };

  const reset = () => setStored([]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-neutral-900/20"
          />
          <motion.aside
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[420px] flex-col border-l border-neutral-200 bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-md bg-amber-500 text-white">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-medium text-neutral-900">Growth Agent</div>
                  <div className="text-xs text-neutral-500">
                    <span className="mr-1.5 inline-flex items-center rounded bg-amber-50 px-1.5 py-0.5 font-mono text-[11px] text-amber-800">
                      Context: {ctx}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 1 && (
                  <button
                    onClick={reset}
                    className="rounded px-2 py-1 text-xs text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="rounded p-1 text-neutral-500 hover:bg-neutral-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : ""}>
                  <div
                    className={
                      m.role === "user"
                        ? "max-w-[80%] rounded-lg rounded-br-sm bg-neutral-900 px-3 py-2 text-sm text-white"
                        : "max-w-[85%] space-y-2 rounded-lg rounded-bl-sm bg-neutral-100 px-3 py-2 text-sm text-neutral-800"
                    }
                  >
                    <p className="whitespace-pre-line">{m.text}</p>
                    {m.action && (
                      <Link
                        to={m.action.to}
                        onClick={onClose}
                        className="inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 hover:bg-amber-100"
                      >
                        <Sparkles className="h-3 w-3" />
                        {m.action.label}
                      </Link>
                    )}
                  </div>
                </div>
              ))}
              {thinking && (
                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500 [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500 [animation-delay:300ms]" />
                  <span>Thinking…</span>
                </div>
              )}
              {messages.length <= 1 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {suggestionsFor(ctx).map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-700 hover:border-amber-400 hover:text-amber-800"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
              <div ref={endRef} />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-neutral-200 p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask about ${ctx.toLowerCase()}…`}
                className="flex-1 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
              <button
                type="submit"
                className="grid h-9 w-9 place-items-center rounded-md bg-amber-500 text-white hover:bg-amber-600"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
