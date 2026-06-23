from flask import Blueprint, jsonify
import pickle
import numpy as np
import os

analytics_bp = Blueprint("analytics", __name__)

# ===========================
# Load Risk Model
# ===========================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RISK_MODEL_PATH = os.path.join(BASE_DIR, "ml", "risk_model.pkl")

risk_model = None

try:
    with open(RISK_MODEL_PATH, "rb") as f:
        risk_model = pickle.load(f)
    print("✅ Risk model loaded successfully.")
except Exception as e:
    print(f"⚠ Could not load risk model: {e}")


# ===========================
# Financial Risk Prediction
# ===========================
@analytics_bp.route("/risk/<float:total>", methods=["GET"])
@analytics_bp.route("/risk/<int:total>", methods=["GET"])
def get_risk(total):

    # Fallback if model is unavailable
    if risk_model is None:

        if total < 3000:
            risk = "Low"
        elif total < 10000:
            risk = "Medium"
        else:
            risk = "High"

        return jsonify({
            "risk": risk,
            "message": "Fallback prediction used"
        }), 200

    try:

        prediction = risk_model.predict(np.array([[total, 0]]))[0]

        risk_map = {
            0: "Low",
            1: "Medium",
            2: "High"
        }

        return jsonify({
            "risk": risk_map.get(prediction, "Low"),
            "message": "Prediction successful"
        }), 200

    except Exception as e:

        return jsonify({
            "risk": "Unknown",
            "error": str(e)
        }), 500