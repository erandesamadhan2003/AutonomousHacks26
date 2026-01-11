import os
import tempfile
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from PIL import Image
from io import BytesIO

from optimizer import InstagramCaptionOptimizer

print("Starting Flask app...")

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for backend communication

# Load Gemini API key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY missing in .env")

optimizer = InstagramCaptionOptimizer(gemini_api_key=GEMINI_API_KEY)


@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy", "service": "caption-optimizer"}), 200


@app.route("/api/instagram/optimize", methods=["POST"])
def optimize_instagram():
    image_path = None
    
    try:
        if "image" not in request.files:
            return jsonify({"success": False, "error": "Image file is required"}), 400

        intent = request.form.get("intent")
        if not intent:
            return jsonify({"success": False, "error": "Intent is required"}), 400

        image_file = request.files["image"]

        # Create temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
            image_path = tmp.name
            
        # Process image properly
        try:
            # Read the file stream
            image_bytes = image_file.read()
            img = Image.open(BytesIO(image_bytes))
            
            # Convert to RGB if needed
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Save as JPEG
            img.save(image_path, 'JPEG', quality=95)
            
        except Exception as e:
            if image_path and os.path.exists(image_path):
                os.remove(image_path)
            return jsonify({
                "success": False,
                "error": f"Invalid image file: {str(e)}"
            }), 400

        try:
            result = optimizer.optimize(image_path, intent)
            return jsonify({
                "success": True,
                "caption": result["caption"],
                "hashtags": result.get("hashtags", [])
            }), 200
        except Exception as e:
            print(f"Optimization error: {str(e)}")
            return jsonify({
                "success": False,
                "error": f"Optimization failed: {str(e)}"
            }), 500
                
    except Exception as e:
        print(f"Request error: {str(e)}")
        return jsonify({
            "success": False,
            "error": f"Request processing failed: {str(e)}"
        }), 500
    finally:
        # Clean up temp files
        if image_path and os.path.exists(image_path):
            try:
                os.remove(image_path)
            except:
                pass
        # Clean up fixed image if exists
        fixed_path = image_path.rsplit('.', 1)[0] + '_fixed.jpg' if image_path else None
        if fixed_path and os.path.exists(fixed_path):
            try:
                os.remove(fixed_path)
            except:
                pass


if __name__ == "__main__":
    print(f"Caption Optimizer Agent running on http://0.0.0.0:5000")
    app.run(host="0.0.0.0", port=5000, debug=True)
