from google.cloud import discoveryengine_v1beta as discoveryengine
from typing import Dict, Any
from ..config import PROJECT_ID, DATASTORE_ID, DATASTORE_LOCATION

def search_eci_documents(query: str) -> Dict[str, Any]:
    """
    Search the Vertex AI Search Datastore for ECI documents.
    """
    # Note: Requires Google Cloud credentials to be configured
    # e.g., via GOOGLE_APPLICATION_CREDENTIALS environment variable
    
    try:
        client = discoveryengine.SearchServiceClient()
        serving_config = client.serving_config_path(
            project=PROJECT_ID,
            location=DATASTORE_LOCATION,
            data_store=DATASTORE_ID,
            serving_config="default_config",
        )

        request = discoveryengine.SearchRequest(
            serving_config=serving_config,
            query=query,
            page_size=3,
        )

        response = client.search(request)
        
        results = []
        for result in response.results:
            results.append({
                "document": result.document.name,
                "content": result.document.derived_struct_data.get("extractive_answers", [{"content": ""}])[0].get("content", ""),
            })
            
        return {
            "retrieved_context": results,
            "source_document": results[0]["document"] if results else None,
            "found": len(results) > 0
        }
    except Exception as e:
        print(f"Error searching Vertex AI: {e}")
        return {"retrieved_context": [], "source_document": None, "found": False}
