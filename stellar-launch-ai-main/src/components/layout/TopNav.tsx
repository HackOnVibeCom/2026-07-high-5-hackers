import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, Bot, ChevronDown, Check } from "lucide-react";
import { useState } from "react";
import { useApp } from "../../lib/store";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/strategy", label: "Strategy" },
  { to: "/studio", label: "Studio" },
  { to: "/campaigns", label: "Campaigns" },
  { to: "/discover", label: "Discover" },
  { to: "/analytics", label: "Analytics" },
] as const;

export function TopNav({
  onOpenAssistant,
  onToggleNotifications,
}: {
  onOpenAssistant: () => void;
  onToggleNotifications: () => void;
}) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const workspaces = useApp((s) => s.workspaces);
  const activeId = useApp((s) => s.activeWorkspaceId);
  const setActive = useApp((s) => s.setActiveWorkspace);
  const active = workspaces.find((w) => w.id === activeId) ?? workspaces[0];
  const [wsOpen, setWsOpen] = useState(false);
  const campaigns = useApp((s) => s.campaigns);
  const notifications = useApp((s) => s.notifications);
  const unreadCount = notifications.filter((n) => n.unread).length;
  const analyticsUnlocked = campaigns.some(
    (c) => c.status === "running" || c.status === "completed",
  );

  const isActive = (to: string) => (to === "/" ? path === "/" : path.startsWith(to));

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-neutral-50/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1240px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Workspace switcher */}
        <div className="relative">
          <button
            onClick={() => setWsOpen((v) => !v)}
            className="flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-2.5 py-1.5 text-sm hover:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
          >
            {active.logo ? (
              <img src={active.logo} alt="" className="h-6 w-6 rounded object-cover" />
            ) : (
              <span
                className="grid h-6 w-6 place-items-center rounded text-sm"
                style={{ backgroundColor: `${active.color}20`, color: active.color }}
              >
                {active.emoji}
              </span>
            )}
            <span className="font-medium text-neutral-900">{active.name}</span>
            <ChevronDown className="h-4 w-4 text-neutral-500" />
          </button>
          {wsOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setWsOpen(false)} />
              <div className="absolute left-0 top-11 z-50 w-64 rounded-lg border border-neutral-200 bg-white p-1 shadow-lg">
                <div className="px-2 py-1.5 text-[11px] font-medium uppercase tracking-wide text-neutral-400">
                  Switch app
                </div>
                {workspaces.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => {
                      setActive(w.id);
                      setWsOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-neutral-100"
                  >
                    {w.logo ? (
                      <img src={w.logo} alt="" className="h-8 w-8 rounded object-cover" />
                    ) : (
                      <span
                        className="grid h-8 w-8 place-items-center rounded"
                        style={{ backgroundColor: `${w.color}20`, color: w.color }}
                      >
                        {w.emoji}
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-neutral-900">{w.name}</div>
                      <div className="truncate text-xs text-neutral-500">{w.category}</div>
                    </div>
                    {w.id === activeId && <Check className="h-4 w-4 text-teal-600" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Center nav */}
        <nav className="ml-4 hidden flex-1 items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active = isActive(item.to);
            const locked = item.to === "/analytics" && !analyticsUnlocked;
            return (
              <Link
                key={item.to}
                to={locked ? "/campaigns" : item.to}
                title={locked ? "Analytics unlocks once a campaign is running" : undefined}
                className={[
                  "relative rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "text-neutral-900"
                    : locked
                      ? "text-neutral-400"
                      : "text-neutral-600 hover:text-neutral-900",
                ].join(" ")}
              >
                {item.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-amber-500" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            onClick={onOpenAssistant}
            className="flex items-center gap-2 rounded-md bg-amber-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
          >
            <Bot className="h-4 w-4" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>
          <button
            onClick={onToggleNotifications}
            aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
            className="relative rounded-md p-2 text-neutral-600 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-amber-500 px-1 font-mono text-[10px] font-medium leading-none text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
          <div className="grid h-8 w-8 place-items-center rounded-full bg-neutral-800 text-xs font-medium text-white">
            AN
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="flex items-center gap-1 overflow-x-auto border-t border-neutral-200 px-2 py-2 md:hidden">
        {NAV.map((item) => {
          const active = isActive(item.to);
          const locked = item.to === "/analytics" && !analyticsUnlocked;
          return (
            <Link
              key={item.to}
              to={locked ? "/campaigns" : item.to}
              className={[
                "shrink-0 rounded-md px-3 py-1.5 text-sm",
                active
                  ? "bg-amber-50 text-amber-800"
                  : locked
                    ? "text-neutral-400"
                    : "text-neutral-600 hover:bg-neutral-100",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
