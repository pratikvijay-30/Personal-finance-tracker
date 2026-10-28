from fastapi import FastAPI
import sqlite3
from passlib.context import CryptContext
from pydantic import BaseModel
from jose import jwt
from datetime import datetime, timedelta, timezone

app = FastAPI()

# JWT Configuration
SECRET_KEY = "1234567890abcdefghijklmnopqrstuvwxyz"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)
class SignupRequest(BaseModel):
    name: str
    email: str
    password: str
class LoginRequest(BaseModel):
    email: str
    password: str

@app.get("/")
def home():
    return {"message": "Personal Finance Tracker Backend is running!"}


@app.post("/income")
def add_income(date: str, category: str, amount: float):

    connection = sqlite3.connect("finance.db")
    cursor = connection.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO incomes (date, category, amount)
            VALUES (?, ?, ?)
            """,
            (date, category, amount)
        )

        connection.commit()

        return {
            "message": "Income added successfully!",
            "date": date,
            "category": category,
            "amount": amount
        }

    except sqlite3.Error as error:

        return {
            "message": "Income could not be added!",
            "error": str(error)
        }

    finally:
        connection.close()
@app.post("/expense")
def add_expense(
    date: str,
    category: str,
    amount: float,
    payment_mode: str
):

    connection = sqlite3.connect("finance.db")
    cursor = connection.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO expenses (date, category, amount, payment_mode)
            VALUES (?, ?, ?, ?)
            """,
            (date, category, amount, payment_mode)
        )

        connection.commit()

        return {
            "message": "Expense added successfully!",
            "date": date,
            "category": category,
            "amount": amount,
            "payment_mode": payment_mode
        }

    except sqlite3.Error as error:

        return {
            "message": "Expense could not be added!",
            "error": str(error)
        }

    finally:
        connection.close()
@app.post("/budget")
def set_budget(month: str, limit: float):

    connection = sqlite3.connect("finance.db")
    cursor = connection.cursor()

    try:
        cursor.execute(
            """
            SELECT * FROM budgets
            WHERE month = ?
            """,
            (month,)
        )

        existing_budget = cursor.fetchone()

        if existing_budget:
            return {
                "message": "Budget already exists for this month!"
            }

        cursor.execute(
            """
            INSERT INTO budgets (month, limit_amount)
            VALUES (?, ?)
            """,
            (month, limit)
        )

        connection.commit()

        return {
            "message": "Budget added successfully!",
            "month": month,
            "limit": limit
        }

    except sqlite3.Error as error:

        return {
            "message": "Budget could not be added!",
            "error": str(error)
        }

    finally:
        connection.close()
@app.get("/summary/monthly")
def monthly_summary(month: str):

    connection = sqlite3.connect("finance.db")
    cursor = connection.cursor()

    try:
        # Get total income for the month
        cursor.execute(
            """
            SELECT SUM(amount)
            FROM incomes
            WHERE date LIKE ?
            """,
            (month + "%",)
        )

        total_income = cursor.fetchone()[0] or 0

        # Get total expense for the month
        cursor.execute(
            """
            SELECT SUM(amount)
            FROM expenses
            WHERE date LIKE ?
            """,
            (month + "%",)
        )

        total_expense = cursor.fetchone()[0] or 0

        # Calculate savings
        savings = total_income - total_expense

        # Get budget
        cursor.execute(
            """
            SELECT limit_amount
            FROM budgets
            WHERE month = ?
            """,
            (month,)
        )

        budget = cursor.fetchone()

        if budget:
            budget_limit = budget[0]

            if total_expense > budget_limit:
                budget_status = "You have exceeded your budget"
            else:
                budget_status = "You are within your budget"
        else:
            budget_limit = None
            budget_status = "No budget set"

        return {
            "month": month,
            "total_income": total_income,
            "total_expense": total_expense,
            "savings": savings,
            "budget": budget_limit,
            "budget_status": budget_status
        }

    except sqlite3.Error as error:

        return {
            "message": "Could not generate monthly summary!",
            "error": str(error)
        }

    finally:
        connection.close()
@app.get("/summary/yearly")
def yearly_summary(year: str):

    connection = sqlite3.connect("finance.db")
    cursor = connection.cursor()

    try:
        # Get total income for the year
        cursor.execute(
            """
            SELECT SUM(amount)
            FROM incomes
            WHERE date LIKE ?
            """,
            (year + "%",)
        )

        total_income = cursor.fetchone()[0] or 0

        # Get total expense for the year
        cursor.execute(
            """
            SELECT SUM(amount)
            FROM expenses
            WHERE date LIKE ?
            """,
            (year + "%",)
        )

        total_expense = cursor.fetchone()[0] or 0

        # Calculate savings
        savings = total_income - total_expense

        return {
            "year": year,
            "total_income": total_income,
            "total_expense": total_expense,
            "savings": savings
        }

    except sqlite3.Error as error:

        return {
            "message": "Could not generate yearly summary!",
            "error": str(error)
        }

    finally:
        connection.close()
@app.post("/signup")
def signup(user: SignupRequest):

    connection = sqlite3.connect("finance.db")
    cursor = connection.cursor()

    try:
        # Check if email already exists
        cursor.execute(
            "SELECT id FROM users WHERE email = ?",
            (user.email,)
        )

        existing_user = cursor.fetchone()
        print(existing_user)

        if existing_user:
            return {
                "message": "Email already registered!"
            }

        # Hash the password
        hashed_password = pwd_context.hash(user.password)

        # Insert new user
        cursor.execute(
            """
            INSERT INTO users (name, email, password_hash)
            VALUES (?, ?, ?)
            """,
            (user.name, user.email, hashed_password)
        )

        connection.commit()

        return {
            "message": "User registered successfully!"
        }

    except sqlite3.Error as error:
        return {
            "message": "Signup failed!",
            "error": str(error)
        }

    finally:
        connection.close()
def create_access_token(data: dict):

    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt
@app.post("/login")
def login(user: LoginRequest):

    connection = sqlite3.connect("finance.db")
    cursor = connection.cursor()

    try:
        # Find user by email
        cursor.execute(
            """
            SELECT id, name, email, password_hash
            FROM users
            WHERE email = ?
            """,
            (user.email,)
        )

        existing_user = cursor.fetchone()
        print(existing_user)

        # Check if user exists
        if not existing_user:
            return {
                "message": "Invalid email or password!"
            
            }

        user_id, name, email, password_hash = existing_user

        # Verify password
        if not pwd_context.verify(user.password, password_hash):
            return {
                "message": "Invalid email or password!"
            }

        # Create JWT token
        access_token = create_access_token(
            data={"sub": str(user_id)}
        )

        return {
            "message": "Login successful!",
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user_id,
                "name": name,
                "email": email
            }
        }

    finally:
        connection.close()