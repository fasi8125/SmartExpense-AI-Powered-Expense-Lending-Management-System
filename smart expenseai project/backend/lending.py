from flask import Blueprint, request, jsonify
from database import get_db_connection
from db import DB_PATH

lending_bp = Blueprint("lending", __name__)

@lending_bp.route("/lending/<int:user_id>", methods=["GET"])
def get_lending(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT name, amount, status FROM lending WHERE user_id=?",
        (user_id,)
    )
    rows = cursor.fetchall()
    conn.close()

    data = [
        {"name": r[0], "amount": r[1], "status": r[2]}
        for r in rows
    ]

    return jsonify(data)
@lending_bp.route("/lending", methods=["POST"])
def add_lending():  
    data = request.get_json()
    user_id = data.get("user_id")
    name = data.get("name")
    amount = data.get("amount")
    status = data.get("status", "pending")

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO lending (user_id, name, amount, status) VALUES (?, ?, ?, ?)",
        (user_id, name, amount, status)
    )
    conn.commit()
    conn.close()

    return jsonify({"message": "Lending record added successfully"}), 201
@lending_bp.route("/lending/<int:lending_id>", methods=["PUT"])
def update_lending(lending_id):
    data = request.get_json()
    status = data.get("status")

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE lending SET status=? WHERE id=?",
        (status, lending_id)
    )
    conn.commit()
    conn.close()

    return jsonify({"message": "Lending record updated successfully"})
@lending_bp.route("/lending/<int:lending_id>", methods=["DELETE"])
def delete_lending(lending_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "DELETE FROM lending WHERE id=?",
        (lending_id,)
    )
    conn.commit()
    conn.close()

    return jsonify({"message": "Lending record deleted successfully"})
@lending_bp.route("/lending/summary/<int:user_id>", methods=["GET"])
def lending_summary(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT SUM(amount) FROM lending WHERE user_id=? AND status='pending'",
        (user_id,)
    )
    total_pending = cursor.fetchone()[0] or 0

    cursor.execute(
        "SELECT SUM(amount) FROM lending WHERE user_id=? AND status='repaid'",
        (user_id,)
    )
    total_repaid = cursor.fetchone()[0] or 0

    conn.close()

    return jsonify({
        "total_pending": total_pending,
        "total_repaid": total_repaid
    })
@lending_bp.route("/lending/users/<int:user_id>", methods=["GET"])
def get_users_with_lending(user_id):

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT DISTINCT u.id, u.username, u.email
        FROM users u
        JOIN lending l ON u.id = l.user_id
        WHERE l.user_id != ?
        """,
        (user_id,)
    )
    rows = cursor.fetchall()
    conn.close()

    users = [
        {"id": r[0], "username": r[1], "email": r[2]}
        for r in rows
    ]

    return jsonify(users)