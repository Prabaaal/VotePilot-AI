from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os

from agents.rag_agent import search_eci_documents
from agents.search_agent import search_live_election_data
from agents.formatter_agent import format_response

app = FastAPI(title="VotePilot AI Orchestrator")

class AskRequest(BaseModel):
    question: str
    explainLevel: str = "standard"
    language: str = "english"

class AskResponse(BaseModel):
    answer: str
    whyItMatters: str
    whatYouShouldDo: str
    keepInMind: str
    source: str

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "votepilot-backend"}

@app.post("/api/ask", response_model=AskResponse)
async def ask_question(request: AskRequest):
    # 1. RAG Agent searches ECI documents
    rag_result = search_eci_documents(request.question)
    
    if rag_result.get("found"):
        context = str(rag_result["retrieved_context"])
        source = f"ECI Document: {rag_result['source_document']}"
    else:
        # 2. Search Agent fallback via Google Search Grounding
        search_result = search_live_election_data(request.question)
        context = search_result.get("raw_answer", "")
        source = search_result.get("source_url", "VotePilot AI Knowledge")
        
    # 3. Formatter Agent applies language and explain level
    final_output = format_response(
        context=context,
        question=request.question,
        explain_level=request.explainLevel,
        language=request.language,
        source=source
    )
    
    return AskResponse(**final_output)

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
