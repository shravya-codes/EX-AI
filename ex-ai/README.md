# EX-AI — Explainable AI-Driven User Behavior Threat Detection

A cybersecurity dashboard that uses a **Random Forest Classifier** to detect suspicious user behavior in real time, with built-in **Explainable AI** so every prediction can be understood — not just trusted blindly.

Built as a live Flask web app with a dark, SOC-style dashboard — not a Colab notebook.

## What it does

- Analyzes 4 behavioral signals: `login_attempts`, `session_duration`, `pages_accessed`, `failed_logins`
- Classifies each user session as **Normal** or **Suspicious**
- Calculates a **deviation score** and assigns a **risk level** (Low / Medium / High)
- Explains *why* a prediction was made using permutation importance (a model-agnostic Explainable AI technique)
- Serves everything live through an interactive web dashboard

## Results

| Metric | Score |
|---|---|
| Accuracy | 95.0% |
| Precision (Suspicious) | 100% |
| Recall (Suspicious) | 77.8% |
| F1-Score (Suspicious) | 87.5% |

## Tech Stack

**Backend:** Python, Flask
**ML:** scikit-learn (Random Forest Classifier), pandas, NumPy
**Explainability:** Permutation Importance
**Visualization:** Matplotlib, Seaborn
**Frontend:** HTML, CSS, JavaScript

## Pages

- **Dashboard** — live stats, animated threat feed, risk distribution, top suspicious users
- **Live Analyzer** — enter session values, get a real-time prediction from the trained model
- **Model Analytics** — confusion matrix, correlation heatmap, risk scatter plot, feature importance, classification report
- **About Project** — objective, pipeline explanation, tech stack

## Run it locally

```bash
cd ex-ai
pip install -r requirements.txt
python app.py
```
Then open **http://localhost:5000**

## Dataset

Modeled on the schema of a standard Kaggle-style User Behavior dataset (`login_attempts`, `session_duration`, `pages_accessed`, `failed_logins`), generated with realistic statistical patterns — normal users show low, consistent activity, while suspicious users show elevated and more erratic behavior.

## Project structure

ex-ai/
├── data/                  # dataset
├── generate_dataset.py    # dataset generation script
├── train_model.py         # full ML pipeline
├── model/                 # trained model, scaler, metrics
├── app.py                 # Flask backend
├── templates/              # dashboard, analyzer, analytics, about pages
├── static/                # css, js, generated plot images
└── colab/                 # companion Colab notebook

---
BCA Final Year Project — Department of Computer Applications
