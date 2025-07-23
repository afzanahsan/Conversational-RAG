# app/embedder.py

"""
Embedding module using HuggingFace models for RAG.
"""

from langchain.embeddings import HuggingFaceEmbeddings
from typing import List
from app.config import HF_EMBEDDING_MODEL

def get_embedding_model() -> HuggingFaceEmbeddings:
    """
    Load and return the HuggingFace embedding model.
    """
    model = HuggingFaceEmbeddings(model_name=HF_EMBEDDING_MODEL)
    return model
