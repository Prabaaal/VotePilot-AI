# backend/agents/search_agent.py

import vertexai
from vertexai.generative_models import GenerativeModel, Tool, grounding
from config import PROJECT_ID, LOCATION, MODEL

vertexai.init(project=PROJECT_ID, location=LOCATION)


def search_live_election_data(query: str) -> dict:
    """
    Searches the live web for current Indian election information including:
    upcoming election schedules, recent election results, ECI announcements,
    and election news. Use this for any question about current or recent
    elections that requires up-to-date information.
    Returns the answer and the source URL.
    """
    try:
        model = GenerativeModel(MODEL)

        # Vertex AI grounding with Google Search
        google_search_tool = Tool.from_google_search_retrieval(
            grounding.GoogleSearchRetrieval()
        )

        response = model.generate_content(
            f"Answer this question about Indian elections using current information: {query}",
            tools=[google_search_tool],
            generation_config={"temperature": 0.1}
        )

        # Extract grounding metadata for source URL
        source_url = ""
        if response.candidates:
            candidate = response.candidates[0]
            if hasattr(candidate, "grounding_metadata") and candidate.grounding_metadata:
                chunks = candidate.grounding_metadata.grounding_chunks
                if chunks:
                    source_url = chunks[0].web.uri if chunks[0].web else ""

        return {
            "raw_answer": response.text,
            "source_url": source_url,
            "found": bool(response.text)
        }

    except Exception as e:
        return {
            "raw_answer": "",
            "source_url": "",
            "found": False,
            "error": str(e)
        }


from google.adk.agents import Agent

search_agent = Agent(
    model=MODEL,
    name="search_agent",
    description=(
        "Retrieves live, current information about Indian elections "
        "including upcoming schedules, recent results, and ECI news "
        "using Google Search grounding."
    ),
    instruction=(
        "You are a live election data assistant. Use the search_live_election_data "
        "tool to find current information about elections. Always include "
        "the source URL in your response so users can verify the information."
    ),
    tools=[search_live_election_data],
)
