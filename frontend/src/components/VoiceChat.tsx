"use client";

import { useState } from "react";
import { createSpeechRecognizer } from "../utils/VoiceRecognition";
import { speak } from "../utils/texttoSpeech";

export default function VoiceChat() {
  const [userSpeech, setUserSpeech] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [botReply, setBotReply] = useState("");
  const BASE_URL = "/api";

  const startVoice = () => {
    const recognizer = createSpeechRecognizer(
      async (text) => {
        setUserSpeech(text);
        setIsListening(false);

        // Send voice text to your RAG backend
        const response = await fetch(`${BASE_URL}/ask`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: text }),
        });

        const data = await response.json();
        const answer = data.answer;

        setBotReply(answer);
        speak(answer); // Voice reply
      },
      () => setIsListening(false)
    );

    if (recognizer) {
      setIsListening(true);
      recognizer.start();
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-md mx-auto mt-8 space-y-4">
      <h2 className="text-lg font-semibold">🎙️ Voice Mode</h2>

      <button
        onClick={startVoice}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
      >
        {isListening ? "Listening..." : "Start Talking"}
      </button>

      <div className="mt-4">
        <p><strong>You said:</strong> {userSpeech}</p>
        <p><strong>Bot replied:</strong> {botReply}</p>
      </div>
    </div>
  );
}
