import { useState } from "react";
import { categories } from "../../data/finance";
import { useFinance } from "../../context/hooks";

export default function TransactionForm({ onClose, transaction }) {
  const { addTransaction, updateTransaction } = useFinance();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    type: transaction?.type || "expense",
    amount: transaction?.amount || "",
    category: transaction?.category || categories[0].id,
    source: transaction?.source || "",
    date: transaction?.date || new Date().toISOString().slice(0, 10),
    note: transaction?.note || "",
  });

  function submit(event) {
    event.preventDefault();
    if (!Number(form.amount) || Number(form.amount) <= 0) return setError("Enter an amount greater than zero.");
    if (!form.date) return setError("Choose a date for this transaction.");
    const record = { ...form, amount: Number(form.amount), source: form.source || (form.type === "income" ? form.category : "") };
    if (transaction) updateTransaction(transaction.id, record);
    else addTransaction(record);
    onClose();
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="transaction-title">
        <button className="modal-close" onClick={onClose} aria-label="Close dialog">×</button>
        <span className="eyebrow">KEEP IT UP TO DATE</span><h2 id="transaction-title">{transaction ? "Edit transaction" : "Add a transaction"}</h2>
        <p className="modal-intro">Every little detail adds up to a clearer picture.</p>
        <form onSubmit={submit} className="form-stack">
          <div className="segmented-control"><button type="button" className={form.type === "expense" ? "selected expense-selected" : ""} onClick={() => setForm({ ...form, type: "expense" })}>Expense</button><button type="button" className={form.type === "income" ? "selected income-selected" : ""} onClick={() => setForm({ ...form, type: "income" })}>Income</button></div>
          <label className="field"><span>Amount</span><div className="amount-input"><b>₹</b><input autoFocus type="number" min="1" step="1" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} placeholder="0" /></div></label>
          {form.type === "expense" ? <label className="field"><span>Category</span><select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>{categories.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}</select></label> : <label className="field"><span>Income source</span><input value={form.source} onChange={(event) => setForm({ ...form, source: event.target.value })} placeholder="e.g. Salary, freelance" required /></label>}
          <label className="field"><span>Description</span><input value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} placeholder="What was it for?" /></label>
          <label className="field"><span>Date</span><input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} /></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="modal-actions"><button type="button" className="button button-quiet" onClick={onClose}>Cancel</button><button className="button button-primary" type="submit">{transaction ? "Save changes" : "Add transaction"}</button></div>
        </form>
      </section>
    </div>
  );
}
