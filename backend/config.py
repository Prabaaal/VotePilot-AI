# backend/config.py
import os

PROJECT_ID = os.environ.get("GOOGLE_CLOUD_PROJECT", "votepilot-ai")
LOCATION = os.environ.get("GOOGLE_CLOUD_LOCATION", "asia-south1")
DATASTORE_ID = os.environ.get("DATASTORE_ID", "eci-documents_1777829976236")

# Use Vertex AI via ADC (Cloud Run service account) — no API key needed
# This must be set before any google-adk or google-genai imports
os.environ.setdefault("GOOGLE_GENAI_USE_VERTEXAI", "true")
os.environ.setdefault("GOOGLE_CLOUD_PROJECT", PROJECT_ID)
os.environ.setdefault("GOOGLE_CLOUD_LOCATION", LOCATION)

# Model — Vertex AI format (no "models/" prefix needed for gemini-1.5-flash)
MODEL = "gemini-1.5-flash"

# Optional local key file — only used for local development
KEY_FILE = "gcp_key.json"
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
_key_path = os.path.join(CURRENT_DIR, KEY_FILE)
if os.path.exists(_key_path):
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = _key_path
    print(f"[config] Using service account key: {_key_path}")
else:
    print("[config] No gcp_key.json — using Cloud Run ADC / GOOGLE_GENAI_USE_VERTEXAI")

# Full datastore resource name
DATASTORE_RESOURCE = (
    f"projects/{PROJECT_ID}/locations/global"
    f"/collections/default_collection"
    f"/dataStores/{DATASTORE_ID}"
)
