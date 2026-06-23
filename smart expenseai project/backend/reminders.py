from flask import Blueprint, request, jsonify
from database import get_db_connection

reminders_bp = Blueprint("reminders", __name__)


# ======================================
# GET ALL REMINDERS
# ======================================
@reminders_bp.route("/reminders/<int:user_id>", methods=["GET"])
def get_reminders(user_id):

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id,title,due_date,status
        FROM reminders
        WHERE user_id=?
        ORDER BY due_date ASC
    """, (user_id,))

    rows = cursor.fetchall()
    conn.close()

    reminders = []

    for row in rows:
        reminders.append({
            "id": row["id"],
            "title": row["title"],
            "due_date": row["due_date"],
            "status": row["status"]
        })

    return jsonify(reminders), 200


# ======================================
# ADD REMINDER
# ======================================
@reminders_bp.route("/reminders", methods=["POST"])
def add_reminder():

    data = request.get_json()

    if not data:
        return jsonify({"error": "No data received"}), 400

    user_id = data.get("user_id")

    # Support both frontend formats
    title = (
        data.get("title")
        or data.get("person")
        or data.get("name")
    )

    due_date = (
        data.get("due_date")
        or data.get("date")
    )

    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    if not title:
        return jsonify({"error": "Reminder title is required"}), 400

    if not due_date:
        return jsonify({"error": "Due date is required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO reminders
        (user_id,title,due_date,status)
        VALUES (?,?,?,?)
    """, (
        user_id,
        title,
        due_date,
        "Pending"
    ))

    conn.commit()

    reminder_id = cursor.lastrowid

    conn.close()

    return jsonify({
        "message": "Reminder added successfully",
        "id": reminder_id
    }), 201


# ======================================
# UPDATE REMINDER STATUS
# ======================================
@reminders_bp.route("/reminders/<int:reminder_id>", methods=["PUT"])
def update_reminder(reminder_id):

    data = request.get_json()

    status = data.get("status", "Completed")

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE reminders
        SET status=?
        WHERE id=?
    """, (status, reminder_id))

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Reminder updated successfully"
    })


# ======================================
# DELETE REMINDER
# ======================================
@reminders_bp.route("/reminders/<int:reminder_id>", methods=["DELETE"])
def delete_reminder(reminder_id):

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM reminders WHERE id=?",
        (reminder_id,)
    )

    conn.commit()
    conn.close()

    return jsonify({
        "message": "Reminder deleted successfully"
    })