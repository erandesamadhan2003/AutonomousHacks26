import os
import argparse
from dotenv import load_dotenv

from agents.optimizer import InstagramCaptionOptimizer


def main():
    # Load .env from agents directory
    load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

    parser = argparse.ArgumentParser(description="Instagram Caption & Hashtag Optimizer")
    parser.add_argument("--image", required=True, help="Path to the image")
    parser.add_argument("--intent", required=True, help="User intent / description")
    args = parser.parse_args()

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY missing. Set it in agents/.env")

    optimizer = InstagramCaptionOptimizer(gemini_api_key=api_key)
    output = optimizer.optimize(args.image, args.intent)
    print(output)


if __name__ == "__main__":
    main()
