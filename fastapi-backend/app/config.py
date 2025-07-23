# app/config.py

"""
Configuration for RAG Multi-Model App
"""

from pathlib import Path
from dotenv import load_dotenv
import os

load_dotenv()

# === Paths === #
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
CHROMA_DB_DIR = DATA_DIR / "chroma_db"

# === Embedding Model === #
HF_EMBEDDING_MODEL = os.getenv("Huggingface_Embedding_Model")

# === Chroma Settings === #
CHROMA_COLLECTION_NAME = "rag_documents"

# === Gemini API === #
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("Gemini_Model")

# === General Settings === #
CHUNK_SIZE = 500
CHUNK_OVERLAP = 50
TOP_K_RETRIEVAL = 5
TEMPERATURE = 0.4
