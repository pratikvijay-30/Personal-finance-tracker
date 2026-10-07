import { useEffect, useMemo } from "react";
import { ThemeContext } from "./contexts";
const themes = ["ocean-glass"];

export function ThemeProvider({ children }) {
  useEffect(() => {
    document.documentElement.dataset.theme = themes[0];
  }, []);

  const value = useMemo(() => ({ theme: themes[0], themes }), []);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
