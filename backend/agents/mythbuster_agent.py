# backend/agents/mythbuster_agent.py

from agents.rag_agent import search_eci_documents
from agents.formatter_agent import format_response
from config import MODEL
from google.adk.agents import Agent
import json


def debunk_myth(myth_statement: str, language: str = "english") -> dict:
    """
    Takes an election-related myth statement, searches official ECI documents
    to verify or debunk it, and returns a clear fact-checked response
    with the official source cited.
    """
    # First search ECI docs for relevant info
    search_result = search_eci_documents(myth_statement)

    raw_answer = search_result.get("retrieved_context", "")
    source = search_result.get("source_document", "ECI Official Documents")

    if not raw_answer:
        raw_answer = (
            "Based on general knowledge of Indian election procedures, "
            "this claim requires verification from official ECI sources."
        )

    # Format as myth-specific response
    formatted = format_response(
        raw_answer=f"Regarding the claim: '{myth_statement}'. {raw_answer}",
        explain_level="standard",
        language=language,
        source=source
    )

    # Add verdict field
    formatted["verdict"] = "needs_verification"
    return formatted


mythbuster_agent = Agent(
    model=MODEL,
    name="mythbuster_agent",
    description=(
        "Fact-checks election-related myths and misconceptions "
        "using official ECI documents. Returns a clear verdict "
        "with official sources cited."
    ),
    instruction=(
        "You are a fact-checker for election myths. Use the debunk_myth tool "
        "to verify or debunk the given claim using official ECI documents. "
        "Be direct: say clearly whether the claim is a myth or fact."
    ),
    tools=[debunk_myth],
)
