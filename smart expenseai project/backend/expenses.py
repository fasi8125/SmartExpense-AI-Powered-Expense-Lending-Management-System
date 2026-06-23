import pickle
import os
from flask import Blueprint, request, jsonify
from db import DB_PATH
from database import get_db_connection

# Create Blueprint
expenses_bp = Blueprint("expenses", __name__)

# ================================
# Load AI Model ONCE (IMPORTANT)
# ================================
MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "ml", "expense_classifier.pkl")

with open(MODEL_PATH, "rb") as f:
    vectorizer, model = pickle.load(f)

# ================================
# Add Expense API
# ================================
@expenses_bp.route("/add-expense", methods=["POST"])
def add_expense():
    data = request.get_json()

    user_id = data.get("user_id")
    amount = data.get("amount")
    category = data.get("category")
    payment_mode = data.get("payment_mode")
    description = data.get("description") or ""
    date = data.get("date")

    # Basic validation
    if not user_id or not amount:
        return jsonify({"error": "User and amount are required"}), 400

    # ================================
    # AI AUTO-CATEGORIZATION LOGIC
    # ================================
    if not category:
        if description.strip():
            X = vectorizer.transform([description])
            category = model.predict(X)[0]
        else:
            category = "Other"

    # ================================
    # Save to Database
    # ================================
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO expenses 
        (user_id, amount, category, payment_mode, description, date)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (user_id, amount, category, payment_mode, description, date)
    )

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Expense added successfully",
        "category": category  # return predicted category
    }), 201



@expenses_bp.route("/expenses/<int:user_id>", methods=["GET"])
def get_expenses(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC",
        (user_id,)
    )
    rows = cursor.fetchall()
    conn.close()

    expenses = [dict(row) for row in rows]
    total = sum(e["amount"] for e in expenses)

    return jsonify({"expenses": expenses, "total": total})
# ================================
# Predict Next Month Expense
# ================================
@expenses_bp.route("/predict-expense", methods=["GET"])
def predict_expense():

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT amount FROM expenses")
    rows = cursor.fetchall()

    conn.close()

    if not rows:
        return jsonify({
            "prediction": 0
        }), 200

    total = sum(float(row["amount"]) for row in rows)
    avg = total / len(rows)

    # Simple prediction (10% increase)
    prediction = round(avg * 1.10, 2)

    return jsonify({
        "prediction": prediction,
        "status": "success"
    }), 200
@expenses_bp.route("/clear-expenses/<int:user_id>", methods=["DELETE"])
def clear_expenses(user_id):

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM expenses WHERE user_id=?",
        (user_id,)
    )

    conn.commit()
    conn.close()

    return jsonify({"message":"All expenses deleted successfully"})