import os
import tempfile
from flask import Flask, request, jsonify
from dotenv import load_dotenv

from optimizer import InstagramCaptionOptimizer

print("Starting Flask app...")

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Load Gemini API key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY missing in .env")

optimizer = InstagramCaptionOptimizer(gemini_api_key=GEMINI_API_KEY)


@app.route("/api/instagram/optimize", methods=["POST"])
def optimize_instagram():
    if "image" not in request.files:
        return jsonify({"error": "Image file is required"}), 400

    intent = request.form.get("intent")
    if not intent:
        return jsonify({"error": "Intent is required"}), 400

    image_file = request.files["image"]

    # Save image temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as tmp:
        image_path = tmp.name
        image_file.save(image_path)

    try:
        result = optimizer.optimize(image_path, intent)
        return jsonify({
            "success": True,
            "caption": result["caption"],
            "hashtags": result["hashtags"]
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500
    finally:
        if os.path.exists(image_path):
            os.remove(image_path)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
