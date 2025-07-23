"""
Chroma-based document retrieval system for RAG.
"""

from app.progress import embedding_progress
from langchain.vectorstores import Chroma
from langchain.schema import Document
from app.embedder import get_embedding_model
from app.config import CHROMA_DB_DIR, CHROMA_COLLECTION_NAME, TOP_K_RETRIEVAL
from typing import List
from pathlib import Path
import time

def save_to_chroma(chunks: List[Document]) -> Chroma:
    embedding_model = get_embedding_model()

    # Stage 1: CHUNKING (assumed done already)
    embedding_progress["stage"] = "Splitting and Chunking"
    embedding_progress["current"] = 0
    embedding_progress["total"] = len(chunks)
    embedding_progress["done"] = False

    # Simulate chunking progress
    for i in range(len(chunks)):
        time.sleep(0.01)
        embedding_progress["current"] = i + 1
        embedding_progress["percent"] = int((i + 1) / len(chunks) * 50)  # First 50% for chunking

    # Stage 2: EMBEDDING
    embedding_progress["stage"] = "Create Embedding"
    embedding_progress["current"] = 0
    embedding_progress["total"] = len(chunks)

    documents = []
    for i, doc in enumerate(chunks):
        documents.append(doc)
        time.sleep(0.01)
        embedding_progress["current"] = i + 1
        embedding_progress["percent"] = 50 + int((i + 1) / len(chunks) * 50)  # 50-100% for embedding

    # Final write to Chroma
    vector_store = Chroma.from_documents(
        documents=documents,
        embedding=embedding_model,
        persist_directory=str(CHROMA_DB_DIR),
        collection_name=CHROMA_COLLECTION_NAME
    )
    vector_store.persist()

    embedding_progress["stage"] = "Let's Chat..."
    embedding_progress["done"] = True
    embedding_progress["percent"] = 100

    return vector_store



def load_chroma() -> Chroma:
    """
    Load an existing Chroma DB from disk.
    """
    embedding_model = get_embedding_model()

    vector_store = Chroma(
        persist_directory=str(CHROMA_DB_DIR),
        embedding_function=embedding_model,
        collection_name=CHROMA_COLLECTION_NAME
    )
    return vector_store


def retrieve_relevant_documents(query: str) -> List[Document]:
    """
    Retrieve top-k documents relevant to the user query.
    """
    vector_store = load_chroma()
    return vector_store.similarity_search(query, k=TOP_K_RETRIEVAL)
