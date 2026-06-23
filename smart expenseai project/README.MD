# 💰 SmartExpense – AI Powered Expense & Lending Management System

An AI-powered personal finance management web application that helps users track expenses, manage lending records, maintain a digital Khata, receive reminders, analyze spending habits, and import expenses automatically using AI-assisted parsing.

---

## 🚀 Features

### 🔐 Authentication
- User Registration
- Secure Login
- Logout
- Session Management

### 💳 Expense Management
- Add Daily Expenses
- Expense Categories
- Payment Modes
- Expense History
- Monthly Expense Tracking

### 🤖 AI Auto Import
- Import Expenses from SMS
- OCR Screenshot Import (Demo)
- AI-based Expense Categorization

### 📊 Analytics Dashboard
- Monthly Spending
- Category Breakdown
- Interactive Charts
- Highest Spending Category
- Spending Prediction
- Spending Risk Analysis

### 📖 Khata Ledger
- Money Given
- Money Received
- Balance Calculation
- Transaction History

### 🤝 Lending Management
- Track Borrowed Money
- Track Lent Money
- Outstanding Balance

### 🔔 Smart Reminders
- Payment Reminders
- Due Date Tracking
- Reminder History

### ⚙️ Settings
- Profile Settings
- Notification Settings
- Theme Preference

---

# 🧠 AI Features

- Automatic SMS Expense Categorization
- Expense Prediction
- Spending Risk Analysis
- Smart Financial Insights

---

# 🛠️ Tech Stack

## Frontend
- HTML5
- CSS3
- JavaScript (ES6)
- Bootstrap 5
- Chart.js
- Font Awesome

## Backend
- Python
- Flask
- Flask Blueprints
- Flask-CORS

## Database
- SQLite

## Machine Learning
- Scikit-learn
- Pandas
- NumPy
- Joblib

---

# 📂 Project Structure

```
SmartExpense/
│
├── backend/
│   ├── app.py
│   ├── auth.py
│   ├── expenses.py
│   ├── analytics.py
│   ├── lending.py
│   ├── reminders.py
│   ├── khata.py
│   ├── database.py
│   ├── config.py
│   ├── database.db
│   └── requirements.txt
│
├── frontend/
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── add_expense.html
│   ├── analytics.html
│   ├── lending.html
│   ├── reminders.html
│   ├── khata.html
│   ├── auto_import.html
│   ├── settings.html
│   │
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   ├── analytics.js
│   │   ├── lending.js
│   │   ├── reminders.js
│   │   ├── khata.js
│   │   ├── import.js
│   │   └── settings.js
│   │
│   └── images/
│
└── README.md
```

---

# 🌐 REST APIs

## Authentication

```
POST /register
POST /login
```

## Expenses

```
POST /add-expense
GET /expenses/<user_id>
```

## Analytics

```
GET /risk/<amount>
GET /predict-expense
```

## Lending

```
POST /lending
GET /lending/<user_id>
GET /lending/summary/<user_id>
```

## Khata

```
POST /khata
GET /khata/<user_id>
PUT /khata/<transaction_id>
DELETE /khata/<transaction_id>
```

## Reminders

```
POST /reminders
GET /reminders/<user_id>
DELETE /reminders/<id>
```

---

# 💻 Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/SmartExpense.git
```

## Backend Setup

```bash
cd backend

python -m venv .venv

# Windows
.venv\Scripts\activate

pip install -r requirements.txt

python app.py
```

Backend runs at:

```
http://127.0.0.1:5000
```

---

## Frontend Setup

```bash
cd frontend

python -m http.server 5500
```

Open:

```
http://127.0.0.1:5500/login.html
```

---

# ☁️ Deployment

## Backend
Deploy on:
- Render
- Railway
- PythonAnywhere

## Frontend
Deploy on:
- Vercel
- Netlify

Replace every occurrence of:

```
http://127.0.0.1:5000
```

with your deployed backend URL before deploying.

---

# 📌 Future Enhancements

- OCR using Tesseract
- Real SMS Integration
- Bank Statement Import
- UPI Integration
- Budget Planner
- AI Chat Assistant
- Voice Expense Entry
- Cloud Database (PostgreSQL)
- Mobile App
- Dark Mode
- PWA Support

---

# 🎯 Learning Outcomes

- Full Stack Web Development
- REST API Development
- Authentication
- SQLite Database Design
- Flask Blueprints
- Machine Learning Integration
- Data Visualization
- Responsive UI Design
- CRUD Operations
- Deployment

---

# 📜 License

This project is developed for educational purposes, academic submission, and portfolio showcasing.

---

# 👨‍💻 Author

**Mohd Fasi**

B.Tech Computer Science (AI & ML)

Backend Developer | Python | Flask | AI Enthusiast

GitHub: https://github.com/fasi8125
####
####
####
#.\.venv\Scripts\Activate.ps1

'''
cd "C:\Users\DELL\minor project"

.\.venv\Scripts\Activate.ps1

cd backend

python app.py

## new terinal for frontend 


###cd "C:\Users\DELL\minor project\frontend"

python -m http.server 5500
'''

cd backend

python app.py