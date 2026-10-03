import sqlite3

connection = sqlite3.connect("finance.db")

cursor = connection.cursor()

# Income table
cursor.execute("""
CREATE TABLE IF NOT EXISTS incomes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    category TEXT NOT NULL,
    amount REAL NOT NULL
)
""")

# Expense table
cursor.execute("""
CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    category TEXT NOT NULL,
    amount REAL NOT NULL,
    payment_mode TEXT NOT NULL
)
""")

# Budget table
cursor.execute("""
CREATE TABLE IF NOT EXISTS budgets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    month TEXT NOT NULL,
    limit_amount REAL NOT NULL
)
""")

connection.commit()

print("Database and tables created successfully!")