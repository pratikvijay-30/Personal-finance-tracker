import { useContext } from "react";
import { AuthContext, FinanceContext, ThemeContext } from "./contexts";

export const useAuth = () => useContext(AuthContext);
export const useTheme = () => useContext(ThemeContext);
export const useFinance = () => useContext(FinanceContext);
