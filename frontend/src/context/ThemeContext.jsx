import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export const DEFAULT_THEME = {
  bg: "#0f172a",   // c1 — Background
  chart: "#6366f1",   // c2 — Highlight
  border: "#1e293b",   // c3 — Border
  font: "#e2e8f0"    // c4 — Text
};

const ThemeContext = createContext({
  theme: DEFAULT_THEME,
  setTheme: () => { },
  resetTheme: () => { }
});

/**
 * Read persisted colors from localStorage on the very first render.
 * This eliminates the DEFAULT_THEME flash on page refresh because the
 * correct colors are applied synchronously before any paint occurs.
 */
function getInitialTheme() {
  try {
    const raw = localStorage.getItem("invenx_user");
    if (raw) {
      const user = JSON.parse(raw);
      const c = user?.colors;
      // Only use stored colors if all four fields are present and non-empty
      if (c && c.bg && c.chart && c.border && c.font) return c;
    }
  } catch (_) { /* ignore any parse errors */ }
  return DEFAULT_THEME;
}

export function ThemeProvider({ children }) {
  // useState with a lazy initializer — runs only once on mount
  const [theme, setThemeRaw] = useState(getInitialTheme);

  /**
   * Guarded setter — ignores calls with incomplete or undefined color objects.
   * Prevents a stale/partial response from resetting a correct theme.
   */
  function setTheme(colors) {
    if (!colors || !colors.bg || !colors.chart || !colors.border || !colors.font) return;
    setThemeRaw(colors);
  }

  // Apply theme CSS variables whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--bg", theme.bg);
    root.style.setProperty("--chart", theme.chart);
    root.style.setProperty("--border", theme.border);
    root.style.setProperty("--font", theme.font);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      resetTheme: () => setThemeRaw(DEFAULT_THEME)
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
