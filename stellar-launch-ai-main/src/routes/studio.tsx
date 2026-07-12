import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { studioTools } from "../lib/mock-data";
import { AppWindow, Play, Instagram, Linkedin, Twitter, MessageCircle, Mail, Layout, Rocket } from "lucide-react";

const iconFor: Record<string, React.ComponentType<{ className?: string }>> = {
  AppWindow, Play, Instagram, Linkedin, Twitter, MessageCircle, Mail, Layout, Rocket,
};

const toneBg: Record<string, string> = {
  blue: "bg-blue-100 text-blue-800",
  teal: "bg-teal-100 text-teal-800",
  amber: "bg-amber-100 text-amber-800",
  rose: "bg-rose-100 text-rose-800",
};

export const Route = createFileRoute("/studio")({
  component: Studio,
});

function Studio() {
  const matches = useMatches();
  const inChild = matches.some((m) => m.routeId === "/studio/$type");

  if (inChild) return <Outlet />;

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm text-neutral-500">Studio</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-neutral-900">
          Marketing assets your agent can draft for you.
        </h1>
        <p className="mt-2 max-w-xl text-sm text-neutral-600">
          Pick a surface. We'll draft in your voice, show a live preview of where it'll appear, and keep every version.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {studioTools.map((t) => {
          const Icon = iconFor[t.icon] ?? Layout;
          return (
            <Link
              key={t.slug}
              to="/studio/$type"
              params={{ type: t.slug }}
              className="group rounded-xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-300 hover:shadow-sm"
            >
              <div className={`inline-flex h-9 w-9 items-center justify-center rounded-md ${toneBg[t.tone]}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="mt-4 font-medium text-neutral-900">{t.name}</div>
              <div className="mt-1 text-xs text-neutral-500">
                Draft, regenerate, and copy in seconds.
              </div>
              <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-amber-800 opacity-0 transition group-hover:opacity-100">
                Open workspace →
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
