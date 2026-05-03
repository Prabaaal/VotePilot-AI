import pytest
from unittest.mock import patch, MagicMock
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))


def test_search_eci_documents_returns_dict():
    with patch('agents.rag_agent.discoveryengine.SearchServiceClient') as mock_client:
        mock_response = MagicMock()
        mock_response.results = []
        mock_client.return_value.search.return_value = mock_response

        from agents.rag_agent import search_eci_documents
        result = search_eci_documents("What is EVM?")

        assert isinstance(result, dict)
        assert "retrieved_context" in result
        assert "source_document" in result
        assert "found" in result


def test_search_eci_documents_handles_exception():
    with patch('agents.rag_agent.discoveryengine.SearchServiceClient') as mock_client:
        mock_client.return_value.search.side_effect = Exception("Network error")

        from agents.rag_agent import search_eci_documents
        result = search_eci_documents("test query")

        assert isinstance(result, dict)
        assert result["found"] == False
        assert "error" in result


def test_search_eci_documents_returns_not_found_for_empty_results():
    with patch('agents.rag_agent.discoveryengine.SearchServiceClient') as mock_client:
        mock_response = MagicMock()
        mock_response.results = []
        mock_client.return_value.search.return_value = mock_response

        from agents.rag_agent import search_eci_documents
        result = search_eci_documents("completely unrelated query xyz")

        assert result["found"] == False
        assert result["retrieved_context"] == ""
