import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

import pytest
from config import PROJECT_ID, LOCATION, MODEL, DATASTORE_ID, DATASTORE_RESOURCE


def test_project_id_is_set():
    assert isinstance(PROJECT_ID, str)
    assert len(PROJECT_ID) > 0
    assert PROJECT_ID != "your-project-id"


def test_location_is_valid():
    valid_locations = ["us-central1", "asia-south1", "europe-west1", "global"]
    assert LOCATION in valid_locations


def test_model_is_gemini():
    assert "gemini" in MODEL.lower()


def test_datastore_id_is_set():
    assert isinstance(DATASTORE_ID, str)
    assert len(DATASTORE_ID) > 0


def test_datastore_resource_contains_project():
    assert PROJECT_ID in DATASTORE_RESOURCE


def test_datastore_resource_format():
    assert "projects/" in DATASTORE_RESOURCE
    assert "dataStores/" in DATASTORE_RESOURCE
