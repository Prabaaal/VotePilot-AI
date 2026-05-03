# backend/config.py
import os

PROJECT_ID = os.environ.get("GOOGLE_CLOUD_PROJECT", "votepilot-ai")
DATASTORE_ID = os.environ.get("DATASTORE_ID", "eci-documents_1777829976236")

# ── Auth strategy ─────────────────────────────────────────────────────────────
# On Cloud Run: use GOOGLE_API_KEY for Gemini Developer API
# Locally: fall back to gcp_key.json if present
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY", "")

if GOOGLE_API_KEY:
    # Use Gemini Developer API (generativelanguage.googleapis.com)
    os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY
    # Ensure Vertex AI mode is OFF so ADK uses the API key path
    os.environ.pop("GOOGLE_GENAI_USE_VERTEXAI", None)
    print("[config] Using Gemini Developer API (GOOGLE_API_KEY)")
else:
    # Local dev: use service account key file if present
    KEY_FILE = "gcp_key.json"
    CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
    _key_path = os.path.join(CURRENT_DIR, KEY_FILE)
    if os.path.exists(_key_path):
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = _key_path
        os.environ["GOOGLE_GENAI_USE_VERTEXAI"] = "true"
        print(f"[config] Using service account key: {_key_path}")
    else:
        os.environ["GOOGLE_GENAI_USE_VERTEXAI"] = "true"
        print("[config] No API key or key file — using Cloud Run ADC")

# Model name (works with both Vertex AI and Gemini Developer API)
MODEL = "gemini-1.5-flash"

# ── Datastore ────────────────────────────────────────────────────────────────
# Discovery Engine uses global endpoint regardless of Vertex AI location
LOCATION = os.environ.get("GOOGLE_CLOUD_LOCATION", "us-central1")

DATASTORE_RESOURCE = (
    f"projects/{PROJECT_ID}/locations/global"
    f"/collections/default_collection"
    f"/dataStores/{DATASTORE_ID}"
)
