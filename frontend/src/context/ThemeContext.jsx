import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const DEFAULT_THEME = {
  bg: "#0b1220",
  chart: "#3b82f6",
  border: "#334155",
  font: "#e5e7eb"
};

const ThemeContext = createContext({
  theme: DEFAULT_THEME,
  setTheme: () => {},
  resetTheme: () => {}
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(DEFAULT_THEME);

  // Apply theme to the whole app using CSS variables
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
      resetTheme: () => setTheme(DEFAULT_THEME)
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}

