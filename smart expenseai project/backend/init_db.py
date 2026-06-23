import sqlite3
from config import DATABASE_PATH

conn = sqlite3.connect(DATABASE_PATH)
cursor = conn.cursor()

# USERS
cursor.execute("""
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
)
""")

# EXPENSES (FIXED)
cursor.execute("""
CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    amount REAL,
    category TEXT,
    payment_mode TEXT,
    description TEXT,
    date TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
)
""")

# LENDING (FIXED)
cursor.execute("""
CREATE TABLE IF NOT EXISTS lending (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT,
    amount REAL,
    status TEXT DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(id)
)
""")

# REMINDERS
cursor.execute("""
CREATE TABLE IF NOT EXISTS reminders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT,
    due_date TEXT,
    status TEXT DEFAULT 'pending'
)
""")
cursor.execute("""
CREATE TABLE IF NOT EXISTS khata (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    person TEXT,
    description TEXT,
    amount REAL,
    type TEXT,
    date TEXT
)
""")

conn.commit()
conn.close()

print("✅ All tables created successfully")
