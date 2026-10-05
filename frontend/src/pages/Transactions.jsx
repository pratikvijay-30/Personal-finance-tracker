import { useEffect, useMemo, useState } from "react";
import { useFinance } from "../context/hooks";
import { categories } from "../data/finance";
import { formatCurrency, formatDate } from "../utils/format";
import TransactionForm from "../components/transactions/TransactionForm";

const PAGE_SIZE = 8;

export default function Transactions() {
  const { data, deleteTransaction } = useFinance();
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    const onSearch = (event) => { setQuery(event.detail); setPage(1); };
    window.addEventListener("finance-search", onSearch);
    return () => window.removeEventListener("finance-search", onSearch);
  }, []);

  const filtered = useMemo(() => data.transactions.filter((item) => {
    const searchTarget = `${item.note} ${item.source} ${categories.find((entry) => entry.id === item.category)?.name || ""}`.toLowerCase();
    return (!query || searchTarget.includes(query.toLowerCase())) && (type === "all" || item.type === type) && (category === "all" || item.category === category) && (!startDate || item.date >= startDate) && (!endDate || item.date <= endDate);
  }).sort((a, b) => b.date.localeCompare(a.date)), [data.transactions, query, type, category, startDate, endDate]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const shown = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return <div className="transactions-page"><div className="page-intro-row"><div><span className="eyebrow">THE FULL PICTURE</span><h2>Transactions</h2><p>A home for every little money moment.</p></div><button className="button button-primary" onClick={() => setEditing({ new: true })}>＋ Add transaction</button></div>
    <div className="transaction-summary"><div><span>Showing</span><strong>{filtered.length} transactions</strong></div><span>Every entry tells a story.</span></div>
    <section className="panel transactions-panel"><div className="filter-bar"><label className="table-search"><span>⌕</span><input aria-label="Search transactions" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search transactions..." /></label><select aria-label="Filter by type" value={type} onChange={(event) => { setType(event.target.value); setPage(1); }}><option value="all">All types</option><option value="income">Income</option><option value="expense">Expenses</option></select><select aria-label="Filter by category" value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }}><option value="all">All categories</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><label className="date-filter"><span>From</span><input aria-label="Start date" type="date" value={startDate} onChange={(event) => { setStartDate(event.target.value); setPage(1); }} /></label><label className="date-filter"><span>To</span><input aria-label="End date" type="date" value={endDate} onChange={(event) => { setEndDate(event.target.value); setPage(1); }} /></label></div>
      <div className="table-scroll"><table className="transactions-table"><thead><tr><th>Date</th><th>Description</th><th>Category</th><th>Amount</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{shown.map((transaction) => { const categoryData = categories.find((item) => item.id === transaction.category); return <tr key={transaction.id}><td>{formatDate(transaction.date)}</td><td><div className="table-description"><span className={`transaction-icon ${transaction.type}`}>{transaction.type === "income" ? "↗" : categoryData?.icon || "•"}</span><div><strong>{transaction.source || categoryData?.name || transaction.category}</strong><small>{transaction.note || (transaction.type === "income" ? "Income" : categoryData?.name)}</small></div></div></td><td><span className={`category-chip ${transaction.type === "income" ? "income-chip" : ""}`}><i style={{ background: categoryData?.color || "var(--income)" }} />{transaction.type === "income" ? "Income" : categoryData?.name || transaction.category}</span></td><td className={`table-amount ${transaction.type}`}>{transaction.type === "income" ? "+" : "−"}{formatCurrency(transaction.amount)}</td><td className="table-actions"><button aria-label="Edit transaction" onClick={() => setEditing(transaction)}>✎</button><button aria-label="Delete transaction" onClick={() => { if (window.confirm("Delete this transaction?")) deleteTransaction(transaction.id); }}>×</button></td></tr>; })}</tbody></table></div>
      {!shown.length && <div className="empty-state"><span>⌕</span><h3>No transactions found</h3><p>Try changing your filters or add a transaction to get started.</p></div>}
      <div className="pagination"><span>Showing {filtered.length ? (page - 1) * PAGE_SIZE + 1 : 0}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</span><div><button disabled={page <= 1} onClick={() => setPage(page - 1)}>← Previous</button><span>{page} / {pages}</span><button disabled={page >= pages} onClick={() => setPage(page + 1)}>Next →</button></div></div>
    </section>{editing && <TransactionForm transaction={editing.new ? null : editing} onClose={() => setEditing(null)} />}
  </div>;
}
