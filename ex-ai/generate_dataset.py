"""
generate_dataset.py
Generates a realistic User Behavior dataset for the EX-AI project.

NOTE ON DATA SOURCE:
Kaggle requires an authenticated API key to download datasets programmatically,
and this build environment has no internet access, so a live Kaggle pull wasn't
possible. Instead this script generates a dataset using the SAME schema and
realistic statistical patterns found in real Kaggle cybersecurity/user-behavior
datasets (e.g. typical users have 1-3 login attempts while attackers show
hundreds; long sessions + high failed logins correlate with compromise).
Kept intentionally small (400 rows) so it trains instantly on a laptop.
"""
import numpy as np
import pandas as pd
import os

np.random.seed(42)

N_NORMAL = 320
N_SUSPICIOUS = 80

# ---------- Normal users ----------
# realistic everyday behavior: few login attempts, short-ish sessions,
# moderate page access, almost no failed logins (with natural overlap/noise)
normal = pd.DataFrame({
    "login_attempts": np.clip(np.random.poisson(2.3, N_NORMAL), 1, 9),
    "session_duration": np.clip(np.random.normal(24, 14, N_NORMAL), 3, 90).round().astype(int),
    "pages_accessed": np.clip(np.random.normal(20, 11, N_NORMAL), 2, 70).round().astype(int),
    "failed_logins": np.clip(np.random.poisson(0.6, N_NORMAL), 0, 4),
})
normal["label"] = 0

# ---------- Suspicious users ----------
# credential stuffing / brute force / session hijack patterns:
# high login attempts, long or erratic sessions, excessive page scraping,
# many failed logins (with natural overlap/noise so it isn't trivially separable)
suspicious = pd.DataFrame({
    "login_attempts": np.clip(np.random.poisson(7, N_SUSPICIOUS) + np.random.randint(0, 5, N_SUSPICIOUS), 3, 25),
    "session_duration": np.clip(np.random.normal(95, 45, N_SUSPICIOUS), 15, 260).round().astype(int),
    "pages_accessed": np.clip(np.random.normal(70, 38, N_SUSPICIOUS), 8, 220).round().astype(int),
    "failed_logins": np.clip(np.random.poisson(4.5, N_SUSPICIOUS), 1, 20),
})
suspicious["label"] = 1

df = pd.concat([normal, suspicious], ignore_index=True)

# small amount of realistic label noise (borderline / ambiguous real-world cases)
flip_idx = df.sample(frac=0.025, random_state=7).index
df.loc[flip_idx, "label"] = 1 - df.loc[flip_idx, "label"]

df = df.sample(frac=1, random_state=42).reset_index(drop=True)
df.insert(0, "user_id", range(1, len(df) + 1))

os.makedirs("data", exist_ok=True)
df.to_csv("data/user_behaviour_data.csv", index=False)
print("Dataset created:", df.shape)
print(df["label"].value_counts())
