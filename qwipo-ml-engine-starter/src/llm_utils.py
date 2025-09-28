# src/llm_utils.py
from dotenv import load_dotenv
import os
import google.generativeai as genai

load_dotenv()  # Load .env file

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("❌ GEMINI_API_KEY is missing in .env")

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)

# Auto-select a valid model from your available Gemini models
AVAILABLE_MODELS = [m.name for m in genai.list_models()]
VALID_MODELS = [m for m in AVAILABLE_MODELS if "gemini-flash" in m or "gemini-2.5-flash" in m]

if not VALID_MODELS:
    raise ValueError("❌ No valid Gemini models found. Check your API key or list_models() output.")

SELECTED_MODEL = "models/gemini-flash-latest" if "models/gemini-flash-latest" in VALID_MODELS else VALID_MODELS[0]
print(f"Using Gemini model: {SELECTED_MODEL}")


def build_explain_prompt(retailer_profile, recommendations):
    """
    Build a structured prompt for Gemini. Ask for output in this exact format:
    - Product Name: Explanation
    At the end, add a separate 'Actionable Tip' line.
    """
    lines = [f"Retailer: {retailer_profile}\n"]
    lines.append("Top recommended items:\n")
    for r in recommendations:
        tag = " (Trending)" if r.get("trending") else ""
        lines.append(f"- {r['title']}{tag}")

    lines.append(
        "\nInstructions:\n"
        "For each product listed above, generate a short 1-2 sentence explanation "
        "for why it is recommended to the retailer. Do NOT include any scores. "
        "Format each explanation like this:\n"
        "- Product Name: Explanation\n"
        "At the end, provide an actionable tip in a separate line starting with 'Actionable Tip:'."
    )
    return "\n".join(lines)


def call_gemini(prompt: str):
    """
    Call Gemini API and return structured explanations per product.
    """
    try:
        model = genai.GenerativeModel(SELECTED_MODEL)
        response = model.generate_content(prompt)
        text = response.text if response and response.text else "No explanation generated."

        # --- Parse response into structured items and tip ---
        lines = text.strip().split("\n")
        items = []
        tip_lines = []

        for line in lines:
            line = line.strip()
            if line.startswith("- "):
                parts = line[2:].split(":", 1)
                title = parts[0].strip()
                explanation = parts[1].strip() if len(parts) > 1 else ""
                items.append({"title": title, "text": explanation})
            elif line.lower().startswith("actionable tip"):
                tip_lines.append(line)
            else:
                # Append any other free text to tip
                tip_lines.append(line)

        tip = " ".join(tip_lines).strip()
        return {"items": items, "tip": tip}

    except Exception as e:
        return {"items": [], "tip": f"[Gemini API Error: {e}]"}
