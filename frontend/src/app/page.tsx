"use client";

import { useEffect, useState } from "react";

import Chat from "../components/Chat";
import Upload from "../components/Upload";
import { checkVectorStoreReady, uploadDocument } from "../lib/api";
import {
  createSpeechRecognizer,
  stopSpeechRecognizer,
} from "../utils/VoiceRecognition";
import { speak } from "../utils/texttoSpeech";

type Stage = "checking" | "uploading" | "processing" | "ready";

export default function Home() {
  const [stage, setStage] = useState<Stage>("checking");
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const BASE_URL = "/api";

  useEffect(() => {
    const check = async () => {
      const ready = await checkVectorStoreReady();
      setStage(ready ? "ready" : "uploading");
    };
    check();
  }, []);

  const handleFileUpload = async (file: File) => {
    setStage("uploading");
    await uploadDocument(file);
    setStage("processing");

    let done = false;
    let attempts = 0;
    const maxAttempts = 600;

    while (!done && attempts < maxAttempts) {
      const res = await fetch(`${BASE_URL}/embedding-progress`);
      const data = await res.json();

      if (data && data.percent !== undefined) {

        done = data.done;
      }

      attempts++;
      await new Promise((r) => setTimeout(r, 3000));
    }

    if (done) {
      setStage("ready");
    } else {
      alert("Embedding timed out.");
      setStage("uploading");
    }
  };

  const handleReset = () => {
    setStage("uploading");
  };

  const addMessage = (msg: { sender: string; text: string }) => {
    setMessages((prev) => [...prev, msg]);
  };

  const handleSend = async (text: string, source: "voice" | "text" = "text") => {
    if (!text.trim()) return;

    addMessage({ sender: "user", text });

    // ➕ Add temporary "Thinking..." message
    addMessage({ sender: "bot", text: "Thinking..." });

    try {
      const res = await fetch(`${BASE_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();
      const answer = data.answer;

      // 🔁 Replace last bot message ("Thinking...") with actual response
      updateLastBotMessage(answer);

      if (source === "voice") {
          speak(answer);
      }
    } catch (error) {
      console.error("Failed to fetch response:", error);
      updateLastBotMessage("❌ Failed to fetch response. See console for details.");
    }
  };


  const updateLastBotMessage = (newText: string) => {
    setMessages((prev) => {
      const updated = [...prev];
      for (let i = updated.length - 1; i >= 0; i--) {
        if (updated[i].sender === "bot") {
          updated[i] = { ...updated[i], text: newText };
          break;
        }
      }
      return updated;
    });
  };

  const startVoice = () => {
    if (isListening) {
      stopSpeechRecognizer();
      setIsListening(false);
      return;
    }

    // Do not stop or pause mic — keep listening
    const recognizer = createSpeechRecognizer(
      async (text) => {
        setInput("");
        await handleSend(text, "voice");
      },
      () => {
        setIsListening(false); // Reflect that mic is stopped
      }
    );

    if (recognizer) {
      try {
        recognizer.start();
        setIsListening(true);
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
        setIsListening(false);
      }
    }
  };

  if (stage === "checking") {
    return (
      <div className="flex items-center justify-center h-screen bg-[#212121] text-white">
        <p className="text-white">Checking system status...</p>
      </div>
    );
  }

  if (stage === "uploading") {
    return (
      <Upload
        onFileUploaded={handleFileUpload}
        onSkipUpload={() => setStage("ready")}
      />
    );
  }

  if (stage === "processing") {
    return (
      <Upload
        onFileUploaded={() => { }}
        onSkipUpload={() => setStage("ready")}
      />
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Chat
        onUploadNewFile={handleReset}
        messages={messages}
        input={input}
        setInput={setInput}
        onSend={(text) => {
          handleSend(text, "text");
          setInput("");
        }}
        onVoice={startVoice}
        isListening={isListening}
      />
    </div>
  );
}
