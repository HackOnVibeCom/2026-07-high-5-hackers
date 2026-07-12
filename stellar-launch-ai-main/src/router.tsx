import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    // Follows Vite's `base` so the SPA also works when hosted under a
    // sub-path (e.g. GitHub Pages project sites). "/" in normal deploys.
    basepath: import.meta.env.BASE_URL,
  });

  return router;
};
