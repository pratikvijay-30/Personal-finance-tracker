import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Bar, BarChart } from "recharts";
import { categories } from "../../data/finance";
import { formatCurrency, getMonthKey, getMonthName } from "../../utils/format";

export function SpendingDonut({ transactions }) {
  const data = categories.map((category) => ({
    name: category.name,
    value: transactions.filter((transaction) => transaction.type === "expense" && transaction.category === category.id).reduce((sum, transaction) => sum + transaction.amount, 0),
    color: category.color,
  })).filter((item) => item.value > 0);
  return data.length ? <ResponsiveContainer width="100%" height={230}><PieChart><Pie data={data} dataKey="value" nameKey="name" innerRadius={67} outerRadius={92} paddingAngle={4} stroke="none">{data.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 12 }} /><Legend verticalAlign="bottom" height={32} iconType="circle" /></PieChart></ResponsiveContainer> : <div className="chart-empty">Add a few expenses to see your spending breakdown.</div>;
}

export function MonthlyBars({ transactions, months = 6 }) {
  const now = new Date();
  const data = Array.from({ length: months }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - months + 1 + index, 1);
    const month = date.toISOString().slice(0, 7);
    const scoped = transactions.filter((item) => getMonthKey(item.date) === month);
    return {
      month: getMonthName(month),
      Income: scoped.filter((item) => item.type === "income").reduce((sum, item) => sum + item.amount, 0),
      Expenses: scoped.filter((item) => item.type === "expense").reduce((sum, item) => sum + item.amount, 0),
    };
  });
  return <ResponsiveContainer width="100%" height={260}><BarChart data={data} barGap={8}><CartesianGrid vertical={false} stroke="var(--line)" strokeDasharray="3 5" /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "var(--muted)", fontSize: 12 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--muted)", fontSize: 11 }} tickFormatter={(value) => value >= 1000 ? `${value / 1000}k` : value} /><Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 12 }} /><Legend iconType="circle" /><Bar dataKey="Income" fill="var(--income)" radius={[6, 6, 0, 0]} /><Bar dataKey="Expenses" fill="var(--expense)" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>;
}
