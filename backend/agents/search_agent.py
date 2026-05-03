from google.cloud import aiplatform
from vertexai.generative_models import GenerativeModel, Tool, grounding
import vertexai
from ..config import PROJECT_ID, LOCATION

def search_live_election_data(query: str) -> dict:
    try:
        vertexai.init(project=PROJECT_ID, location=LOCATION)
        tool = Tool.from_google_search_retrieval(grounding.GoogleSearchRetrieval())
        model = GenerativeModel("gemini-1.5-flash-001", tools=[tool])
        response = model.generate_content(f"Answer this question about Indian elections: {query}")
        
        source = "Google Search"
        if response.candidates and response.candidates[0].grounding_metadata:
            metadata = response.candidates[0].grounding_metadata
            if metadata.web_search_queries:
                source = f"Google Search: {metadata.web_search_queries[0]}"
                
        return {
            "raw_answer": response.text,
            "source_url": source,
            "found": bool(response.text)
        }
    except Exception as e:
        print(f"Search Agent error: {e}")
        return {"raw_answer": "", "source_url": "VotePilot AI Knowledge Base", "found": False}
