const pptxgen = require("pptxgenjs");

let pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.3 x 7.5
pres.author = "Shravya";
pres.title = "EX-AI - Explainable AI-Driven User Behavior Threat Detection";

// ---------- Design tokens ----------
const C = {
  void: "0A0E14",
  panel: "10161F",
  panel2: "141C26",
  line: "222C38",
  signal: "00FFA3",
  signalDim: "0A3D2E",
  alert: "FF3B5C",
  amber: "FFB020",
  info: "4FA8FF",
  text: "E6EDF3",
  muted: "8B98A5",
  muted2: "5B6672",
};
const FONT_HEAD = "Courier New";
const FONT_BODY = "Calibri";

const W = 13.33, H = 7.5;

function bgSlide() {
  let s = pres.addSlide();
  s.background = { color: C.void };
  return s;
}

function kicker(s, text, x = 0.6, y = 0.42) {
  s.addText(text.toUpperCase(), {
    x, y, w: 8, h: 0.3, fontFace: FONT_HEAD, fontSize: 11, color: C.signal,
    bold: true, charSpacing: 2, margin: 0,
  });
}

function title(s, text, x = 0.6, y = 0.7, w = 11, size = 30) {
  s.addText(text, {
    x, y, w, h: 0.8, fontFace: FONT_HEAD, fontSize: size, color: C.text,
    bold: true, margin: 0,
  });
}

function pageNum(s, n) {
  s.addText(`0${n}`.slice(-2) + " / 12", {
    x: W - 1.3, y: H - 0.5, w: 1, h: 0.3, fontFace: FONT_HEAD, fontSize: 9,
    color: C.muted2, align: "right", margin: 0,
  });
  s.addText("EX-AI", {
    x: 0.6, y: H - 0.5, w: 4, h: 0.3, fontFace: FONT_HEAD, fontSize: 9,
    color: C.muted2, charSpacing: 1, margin: 0,
  });
}

function card(s, x, y, w, h, opts = {}) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, rectRadius: 0.06,
    fill: { color: opts.fill || C.panel },
    line: { color: opts.line || C.line, width: 1 },
  });
}

function dot(s, x, y, color) {
  s.addShape(pres.shapes.OVAL, { x, y, w: 0.09, h: 0.09, fill: { color } });
}

// ============================================================
// SLIDE 1 — Title
// ============================================================
{
  let s = bgSlide();
  // subtle grid dots using thin lines pattern is overkill; keep minimal.
  s.addText([{ text: ">_ ", options: { color: C.signal } }, { text: "EX-AI", options: { color: C.text } }], {
    x: 0.9, y: 1.95, w: 10, h: 0.5, fontFace: FONT_HEAD, fontSize: 20, bold: true, charSpacing: 2, margin: 0,
  });
  s.addText("Explainable AI-Driven User Behavior\nThreat Detection Using Random Forest Classifier", {
    x: 0.9, y: 2.5, w: 11.2, h: 1.75, fontFace: FONT_HEAD, fontSize: 36, color: C.text, bold: true, margin: 0, lineSpacingMultiple: 1.1,
  });
  s.addText("BCA Final Year Project  ·  Department of Computer Applications", {
    x: 0.9, y: 4.45, w: 10, h: 0.4, fontFace: FONT_BODY, fontSize: 15, color: C.muted, margin: 0,
  });

  card(s, 0.9, 5.35, 5.7, 1.1, {});
  s.addText([
    { text: "SUBMITTED BY\n", options: { fontSize: 10, color: C.muted, charSpacing: 1, breakLine: true } },
    { text: "SHRAVYA  ", options: { fontSize: 15, color: C.text, bold: true } },
    { text: "(U18BH23S0043)", options: { fontSize: 12, color: C.muted } },
  ], { x: 1.15, y: 5.52, w: 5.2, h: 0.8, fontFace: FONT_BODY, margin: 0 });

  card(s, 6.85, 5.35, 5.7, 1.1, {});
  s.addText([
    { text: "GUIDED BY\n", options: { fontSize: 10, color: C.muted, charSpacing: 1, breakLine: true } },
    { text: "Mrs. Amrutha Kakkoth", options: { fontSize: 15, color: C.text, bold: true } },
  ], { x: 7.1, y: 5.52, w: 5.2, h: 0.8, fontFace: FONT_BODY, margin: 0 });

  dot(s, 0.9, 1.7, C.signal);
  s.addText("SYSTEM STATUS: ONLINE", {
    x: 1.1, y: 1.58, w: 4, h: 0.3, fontFace: FONT_HEAD, fontSize: 10, color: C.signal, charSpacing: 1, margin: 0,
  });
}

// ============================================================
// SLIDE 2 — Problem Statement
// ============================================================
{
  let s = bgSlide();
  kicker(s, "The Problem");
  title(s, "Traditional security tools can't see behavioral threats");
  s.addText(
    "Rule-based and signature-based systems catch known attack patterns — but insider threats, "
    + "credential stuffing, and account hijacking often look like \"normal\" traffic on the surface. "
    + "The only signal is in behavior.",
    { x: 0.6, y: 1.65, w: 7.6, h: 1.1, fontFace: FONT_BODY, fontSize: 14, color: C.muted, margin: 0, lineSpacingMultiple: 1.3 }
  );

  const risks = [
    ["Repeated login attempts", "Brute-force / credential stuffing signal"],
    ["Abnormal session duration", "Persistence after unauthorized access"],
    ["Excessive page access", "Automated scraping or reconnaissance"],
    ["High failed-login count", "Dictionary attacks against accounts"],
  ];
  let ry = 3.0;
  risks.forEach(([h, sub], i) => {
    card(s, 0.6, ry, 7.6, 0.85);
    dot(s, 0.85, ry + 0.37, C.alert);
    s.addText(h, { x: 1.1, y: ry + 0.08, w: 6.8, h: 0.35, fontFace: FONT_HEAD, fontSize: 12.5, color: C.text, bold: true, margin: 0 });
    s.addText(sub, { x: 1.1, y: ry + 0.42, w: 6.8, h: 0.32, fontFace: FONT_BODY, fontSize: 11, color: C.muted, margin: 0 });
    ry += 1.0;
  });

  card(s, 8.5, 1.65, 4.2, 5.0, { fill: C.panel2 });
  s.addText("WHY IT MATTERS", { x: 8.8, y: 1.95, w: 3.6, h: 0.3, fontFace: FONT_HEAD, fontSize: 10.5, color: C.signal, charSpacing: 1.5, margin: 0 });
  s.addText([
    { text: "82%", options: { fontSize: 40, color: C.text, bold: true, breakLine: true } },
    { text: "of breaches involve a human / behavioral element, not just a technical exploit.", options: { fontSize: 12, color: C.muted } },
  ], { x: 8.8, y: 2.35, w: 3.6, h: 1.6, fontFace: FONT_HEAD, margin: 0, lineSpacingMultiple: 1.2 });
  s.addShape(pres.shapes.LINE, { x: 8.8, y: 4.15, w: 3.6, h: 0, line: { color: C.line, width: 1 } });
  s.addText("Manual monitoring cannot scale to thousands of sessions per day — this project automates that judgment call.", {
    x: 8.8, y: 4.4, w: 3.6, h: 2.0, fontFace: FONT_BODY, fontSize: 12.5, color: C.text, margin: 0, lineSpacingMultiple: 1.35,
  });

  pageNum(s, 2);
}

// ============================================================
// SLIDE 3 — Objectives
// ============================================================
{
  let s = bgSlide();
  kicker(s, "Objectives");
  title(s, "What this system sets out to do");

  const objs = [
    ["01", "Detect", "Flag suspicious user behavior automatically using Machine Learning."],
    ["02", "Classify", "Separate Normal vs Suspicious users with a Random Forest Classifier."],
    ["03", "Score", "Generate a deviation score measuring how abnormal a session is."],
    ["04", "Prioritize", "Assign Low / Medium / High risk levels for triage."],
    ["05", "Explain", "Use Explainable AI to show why a prediction was made."],
    ["06", "Visualize", "Present everything through a live security dashboard."],
  ];
  const cols = 3, cw = 3.9, ch = 2.05, gx = 0.25, gy = 0.25, startX = 0.6, startY = 1.75;
  objs.forEach((o, i) => {
    const col = i % cols, row = Math.floor(i / cols);
    const x = startX + col * (cw + gx), y = startY + row * (ch + gy);
    card(s, x, y, cw, ch);
    s.addText(o[0], { x: x + 0.25, y: y + 0.18, w: 1.5, h: 0.5, fontFace: FONT_HEAD, fontSize: 22, color: C.signal, bold: true, margin: 0 });
    s.addText(o[1], { x: x + 0.25, y: y + 0.72, w: cw - 0.5, h: 0.4, fontFace: FONT_HEAD, fontSize: 15, color: C.text, bold: true, margin: 0 });
    s.addText(o[2], { x: x + 0.25, y: y + 1.12, w: cw - 0.5, h: 0.8, fontFace: FONT_BODY, fontSize: 11.5, color: C.muted, margin: 0, lineSpacingMultiple: 1.25 });
  });

  pageNum(s, 3);
}

// ============================================================
// SLIDE 4 — Pipeline / Architecture
// ============================================================
{
  let s = bgSlide();
  kicker(s, "System Architecture");
  title(s, "From raw session data to a live verdict");

  const steps = ["Dataset", "Preprocess", "Scale", "Train\n(Random Forest)", "Evaluate", "Explain\n(XAI)", "Serve\n(Flask UI)"];
  const n = steps.length;
  const totalW = 12.1, boxW = 1.55, gap = (totalW - n * boxW) / (n - 1);
  let x = 0.6, y = 3.2;
  steps.forEach((label, i) => {
    card(s, x, y, boxW, 1.15, { fill: i === 3 || i === 5 ? C.signalDim : C.panel, line: i === 3 || i === 5 ? C.signal : C.line });
    s.addText(label, {
      x: x + 0.05, y: y + 0.12, w: boxW - 0.1, h: 0.9, fontFace: FONT_HEAD, fontSize: 10.5,
      color: (i === 3 || i === 5) ? C.signal : C.text, bold: true, align: "center", valign: "middle", margin: 0,
    });
    if (i < n - 1) {
      s.addShape(pres.shapes.LINE, {
        x: x + boxW, y: y + 0.575, w: gap, h: 0,
        line: { color: C.muted2, width: 1.5, endArrowType: "triangle" },
      });
    }
    x += boxW + gap;
  });

  s.addText(
    "Behavioral features — login_attempts, session_duration, pages_accessed, failed_logins — flow through "
    + "preprocessing and scaling into a Random Forest Classifier. Predictions are paired with deviation scoring, "
    + "risk classification and permutation-importance explainability, then served live through a Flask web dashboard.",
    { x: 0.6, y: 1.7, w: 11.2, h: 1.1, fontFace: FONT_BODY, fontSize: 13.5, color: C.muted, margin: 0, lineSpacingMultiple: 1.35 }
  );

  pageNum(s, 4);
}

// ============================================================
// SLIDE 5 — Dataset
// ============================================================
{
  let s = bgSlide();
  kicker(s, "Data");
  title(s, "The behavioral dataset");

  card(s, 0.6, 1.75, 5.7, 4.9);
  s.addText("4 BEHAVIORAL FEATURES", { x: 0.9, y: 2.0, w: 5, h: 0.3, fontFace: FONT_HEAD, fontSize: 11, color: C.signal, charSpacing: 1, margin: 0 });
  const feats = [
    ["login_attempts", "Frequency of authentication activity"],
    ["session_duration", "Length of the user session, in minutes"],
    ["pages_accessed", "Breadth of browsing / access behavior"],
    ["failed_logins", "Count of failed authentication attempts"],
  ];
  let fy = 2.4;
  feats.forEach(([f, d]) => {
    s.addText(f, { x: 0.9, y: fy, w: 4.9, h: 0.3, fontFace: FONT_HEAD, fontSize: 13, color: C.text, bold: true, margin: 0 });
    s.addText(d, { x: 0.9, y: fy + 0.32, w: 4.9, h: 0.3, fontFace: FONT_BODY, fontSize: 11, color: C.muted, margin: 0 });
    fy += 0.78;
  });
  s.addShape(pres.shapes.LINE, { x: 0.9, y: fy + 0.02, w: 5.1, h: 0, line: { color: C.line, width: 1 } });
  s.addText("400 sessions, labeled Normal / Suspicious — matching the schema of the original Kaggle-style dataset.", {
    x: 0.9, y: fy + 0.2, w: 5.1, h: 0.75, fontFace: FONT_BODY, fontSize: 10.5, color: C.muted, italic: true, margin: 0, lineSpacingMultiple: 1.25,
  });

  card(s, 6.55, 1.75, 6.15, 4.9, { fill: C.panel2 });
  s.addText("CLASS DISTRIBUTION", { x: 6.85, y: 2.0, w: 5, h: 0.3, fontFace: FONT_HEAD, fontSize: 11, color: C.signal, charSpacing: 1, margin: 0 });
  s.addText("319", { x: 6.85, y: 2.5, w: 2.6, h: 0.9, fontFace: FONT_HEAD, fontSize: 44, color: C.signal, bold: true, margin: 0 });
  s.addText("NORMAL USERS  ·  79.8%", { x: 6.85, y: 3.35, w: 2.6, h: 0.4, fontFace: FONT_HEAD, fontSize: 10, color: C.muted, charSpacing: 0.5, margin: 0 });
  s.addText("81", { x: 9.6, y: 2.5, w: 2.6, h: 0.9, fontFace: FONT_HEAD, fontSize: 44, color: C.alert, bold: true, margin: 0 });
  s.addText("SUSPICIOUS USERS  ·  20.2%", { x: 9.6, y: 3.35, w: 3, h: 0.4, fontFace: FONT_HEAD, fontSize: 10, color: C.muted, charSpacing: 0.5, margin: 0 });

  // simple bar visualization
  s.addShape(pres.shapes.RECTANGLE, { x: 6.85, y: 4.5, w: 5.5 * 0.798, h: 0.35, fill: { color: C.signal } });
  s.addShape(pres.shapes.RECTANGLE, { x: 6.85 + 5.5 * 0.798, y: 4.5, w: 5.5 * 0.202, h: 0.35, fill: { color: C.alert } });

  s.addText("Preprocessing: duplicate check, missing-value check (0 found), feature selection, StandardScaler normalization before training.", {
    x: 6.85, y: 5.4, w: 5.6, h: 1.1, fontFace: FONT_BODY, fontSize: 11.5, color: C.text, margin: 0, lineSpacingMultiple: 1.35,
  });

  pageNum(s, 5);
}

// ============================================================
// SLIDE 6 — Model
// ============================================================
{
  let s = bgSlide();
  kicker(s, "The Model");
  title(s, "Why Random Forest Classifier");

  s.addText(
    "Random Forest builds many decision trees on random subsets of data and averages their output. "
    + "That ensemble approach reduces overfitting and handles mixed-scale behavioral features reliably "
    + "without heavy tuning — a strong, explainable baseline for a first cybersecurity ML classifier.",
    { x: 0.6, y: 1.7, w: 6.9, h: 1.7, fontFace: FONT_BODY, fontSize: 14, color: C.muted, margin: 0, lineSpacingMultiple: 1.4 }
  );

  const pts = ["High classification accuracy", "Reduces overfitting vs. a single tree", "Handles behavioral data efficiently", "Widely used in anomaly detection"];
  let py = 3.5;
  pts.forEach(p => {
    dot(s, 0.65, py + 0.11, C.signal);
    s.addText(p, { x: 0.95, y: py, w: 6.4, h: 0.35, fontFace: FONT_BODY, fontSize: 13, color: C.text, margin: 0 });
    py += 0.5;
  });

  card(s, 7.9, 1.7, 4.8, 5.0, { fill: C.panel2 });
  s.addText("MODEL CONFIG", { x: 8.2, y: 1.95, w: 4, h: 0.3, fontFace: FONT_HEAD, fontSize: 10.5, color: C.signal, charSpacing: 1, margin: 0 });
  const cfg = [["Algorithm", "RandomForestClassifier"], ["Estimators", "200 trees"], ["Max depth", "8"], ["Train / Test split", "80% / 20%"], ["Random state", "42"], ["Library", "scikit-learn"]];
  let cy = 2.4;
  cfg.forEach(([k, v]) => {
    s.addText(k, { x: 8.2, y: cy, w: 2.0, h: 0.4, fontFace: FONT_BODY, fontSize: 12, color: C.muted, margin: 0 });
    s.addText(v, { x: 10.1, y: cy, w: 2.4, h: 0.4, fontFace: FONT_HEAD, fontSize: 12, color: C.text, bold: true, align: "right", margin: 0 });
    s.addShape(pres.shapes.LINE, { x: 8.2, y: cy + 0.42, w: 4.3, h: 0, line: { color: C.line, width: 0.75 } });
    cy += 0.62;
  });

  pageNum(s, 6);
}

// ============================================================
// SLIDE 7 — Evaluation (Confusion Matrix + Classification Report)
// ============================================================
{
  let s = bgSlide();
  kicker(s, "Evaluation");
  title(s, "Model performance on unseen data");

  s.addImage({ path: "ppt_assets/confusion_matrix.png", x: 0.6, y: 1.75, w: 5.4, h: 4.6 });

  card(s, 6.3, 1.75, 6.4, 4.6, { fill: C.panel2 });
  s.addText("CLASSIFICATION REPORT", { x: 6.6, y: 2.0, w: 5, h: 0.3, fontFace: FONT_HEAD, fontSize: 10.5, color: C.signal, charSpacing: 1, margin: 0 });

  const headers = ["Class", "Precision", "Recall", "F1"];
  const rows = [["Normal", "93.9%", "100%", "96.9%"], ["Suspicious", "100%", "77.8%", "87.5%"], ["Weighted Avg", "95.3%", "95.0%", "94.8%"]];
  let ty = 2.45;
  // build manual table with text boxes for control
  const colX = [6.6, 8.7, 10.0, 11.3];
  headers.forEach((h, i) => s.addText(h, { x: colX[i], y: 2.45, w: 1.3, h: 0.3, fontFace: FONT_HEAD, fontSize: 10, color: C.muted, charSpacing: 0.5, margin: 0 }));
  s.addShape(pres.shapes.LINE, { x: 6.6, y: 2.78, w: 5.9, h: 0, line: { color: C.line, width: 1 } });
  let rowY = 2.9;
  rows.forEach(r => {
    r.forEach((v, i) => s.addText(v, { x: colX[i], y: rowY, w: 1.3, h: 0.35, fontFace: FONT_HEAD, fontSize: 12, color: i === 0 ? C.text : C.signal, bold: i === 0, margin: 0 }));
    rowY += 0.5;
  });

  s.addShape(pres.shapes.LINE, { x: 6.6, y: rowY + 0.1, w: 5.9, h: 0, line: { color: C.line, width: 1 } });
  s.addText("95.0%", { x: 6.6, y: rowY + 0.35, w: 3, h: 0.9, fontFace: FONT_HEAD, fontSize: 40, color: C.signal, bold: true, margin: 0 });
  s.addText("OVERALL MODEL ACCURACY", { x: 6.6, y: rowY + 1.15, w: 4, h: 0.3, fontFace: FONT_HEAD, fontSize: 9.5, color: C.muted, charSpacing: 1, margin: 0 });

  pageNum(s, 7);
}

// ============================================================
// SLIDE 8 — Correlation Heatmap + Risk Scatter
// ============================================================
{
  let s = bgSlide();
  kicker(s, "Behavioral Analysis");
  title(s, "Feature relationships & risk separation");

  s.addImage({ path: "ppt_assets/correlation_heatmap.png", x: 0.6, y: 1.75, w: 5.9, h: 4.9 });
  s.addImage({ path: "ppt_assets/risk_scatter.png", x: 6.85, y: 1.75, w: 5.9, h: 4.9 });

  pageNum(s, 8);
}

// ============================================================
// SLIDE 9 — Explainable AI
// ============================================================
{
  let s = bgSlide();
  kicker(s, "Explainable AI");
  title(s, "Which features drive a prediction?");

  s.addImage({ path: "ppt_assets/feature_importance.png", x: 0.6, y: 1.75, w: 7.2, h: 4.9 });

  card(s, 8.1, 1.75, 4.6, 4.9, { fill: C.panel2 });
  s.addText("PERMUTATION IMPORTANCE", { x: 8.4, y: 2.0, w: 4, h: 0.3, fontFace: FONT_HEAD, fontSize: 10.5, color: C.signal, charSpacing: 1, margin: 0 });
  s.addText(
    "Traditional ML models behave like black boxes. This project uses permutation importance — "
    + "a model-agnostic Explainable AI technique — to measure how much accuracy drops when a "
    + "feature is shuffled. A bigger drop means the model relies on that feature more heavily.",
    { x: 8.4, y: 2.4, w: 4, h: 2.2, fontFace: FONT_BODY, fontSize: 12, color: C.text, margin: 0, lineSpacingMultiple: 1.35 }
  );
  s.addShape(pres.shapes.LINE, { x: 8.4, y: 4.7, w: 3.9, h: 0, line: { color: C.line, width: 1 } });
  s.addText("pages_accessed and session_duration show the strongest influence on this dataset's predictions.", {
    x: 8.4, y: 4.9, w: 3.9, h: 1.4, fontFace: FONT_BODY, fontSize: 11.5, color: C.muted, italic: true, margin: 0, lineSpacingMultiple: 1.3,
  });

  pageNum(s, 9);
}

// ============================================================
// SLIDE 10 — Live Web Dashboard
// ============================================================
{
  let s = bgSlide();
  kicker(s, "Deployment");
  title(s, "A real, live security dashboard");
  s.addText("Not a Colab widget — a full Flask web app with real-time predictions, styled as an actual SOC monitoring tool.", {
    x: 0.6, y: 1.35, w: 10, h: 0.4, fontFace: FONT_BODY, fontSize: 13, color: C.muted, margin: 0,
  });

  s.addImage({ path: "ppt_assets/dashboard.png", x: 0.6, y: 1.9, w: 7.7, h: 5.13 });

  card(s, 8.55, 1.9, 4.15, 2.45, { fill: C.panel2 });
  s.addText("Dashboard", { x: 8.8, y: 2.1, w: 3.6, h: 0.35, fontFace: FONT_HEAD, fontSize: 13, color: C.signal, bold: true, margin: 0 });
  s.addText("Live animated threat feed, risk distribution, top suspicious users — ranked by deviation score.", {
    x: 8.8, y: 2.5, w: 3.6, h: 1.7, fontFace: FONT_BODY, fontSize: 11.5, color: C.text, margin: 0, lineSpacingMultiple: 1.3,
  });

  card(s, 8.55, 4.55, 4.15, 2.45, { fill: C.panel2 });
  s.addText("Live Analyzer", { x: 8.8, y: 4.75, w: 3.6, h: 0.35, fontFace: FONT_HEAD, fontSize: 13, color: C.signal, bold: true, margin: 0 });
  s.addText("Move the sliders, run threat analysis, and get a real prediction from the trained Random Forest model instantly.", {
    x: 8.8, y: 5.15, w: 3.6, h: 1.7, fontFace: FONT_BODY, fontSize: 11.5, color: C.text, margin: 0, lineSpacingMultiple: 1.3,
  });

  pageNum(s, 10);
}

// ============================================================
// SLIDE 11 — Analyzer + Analytics screenshots
// ============================================================
{
  let s = bgSlide();
  kicker(s, "Deployment");
  title(s, "Interactive prediction & analytics pages");

  s.addImage({ path: "ppt_assets/analyzer.png", x: 0.6, y: 1.8, w: 6.0, h: 4.0 });
  s.addImage({ path: "ppt_assets/analytics.png", x: 6.85, y: 1.8, w: 5.9, h: 4.85 });

  s.addText("Live Analyzer — real-time prediction with confidence & risk level", {
    x: 0.6, y: 5.85, w: 6, h: 0.4, fontFace: FONT_BODY, fontSize: 11.5, color: C.muted, italic: true, margin: 0,
  });

  pageNum(s, 11);
}

// ============================================================
// SLIDE 12 — Conclusion / Future Scope
// ============================================================
{
  let s = bgSlide();
  kicker(s, "Conclusion");
  title(s, "Outcome & where this goes next", 0.6, 0.7, 11, 30);

  card(s, 0.6, 1.75, 5.9, 4.9);
  s.addText("RESULTS", { x: 0.9, y: 2.0, w: 5, h: 0.3, fontFace: FONT_HEAD, fontSize: 11, color: C.signal, charSpacing: 1, margin: 0 });
  const results = [
    "95% test accuracy with realistic class overlap (not artificially perfect)",
    "Deviation scoring + 3-tier risk classification for triage",
    "Permutation-importance explainability for model transparency",
    "Deployed as a live, interactive Flask web dashboard",
  ];
  let ry = 2.5;
  results.forEach(r => {
    dot(s, 0.95, ry + 0.1, C.signal);
    s.addText(r, { x: 1.25, y: ry, w: 5.0, h: 0.6, fontFace: FONT_BODY, fontSize: 12.5, color: C.text, margin: 0, lineSpacingMultiple: 1.25 });
    ry += 0.72;
  });

  card(s, 6.85, 1.75, 5.9, 4.9, { fill: C.panel2 });
  s.addText("FUTURE SCOPE", { x: 7.15, y: 2.0, w: 5, h: 0.3, fontFace: FONT_HEAD, fontSize: 11, color: C.amber, charSpacing: 1, margin: 0 });
  const future = [
    "Real-time streaming input instead of static datasets",
    "Larger, real-world labeled cybersecurity datasets",
    "Deep Learning models (LSTM) for sequential session behavior",
    "Cloud deployment with authentication & alerting integrations",
  ];
  let fy = 2.5;
  future.forEach(r => {
    dot(s, 7.2, fy + 0.1, C.amber);
    s.addText(r, { x: 7.5, y: fy, w: 5.0, h: 0.6, fontFace: FONT_BODY, fontSize: 12.5, color: C.text, margin: 0, lineSpacingMultiple: 1.25 });
    fy += 0.72;
  });

  // (footer already signs off with "EX-AI")

  pageNum(s, 12);
}

pres.writeFile({ fileName: "EX_AI_Presentation.pptx" }).then(() => console.log("done"));
