import os
import json
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import joblib

def train_model():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_path = os.path.join(current_dir, "dataset.csv")
    model_path = os.path.join(current_dir, "yield_model.pkl")
    labels_path = os.path.join(current_dir, "labels.json")

    if not os.path.exists(dataset_path):
        print(f"Dataset not found at {dataset_path}")
        return

    df = pd.read_csv(dataset_path)

    X = df[['crop', 'area', 'soil_type', 'ph', 'N', 'P', 'K', 'rainfall', 'temperature', 'humidity', 'season']]
    y = df['yield_per_acre']

    categorical_features = ['crop', 'soil_type', 'season']
    numerical_features = ['area', 'ph', 'N', 'P', 'K', 'rainfall', 'temperature', 'humidity']

    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features),
            ('num', 'passthrough', numerical_features)
        ]
    )

    model = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', RandomForestRegressor(n_estimators=100, random_state=42))
    ])

    model.fit(X, y)

    joblib.dump(model, model_path)

    unique_crops = sorted(list(df['crop'].unique()))
    with open(labels_path, "w") as f:
        json.dump({"crops": unique_crops}, f, indent=2)

    print(f"Yield prediction model trained & saved to {model_path}")

if __name__ == "__main__":
    train_model()
