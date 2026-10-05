const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export const formatCurrency = (amount) => inr.format(amount || 0);

export function formatDate(date) {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${date}T00:00:00`));
}

export function monthLabel(date = new Date()) {
  return new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(date);
}

export function getMonthKey(date) {
  return new Date(date).toISOString().slice(0, 7);
}

export const getMonthName = (date) =>
  new Intl.DateTimeFormat("en-IN", { month: "short" }).format(new Date(`${date}-01T00:00:00`));
