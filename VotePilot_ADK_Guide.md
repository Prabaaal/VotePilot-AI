

---



An ADK agent is just a **Python function with a description**. You tell it what it does in plain English, give it tools, and ADK figures out when to call it. The orchestrator is just another agent that has the other agents as its tools.

That's genuinely it. The framework handles the routing logic.

---

## How ADK Works in 3 Concepts

**Concept 1 — Tool**
A Python function that does one specific thing. Fetch from Vertex AI Search, call Gemini, format a response. Each function has a docstring that ADK reads to understand what the tool does.

**Concept 2 — Agent**
An agent is a Gemini model + a list of tools + a system instruction. When you call the agent with a query, Gemini decides which tools to call, calls them, and returns a result.

**Concept 3 — Orchestrator**
Just another agent whose "tools" are the other agents. It reads the query, decides which sub-agent to call, gets the result, and returns it.

---

## Install ADK First

```bash
pip install google-adk
pip install google-cloud-aiplatform
pip install fastapi uvicorn
```

---

## Your Entire Backend Structure

```
backend/
├── main.py                  ← FastAPI app (Cloud Run entry point)
├── agents/
│   ├── __init__.py
│   ├── rag_agent.py         ← searches ECI documents
│   ├── search_agent.py      ← searches live web via grounding
│   ├── formatter_agent.py   ← applies language + explain level
│   ├── mythbuster_agent.py  ← debunks myths using ECI docs
│   └── orchestrator.py      ← routes to the right agents
├── config.py                ← all GCP constants in one place
├── prompts/
│   └── system_prompt.txt    ← base Gemini prompt
├── requirements.txt
└── Dockerfile
```

---

## Step 1 — config.py (do this first, everything imports from here)

```python
# backend/config.py

PROJECT_ID = "votepilot-ai-[your-id]"      # your GCP project ID
LOCATION = "asia-south1"                    # your region
DATASTORE_ID = "eci-documents_[your-id]"   # from Vertex AI Search console
MODEL = "gemini-2.0-flash-001"             # model to use everywhere

# Full datastore resource name — ADK needs this format
DATASTORE_RESOURCE = (
    f"projects/{PROJECT_ID}/locations/global"
    f"/collections/default_collection"
    f"/dataStores/{DATASTORE_ID}"
)
```

---

## Step 2 — RAG Agent

This agent searches your ECI document datastore and returns grounded answers.

```python
# backend/agents/rag_agent.py

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
```

---

## Step 3 — Search Agent

This agent handles live queries — election results, upcoming dates, recent news.

```python
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
```

---

## Step 4 — Formatter Agent

Takes a raw answer and transforms it based on explain level + language.

```python
# backend/agents/formatter_agent.py

import vertexai
from vertexai.generative_models import GenerativeModel
from config import PROJECT_ID, LOCATION, MODEL
import json
import re

vertexai.init(project=PROJECT_ID, location=LOCATION)

SYSTEM_PROMPT = open("prompts/system_prompt.txt").read()


def format_response(
    raw_answer: str,
    explain_level: str,
    language: str,
    source: str = ""
) -> dict:
    """
    Transforms a raw answer into a structured, user-friendly response.
    Applies the correct explanation depth (simple/standard/detailed)
    and language (english/hindi/assamese).
    Always call this last, after getting a raw answer from any other agent.
    Returns a structured JSON with answer, whyItMatters, whatYouShouldDo,
    keepInMind, and source fields.
    """
    try:
        model = GenerativeModel(
            MODEL,
            system_instruction=SYSTEM_PROMPT
        )

        user_message = f"""
explain_level: {explain_level}
language: {language}
source_document: {source}
raw_answer: {raw_answer}

Now format this into the required JSON structure.
        """.strip()

        response = model.generate_content(
            user_message,
            generation_config={"temperature": 0.2}
        )

        # Clean and parse JSON
        text = response.text.strip()
        # Remove markdown code fences if present
        text = re.sub(r"```json|```", "", text).strip()

        parsed = json.loads(text)
        return parsed

    except json.JSONDecodeError:
        # Fallback: return raw in answer field
        return {
            "answer": raw_answer,
            "whyItMatters": "",
            "whatYouShouldDo": "",
            "keepInMind": "",
            "source": source
        }
    except Exception as e:
        return {
            "answer": f"Error formatting response: {str(e)}",
            "whyItMatters": "",
            "whatYouShouldDo": "",
            "keepInMind": "",
            "source": source
        }


from google.adk.agents import Agent

formatter_agent = Agent(
    model=MODEL,
    name="formatter_agent",
    description=(
        "Formats any raw answer into a structured, user-friendly response "
        "with the correct language and explanation depth. "
        "Always the last agent called in any pipeline."
    ),
    instruction=(
        "You format answers for voters. Use the format_response tool "
        "with the provided raw_answer, explain_level, language, and source. "
        "Always call the tool — never format manually."
    ),
    tools=[format_response],
)
```

---

## Step 5 — Myth Buster Agent

```python
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
```

---

## Step 6 — Orchestrator (The Brain)

```python
# backend/agents/orchestrator.py

from google.adk.agents import Agent
from agents.rag_agent import rag_agent
from agents.search_agent import search_agent
from agents.formatter_agent import formatter_agent
from agents.mythbuster_agent import mythbuster_agent
from config import MODEL


orchestrator = Agent(
    model=MODEL,
    name="orchestrator",
    description="Main VotePilot AI orchestrator that routes voter questions to the right agents.",
    instruction="""
You are the VotePilot AI orchestrator. Your job is to answer voter questions
by routing them to the right agents and combining their outputs.

Routing rules — follow these strictly:

1. If the question is about HOW elections work, voting procedures, voter rights,
   EVM, VVPAT, EPIC cards, Model Code of Conduct, booth procedures:
   → Use rag_agent to get the answer from ECI documents

2. If the question is about CURRENT or RECENT elections — upcoming dates,
   recent results, who won, when is the next election:
   → Use search_agent to get live information

3. ALWAYS call formatter_agent last with:
   - The raw answer from whichever agent you called
   - The explain_level from the original request
   - The language from the original request
   - The source from the agent's response

4. If the request is specifically about fact-checking a myth:
   → Use mythbuster_agent directly

Never answer from your own knowledge. Always use the agents.
Always call formatter_agent as the final step.
    """,
    # Sub-agents become tools for the orchestrator
    agents=[rag_agent, search_agent, formatter_agent, mythbuster_agent],
)
```

---

## Step 7 — main.py (FastAPI entry point)

```python
# backend/main.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from agents.orchestrator import orchestrator
from agents.mythbuster_agent import mythbuster_agent
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
import uvicorn

app = FastAPI(title="VotePilot AI Backend")

# Allow requests from your Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tighten this to your Vercel URL in production
    allow_methods=["*"],
    allow_headers=["*"],
)

# ADK session service — manages conversation state
session_service = InMemorySessionService()

# ADK runners — one per agent entry point
ask_runner = Runner(
    agent=orchestrator,
    app_name="votepilot",
    session_service=session_service
)

myth_runner = Runner(
    agent=mythbuster_agent,
    app_name="votepilot",
    session_service=session_service
)


# Request models
class AskRequest(BaseModel):
    question: str
    explain_level: str = "standard"    # simple | standard | detailed
    language: str = "english"          # english | hindi | assamese
    user_profile: Optional[dict] = {}

class MythRequest(BaseModel):
    myth_statement: str
    language: str = "english"


@app.get("/health")
def health():
    return {"status": "ok", "service": "votepilot-backend"}


@app.post("/ask")
async def ask(req: AskRequest):
    try:
        # Build message with all context
        message = f"""
question: {req.question}
explain_level: {req.explain_level}
language: {req.language}
user_state: {req.user_profile.get("state", "India")}
first_time_voter: {req.user_profile.get("firstTimeVoter", True)}
        """.strip()

        # Create a session for this request
        session = await session_service.create_session(
            app_name="votepilot",
            user_id="anonymous",
        )

        # Run the orchestrator
        response_text = ""
        async for event in ask_runner.run_async(
            user_id="anonymous",
            session_id=session.id,
            new_message=message
        ):
            if event.is_final_response():
                response_text = event.content.parts[0].text
                break

        # Parse JSON response from formatter agent
        import json, re
        clean = re.sub(r"```json|```", "", response_text).strip()
        return json.loads(clean)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/mythbuster")
async def mythbuster(req: MythRequest):
    try:
        session = await session_service.create_session(
            app_name="votepilot",
            user_id="anonymous",
        )

        response_text = ""
        async for event in myth_runner.run_async(
            user_id="anonymous",
            session_id=session.id,
            new_message=f"myth: {req.myth_statement}\nlanguage: {req.language}"
        ):
            if event.is_final_response():
                response_text = event.content.parts[0].text
                break

        import json, re
        clean = re.sub(r"```json|```", "", response_text).strip()
        return json.loads(clean)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
```

---

## Step 8 — Dockerfile

```dockerfile
# backend/Dockerfile

FROM python:3.11-slim

WORKDIR /app

# Copy requirements first (layer caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy rest of backend
COPY . .

# Cloud Run expects port 8080
EXPOSE 8080

# Start FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
```

---

## Step 9 — requirements.txt

```
google-adk>=0.1.0
google-cloud-aiplatform>=1.60.0
google-cloud-discoveryengine>=0.11.0
fastapi>=0.110.0
uvicorn>=0.29.0
pydantic>=2.0.0
```

---

## Step 10 — Deploy to Cloud Run

Once all agents are written and tested locally, deploy with one command:

```bash
# From inside the /backend folder

# Build and push Docker image
gcloud builds submit \
  --tag asia-south1-docker.pkg.dev/[YOUR-PROJECT-ID]/votepilot-repo/backend:v1

# Deploy to Cloud Run
gcloud run deploy votepilot-backend \
  --image asia-south1-docker.pkg.dev/[YOUR-PROJECT-ID]/votepilot-repo/backend:v1 \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --service-account votepilot-cloudrun@[YOUR-PROJECT-ID].iam.gserviceaccount.com \
  --set-env-vars GOOGLE_CLOUD_PROJECT=[YOUR-PROJECT-ID]
```

After deploy, GCP gives you a URL like:
`https://votepilot-backend-abc123-el.a.run.app`

That URL goes into your Next.js `.env.local` as `CLOUD_RUN_ORCHESTRATOR_URL`.

---

## How to Test Locally Before Deploying

```bash
# From /backend folder
# Set credentials for local dev
export GOOGLE_APPLICATION_CREDENTIALS="./votepilot-cloudrun-key.json"
export GOOGLE_CLOUD_PROJECT="votepilot-ai-[your-id]"

# Run FastAPI locally
uvicorn main:app --reload --port 8080

# Test in another terminal
curl -X POST http://localhost:8080/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What documents do I need to bring on voting day?",
    "explain_level": "simple",
    "language": "english"
  }'
```

If you get a structured JSON back with `answer`, `whyItMatters`, `whatYouShouldDo`, `keepInMind` — the entire pipeline is working.

---

## The Learning Curve Reality

Day 4 will feel confusing — that's normal. The pattern to remember:

```
Tool = Python function with a docstring
Agent = Model + tools + instruction
Orchestrator = Agent whose tools are other agents
Runner = What actually executes the agent
```

Once the RAG agent works end-to-end locally, the others follow the exact same pattern. You're essentially copy-pasting the structure and swapping the tool function.

Want me to add this as a section in the main roadmap doc?