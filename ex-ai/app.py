"""
app.py - EX-AI
Flask backend serving the dark cybersecurity dashboard, live prediction API,
and analytics pages for the Explainable AI User Behavior Threat Detection project.
"""
import json
import pickle

import numpy as np
import pandas as pd
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

with open("model/model.pkl", "rb") as f:
    model = pickle.load(f)
with open("model/scaler.pkl", "rb") as f:
    scaler = pickle.load(f)
with open("model/metrics.json") as f:
    METRICS = json.load(f)
with open("model/top_suspicious.json") as f:
    TOP_SUSPICIOUS = json.load(f)

SCORED_DF = pd.read_csv("model/scored_dataset.csv")
FEATURES = METRICS["features"]

# normal-user baseline used for live deviation scoring (same logic as training)
_normals = SCORED_DF[SCORED_DF["label"] == 0][FEATURES]
BASELINE = _normals.mean()
SPREAD = _normals.std().replace(0, 1)
MAX_DEV = SCORED_DF["deviation_score"].max() / 100 * (
    ((_normals - BASELINE).abs() / SPREAD).mean(axis=1).max()
) if len(_normals) else 1
# simpler: recompute max deviation directly from training set for consistent scaling
_all = SCORED_DF[FEATURES]
_dev_raw_all = ((_all - BASELINE).abs() / SPREAD).mean(axis=1)
DEV_MAX_RAW = _dev_raw_all.max()


def risk_level(score):
    if score < 33:
        return "Low Risk"
    elif score < 66:
        return "Medium Risk"
    return "High Risk"


def score_input(values: dict):
    row = pd.DataFrame([values])[FEATURES]
    scaled = scaler.transform(row)
    pred = int(model.predict(scaled)[0])
    proba = model.predict_proba(scaled)[0]
    confidence = round(float(max(proba)) * 100, 1)

    dev_raw = ((row.iloc[0] - BASELINE).abs() / SPREAD).mean()
    dev_pct = float(np.clip(dev_raw / DEV_MAX_RAW * 100, 0, 100))
    risk = risk_level(dev_pct)

    return {
        "prediction": "Suspicious" if pred == 1 else "Normal",
        "prediction_code": pred,
        "confidence": confidence,
        "deviation_score": round(dev_pct, 1),
        "risk_level": risk,
    }


@app.route("/")
def dashboard():
    risk_counts = SCORED_DF["risk_level"].value_counts()
    total = len(SCORED_DF)
    risk_dist = {
        "Low Risk": round(int(risk_counts.get("Low Risk", 0)) / total * 100, 1),
        "Medium Risk": round(int(risk_counts.get("Medium Risk", 0)) / total * 100, 1),
        "High Risk": round(int(risk_counts.get("High Risk", 0)) / total * 100, 1),
    }
    return render_template(
        "dashboard.html",
        metrics=METRICS,
        top_suspicious=TOP_SUSPICIOUS,
        risk_dist=risk_dist,
    )


@app.route("/analyzer")
def analyzer():
    return render_template("analyzer.html", features=FEATURES)


@app.route("/analytics")
def analytics():
    return render_template("analytics.html", metrics=METRICS)


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/api/predict", methods=["POST"])
def api_predict():
    data = request.get_json(force=True)
    try:
        values = {f: float(data[f]) for f in FEATURES}
    except (KeyError, ValueError, TypeError):
        return jsonify({"error": "Invalid or missing input values."}), 400
    result = score_input(values)
    return jsonify(result)


@app.route("/api/live-feed")
def api_live_feed():
    """Returns a small random sample of scored users to animate a 'live' feed."""
    sample = SCORED_DF.sample(n=6).to_dict(orient="records")
    return jsonify(sample)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
