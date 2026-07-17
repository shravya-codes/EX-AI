"""
train_model.py
End-to-end pipeline: load -> preprocess -> scale -> train Random Forest ->
evaluate -> deviation/risk scoring -> explainability -> save all artifacts
used by the Flask web app.
"""
import json
import pickle
import os

import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
)
from sklearn.inspection import permutation_importance

sns.set_theme(style="whitegrid")
plt.rcParams.update({
    "figure.facecolor": "white",
    "axes.facecolor": "white",
    "axes.edgecolor": "#333333",
    "axes.labelcolor": "#000000",
    "text.color": "#000000",
    "xtick.color": "#333333",
    "ytick.color": "#333333",
    "grid.color": "#dddddd",
})

FEATURES = ["login_attempts", "session_duration", "pages_accessed", "failed_logins"]
os.makedirs("static/plots", exist_ok=True)
os.makedirs("model", exist_ok=True)

# ---------- 1. Load ----------
df = pd.read_csv("data/user_behaviour_data.csv")

# ---------- 2. Preprocess ----------
df = df.drop_duplicates()
missing = int(df.isnull().sum().sum())

X = df[FEATURES]
y = df["label"]

# ---------- 3. Scale ----------
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# ---------- 4. Train/test split ----------
X_train, X_test, y_train, y_test, idx_train, idx_test = train_test_split(
    X_scaled, y, df.index, test_size=0.2, random_state=42, stratify=y
)

# ---------- 5. Train Random Forest ----------
model = RandomForestClassifier(n_estimators=200, max_depth=8, random_state=42)
model.fit(X_train, y_train)

# ---------- 6. Evaluate ----------
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
report = classification_report(y_test, y_pred, output_dict=True)
cm = confusion_matrix(y_test, y_pred)

print(f"Accuracy: {accuracy*100:.2f}%")

# Confusion matrix plot
fig, ax = plt.subplots(figsize=(5, 4.2))
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", cbar=True,
            xticklabels=["Normal", "Suspicious"], yticklabels=["Normal", "Suspicious"], ax=ax)
ax.set_xlabel("Predicted Label")
ax.set_ylabel("Actual Label")
ax.set_title("Confusion Matrix", color="#000000", fontweight="bold")
plt.tight_layout()
plt.savefig("static/plots/confusion_matrix.png", dpi=140, facecolor=fig.get_facecolor())
plt.close()

# ---------- 7. Correlation heatmap ----------
fig, ax = plt.subplots(figsize=(5.5, 4.6))
corr = df[FEATURES].corr()
sns.heatmap(corr, annot=True, fmt=".2f", cmap="coolwarm", ax=ax)
ax.set_title("Feature Correlation Heatmap", color="#000000", fontweight="bold")
plt.tight_layout()
plt.savefig("static/plots/correlation_heatmap.png", dpi=140, facecolor=fig.get_facecolor())
plt.close()

# ---------- 8. Deviation score + risk level (whole dataset) ----------
baseline = X[y == 0].mean()  # normal-user baseline
spread = X[y == 0].std().replace(0, 1)
deviation = ((X - baseline).abs() / spread).mean(axis=1)
deviation_pct = (deviation / deviation.max() * 100).clip(0, 100)

def risk_level(score):
    if score < 33:
        return "Low Risk"
    elif score < 66:
        return "Medium Risk"
    return "High Risk"

df["deviation_score"] = deviation_pct.round(1)
df["risk_level"] = df["deviation_score"].apply(risk_level)
df["predicted_label"] = model.predict(X_scaled)

top_suspicious = (
    df[df["predicted_label"] == 1]
    .sort_values("deviation_score", ascending=False)
    .head(10)[["user_id", "predicted_label", "deviation_score", "risk_level"]]
)
top_suspicious.to_json("model/top_suspicious.json", orient="records")

# Risk visualization scatter
fig, ax = plt.subplots(figsize=(6, 4.6))
colors = df["risk_level"].map({"Low Risk": "tab:blue", "Medium Risk": "tab:orange", "High Risk": "tab:red"})
ax.scatter(df["session_duration"], df["pages_accessed"], c=colors, alpha=0.85, edgecolors="none", s=40)
ax.set_xlabel("Session Duration")
ax.set_ylabel("Pages Accessed")
ax.set_title("User Behavior Risk Visualization", color="#000000", fontweight="bold")
import matplotlib.patches as mpatches
handles = [mpatches.Patch(color=c, label=l) for l, c in
           [("Low Risk", "tab:blue"), ("Medium Risk", "tab:orange"), ("High Risk", "tab:red")]]
ax.legend(handles=handles, title="Risk Level", facecolor="white", edgecolor="#cccccc", labelcolor="#000000")
plt.tight_layout()
plt.savefig("static/plots/risk_scatter.png", dpi=140, facecolor=fig.get_facecolor())
plt.close()

# ---------- 9. Explainability: permutation importance ----------
# (shap library unavailable offline; permutation importance is a standard,
# model-agnostic explainability technique that serves the same purpose)
perm = permutation_importance(model, X_test, y_test, n_repeats=30, random_state=42)
importances = pd.Series(perm.importances_mean, index=FEATURES).sort_values()

fig, ax = plt.subplots(figsize=(6, 3.6))
bars = ax.barh(importances.index, importances.values, color="#0099ff")
ax.set_xlabel("Mean Decrease in Accuracy (Permutation Importance)")
ax.set_title("Explainable AI — Feature Importance", color="#000000", fontweight="bold")
ax.grid(False)
plt.tight_layout()
plt.savefig("static/plots/feature_importance.png", dpi=140, facecolor=fig.get_facecolor())
plt.close()

feature_importance_dict = importances.sort_values(ascending=False).round(4).to_dict()

# ---------- 10. Save artifacts ----------
with open("model/model.pkl", "wb") as f:
    pickle.dump(model, f)
with open("model/scaler.pkl", "wb") as f:
    pickle.dump(scaler, f)

metrics = {
    "accuracy": round(accuracy * 100, 2),
    "total_users": int(len(df)),
    "normal_users": int((df["predicted_label"] == 0).sum()),
    "suspicious_users": int((df["predicted_label"] == 1).sum()),
    "missing_values_found": missing,
    "classification_report": report,
    "confusion_matrix": cm.tolist(),
    "feature_importance": feature_importance_dict,
    "features": FEATURES,
}
with open("model/metrics.json", "w") as f:
    json.dump(metrics, f, indent=2)

df.to_csv("model/scored_dataset.csv", index=False)

print("All artifacts saved to model/ and static/plots/")
print(json.dumps({k: v for k, v in metrics.items() if k not in ["classification_report"]}, indent=2))
