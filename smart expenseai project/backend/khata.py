from flask import Blueprint, request, jsonify
from database import get_db_connection

khata_bp = Blueprint("khata", __name__)

# ==========================================
# GET ALL KHATA TRANSACTIONS
# ==========================================
@khata_bp.route("/khata/<int:user_id>", methods=["GET"])
def get_khata(user_id):

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, person, description, amount, type, date
        FROM khata
        WHERE user_id=?
        ORDER BY id DESC
    """, (user_id,))

    rows = cursor.fetchall()

    transactions = []

    total_given = 0
    total_received = 0

    for row in rows:

        transaction = {
            "id": row["id"],
            "person": row["person"],
            "description": row["description"],
            "amount": row["amount"],
            "type": row["type"],
            "date": row["date"]
        }

        transactions.append(transaction)

        if row["type"].lower() == "gave":
            total_given += float(row["amount"])
        else:
            total_received += float(row["amount"])

    conn.close()

    balance = total_received - total_given

    return jsonify({
        "transactions": transactions,
        "summary": {
            "given": total_given,
            "received": total_received,
            "balance": balance
        }
    })


# ==========================================
# ADD TRANSACTION
# ==========================================
@khata_bp.route("/khata", methods=["POST"])
def add_khata():

    data = request.get_json()

    if not data:
        return jsonify({"error": "No data received"}), 400

    user_id = data.get("user_id")
    person = data.get("person")
    description = data.get("description", "")
    amount = data.get("amount")
    transaction_type = data.get("type")

    if not user_id:
        return jsonify({"error": "User ID required"}), 400

    if not person:
        return jsonify({"error": "Person name required"}), 400

    if amount is None:
        return jsonify({"error": "Amount required"}), 400

    if not transaction_type:
        return jsonify({"error": "Transaction type required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO khata
        (user_id, person, description, amount, type, date)
        VALUES (?, ?, ?, ?, ?, DATE('now'))
    """, (
        user_id,
        person,
        description,
        amount,
        transaction_type
    ))

    conn.commit()

    transaction_id = cursor.lastrowid

    conn.close()

    return jsonify({
        "message": "Transaction added successfully",
        "id": transaction_id
    }), 201


# ==========================================
# UPDATE TRANSACTION
# ==========================================
@khata_bp.route("/khata/<int:transaction_id>", methods=["PUT"])
def update_khata(transaction_id):

    data = request.get_json()

    person = data.get("person")
    description = data.get("description")
    amount = data.get("amount")
    transaction_type = data.get("type")

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE khata
        SET person=?,
            description=?,
            amount=?,
            type=?
        WHERE id=?
    """, (
        person,
        description,
        amount,
        transaction_type,
        transaction_id
    ))

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Transaction updated successfully"
    })


# ==========================================
# DELETE TRANSACTION
# ==========================================
@khata_bp.route("/khata/<int:transaction_id>", methods=["DELETE"])
def delete_khata(transaction_id):

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM khata WHERE id=?",
        (transaction_id,)
    )

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Transaction deleted successfully"
    })