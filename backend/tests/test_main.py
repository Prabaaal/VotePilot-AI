import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock, AsyncMock
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from main import app

client = TestClient(app)


def test_health_endpoint_returns_200():
    response = client.get("/health")
    assert response.status_code == 200


def test_health_endpoint_returns_ok_status():
    response = client.get("/health")
    data = response.json()
    assert data["status"] == "ok"


def test_health_endpoint_returns_service_name():
    response = client.get("/health")
    data = response.json()
    assert "service" in data
    assert "votepilot" in data["service"].lower()


def test_ask_endpoint_exists():
    # Just check it's not a 404 — actual call would need Cloud Run
    response = client.post("/ask", json={})
    assert response.status_code != 404


def test_mythbuster_endpoint_exists():
    response = client.post("/mythbuster", json={})
    assert response.status_code != 404
