import pytest
import json
from unittest.mock import patch, MagicMock
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))


def test_formatter_returns_dict_on_valid_json():
    with patch('agents.formatter_agent.GenerativeModel') as mock_model:
        valid_response = json.dumps({
            "answer": "You need your EPIC card or one of 12 alternative IDs.",
            "whyItMatters": "Without ID you cannot vote.",
            "whatYouShouldDo": "Bring your Aadhaar or Voter ID.",
            "keepInMind": "12 alternatives are accepted.",
            "source": "ECI Handbook 2024"
        })
        mock_response = MagicMock()
        mock_response.text = valid_response
        mock_model.return_value.generate_content.return_value = mock_response

        from agents.formatter_agent import format_response
        result = format_response(
            raw_answer="You need your Voter ID.",
            explain_level="simple",
            language="english",
            source="ECI Handbook 2024"
        )

        assert isinstance(result, dict)
        assert "answer" in result
        assert "whyItMatters" in result
        assert "whatYouShouldDo" in result
        assert "keepInMind" in result


def test_formatter_fallback_on_invalid_json():
    with patch('agents.formatter_agent.GenerativeModel') as mock_model:
        mock_response = MagicMock()
        mock_response.text = "This is not valid JSON!!!"
        mock_model.return_value.generate_content.return_value = mock_response

        from agents.formatter_agent import format_response
        result = format_response(
            raw_answer="Raw answer text",
            explain_level="standard",
            language="hindi",
            source=""
        )

        assert isinstance(result, dict)
        assert "answer" in result
        # Should not raise, should gracefully fall back


def test_formatter_strips_markdown_fences():
    with patch('agents.formatter_agent.GenerativeModel') as mock_model:
        response_with_fences = """```json
{
  "answer": "Test answer",
  "whyItMatters": "Test why",
  "whatYouShouldDo": "Test what",
  "keepInMind": "Test keep",
  "source": "Test source"
}
```"""
        mock_response = MagicMock()
        mock_response.text = response_with_fences
        mock_model.return_value.generate_content.return_value = mock_response

        from agents.formatter_agent import format_response
        result = format_response(
            raw_answer="test",
            explain_level="detailed",
            language="assamese",
            source="ECI"
        )

        assert isinstance(result, dict)
        assert result.get("answer") == "Test answer"
