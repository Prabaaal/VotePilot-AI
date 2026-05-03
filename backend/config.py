# backend/config.py
import os

PROJECT_ID = "votepilot-ai"
LOCATION = "asia-south1"
DATASTORE_ID = "eci-documents_1777829976236"
MODEL = "gemini-1.5-flash"

KEY_FILE = "gcp_key.json" 
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
GOOGLE_APPLICATION_CREDENTIALS = os.path.join(CURRENT_DIR, KEY_FILE)

if os.path.exists(GOOGLE_APPLICATION_CREDENTIALS):
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = GOOGLE_APPLICATION_CREDENTIALS
else:
    print("Warning: gcp_key.json not found. Using default application credentials.")

# Full datastore resource name — ADK needs this format
DATASTORE_RESOURCE = (
    f"projects/{PROJECT_ID}/locations/global"
    f"/collections/default_collection"
    f"/dataStores/{DATASTORE_ID}"
)
