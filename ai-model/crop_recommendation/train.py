import os
import json
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib

def train_model():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_path = os.path.join(current_dir, "dataset.csv")
    model_path = os.path.join(current_dir, "model.pkl")
    labels_path = os.path.join(current_dir, "labels.json")

    if not os.path.exists(dataset_path):
        print(f"Dataset not found at {dataset_path}")
        return

    df = pd.read_csv(dataset_path)

    X = df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
    y = df['label']

    labels = sorted(list(y.unique()))
    with open(labels_path, "w") as f:
        json.dump(labels, f, indent=2)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train, y_train)

    y_pred = clf.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"Model trained successfully. Test Accuracy: {acc * 100:.2f}%")

    joblib.dump(clf, model_path)
    print(f"Saved model to {model_path}")

if __name__ == "__main__":
    train_model()
