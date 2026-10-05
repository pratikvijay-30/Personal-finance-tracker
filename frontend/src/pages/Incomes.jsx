import { useState } from "react";
import { useFinance } from "../context/hooks";
import { formatCurrency, formatDate } from "../utils/format";
import { TransactionList } from "./Dashboard";

export default function Incomes() {
  const { data, addIncome } = useFinance();
  const [showForm, setShowForm] = useState(false);
  const incomeItems = data.transactions.filter((item) => item.type === "income").sort((a, b) => b.date.localeCompare(a.date));
  const total = incomeItems.filter((item) => item.date.startsWith(new Date().toISOString().slice(0, 7))).reduce((sum, item) => sum + item.amount, 0);

  function addSource(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const amount = Number(form.get("amount"));
    if (amount > 0) {
      addIncome({ source: form.get("source"), amount, frequency: form.get("frequency"), date: form.get("date") });
      setShowForm(false);
    }
  }

  return <div className="incomes-page"><div className="page-intro-row"><div><span className="eyebrow">THE GOOD STUFF</span><h2>Income streams</h2><p>Every way you make money, all in one place.</p></div><button className="button button-primary" onClick={() => setShowForm(!showForm)}>＋ Add income</button></div>
    <section className="income-hero"><div><span className="eyebrow">INCOME THIS MONTH</span><strong>{formatCurrency(total)}</strong><p>Coming in, and going somewhere good.</p></div><div className="income-hero-art"><span>↗</span><i /><i /><i /><i /><i /><i /></div></section>
    {showForm && <form className="inline-income-form" onSubmit={addSource}><label className="field"><span>Source</span><input name="source" required placeholder="e.g. Salary, freelance" /></label><label className="field"><span>Amount</span><input name="amount" type="number" min="1" required placeholder="₹ Amount" /></label><label className="field"><span>Frequency</span><select name="frequency"><option>Monthly</option><option>Weekly</option><option>One-time</option></select></label><label className="field"><span>Date received</span><input name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required /></label><button className="button button-primary">Save income</button></form>}
    <div className="income-source-grid">{data.incomes.slice(0, 4).map((income, index) => <article className="income-source-card" key={income.id}><div className={`source-icon source-${index % 4}`}>{["↗", "✳", "◇", "＋"][index % 4]}</div><span className="frequency-tag">{income.frequency}</span><h3>{income.source}</h3><strong>{formatCurrency(income.amount)}</strong><span className="source-date">Last received {formatDate(income.date)}</span></article>)}{!data.incomes.length && <div className="empty-state"><span>↗</span><h3>Add your first income source</h3><p>Salary, freelance, a side project—it all belongs here.</p></div>}</div>
    <section className="panel income-history"><div className="panel-heading"><div><span className="eyebrow">EVERY GOOD THING</span><h3>Income history</h3></div><span className="period-chip">All time</span></div><TransactionList transactions={incomeItems} /></section>
  </div>;
}
