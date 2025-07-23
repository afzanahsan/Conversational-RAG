# backend/rag_engine.py
import os
from app.rag_pipeline import run_rag_pipeline
from pathlib import Path
from app.chunking import chunk_documents, load_documents
from app.retrieval import save_to_chroma

def get_rag_answer(query: str) -> str:
    # No --init by default here
    return run_rag_pipeline(query=query, initialize_db=False)


def initialize_rag_with_file(file_path: Path):
    docs = load_documents(file_path.parent)
    chunks = chunk_documents(docs)
    save_to_chroma(chunks)
    print(f"[✅] Finished embedding and storing: {file_path.name}")
    try:
        os.remove(file_path)
        print(f"{file_path} deleted successfully.")
    except Exception as e:
        print(f"Error deleting {file_path}: {e}")
