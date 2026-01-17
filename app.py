import os
import random
from flask import Flask, request, jsonify, send_from_directory, render_template
from flask_cors import CORS

# ----------------------------
# App setup
# ----------------------------
app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ----------------------------
# Categories / keywords
# ----------------------------
CATEGORY_KEYWORDS = {
    "tops": ["shirt", "tshirt", "tee", "top", "blouse"],
    "bottoms": ["pant", "pants", "jean", "trouser", "trousers", "skirt"],
    "accessories": ["watch", "earring", "earrings", "belt", "necklace"],
    "footwear": ["shoe", "shoes", "sneaker", "heel", "sandal"],
    "bags": ["bag", "handbag", "purse", "backpack"],
    "outerwear": ["jacket", "coat", "hoodie", "blazer"],
}

NEUTRALS = {"black", "white", "grey", "gray", "beige", "navy"}
WARM = {"red", "orange", "yellow", "brown", "gold", "maroon", "pink"}
COOL = {"blue", "green", "teal", "purple", "silver"}

# ----------------------------
# Helpers
# ----------------------------
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def detect_category(filename):
    low = filename.lower()
    for cat, keys in CATEGORY_KEYWORDS.items():
        if any(k in low for k in keys):
            return cat
    return "unknown"


def extract_color_from_filename(filename):
    name = filename.lower().split(".")[0]
    return name.split("_")[0] if "_" in name else "unknown"


def build_buckets(files):
    buckets = {k: [] for k in CATEGORY_KEYWORDS}
    for f in files:
        cat = detect_category(f)
        if cat in buckets:
            buckets[cat].append(f)
    return buckets


def confidence(score):
    if score >= 90:
        return "Excellent"
    if score >= 75:
        return "Great"
    if score >= 60:
        return "Good"
    return "Okay"

# ----------------------------
# Scoring logic
# ----------------------------
def score_outfit(top_color, bottom_color, palette, style, age_group, gender):
    score = 65
    reasons = []

    if palette == "warm" and (top_color in WARM or bottom_color in WARM):
        score += 10
        reasons.append("Warm palette match.")
    if palette == "cool" and (top_color in COOL or bottom_color in COOL):
        score += 10
        reasons.append("Cool palette match.")
    if palette == "neutral":
        score += 6
        reasons.append("Neutral palette is versatile.")

    if top_color == bottom_color:
        score += 5
        reasons.append("Monochrome gives a clean look.")
    else:
        score += 8
        reasons.append("Good contrast improves balance.")

    if style == "formal" and top_color in NEUTRALS:
        score += 8
        reasons.append("Formal styles prefer classic tones.")
    elif style == "chic":
        score += 6
        reasons.append("Chic favors refined combinations.")
    elif style == "casual":
        score += 6
        reasons.append("Casual allows relaxed styling.")
    elif style == "sport":
        score += 6
        reasons.append("Sport suits bold colors.")

    if age_group == "31-40":
        score += 8
        reasons.append("Refined age styling.")
    elif age_group == "26-30":
        score += 6
        reasons.append("Modern balanced styling.")
    else:
        score += 5
        reasons.append("Youthful flexibility.")

    if gender == "female" and style == "chic" and bottom_color in {"black", "teal"}:
        score += 5
        reasons.append("Elegant feminine styling.")
    elif gender == "male":
        score += 4
        reasons.append("Structured profile match.")
    else:
        score += 3
        reasons.append("Gender-neutral styling.")

    return min(score, 95), reasons[:6]

# ----------------------------
# Routes
# ----------------------------
@app.route("/")
def home():
    return jsonify({"status": "ColorWise backend running"})

@app.route("/ui")
def ui():
    return render_template("index.html")

@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file sent"}), 400

    file = request.files["file"]
    if file.filename == "" or not allowed_file(file.filename):
        return jsonify({"error": "Invalid file"}), 400

    path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(path)

    return jsonify({"file_url": f"/uploads/{file.filename}"})


@app.route("/uploads/<filename>")
def serve_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


@app.route("/pair", methods=["POST"])
def pair():
    data = request.get_json(force=True)

    age_group = data.get("age_group", "18-25")
    gender = data.get("gender", "non-binary")
    style = data.get("style", "casual")
    palette = data.get("palette", "neutral")

    files = [f for f in os.listdir(UPLOAD_FOLDER) if allowed_file(f)]
    buckets = build_buckets(files)

    tops = buckets["tops"]
    bottoms = buckets["bottoms"]

    if not tops or not bottoms:
        return jsonify({"error": "Upload at least one top and bottom"}), 400

    results = []

    for t in tops:
        for b in bottoms:
            tc = extract_color_from_filename(t)
            bc = extract_color_from_filename(b)
            score, reasons = score_outfit(tc, bc, palette, style, age_group, gender)

            results.append({
                "top": f"/uploads/{t}",
                "bottom": f"/uploads/{b}",
                "colors": {"top": tc, "bottom": bc},
                "score": score,
                "confidence": confidence(score),
                "reasons": reasons
            })

    results.sort(key=lambda x: x["score"], reverse=True)

    return jsonify({
        "best_outfit": results[0],
        "recommendations": results[:5],
        "total_combinations": len(results)
    })
@app.route("/reset", methods=["POST"])
def reset_uploads():
    files = [f for f in os.listdir(app.config["UPLOAD_FOLDER"]) if allowed_file(f)]
    deleted = []

    for f in files:
        try:
            os.remove(os.path.join(app.config["UPLOAD_FOLDER"], f))
            deleted.append(f)
        except Exception as e:
            print("Could not delete", f, e)

    return jsonify({
        "message": "Uploads cleared for new session",
        "deleted_files": deleted
    })


# ----------------------------
# Run
# ----------------------------
if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)