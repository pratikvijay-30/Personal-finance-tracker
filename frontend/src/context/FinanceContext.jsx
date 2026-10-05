import { useCallback, useMemo, useState } from "react";
import { useAuth } from "./hooks";
import { FinanceContext } from "./contexts";
import { readFinanceData } from "../data/finance";

export function FinanceProvider({ children }) {
  const { user } = useAuth();
  const [storedData, setStoredData] = useState(() => ({ userId: user?.id, data: user ? readFinanceData(user.id) : null }));
  const data = storedData.userId === user?.id ? storedData.data : user ? readFinanceData(user.id) : null;

  const persist = useCallback((next) => {
    if (!user) return;
    setStoredData({ userId: user.id, data: next });
    localStorage.setItem(`pocketwise:finance:${user.id}`, JSON.stringify(next));
  }, [user]);

  const addTransaction = useCallback((transaction) => {
    if (!user || !data) return;
    const record = { ...transaction, id: crypto.randomUUID(), userId: user.id };
    const next = { ...data, transactions: [record, ...data.transactions] };
    if (record.type === "income") next.incomes = [{ id: crypto.randomUUID(), userId: user.id, source: record.source || record.category, amount: record.amount, frequency: "One-time", date: record.date }, ...data.incomes];
    persist(next);
  }, [data, persist, user]);

  const updateTransaction = useCallback((id, changes) => {
    if (!data) return;
    persist({
    ...data,
    transactions: data.transactions.map((transaction) => transaction.id === id ? { ...transaction, ...changes } : transaction),
    });
  }, [data, persist]);

  const deleteTransaction = useCallback((id) => {
    if (data) persist({ ...data, transactions: data.transactions.filter((transaction) => transaction.id !== id) });
  }, [data, persist]);
  const addIncome = useCallback((income) => {
    if (!user || !data) return;
    const record = { ...income, id: crypto.randomUUID(), userId: user.id };
    const transaction = { id: crypto.randomUUID(), userId: user.id, type: "income", amount: record.amount, category: record.source, source: record.source, date: record.date, note: record.frequency };
    persist({ ...data, incomes: [record, ...data.incomes], transactions: [transaction, ...data.transactions] });
  }, [data, persist, user]);

  const value = useMemo(() => ({
    data: data || { transactions: [], incomes: [], budgets: [] },
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addIncome,
  }), [data, addIncome, addTransaction, deleteTransaction, updateTransaction]);
  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}
