from vertexai.generative_models import GenerativeModel
import vertexai
from ..config import PROJECT_ID, LOCATION
import json

def format_response(context: str, question: str, explain_level: str, language: str, source: str) -> dict:
    try:
        vertexai.init(project=PROJECT_ID, location=LOCATION)
        model = GenerativeModel("gemini-1.5-flash-001")
        
        prompt = f"""
        You are VotePilot AI. Using the following context, answer the user's question.
        If the context is insufficient, rely on your knowledge of Indian elections.
        
        Context: {context}
        Question: {question}
        Explain Level: {explain_level} (simple = 12 year old, standard = first-time voter, detailed = informed citizen)
        Language: {language}
        
        Always respond in this exact JSON format with no extra text, no markdown, no backticks:
        {{
          "answer": "...",
          "whyItMatters": "...",
          "whatYouShouldDo": "...",
          "keepInMind": "...",
          "source": "{source}"
        }}
        """
        
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        return json.loads(response.text)
    except Exception as e:
        print(f"Formatter error: {e}")
        return {
            "answer": "We couldn't generate a formatted response at this time.",
            "whyItMatters": "",
            "whatYouShouldDo": "",
            "keepInMind": "",
            "source": source
        }
