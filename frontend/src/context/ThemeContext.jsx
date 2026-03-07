import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export const DEFAULT_THEME = {
  bg: "#0f172a",
  chart: "#6366f1",
  border: "#1e293b",
  font: "#e2e8f0"
};

const ThemeContext = createContext({
  theme: DEFAULT_THEME,
  setTheme: () => { },
  resetTheme: () => { }
});


function getInitialTheme() {
  try {
    const raw = localStorage.getItem("invenx_user");
    if (raw) {
      const user = JSON.parse(raw);
      const c = user?.colors;
      if (c && c.bg && c.chart && c.border && c.font) return c;
    }
  } catch (_) { }
  return DEFAULT_THEME;
}

export function ThemeProvider({ children }) {
  const [theme, setThemeRaw] = useState(getInitialTheme);


  function setTheme(colors) {
    if (!colors || !colors.bg || !colors.chart || !colors.border || !colors.font) return;
    setThemeRaw(colors);
  }

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
