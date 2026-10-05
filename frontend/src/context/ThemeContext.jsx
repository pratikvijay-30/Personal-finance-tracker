import { useEffect, useMemo, useState } from "react";
import { ThemeContext } from "./contexts";
const themes = ["calm-ledger", "night-vault", "fresh-mint"];

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("pocketwise:theme") || themes[0]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("pocketwise:theme", theme);
  }, [theme]);

  const value = useMemo(() => ({
    theme,
    themes,
    setTheme: (next) => setTheme(themes.includes(next) ? next : themes[0]),
    cycleTheme: () => setTheme((current) => themes[(themes.indexOf(current) + 1) % themes.length]),
  }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
