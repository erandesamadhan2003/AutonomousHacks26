import os
import io
import base64
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image, ImageEnhance, ImageFilter, ImageOps
import numpy as np
import cv2

print("Starting Image Processing Agent...")

app = Flask(__name__)
CORS(app)

# Platform-specific image dimensions
PLATFORM_SIZES = {
    "instagram_post": (1080, 1080),
    "instagram_story": (1080, 1920),
    "instagram_reel": (1080, 1920),
    "linkedin": (1200, 627),
    "facebook": (1200, 630),
    "twitter": (1200, 675),
    "pinterest": (1000, 1500),
    "youtube_thumbnail": (1280, 720)
}

# Filter presets
FILTER_CONFIGS = {
    "vibrant": {"color": 1.5, "contrast": 1.2, "brightness": 1.05, "sharpness": 1.2},
    "professional": {"color": 0.9, "contrast": 1.3, "brightness": 1.0, "sharpness": 1.3},
    "vintage": {"color": 0.8, "contrast": 0.95, "brightness": 1.05, "sharpness": 0.9},
    "bold": {"color": 1.3, "contrast": 1.8, "brightness": 1.0, "sharpness": 1.4},
    "soft": {"color": 1.1, "contrast": 0.9, "brightness": 1.1, "sharpness": 0.8},
    "dramatic": {"color": 1.2, "contrast": 2.0, "brightness": 0.95, "sharpness": 1.5},
    "natural": {"color": 1.0, "contrast": 1.1, "brightness": 1.05, "sharpness": 1.1},
    "bw_classic": {"color": 0.0, "contrast": 1.4, "brightness": 1.0, "sharpness": 1.2}
}

def enhance_image_quality(image):
    """
    Automatically enhance image quality
    
    Args:
        image: PIL Image object
    
    Returns:
        Enhanced PIL Image
    """
    try:
        # Auto contrast
        image = ImageOps.autocontrast(image, cutoff=1)
        
        # Slight sharpness enhancement
        enhancer = ImageEnhance.Sharpness(image)
        image = enhancer.enhance(1.2)
        
        # Slight color enhancement
        enhancer = ImageEnhance.Color(image)
        image = enhancer.enhance(1.1)
        
        return image
    except Exception as e:
        print(f"Enhancement error: {e}")
        return image

def apply_filter(image, filter_name):
    """
    Apply predefined filter to image
    
    Args:
        image: PIL Image object
        filter_name: Name of filter to apply
    
    Returns:
        Filtered PIL Image
    """
    try:
        if filter_name not in FILTER_CONFIGS:
            return image
        
        config = FILTER_CONFIGS[filter_name]
        result = image.copy()
        
        # Apply color adjustment
        if config["color"] > 0:
            enhancer = ImageEnhance.Color(result)
            result = enhancer.enhance(config["color"])
        else:
            # Convert to grayscale for B&W
            result = result.convert('L').convert('RGB')
        
        # Apply contrast
        enhancer = ImageEnhance.Contrast(result)
        result = enhancer.enhance(config["contrast"])
        
        # Apply brightness
        enhancer = ImageEnhance.Brightness(result)
        result = enhancer.enhance(config["brightness"])
        
        # Apply sharpness
        enhancer = ImageEnhance.Sharpness(result)
        result = enhancer.enhance(config["sharpness"])
        
        # Special filters
        if filter_name == "vintage":
            result = apply_sepia(result)
        elif filter_name == "soft":
            result = result.filter(ImageFilter.GaussianBlur(radius=0.5))
        
        return result
    except Exception as e:
        print(f"Filter error: {e}")
        return image

def apply_sepia(image):
    """Apply sepia tone effect"""
    try:
        img_array = np.array(image)
        sepia_filter = np.array([
            [0.393, 0.769, 0.189],
            [0.349, 0.686, 0.168],
            [0.272, 0.534, 0.131]
        ])
        sepia_img = cv2.transform(img_array, sepia_filter)
        sepia_img = np.clip(sepia_img, 0, 255).astype(np.uint8)
        return Image.fromarray(sepia_img)
    except Exception as e:
        print(f"Sepia error: {e}")
        return image

def smart_crop_and_resize(image, target_size, crop_mode="center"):
    """
    Intelligently crop and resize image to target dimensions
    
    Args:
        image: PIL Image object
        target_size: Tuple of (width, height)
        crop_mode: "center", "top", "bottom"
    
    Returns:
        Resized PIL Image
    """
    try:
        target_width, target_height = target_size
        img_ratio = image.width / image.height
        target_ratio = target_width / target_height
        
        if img_ratio > target_ratio:
            # Image is wider - crop width
            new_width = int(image.height * target_ratio)
            if crop_mode == "center":
                left = (image.width - new_width) // 2
            elif crop_mode == "left":
                left = 0
            else:  # right
                left = image.width - new_width
            image = image.crop((left, 0, left + new_width, image.height))
        else:
            # Image is taller - crop height
            new_height = int(image.width / target_ratio)
            if crop_mode == "center":
                top = (image.height - new_height) // 2
            elif crop_mode == "top":
                top = 0
            else:  # bottom
                top = image.height - new_height
            image = image.crop((0, top, image.width, top + new_height))
        
        # Resize with high quality
        return image.resize(target_size, Image.LANCZOS)
    except Exception as e:
        print(f"Crop/resize error: {e}")
        return image.resize(target_size, Image.LANCZOS)

def optimize_for_web(image, quality=85):
    """Optimize image for web delivery"""
    try:
        # Convert to RGB if needed
        if image.mode in ('RGBA', 'LA', 'P'):
            background = Image.new('RGB', image.size, (255, 255, 255))
            if image.mode == 'P':
                image = image.convert('RGBA')
            background.paste(image, mask=image.split()[-1] if image.mode == 'RGBA' else None)
            image = background
        elif image.mode != 'RGB':
            image = image.convert('RGB')
        
        return image
    except Exception as e:
        print(f"Optimization error: {e}")
        return image

def image_to_base64(image, format="JPEG", quality=90):
    """Convert PIL Image to base64 string"""
    try:
        buffer = io.BytesIO()
        image.save(buffer, format=format, quality=quality, optimize=True)
        return base64.b64encode(buffer.getvalue()).decode()
    except Exception as e:
        print(f"Base64 conversion error: {e}")
        return None

def base64_to_image(base64_string):
    """Convert base64 string to PIL Image"""
    try:
        # Remove data URL prefix if present
        if ',' in base64_string:
            base64_string = base64_string.split(',')[1]
        
        img_data = base64.b64decode(base64_string)
        return Image.open(io.BytesIO(img_data))
    except Exception as e:
        print(f"Base64 decode error: {e}")
        return None

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "image-processing-agent"
    }), 200

@app.route('/process-images', methods=['POST'])
def process_images():
    """
    Main endpoint for image processing
    
    Request Body:
        - images: List of base64 encoded images or URLs
        - platform: Target platform (default: instagram_post)
        - filters: List of filter names to apply
        - enhance: Boolean to apply auto-enhancement
        - cropMode: "center", "top", "bottom"
    
    Returns:
        JSON with processed images
    """
    try:
        data = request.json or {}
        
        images_data = data.get('images', [])
        platform = data.get('platform', 'instagram_post')
        requested_filters = data.get('filters', ['enhanced', 'vibrant', 'professional'])
        auto_enhance = data.get('enhance', True)
        crop_mode = data.get('cropMode', 'center')
        
        if not images_data:
            return jsonify({
                "success": False,
                "error": "No images provided"
            }), 400
        
        if platform not in PLATFORM_SIZES:
            platform = 'instagram_post'
        
        target_size = PLATFORM_SIZES[platform]
        processed_images = []
        
        for idx, img_data in enumerate(images_data):
            try:
                # Decode image
                image = base64_to_image(img_data)
                if not image:
                    continue
                
                # Convert to RGB and optimize
                image = optimize_for_web(image)
                
                # Create variants
                variants = []
                
                # Enhanced version (original with auto-enhancement)
                if auto_enhance:
                    enhanced = enhance_image_quality(image.copy())
                    enhanced = smart_crop_and_resize(enhanced, target_size, crop_mode)
                    enhanced_b64 = image_to_base64(enhanced)
                    
                    if enhanced_b64:
                        variants.append({
                            "variant": "enhanced",
                            "name": "Enhanced Original",
                            "url": f"data:image/jpeg;base64,{enhanced_b64}",
                            "width": target_size[0],
                            "height": target_size[1]
                        })
                
                # Apply requested filters
                for filter_name in requested_filters:
                    if filter_name == "enhanced":
                        continue  # Already added
                    
                    if filter_name in FILTER_CONFIGS:
                        filtered = apply_filter(image.copy(), filter_name)
                        filtered = smart_crop_and_resize(filtered, target_size, crop_mode)
                        filtered_b64 = image_to_base64(filtered)
                        
                        if filtered_b64:
                            variants.append({
                                "variant": filter_name,
                                "name": filter_name.replace('_', ' ').title(),
                                "url": f"data:image/jpeg;base64,{filtered_b64}",
                                "width": target_size[0],
                                "height": target_size[1]
                            })
                
                processed_images.append({
                    "id": idx,
                    "platform": platform,
                    "dimensions": {"width": target_size[0], "height": target_size[1]},
                    "variants": variants,
                    "variantCount": len(variants)
                })
                
            except Exception as e:
                print(f"Error processing image {idx}: {e}")
                continue
        
        return jsonify({
            "success": True,
            "platform": platform,
            "targetSize": {"width": target_size[0], "height": target_size[1]},
            "processedImages": processed_images,
            "count": len(processed_images)
        }), 200
    
    except Exception as e:
        print(f"Process images error: {str(e)}")
        return jsonify({
            "success": False,
            "error": f"Failed to process images: {str(e)}"
        }), 500

@app.route('/platforms', methods=['GET'])
def get_platforms():
    """Get list of available platforms and their sizes"""
    platforms = [
        {"name": name, "width": size[0], "height": size[1]}
        for name, size in PLATFORM_SIZES.items()
    ]
    return jsonify({
        "success": True,
        "platforms": platforms
    }), 200

@app.route('/filters', methods=['GET'])
def get_filters():
    """Get list of available filters"""
    filters = [
        {"name": name, "config": config}
        for name, config in FILTER_CONFIGS.items()
    ]
    return jsonify({
        "success": True,
        "filters": filters
    }), 200

if __name__ == '__main__':
    print("Image Processing Agent running on http://0.0.0.0:5001")
    app.run(host='0.0.0.0', port=5001, debug=True)
