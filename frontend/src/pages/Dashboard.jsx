import { Link } from "react-router-dom";
import { useFinance } from "../context/hooks";
import { categories } from "../data/finance";
import { formatCurrency, formatDate, monthLabel } from "../utils/format";
import { MonthlyBars } from "../components/charts/FinanceCharts";

export default function Dashboard() {
  const { data } = useFinance();
  const month = new Date().toISOString().slice(0, 7);
  const current = data.transactions.filter((item) => item.date.startsWith(month));
  const income = current.filter((item) => item.type === "income").reduce((sum, item) => sum + item.amount, 0);
  const expenses = current.filter((item) => item.type === "expense").reduce((sum, item) => sum + item.amount, 0);
  const balance = data.transactions.reduce((sum, item) => sum + (item.type === "income" ? item.amount : -item.amount), 0);
  const budget = data.budgets.reduce((sum, item) => sum + item.limit, 0);
  const budgetUsed = data.budgets.reduce((sum, item) => sum + current.filter((transaction) => transaction.type === "expense" && transaction.category === item.categoryId).reduce((total, transaction) => total + transaction.amount, 0), 0);

  return <div className="dashboard-page">
    <div className="welcome-row"><div><span className="eyebrow">MONDAY, {new Intl.DateTimeFormat("en-IN", { month: "long", day: "numeric" }).format(new Date()).toUpperCase()}</span><h2>Your money, looking good <span>✳</span></h2><p>Here’s your financial snapshot for {monthLabel()}.</p></div><span className="streak-pill">✦ You’re building a great habit</span></div>
    <section className="stats-grid">
      <StatCard label="Total balance" amount={balance} icon="◒" trend="+12.8%" tone="balance" note="vs. last month" />
      <StatCard label="Income this month" amount={income} icon="↗" trend="+8.2%" tone="income" note="vs. last month" />
      <StatCard label="Spent this month" amount={expenses} icon="↘" trend="−3.4%" tone="expense" note="vs. last month" />
      <StatCard label="Saved this month" amount={income - expenses} icon="✳" trend={`${income ? Math.round((income - expenses) / income * 100) : 0}%`} tone="savings" note="of your income" />
    </section>
    <div className="dashboard-grid">
      <section className="panel spending-panel"><div className="panel-heading"><div><span className="eyebrow">THE BIG PICTURE</span><h3>Income & spending</h3></div><span className="period-chip">Last 6 months <span>⌄</span></span></div><MonthlyBars transactions={data.transactions} /></section>
      <section className="panel budget-panel"><div className="panel-heading"><div><span className="eyebrow">A GENTLE CHECK-IN</span><h3>Monthly budget</h3></div><span className="budget-sparkle">✳</span></div><div className="budget-total"><strong>{formatCurrency(budgetUsed)}</strong><span>of {formatCurrency(budget)}</span></div><div className="progress-track"><span style={{ width: `${Math.min(100, budget ? budgetUsed / budget * 100 : 0)}%` }} /></div><div className="budget-foot"><span>{budget ? Math.round(budgetUsed / budget * 100) : 0}% used</span><span>{formatCurrency(Math.max(0, budget - budgetUsed))} left to spend</span></div><div className="budget-note"><span>☼</span><p>You’re right on track. Keep it up!</p></div></section>
    </div>
    <section className="panel recent-panel"><div className="panel-heading"><div><span className="eyebrow">THE LATEST</span><h3>Recent transactions</h3></div><Link className="subtle-link" to="/transactions">See all <span>↗</span></Link></div><TransactionList transactions={data.transactions.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)} /></section>
  </div>;
}

function StatCard({ label, amount, icon, trend, tone, note }) {
  return <article className={`stat-card ${tone}`}><div className="stat-top"><span>{label}</span><span className="stat-icon">{icon}</span></div><strong>{formatCurrency(amount)}</strong><div className="stat-trend"><span>{trend}</span> {note}</div></article>;
}

export function TransactionList({ transactions }) {
  if (!transactions.length) return <div className="empty-state"><span>✳</span><h3>A fresh start</h3><p>Your transactions will show up here as you add them.</p></div>;
  return <div className="transaction-list">{transactions.map((transaction) => {
    const category = categories.find((item) => item.id === transaction.category);
    return <div className="transaction-row" key={transaction.id}><span className={`transaction-icon ${transaction.type}`}>{transaction.type === "income" ? "↗" : category?.icon || "•"}</span><div className="transaction-description"><strong>{transaction.source || category?.name || transaction.category}</strong><span>{transaction.note || category?.name || "Income"} <i>·</i> {formatDate(transaction.date)}</span></div><strong className={`transaction-amount ${transaction.type}`}>{transaction.type === "income" ? "+" : "−"}{formatCurrency(transaction.amount)}</strong></div>;
  })}</div>;
}
