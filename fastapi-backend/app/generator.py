"""
LLM response generator using Gemini via LangChain integration.
"""

from langchain_google_genai import ChatGoogleGenerativeAI
from app.config import GEMINI_API_KEY, GEMINI_MODEL, TEMPERATURE

def get_llm() -> ChatGoogleGenerativeAI:
    """
    Initialize Gemini LLM wrapper via LangChain.
    """
    return ChatGoogleGenerativeAI(
        model=GEMINI_MODEL,
        google_api_key=GEMINI_API_KEY,
        temperature=TEMPERATURE
    )

def generate_answer(prompt: str) -> str:
    """
    Generate answer from Gemini API using formatted prompt.
    """
    llm = get_llm()
    response = llm.invoke(prompt)
    return response.content.strip() if hasattr(response, 'content') else str(response)
