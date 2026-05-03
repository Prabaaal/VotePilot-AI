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
