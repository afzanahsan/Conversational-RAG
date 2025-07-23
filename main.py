# main.py

"""
Main CLI entry point for the RAG application.
"""

import argparse
from app.rag_pipeline import run_rag_pipeline

def main():
    parser = argparse.ArgumentParser(description="Multi-Model RAG Application")
    parser.add_argument(
        "--init",
        action="store_true",
        help="Initialize and store document embeddings in Chroma DB."
    )
    parser.add_argument(
        "--query",
        type=str,
        required=True,
        help="User question for the RAG pipeline."
    )
    
    args = parser.parse_args()

    print("\n[🔥] Running Multi-Model RAG Pipeline...\n")
    answer = run_rag_pipeline(query=args.query, initialize_db=args.init)
    print("\n[✅ Answer]\n", answer)

if __name__ == "__main__":
    main()
