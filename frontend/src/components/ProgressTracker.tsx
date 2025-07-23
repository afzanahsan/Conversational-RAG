import { useEffect, useState } from "react";

export default function ProgressTracker() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Spiltting and Chunking");

  const BASE_URL = "/api";
  useEffect(() => {
    const interval: NodeJS.Timeout = setInterval(fetchProgress, 1000); // ✅ Poll every 1 second

    async function fetchProgress() {
      try {
        const res = await fetch(`${BASE_URL}/embedding-progress`);
        const data = await res.json();

        setProgress(data.percent);
        setStatus(data.stage);

        if (data.done) {
          clearInterval(interval);  // ✅ Stop polling when done
        }
      } catch (err) {
        console.error("Error fetching progress:", err);
      }
    }

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  return (
    <div>
      <p>{status} - {progress}%</p>
      <div className="bg-gray-300 h-3 rounded-full overflow-hidden">
        <div className="bg-indigo-600 h-3 transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
