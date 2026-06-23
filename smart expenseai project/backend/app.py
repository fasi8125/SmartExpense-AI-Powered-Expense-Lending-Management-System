from flask import Flask
from flask_cors import CORS
from database import init_db

from auth import auth_bp
from expenses import expenses_bp
from analytics import analytics_bp
from lending import lending_bp
from reminders import reminders_bp
from khata import khata_bp

app = Flask(__name__)
app.config.from_object("config")

CORS(app)  # ✅ ADD THIS LINE

init_db()
app.register_blueprint(auth_bp)
app.register_blueprint(expenses_bp)
app.register_blueprint(analytics_bp)
app.register_blueprint(lending_bp)
app.register_blueprint(reminders_bp)
app.register_blueprint(khata_bp)

@app.route("/")
def home():
    return {"message": "Welcome to the Expense Tracker API"}


if __name__ == "__main__":
    app.run(debug=app.config["DEBUG"])


