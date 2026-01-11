import google.generativeai as genai
from PIL import Image
import re


class InstagramCaptionOptimizer:
    def __init__(self, gemini_api_key):
        genai.configure(api_key=gemini_api_key)
        # Try to use available models with correct names
        self.available_models = [
            'models/gemini-2.5-flash',
            'models/gemini-2.0-flash',
            'models/gemini-flash-latest',
            'models/gemini-2.5-pro',
        ]
        self.model = None
        self._init_model()

    def _init_model(self):
        """Initialize the first available model"""
        for model_name in self.available_models:
            try:
                self.model = genai.GenerativeModel(model_name)
                print(f"✓ Successfully initialized model: {model_name}")
                return
            except Exception as e:
                print(f"✗ Failed to initialize {model_name}: {str(e)[:50]}")
                continue

        print("⚠️  No vision models available, will use fallback captions")

    def optimize(self, image_path, intent):
        """
        Optimize caption for Instagram using Gemini Vision

        Args:
            image_path: Path to the image file
            intent: User's intended message/context

        Returns:
            dict with 'caption' and 'hashtags'
        """
        try:
            # Open and validate image
            try:
                img = Image.open(image_path)
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                fixed_path = image_path.rsplit('.', 1)[0] + '_fixed.jpg'
                img.save(fixed_path, 'JPEG', quality=95)
                img_to_use = Image.open(fixed_path)
            except Exception as e:
                raise Exception(f"Image processing failed: {str(e)}")

            # Create prompt
            prompt = f"""
Analyze this image and create an engaging Instagram caption based on the following intent:
"{intent}"

Requirements:
1. Create a captivating caption (2-3 sentences) that matches the intent
2. Use emojis appropriately to enhance engagement
3. Make it authentic and relatable
4. Suggest 5-8 relevant hashtags

Format your response EXACTLY as:
CAPTION: [your caption here]
HASHTAGS: [comma-separated hashtags without #]
"""

            # Generate content with image
            if self.model:
                try:
                    response = self.model.generate_content([prompt, img_to_use])
                    response_text = response.text
                except Exception as e:
                    error_str = str(e)
                    print(f"⚠️  Model generation failed: {error_str[:100]}")
                    if '429' in error_str or 'RESOURCE_EXHAUSTED' in error_str or 'quota' in error_str.lower():
                        print(f"Using fallback caption generation")
                        response_text = self._generate_fallback_caption(intent)
                    else:
                        raise
            else:
                print(f"No model available, using fallback caption")
                response_text = self._generate_fallback_caption(intent)

            # Parse response
            caption = ""
            hashtags = []

            # Extract caption
            caption_match = re.search(r'CAPTION:\s*(.+?)(?=HASHTAGS:|$)', response_text, re.DOTALL | re.IGNORECASE)
            if caption_match:
                caption = caption_match.group(1).strip()

            # Extract hashtags
            hashtags_match = re.search(r'HASHTAGS:\s*(.+?)$', response_text, re.DOTALL | re.IGNORECASE)
            if hashtags_match:
                hashtag_text = hashtags_match.group(1).strip()
                hashtags = [tag.strip().lstrip('#') for tag in hashtag_text.split(',')]
                hashtags = [f"#{tag}" for tag in hashtags if tag]

            # Fallback if parsing fails
            if not caption:
                caption = response_text.strip()
                hashtags = re.findall(r'#\w+', response_text)

            return {
                "caption": caption,
                "hashtags": hashtags[:8]
            }

        except Exception as e:
            # Last resort: return fallback caption
            print(f"Error in optimize: {str(e)}")
            result = self._parse_fallback(self._generate_fallback_caption(intent))
            return result

    def _generate_fallback_caption(self, intent):
        """Generate a basic caption when API is unavailable"""
        words = intent.lower().split()

        caption = f"✨ {intent.capitalize()}! "
        caption += "Creating unforgettable moments and sharing them with you. 📸 "

        keywords = ['instagram', 'photography', 'lifestyle', 'moments', 'inspiration']
        for word in words[:3]:
            if len(word) > 3 and word.isalpha():
                keywords.append(word)

        hashtags_text = ', '.join(keywords[:8])

        return f"CAPTION: {caption}\nHASHTAGS: {hashtags_text}"

    def _parse_fallback(self, text):
        """Parse fallback caption text"""
        caption = ""
        hashtags = []

        caption_match = re.search(r'CAPTION:\s*(.+?)(?=HASHTAGS:|$)', text, re.DOTALL | re.IGNORECASE)
        if caption_match:
            caption = caption_match.group(1).strip()

        hashtags_match = re.search(r'HASHTAGS:\s*(.+?)$', text, re.DOTALL | re.IGNORECASE)
        if hashtags_match:
            hashtag_text = hashtags_match.group(1).strip()
            hashtags = [f"#{tag.strip()}" for tag in hashtag_text.split(',') if tag.strip()]

        return {
            "caption": caption or "✨ Check out this amazing moment!",
            "hashtags": hashtags[:8]
        }
