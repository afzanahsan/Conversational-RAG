from fastapi import FastAPI, File, UploadFile, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config import CHROMA_DB_DIR
from pathlib import Path
import shutil
import uuid
from app.progress import embedding_progress
from fastapi.responses import JSONResponse

from backend.models import AskRequest, AskResponse
from backend.rag_engine import get_rag_answer, initialize_rag_with_file

app = FastAPI(title="Multi-Model RAG FastAPI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/status")
def check_status():
    """
    Return whether Chroma vector store is already initialized.
    """
    index_path = Path(CHROMA_DB_DIR) / "index"
    return {"vector_store_ready": index_path.exists() and any(index_path.glob("*"))}


@app.post("/ask", response_model=AskResponse)
def ask_rag(req: AskRequest):
    print(f"Received query: {req.message}")
    response = get_rag_answer(req.message)
    print(f"Response: {response}")
    return AskResponse(answer=response)


@app.post("/upload")
async def upload_document(file: UploadFile = File(...), background_tasks: BackgroundTasks = None):
    """
    Upload a document, save it temporarily, and initialize the RAG pipeline.
    """
    file_id = str(uuid.uuid4())
    file_path = Path(f"{file_id}_{file.filename}")
    file_path.parent.mkdir(exist_ok=True, parents=True)

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Trigger RAG init in the background
    background_tasks.add_task(initialize_rag_with_file, file_path)
    
    return JSONResponse(content={"status": "processing", "filename": file.filename})


@app.get("/embedding-progress")
def get_embedding_progress():
    from app.progress import embedding_progress
    return embedding_progress


