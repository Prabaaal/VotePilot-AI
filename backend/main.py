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
user_state: {req.user_profile.get("state", "India") if req.user_profile else "India"}
first_time_voter: {req.user_profile.get("firstTimeVoter", True) if req.user_profile else True}
        """.strip()

        print(f"Orchestrating request: {req.question}")

        # Run the orchestrator without session history for stateless request
        response_text = ""
        async for event in ask_runner.run_async(
            user_id="anonymous",
            session_id=f"stateless-{os.urandom(8).hex()}", # Unique session every time
            new_message=message
        ):
            if event.is_final_response():
                response_text = event.content.parts[0].text
                break

        print(f"Raw response from agent: {response_text}")

        if not response_text:
            return {"error": "No response from agents", "answer": "I'm sorry, I couldn't generate an answer right now."}

        # Parse JSON response from formatter agent
        import json, re
        try:
            clean = re.sub(r"```json|```", "", response_text).strip()
            return json.loads(clean)
        except Exception as parse_err:
            print(f"JSON Parse Error: {str(parse_err)}")
            return {
                "answer": response_text,
                "whyItMatters": "",
                "whatYouShouldDo": "",
                "keepInMind": "",
                "source": "ECI Documents"
            }

    except Exception as e:
        print(f"Endpoint Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/mythbuster")
async def mythbuster(req: MythRequest):
    try:
        print(f"MythBusting: {req.myth_statement}")
        
        response_text = ""
        async for event in myth_runner.run_async(
            user_id="anonymous",
            session_id=f"myth-stateless-{os.urandom(8).hex()}",
            new_message=f"myth: {req.myth_statement}\nlanguage: {req.language}"
        ):
            if event.is_final_response():
                response_text = event.content.parts[0].text
                break

        print(f"Raw response from myth agent: {response_text}")

        if not response_text:
            return {"error": "No response from myth agent", "answer": "I couldn't verify this myth."}

        import json, re
        try:
            clean = re.sub(r"```json|```", "", response_text).strip()
            return json.loads(clean)
        except Exception as parse_err:
            print(f"Myth Parse Error: {str(parse_err)}")
            return {"answer": response_text, "verdict": "unknown"}

    except Exception as e:
        print(f"Myth Endpoint Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
