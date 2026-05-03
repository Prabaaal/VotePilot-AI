import os
from dotenv import load_dotenv

load_dotenv()

PROJECT_ID = os.environ.get("GOOGLE_CLOUD_PROJECT", "votepilot-ai")
LOCATION = os.environ.get("GOOGLE_CLOUD_LOCATION", "asia-south1")

# Vertex AI Search / Datastore Constants
DATASTORE_ID = os.environ.get("DATASTORE_ID", "eci-documents")
DATASTORE_LOCATION = os.environ.get("DATASTORE_LOCATION", "global")
