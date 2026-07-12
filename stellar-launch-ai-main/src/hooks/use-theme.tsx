import { useCallback, useSyncExternalStore } from "react";

// Theme is a plain `dark` class on <html>, applied before hydration by the
// inline boot script in __root.tsx so there is no flash of the wrong theme.
// The app ships dark-first: dark is the default until the user opts out.

export type Theme = "light" | "dark";

const STORAGE_KEY = "launchpilot-theme";

const listeners = new Set<() => void>();

function getSnapshot(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

// SSR/prerender shell renders before any client preference is known.
function getServerSnapshot(): Theme {
  return "dark";
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* private mode — theme just won't persist */
  }
  listeners.forEach((l) => l());
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const toggleTheme = useCallback(() => {
    applyTheme(getSnapshot() === "dark" ? "light" : "dark");
  }, []);
  return { theme, toggleTheme };
}
