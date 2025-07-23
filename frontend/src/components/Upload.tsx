"use client";
import { useRef, useState } from "react";
import { CheckCircle, X } from "lucide-react";
import ProgressTracker from "./ProgressTracker";

export default function Upload({
  onFileUploaded,
  onSkipUpload,
}: {
  onFileUploaded: (file: File) => void;
  onSkipUpload: () => void;
}) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const [statusStep, setStatusStep] = useState<"Splitting and Chunking" | "uploading" | "uploaded">("Splitting and Chunking");
  const [showProgressTracker, setShowProgressTracker] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setStatusStep("uploading");

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((r) => setTimeout(r, 500));
      setUploadProgress(i);
    }

    setStatusStep("uploaded");

    await new Promise((r) => setTimeout(r, 500));
    onFileUploaded(file);

    // Show ProgressTracker
    setShowProgressTracker(true);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-6 bg-[#212121] text-white relative">
      {/* ✅ Skip/Close Button */}
      <button
        onClick={onSkipUpload}
        title="Skip upload and go to chat"
        className="absolute top-4 right-4 p-2 text-gray-400 rounded-full hover:text-white hover:bg-[#333232] hover:rounded-full transition cursor-pointer"
      >
        <X size={23} />
      </button>

      <h1 className="text-2xl font-semibold mb-6 text-center">Upload a document to start</h1>

      {statusStep === "Splitting and Chunking" && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.pdf,.docx"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-[#333232] text-white px-6 py-2 rounded-full shadow hover:bg-gray-600 transition cursor-pointer"
          >
            Upload File
          </button>
        </>
      )}

      {(statusStep !== "Splitting and Chunking") && (
        <div className="w-full max-w-md space-y-4">

          <div className="flex items-center gap-2">
            {statusStep === "uploaded" ? (
              <CheckCircle className="text-green-500" size={20} />
            ) : (
              <div className="w-5 h-5 rounded-full bg-blue-300 animate-pulse" />
            )}
            <span className={`text-sm ${statusStep === "uploaded" ? "text-green-400" : "text-gray-300"}`}>
              {fileName} uploaded successfully
            </span>
          </div>

          {statusStep === "uploading" && (
            <>
              <div className="bg-gray-600 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-3 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-gray-300 text-sm">{uploadProgress}%</p>
            </>
          )}

          {showProgressTracker && <ProgressTracker />}
        </div>
      )}
    </div>
  );
}
