# app/rag_pipeline.py

"""
End-to-end RAG pipeline using LangChain's LLMChain.
"""

from app.chunking import load_documents, chunk_documents
from app.retrieval import save_to_chroma, retrieve_relevant_documents
from app.prompt_builder import get_prompt_template
from app.generator import get_llm
from app.config import DATA_DIR
from app.cache import get_cached_answer, add_to_cache
import time
from langchain.chains import LLMChain

def run_rag_pipeline(query: str, initialize_db: bool = False) -> str:
    query = query.lower()
    if initialize_db:
        print("[INFO] Initializing DB...")
        raw_docs = load_documents(DATA_DIR)
        chunks = chunk_documents(raw_docs)
        save_to_chroma(chunks)

    print("[INFO] Checking cache...")
    cached = get_cached_answer(query)
    if cached:
        print("[✅ Cache hit]")
        time.sleep(1)  # Add 1-second delay to simulate thinking
        return cached


    print("[INFO] Cache miss. Retrieving documents...")
    docs = retrieve_relevant_documents(query)
    context = "\n\n".join(
        [f"{doc.page_content}\n\nSource: {doc.metadata.get('source', 'n/a')}" for doc in docs]
    )

    llm = get_llm()
    prompt = get_prompt_template()
    chain = LLMChain(llm=llm, prompt=prompt, verbose=False)

    print("[INFO] Generating answer...")
    answer = chain.run({"context": context, "question": query}).strip()

    print("[INFO] Saving to cache...")
    add_to_cache(query, answer)

    return answer
