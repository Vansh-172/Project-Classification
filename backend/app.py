from pathlib import Path
import pickle

import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "pred.pkl"

FEATURE_OPTIONS = {
    "cap-shape": ["Bell", "Conical", "Convex", "Flat", "Knobbed", "Sunken"],
    "cap-surface": ["Fibrous", "Grooves", "Scaly", "Smooth"],
    "cap-color": ["Brown", "Buff", "Cinnamon", "Gray", "Green", "Pink", "Purple", "Red", "White", "Yellow"],
    "bruises": ["Bruises", "No Bruises"],
    "odor": ["Almond", "Anise", "Creosote", "Fishy", "Foul", "Musty", "None", "Pungent", "Spicy"],
    "gill-attachment": ["Attached", "Descending", "Free", "Notched"],
    "gill-spacing": ["Close", "Crowded", "Distant"],
    "gill-size": ["Broad", "Narrow"],
    "gill-color": ["Black", "Brown", "Buff", "Chocolate", "Gray", "Green", "Orange", "Pink", "Purple", "Red", "White", "Yellow"],
    "stalk-shape": ["Enlarging", "Tapering"],
    "stalk-root": ["Bulbous", "Club", "Cup", "Equal", "Rhizomorphs", "Rooted"],
    "stalk-surface-above-ring": ["Fibrous", "Scaly", "Silky", "Smooth"],
    "stalk-surface-below-ring": ["Fibrous", "Scaly", "Silky", "Smooth"],
    "stalk-color-above-ring": ["Brown", "Buff", "Cinnamon", "Gray", "Orange", "Pink", "Red", "White", "Yellow"],
    "stalk-color-below-ring": ["Brown", "Buff", "Cinnamon", "Gray", "Orange", "Pink", "Red", "White", "Yellow"],
    "veil-color": ["Brown", "Orange", "White", "Yellow"],
    "ring-number": ["None", "One", "Two"],
    "ring-type": ["Cobwebby", "Evanescent", "Flaring", "Large", "None", "Pendant", "Sheathing", "Zone"],
    "spore-print-color": ["Black", "Brown", "Buff", "Chocolate", "Green", "Orange", "Purple", "White", "Yellow"],
    "population": ["Abundant", "Clustered", "Numerous", "Scattered", "Several", "Solitary"],
    "habitat": ["Grasses", "Leaves", "Meadows", "Paths", "Urban", "Waste", "Woods"],
}

FEATURE_NAMES = list(FEATURE_OPTIONS.keys())


def build_training_columns():
    columns = []
    for feature, options in FEATURE_OPTIONS.items():
        for option in sorted(options)[1:]:
            columns.append(f"{feature}_{option}")
    return columns


FALLBACK_TRAINING_COLUMNS = build_training_columns()


def load_model():
    with MODEL_PATH.open("rb") as model_file:
        return pickle.load(model_file)


model = load_model()
TRAINING_COLUMNS = list(getattr(model, "feature_names_in_", FALLBACK_TRAINING_COLUMNS))
app = Flask(__name__)
CORS(app)


def validate_payload(payload):
    if not isinstance(payload, dict):
        return "Request body must be a JSON object."

    missing = [feature for feature in FEATURE_NAMES if feature not in payload]
    if missing:
        return f"Missing required feature(s): {', '.join(missing)}."

    invalid = {
        feature: payload[feature]
        for feature, options in FEATURE_OPTIONS.items()
        if payload[feature] not in options
    }
    if invalid:
        details = ", ".join(f"{feature}={value!r}" for feature, value in invalid.items())
        return f"Invalid feature value(s): {details}."

    return None


def preprocess(payload):
    row = pd.DataFrame([{feature: payload[feature] for feature in FEATURE_NAMES}])
    encoded = pd.get_dummies(row).astype(int)
    return encoded.reindex(columns=TRAINING_COLUMNS, fill_value=0)


def prediction_confidence(input_frame):
    if hasattr(model, "predict_proba"):
        return float(model.predict_proba(input_frame)[0].max())
    return None


@app.get("/health")
def health():
    return jsonify({"status": "ok"})


@app.post("/predict")
def predict():
    payload = request.get_json(silent=True)
    error = validate_payload(payload)
    if error:
        return jsonify({"error": error}), 400

    input_frame = preprocess(payload)
    prediction = int(model.predict(input_frame)[0])
    label = "poisonous" if prediction == 1 else "edible"
    confidence = prediction_confidence(input_frame)

    response = {"prediction": label}
    if confidence is not None:
        response["confidence"] = round(confidence, 4)

    return jsonify(response)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
