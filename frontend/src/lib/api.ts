import axios from "axios";

// // Base URL for FastAPI backend
const BASE_URL = "/api";
const UPLOAD_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE; 

/**
 * Send a user query to the RAG backend and get the answer.
 */
export async function sendMessageToRAG(question: string) {
  console.log("Sending message to RAG:", question);
  const res = await axios.post(`${BASE_URL}/ask`, {
    message: question,
  });

  console.log("Received response from RAG:", res.data);
  return res.data.answer;
}


/**
 * Upload a document to the backend for processing.
 * Returns status info (e.g., "processing", filename, etc.)
 */
export async function uploadDocument(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(`${UPLOAD_BASE_URL}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
}

/**
 * Check if the data is already existed to skip initial screen where user upload file.
 */
export async function checkVectorStoreReady(): Promise<boolean> {
  const res = await axios.get(`${BASE_URL}/status`);
  return res.data.vector_store_ready === true;
}
