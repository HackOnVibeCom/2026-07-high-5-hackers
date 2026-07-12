import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportError } from "../lib/error-reporting";
import { TopNav } from "../components/layout/TopNav";
import { AssistantPanel } from "../components/panels/AssistantPanel";
import { NotificationsPanel } from "../components/panels/NotificationsPanel";
import { Toaster } from "../components/ui/sonner";
import { AnimatePresence, motion } from "framer-motion";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-6xl font-semibold text-neutral-900">404</h1>
        <p className="mt-3 text-neutral-600">This page hasn't been mapped yet.</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
        >
          Back to LaunchPilot
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    reportError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-xl font-semibold text-neutral-900">Something broke</h1>
        <p className="mt-2 text-sm text-neutral-600">Try again in a moment.</p>
        <button
          onClick={reset}
          className="mt-6 inline-flex items-center justify-center rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "LaunchPilot AI — Your AI Growth Agent" },
      {
        name: "description",
        content:
          "LaunchPilot AI is an AI growth agent that takes newly launched mobile apps from day one to their first 10,000 users.",
      },
      { property: "og:title", content: "LaunchPilot AI — Your AI Growth Agent" },
      {
        property: "og:description",
        content:
          "From launch day to 10,000 users. Strategy, assets, campaigns and growth insights, on autopilot.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-neutral-50">
        <TopNav
          onOpenAssistant={() => setAssistantOpen(true)}
          onToggleNotifications={() => setNotifOpen((v) => !v)}
        />
        <main className="mx-auto w-full max-w-[1240px] px-4 pb-24 pt-8 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={typeof window !== "undefined" ? window.location.pathname : "root"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        <AssistantPanel open={assistantOpen} onClose={() => setAssistantOpen(false)} />
        <NotificationsPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
        <Toaster position="bottom-right" />
      </div>
    </QueryClientProvider>
  );
}
