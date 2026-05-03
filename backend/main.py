# backend/main.py

import os
import json
import re
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from google.genai.types import Content, Part
from agents.orchestrator import orchestrator
from agents.mythbuster_agent import mythbuster_agent
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
import uvicorn

app = FastAPI(title="VotePilot AI Backend")

# Allow requests from Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ADK session service and runners
session_service = InMemorySessionService()

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


# ── Request models ──────────────────────────────────────────────────────────
class AskRequest(BaseModel):
    question: str
    explain_level: str = "standard"    # simple | standard | detailed
    language: str = "english"          # english | hindi | assamese
    user_profile: Optional[dict] = {}


class MythRequest(BaseModel):
    myth_statement: str
    language: str = "english"


def _parse_response(raw: str) -> dict:
    """Strip markdown fences and parse JSON, with plain-text fallback."""
    try:
        clean = re.sub(r"```json|```", "", raw).strip()
        return json.loads(clean)
    except Exception:
        return {
            "answer": raw,
            "whyItMatters": "",
            "whatYouShouldDo": "",
            "keepInMind": "",
            "source": "ECI Documents"
        }


# ── Routes ──────────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "ok", "service": "votepilot-backend"}


@app.post("/ask")
async def ask(req: AskRequest):
    try:
        message_text = (
            f"question: {req.question}\n"
            f"explain_level: {req.explain_level}\n"
            f"language: {req.language}\n"
            f"user_state: {req.user_profile.get('state', 'India') if req.user_profile else 'India'}\n"
            f"first_time_voter: {req.user_profile.get('firstTimeVoter', True) if req.user_profile else True}"
        )

        # ADK requires a Content object — not a raw string
        new_message = Content(
            parts=[Part(text=message_text)],
            role="user"
        )

        # Each request gets a fresh session so history never corrupts types
        session_id = f"ask-{os.urandom(8).hex()}"
        await session_service.create_session(
            app_name="votepilot",
            user_id="anonymous",
            session_id=session_id,
        )

        print(f"[ask] session={session_id} q={req.question!r}")

        response_text = ""
        async for event in ask_runner.run_async(
            user_id="anonymous",
            session_id=session_id,
            new_message=new_message,
        ):
            if event.is_final_response():
                response_text = event.content.parts[0].text
                break

        print(f"[ask] raw response: {response_text[:200]!r}")

        if not response_text:
            return {
                "answer": "I'm sorry, I couldn't generate an answer right now.",
                "error": "No response from agents"
            }

        return _parse_response(response_text)

    except Exception as e:
        print(f"[ask] ERROR: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/mythbuster")
async def mythbuster(req: MythRequest):
    try:
        new_message = Content(
            parts=[Part(text=f"myth: {req.myth_statement}\nlanguage: {req.language}")],
            role="user"
        )

        session_id = f"myth-{os.urandom(8).hex()}"
        await session_service.create_session(
            app_name="votepilot",
            user_id="anonymous",
            session_id=session_id,
        )

        print(f"[mythbuster] session={session_id} myth={req.myth_statement!r}")

        response_text = ""
        async for event in myth_runner.run_async(
            user_id="anonymous",
            session_id=session_id,
            new_message=new_message,
        ):
            if event.is_final_response():
                response_text = event.content.parts[0].text
                break

        print(f"[mythbuster] raw response: {response_text[:200]!r}")

        if not response_text:
            return {"answer": "I couldn't verify this myth.", "verdict": "unknown"}

        return _parse_response(response_text)

    except Exception as e:
        print(f"[mythbuster] ERROR: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
