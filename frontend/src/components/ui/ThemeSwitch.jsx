import { useTheme } from "../../context/hooks";

export default function ThemeSwitch() {
  const { theme, cycleTheme } = useTheme();
  return (
    <button className="theme-switch" type="button" onClick={cycleTheme} aria-label={`Theme: ${theme.replace("-", " ")}. Change theme`}>
      <span aria-hidden="true">{theme === "night-vault" ? "☾" : theme === "fresh-mint" ? "✿" : "☼"}</span>
      <span className="theme-switch-label">{theme === "calm-ledger" ? "Calm" : theme === "night-vault" ? "Night" : "Mint"}</span>
    </button>
  );
}
