import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import pickle

# Load data
data = pd.read_csv("sample_data.csv")

X = data["description"]
y = data["category"]

# Convert text to numerical features
vectorizer = TfidfVectorizer()
X_tfidf = vectorizer.fit_transform(X)

# Train model
model = LogisticRegression()
model.fit(X_tfidf, y)

# Save model and vectorizer
with open("expense_classifier.pkl", "wb") as f:
    pickle.dump((vectorizer, model), f)

print("Expense category model trained and saved!")
