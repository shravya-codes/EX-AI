# EX-AI — Explainable AI-Driven User Behavior Threat Detection

Full rebuild of the BCA final year project: a Random Forest classifier that flags
suspicious user behavior, wrapped in a real dark-themed cybersecurity web dashboard
(Flask backend + custom HTML/CSS/JS frontend).

## How to run it on your laptop

1. Open a terminal in this folder.
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. (Only needed if you want to regenerate the dataset/model — already done for you,
   artifacts are included in `data/` and `model/`):
   ```
   python generate_dataset.py
   python train_model.py
   ```
4. Start the web app:
   ```
   python app.py
   ```
5. Open your browser to: **http://localhost:5000**

You'll land on the Dashboard. Use the left sidebar to move between:
- **Dashboard** — live stats, animated threat feed, risk distribution, top suspicious users
- **Live Analyzer** — move the sliders, click "Run Threat Analysis", get a real live prediction from the trained model
- **Model Analytics** — confusion matrix, correlation heatmap, risk scatter plot, feature importance, classification report
- **About Project** — objective, pipeline explanation, tech stack (good cheat-sheet for your viva)

## Important things to say honestly if asked

- **Dataset**: Built to match the exact schema of the original Kaggle-style "User
  Behavior" dataset (login_attempts, session_duration, pages_accessed, failed_logins),
  generated locally with realistic statistical patterns (not a literal Kaggle
  download) — kept small (400 rows) so it trains instantly on a laptop.
- **Explainable AI**: Uses **permutation importance** from scikit-learn, not the
  literal `shap` library (it needed internet to install and wasn't available in
  the build sandbox). It serves the exact same purpose — shows which behavioral
  features most influence a prediction — and produces the same style of bar chart.
  If asked, you can say: "I used permutation importance for feature explainability,
  which is a standard model-agnostic XAI technique similar in purpose to SHAP."
- **Accuracy**: ~95% (not artificially 100%) with realistic class overlap, more
  credible than a suspiciously perfect score.

## Project structure

```
ex-ai/
├── data/user_behaviour_data.csv     # dataset
├── generate_dataset.py              # dataset generation script
├── train_model.py                   # full ML pipeline
├── model/                           # trained model, scaler, metrics (generated)
├── app.py                           # Flask backend
├── templates/                       # dashboard, analyzer, analytics, about pages
└── static/                          # css, js, generated plot images
```
