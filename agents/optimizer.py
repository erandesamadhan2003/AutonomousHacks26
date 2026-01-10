from typing import List
from google import genai
import mimetypes
import json


class InstagramCaptionOptimizer:
    def __init__(self, gemini_api_key: str):
        self.client = genai.Client(api_key=gemini_api_key)
        # Use a vision-capable model from the available list
        self.model_name = "models/gemini-2.5-flash"

    def analyze_image(self, image_path: str) -> dict:
        with open(image_path, "rb") as img_file:
            img_bytes = img_file.read()

        prompt = (
            "Describe the subject and mood of this image for Instagram content optimization. "
            "Return only a JSON object with 'subject' and 'mood'."
        )

        mime_type, _ = mimetypes.guess_type(image_path)
        blob = genai.types.Blob(mime_type=mime_type or "image/png", data=img_bytes)
        image_part = genai.types.Part(inline_data=blob)

        response = self.client.models.generate_content(
            model=self.model_name,
            contents=[prompt, image_part]
        )

        try:
            return json.loads(response.text)
        except Exception:
            return {"subject": "photo", "mood": "neutral"}

    def decide_strategy(self, intent: str, image_analysis: dict) -> str:
        if any(q in intent.lower() for q in ["?", "how", "what", "why", "who"]):
            return "question"
        if "story" in intent.lower():
            return "story"
        if image_analysis.get("mood") in ["happy", "excited", "fun"]:
            return "hook"
        return "minimal"

    def generate_caption(self, intent: str, image_analysis: dict, strategy: str) -> str:
        prompt = (
            "You are an Instagram Caption Optimization Agent. "
            "Your goal is to maximize reach, saves, comments, and shares. "
            "Instagram only. Sound human, not AI. "
            "No corporate or LinkedIn tone. No hashtag stuffing. "
            "No explanations. Return only the caption.\n\n"
            f"Subject: {image_analysis.get('subject')}\n"
            f"Mood: {image_analysis.get('mood')}\n"
            f"Intent: {intent}\n"
            f"Strategy: {strategy}"
        )

        response = self.client.models.generate_content(
            model=self.model_name,
            contents=prompt
        )
        return response.text.strip()

    def generate_hashtags(self, image_analysis: dict, intent: str) -> List[str]:
        prompt = (
            "Generate 8–15 Instagram hashtags (broad + niche). "
            "Instagram only. No explanations. Return only hashtags.\n\n"
            f"Subject: {image_analysis.get('subject')}\n"
            f"Mood: {image_analysis.get('mood')}\n"
            f"Intent: {intent}"
        )

        response = self.client.models.generate_content(
            model=self.model_name,
            contents=prompt
        )

        return [t for t in response.text.split() if t.startswith("#")][:15]

    def optimize(self, image_path: str, intent: str) -> str:
        image_analysis = self.analyze_image(image_path)
        strategy = self.decide_strategy(intent, image_analysis)
        caption = self.generate_caption(intent, image_analysis, strategy)
        hashtags = self.generate_hashtags(image_analysis, intent)

        return f"Caption:\n{caption}\n\nHashtags:\n{' '.join(hashtags)}"
