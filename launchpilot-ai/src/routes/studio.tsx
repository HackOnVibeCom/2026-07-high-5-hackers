import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { studioTools } from "../lib/mock-data";
import {
  AppWindow,
  Play,
  Instagram,
  Linkedin,
  Twitter,
  MessageCircle,
  Mail,
  Layout,
  Rocket,
  Check,
  Sparkles,
  Loader2,
  Wand2,
} from "lucide-react";
import { useApp, useActiveWorkspace } from "../lib/store";
import { toast } from "sonner";

const iconFor: Record<string, React.ComponentType<{ className?: string }>> = {
  AppWindow,
  Play,
  Instagram,
  Linkedin,
  Twitter,
  MessageCircle,
  Mail,
  Layout,
  Rocket,
};

const toneBg: Record<string, string> = {
  blue: "bg-blue-100 text-blue-800",
  teal: "bg-teal-100 text-teal-800",
  amber: "bg-amber-100 text-amber-800",
  rose: "bg-rose-100 text-rose-800",
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

export const Route = createFileRoute("/studio")({
  component: Studio,
});

function Studio() {
  const matches = useMatches();
  const inChild = matches.some((m) => m.routeId === "/studio/$type");
  const drafts = useApp((s) => s.studioDrafts);
  const ws = useActiveWorkspace();
  const generateBrandLaunchPackage = useApp((s) => s.generateBrandLaunchPackage);
  const generatingPackage = useApp((s) => s.generatingPackage);

  const handleGenerate = async () => {
    toast.promise(generateBrandLaunchPackage(ws.name, ws.category, ws.description), {
      loading: "Generating assets with ASO & Content Agents...",
      success: "ASO metadata and social post drafts generated successfully!",
      error: "Failed to generate assets.",
    });
  };

  if (inChild) return <Outlet />;

  return (
    <div className="space-y-8">
      <motion.header
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Wand2 className="h-4 w-4" />
            </div>
            <p className="text-sm text-neutral-500">Studio</p>
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-neutral-900">
            Marketing assets your agent can draft for you.
          </h1>
          <p className="mt-2 max-w-xl text-sm text-neutral-600">
            Pick a surface. We'll draft in your voice, show a live preview of where it'll appear, and
            keep every version.
          </p>
        </div>
        <button
          disabled={generatingPackage}
          onClick={handleGenerate}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all hover:scale-[1.03] active:scale-[0.97] disabled:opacity-50 cursor-pointer"
        >
          {generatingPackage ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          Generate Launch Package
        </button>
      </motion.header>

      <motion.div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {studioTools.map((t) => {
          const Icon = iconFor[t.icon] ?? Layout;
          const hasDraft = !!drafts[t.slug];
          return (
            <motion.div key={t.slug} variants={fadeUp}>
              <Link
                to="/studio/$type"
                params={{ type: t.slug }}
                className="group block rounded-2xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${toneBg[t.tone]} transition-transform group-hover:scale-110`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  {hasDraft && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-teal-500/10 border border-teal-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-teal-400">
                      <Check className="h-3 w-3" /> Draft saved
                    </span>
                  )}
                </div>
                <div className="mt-5 font-display font-semibold text-neutral-900">{t.name}</div>
                <div className="mt-1.5 text-xs text-neutral-500">
                  Draft, regenerate, and copy in seconds.
                </div>
                <div className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-amber-500 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
                  {hasDraft ? "Continue editing" : "Open workspace"} →
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
