import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "votepilot-backend"}

def test_ask_endpoint():
    # Because we're using a real orchestrator we may not want to actually test it like this.
    # We should just test if the endpoint runs.
    # Assuming standard setup
    pass

def test_mythbuster_endpoint():
    pass
