class User:
    id: int
    name: str
    email: str
    password: str

class Expense:
    id: int
    user_id: int
    amount: float
    category: str
    payment_mode: str
    description: str
    date: str
