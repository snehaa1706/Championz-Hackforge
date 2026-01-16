import os
import random
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

# ----------------------------
# App setup
# ----------------------------
app = Flask(__name__)
CORS(app)

# Absolute path setup (VERY IMPORTANT on Windows)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ----------------------------
# Helper functions
# ----------------------------
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

# ----------------------------
# Routes
# ----------------------------

# Home route
@app.route("/")
def home():
    return jsonify({"status": "ColorWise backend running"})

# Upload route
@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No file sent"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type"}), 400

    save_path = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
    file.save(save_path)

    return jsonify({
        "message": "File uploaded successfully",
        "file_url": f"/uploads/{file.filename}"
    })

# Serve uploaded files
@app.route("/uploads/<filename>")
def serve_uploaded_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

# Outfit pairing route
@app.route("/pair", methods=["GET"])
def pair_outfit():
    files = os.listdir(app.config["UPLOAD_FOLDER"])

    # Keywords for detection
    top_keywords = ["shirt", "top", "tshirt", "tee", "t-shirt"]
    bottom_keywords = ["pant", "pants", "jean", "jeans", "trouser", "trousers", "bottom"]

    tops = [f for f in files if any(k in f.lower() for k in top_keywords)]
    bottoms = [f for f in files if any(k in f.lower() for k in bottom_keywords)]

    if not tops or not bottoms:
        return jsonify({
            "error": "Not enough clothes uploaded",
            "files_found": files,
            "tops_found": tops,
            "bottoms_found": bottoms,
            "fix": "Upload at least 1 TOP and 1 BOTTOM (e.g., blue_shirt.png, black_pants.png)"
        }), 400

    selected_top = random.choice(tops)
    selected_bottom = random.choice(bottoms)

    return jsonify({
        "top": f"/uploads/{selected_top}",
        "bottom": f"/uploads/{selected_bottom}",
        "reason": "This is a basic outfit pairing demo (top + bottom)."
    })

# ----------------------------
# Run server
# ----------------------------
if __name__ == "__main__":
    app.run(debug=True)

