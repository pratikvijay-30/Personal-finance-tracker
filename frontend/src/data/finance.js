export const categories = [
  { id: "food", name: "Food & dining", icon: "◉", color: "#ed9f52", budgetLimit: 12000 },
  { id: "housing", name: "Home & bills", icon: "⌂", color: "#6486e8", budgetLimit: 22000 },
  { id: "transport", name: "Transport", icon: "↗", color: "#9b83d6", budgetLimit: 7000 },
  { id: "shopping", name: "Shopping", icon: "◇", color: "#e47f91", budgetLimit: 9000 },
  { id: "health", name: "Health", icon: "＋", color: "#45a988", budgetLimit: 5000 },
  { id: "other", name: "Other", icon: "•••", color: "#7f8d9e", budgetLimit: 6000 },
];

const day = (offset) => {
  const date = new Date();
  date.setDate(date.getDate() - offset);
  return date.toISOString().slice(0, 10);
};

export function createSeedData(userId) {
  const transactions = [
    ["income", 85000, "Salary", "Northstar Studio", 1, "Monthly salary"],
    ["expense", 920, "food", "Blue Tokai", 1, "Coffee with a friend"],
    ["expense", 2450, "food", "Nature's Basket", 2, "Weekly groceries"],
    ["expense", 1800, "transport", "Uber", 3, "Airport ride"],
    ["expense", 12000, "housing", "House rent", 5, "Monthly rent"],
    ["income", 12500, "Freelance", "Design project", 6, "Website design"],
    ["expense", 3400, "shopping", "Myntra", 8, "New running shoes"],
    ["expense", 1450, "health", "Apollo Pharmacy", 10, "Prescription"],
    ["expense", 760, "food", "Third Wave Coffee", 12, "Lunch"],
    ["expense", 2100, "other", "Bookshop", 16, "Books and stationery"],
    ["income", 85000, "Salary", "Northstar Studio", 31, "Monthly salary"],
    ["expense", 2500, "transport", "Metro card", 33, "Travel pass"],
    ["expense", 2800, "food", "Dinner at O Pedro", 35, "Dinner"],
    ["income", 10000, "Freelance", "Brand identity", 38, "Design project"],
  ].map(([type, amount, category, source, offset, note], index) => ({
    id: `${userId}-tx-${index + 1}`,
    userId,
    type,
    amount,
    category,
    source,
    date: day(offset),
    note,
  }));

  return {
    transactions,
    incomes: [
      { id: `${userId}-inc-1`, userId, source: "Salary", amount: 85000, frequency: "Monthly", date: day(1) },
      { id: `${userId}-inc-2`, userId, source: "Freelance", amount: 12500, frequency: "One-time", date: day(6) },
    ],
    budgets: categories.map((category) => ({
      id: `${userId}-budget-${category.id}`,
      userId,
      categoryId: category.id,
      month: new Date().toISOString().slice(0, 7),
      limit: category.budgetLimit,
    })),
  };
}

export function readFinanceData(userId) {
  const key = `pocketwise:finance:${userId}`;
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return { ...createSeedData(userId), ...JSON.parse(stored) };
    } catch (error) {
      console.error("Could not read saved finance data.", error);
    }
  }
  const seeded = createSeedData(userId);
  localStorage.setItem(key, JSON.stringify(seeded));
  return seeded;
}
