import pickle
from sklearn.linear_model import LogisticRegression
import numpy as np
import os

# dummy training data
X = np.array([
    [1000, 5],
    [2000, 10],
    [300, 1],
    [5000, 20]
])
y = [0, 1, 0, 1]  # 0 = low risk, 1 = high risk

model = LogisticRegression()
model.fit(X, y)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, "risk_model.pkl")

with open(model_path, "wb") as f:
    pickle.dump(model, f)

print("✅ risk_model.pkl created successfully")
print(f"Model saved at: {model_path}")