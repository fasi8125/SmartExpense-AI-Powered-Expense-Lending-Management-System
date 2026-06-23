import sqlite3
import numpy as np
from sklearn.linear_model import LinearRegression
import pickle
import os

DB_PATH = os.path.join("backend", "database.db")
MODEL_PATH = os.path.join("backend", "ml", "expense_predictor.pkl")

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Fetch monthly totals
cursor.execute("""
    SELECT substr(date, 1, 7) AS month, SUM(amount)
    FROM expenses
    GROUP BY month
    ORDER BY month
""")

rows = cursor.fetchall()
conn.close()

if len(rows) < 2:
    print("Not enough data to train prediction model.")
    exit()

# Prepare data
X = np.array(range(len(rows))).reshape(-1, 1)
y = np.array([row[1] for row in rows])

# Train Linear Regression
model = LinearRegression()
model.fit(X, y)

# Save model
with open(MODEL_PATH, "wb") as f:
    pickle.dump(model, f)

print("Monthly expense prediction model trained!")
