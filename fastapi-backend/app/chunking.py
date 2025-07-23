"""
Document loading and text chunking for RAG pipeline with fallback PDF loaders.
"""

from typing import List
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.document_loaders import (
    TextLoader, PyPDFLoader, Docx2txtLoader,
    PyMuPDFLoader, UnstructuredPDFLoader
)
from langchain.docstore.document import Document
from pathlib import Path

from app.config import CHUNK_SIZE, CHUNK_OVERLAP


def load_documents(data_dir: Path) -> List[Document]:
    """
    Load documents from a directory (supports .txt, .pdf, .docx) with PDF loader fallback:
    PyPDFLoader → PyMuPDFLoader → UnstructuredPDFLoader
    """
    docs = []

    for file_path in data_dir.glob("*"):
        try:
            if file_path.suffix == ".txt":
                loader = TextLoader(str(file_path), encoding="utf-8")
                docs.extend(loader.load())

            elif file_path.suffix == ".docx":
                loader = Docx2txtLoader(str(file_path))
                docs.extend(loader.load())

            elif file_path.suffix == ".pdf":
                # Try PyPDFLoader first
                try:
                    loader = PyPDFLoader(str(file_path))
                    docs.extend(loader.load())
                except Exception as e1:
                    print(f"[WARN] PyPDFLoader failed: {e1}")
                    try:
                        loader = PyMuPDFLoader(str(file_path))
                        docs.extend(loader.load())
                    except Exception as e2:
                        print(f"[WARN] PyMuPDFLoader failed: {e2}")
                        try:
                            loader = UnstructuredPDFLoader(str(file_path))
                            docs.extend(loader.load())
                        except Exception as e3:
                            print(f"[ERROR] All PDF loaders failed for {file_path.name}: {e3}")
                            continue

        except Exception as e:
            print(f"[ERROR] Failed to load {file_path.name}: {e}")
            continue

    return docs


def chunk_documents(docs: List[Document]) -> List[Document]:
    """
    Split documents into chunks using RecursiveCharacterTextSplitter.
    """
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP
    )
    return splitter.split_documents(docs)
