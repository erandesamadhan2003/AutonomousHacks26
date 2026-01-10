import os
import argparse
from dotenv import load_dotenv

from agents.optimizer import InstagramCaptionOptimizer
from agents.content import InstagramContentCreationAgent


def main():
    # Load .env from agents directory
    load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

    parser = argparse.ArgumentParser(description="Instagram Agent Pipeline")
    parser.add_argument("--image", required=True, help="Path to the image")
    parser.add_argument("--intent", required=True, help="User intent / description")
    parser.add_argument("--tone", default="aesthetic", help="Brand tone")
    args = parser.parse_args()

    # 🔑 Gemini API key (Caption + Hashtags)
    gemini_api_key = os.environ.get("GEMINI_API_KEY")
    if not gemini_api_key:
        raise RuntimeError("GEMINI_API_KEY missing. Set it in agents/.env")

    # 🔑 DeepAI API key (Content Creation Agent)
    deepai_api_key = os.environ.get("API_KEY")
    if not deepai_api_key:
        raise RuntimeError("API_KEY (DeepAI) missing. Set it in agents/.env")

    # ===== 1️⃣ Content Creation Agent =====
    content_agent = InstagramContentCreationAgent(deepai_api_key)
    content_idea = content_agent.generate(
        image_path=args.image,
        description=args.intent,
        brand_tone=args.tone,
    )

    print("\n=== CONTENT CREATION AGENT OUTPUT ===\n")
    print(content_idea)

    # ===== 2️⃣ Caption + Hashtag Agent =====
    optimizer = InstagramCaptionOptimizer(gemini_api_key=gemini_api_key)
    caption_output = optimizer.optimize(args.image, args.intent)

    print("\n=== CAPTION & HASHTAG AGENT OUTPUT ===\n")
    print(caption_output)


if __name__ == "__main__":
    main()
