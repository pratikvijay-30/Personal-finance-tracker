import { useMemo, useState } from "react";
import { useFinance } from "../context/hooks";
import { categories } from "../data/finance";
import { formatCurrency } from "../utils/format";
import { MonthlyBars, SpendingDonut } from "../components/charts/FinanceCharts";

export default function Analysis() {
  const { data } = useFinance();
  const [range, setRange] = useState("6");
  const expenses = data.transactions.filter((item) => item.type === "expense");
  const spendByCategory = categories.map((category) => ({ ...category, amount: expenses.filter((item) => item.category === category.id).reduce((sum, item) => sum + item.amount, 0) })).sort((a, b) => b.amount - a.amount);
  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
  const totalIncome = data.transactions.filter((item) => item.type === "income").reduce((sum, item) => sum + item.amount, 0);
  const topCategory = spendByCategory[0];
  const savingsRate = totalIncome ? Math.round((totalIncome - totalExpense) / totalIncome * 100) : 0;
  const selectedTransactions = useMemo(() => {
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - Number(range));
    return data.transactions.filter((item) => new Date(`${item.date}T00:00:00`) >= cutoff);
  }, [data.transactions, range]);

  return <div className="analysis-page"><div className="page-intro-row"><div><span className="eyebrow">PATTERNS & POSSIBILITIES</span><h2>Money, in perspective</h2><p>Little patterns can point to lovely possibilities.</p></div><label className="range-select"><span>TIMEFRAME</span><select value={range} onChange={(event) => setRange(event.target.value)}><option value="1">This month</option><option value="3">Last quarter</option><option value="6">Last 6 months</option><option value="12">This year</option></select></label></div>
    <div className="analysis-summary"><div><span>Total income tracked</span><strong>{formatCurrency(totalIncome)}</strong></div><div><span>Total expenses tracked</span><strong>{formatCurrency(totalExpense)}</strong></div><div><span>Average savings rate</span><strong>{savingsRate}%</strong></div></div>
    <div className="analysis-grid"><section className="panel donut-panel"><div className="panel-heading"><div><span className="eyebrow">WHERE IT GOES</span><h3>Spending by category</h3></div><span className="period-chip">{range} month{range === "1" ? "" : "s"}</span></div><SpendingDonut transactions={selectedTransactions} /><div className="category-breakdown">{spendByCategory.filter((item) => item.amount > 0).slice(0, 4).map((item) => <div key={item.id}><span><i style={{ background: item.color }} />{item.name}</span><strong>{formatCurrency(item.amount)}</strong></div>)}</div></section><section className="panel trend-panel"><div className="panel-heading"><div><span className="eyebrow">IN & OUT</span><h3>Income vs. expenses</h3></div><span className="chart-legend"><i /> Income <i /> Expenses</span></div><MonthlyBars transactions={selectedTransactions} months={Number(range) > 6 ? 12 : Number(range)} /></section></div>
    <section className="insights-section"><div className="insight-heading"><span className="eyebrow">A FEW THINGS WE NOTICED</span><h3>Your money story, so far.</h3></div><div className="insight-grid"><Insight icon="◉" tone="peach" label="Top spending category" value={topCategory?.name || "Not yet"} copy={topCategory?.amount ? `${formatCurrency(topCategory.amount)} across your transactions` : "Your spending insights will appear here."} /><Insight icon="↗" tone="mint" label="Biggest expense" value={expenses.length ? categories.find((item) => item.id === expenses.slice().sort((a, b) => b.amount - a.amount)[0].category)?.name || "One-off" : "Not yet"} copy={expenses.length ? `${formatCurrency(Math.max(...expenses.map((item) => item.amount)))} in a single transaction` : "Add expenses to spot your biggest spends."} /><Insight icon="✳" tone="lavender" label="Savings rate" value={`${savingsRate}%`} copy={savingsRate >= 20 ? "A lovely pace. You’re making it happen." : "Every little bit saved is a good start."} /></div></section>
  </div>;
}

function Insight({ icon, tone, label, value, copy }) {
  return <article className="insight-card"><span className={`insight-icon ${tone}`}>{icon}</span><span className="insight-label">{label}</span><strong>{value}</strong><p>{copy}</p></article>;
}
