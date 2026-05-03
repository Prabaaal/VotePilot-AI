# backend/agents/rag_agent.py
from google.cloud import discoveryengine_v1beta as discoveryengine
from config import DATASTORE_RESOURCE, PROJECT_ID, LOCATION

def search_eci_docs(query: str):
    """
    Queries the ECI PDF Data Store and returns the most relevant snippets.
    """
    # 1. Initialize the client
    # It automatically uses GOOGLE_APPLICATION_CREDENTIALS from your config.py
    client = discoveryengine.SearchServiceClient()

    # 2. Define the 'Serving Config' path
    # This tells Google WHICH search engine settings to use within your datastore
    serving_config = f"{DATASTORE_RESOURCE}/servingConfigs/default_search"

    # 3. Build the search request
    request = discoveryengine.SearchRequest(
        serving_config=serving_config,
        query=query,
        page_size=5, # Number of PDF snippets to retrieve
        content_search_spec=discoveryengine.SearchRequest.ContentSearchSpec(
            # This enables "extractive segments" (actual sentences from your PDFs)
            extractive_content_spec=discoveryengine.SearchRequest.ContentSearchSpec.ExtractiveContentSpec(
                max_extractive_answer_count=1
            ),
            # This enables the built-in summary (optional, but very helpful)
            summary_spec=discoveryengine.SearchRequest.ContentSearchSpec.SummarySpec(
                summary_result_count=5,
                include_citations=True,
            ),
        ),
    )

    # 4. Execute the search
    response = client.search(request)

    # 5. Extract the summary text
    # This is the "AI Answer" based on your 7 PDFs
    if response.summary and response.summary.summary_text:
        return response.summary.summary_text
    
    return "I couldn't find a specific answer in the election documents."

# Optional: Add a test block at the bottom
if __name__ == "__main__":
    test_query = "What are the rules for social media campaigning?"
    print(f"Testing RAG with query: {test_query}")
    answer = search_eci_docs(test_query)
    print(f"\nResult:\n{answer}")
import vertexai
from vertexai.preview import reasoning_engines
from google.cloud import discoveryengine_v1 as discoveryengine
from config import PROJECT_ID, LOCATION, DATASTORE_ID, DATASTORE_RESOURCE, MODEL
import json

# Initialize Vertex AI once
vertexai.init(project=PROJECT_ID, location=LOCATION)


def search_eci_documents(query: str) -> dict:
    """
    Searches official ECI (Election Commission of India) documents
    for information about voting procedures, voter rights, EVM usage,
    EPIC cards, Model Code of Conduct, and election processes.
    Use this for any factual question about how elections work in India.
    Returns the answer and the source document name.
    """
    try:
        client = discoveryengine.SearchServiceClient()

        serving_config = (
            f"projects/{PROJECT_ID}/locations/global"
            f"/collections/default_collection"
            f"/dataStores/{DATASTORE_ID}"
            f"/servingConfigs/default_config"
        )

        request = discoveryengine.SearchRequest(
            serving_config=serving_config,
            query=query,
            page_size=3,                    # top 3 most relevant chunks
            query_expansion_spec=discoveryengine.SearchRequest.QueryExpansionSpec(
                condition=discoveryengine.SearchRequest.QueryExpansionSpec.Condition.AUTO
            ),
            spell_correction_spec=discoveryengine.SearchRequest.SpellCorrectionSpec(
                mode=discoveryengine.SearchRequest.SpellCorrectionSpec.Mode.AUTO
            ),
        )

        response = client.search(request)

        # Extract text chunks from results
        chunks = []
        source = ""
        for result in response.results:
            doc = result.document
            if doc.derived_struct_data:
                data = dict(doc.derived_struct_data)
                snippets = data.get("snippets", [])
                for snippet in snippets:
                    if snippet.get("snippet"):
                        chunks.append(snippet["snippet"])
                if not source and data.get("title"):
                    source = data["title"]

        retrieved_context = " ".join(chunks) if chunks else ""

        return {
            "retrieved_context": retrieved_context,
            "source_document": source or "ECI Official Documents",
            "found": bool(retrieved_context)
        }

    except Exception as e:
        return {
            "retrieved_context": "",
            "source_document": "",
            "found": False,
            "error": str(e)
        }


# The RAG Agent — wraps the search tool with a Gemini model
from google.adk.agents import Agent

rag_agent = Agent(
    model=MODEL,
    name="rag_agent",
    description=(
        "Answers factual questions about Indian election procedures, "
        "voter rights, EVM usage, EPIC cards, and voting processes "
        "by searching official ECI documents."
    ),
    instruction=(
        "You are a civic education assistant. When given a question, "
        "use the search_eci_documents tool to find relevant information "
        "from official ECI documents. Base your answer strictly on what "
        "the documents say. If the documents don't contain relevant info, "
        "say so clearly. Always return the source document name."
    ),
    tools=[search_eci_documents],
)
