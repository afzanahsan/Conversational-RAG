"use client";

import { useEffect, useRef } from "react";
import { Mic, ArrowUp } from "lucide-react";

export default function Chat({
  onUploadNewFile,
  messages,
  input,
  setInput,
  onSend,
  onVoice,
  isListening,
}: {
  onUploadNewFile: () => void;
  messages: { sender: string; text: string }[];
  input: string;
  setInput: (value: string) => void;
  onSend: (value: string) => void;
  onVoice: () => void;
  isListening: boolean;
}) {
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-[#1E1E2F] text-white font-sans">
      <header className="sticky top-0 z-10 bg-[#212121] px-6 py-4 shadow-md flex justify-between items-center border-b border-[#3C3C4E]">
        <h1 className="text-lg font-medium tracking-wide">ChatRAG</h1>
        <button
          onClick={onUploadNewFile}
          className="flex items-center justify-center text-base bg-transparent text-white px-4 py-2 rounded-full hover:bg-[#333232] hover:shadow-lg active:bg-[#333232] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
        >
          <ArrowUp size={18} className="text-white mr-2" strokeWidth={3} /> Upload New File
        </button>
      </header>

      <main
        ref={chatRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-[#212121] pb-30"
      >
        {messages.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-2xl">
            Hi, Buddy
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
            >
              <div
                className={`max-w-2xl break-words px-5 py-4 text-base rounded-2xl whitespace-pre-line ${msg.sender === "user"
                  ? "bg-[#303030] text-white mr-67 rounded-3xl"
                  : "text-white ml-67"
                  }`}
              >
                {msg.text === "Thinking..." ? (
                  <span className="animate-pulse text-white">Thinking...</span>
                ) : (
                  msg.text
                )}

              </div>
            </div>
          )))}
      </main>
      <div className="fixed bottom-0 left-0 right-0 max-w-3xl mx-auto gap-2 bg-[#212121] z-40 h-20">
        <footer className="fixed bottom-4 right-0 left-0 max-w-3xl mx-auto gap-2 rounded-3xl px-4 py-4 bg-[#303030] border-t border-[#3C3C4E] z-50">
          <div className="flex items-center gap-2 rounded-lg border border-[#303030] px-4 py-2 bg-[#303030]">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSend(input);
                  setInput("");
                }
              }}
              placeholder="Enter Query ..."
              className="flex-grow bg-transparent text-white outline-none placeholder-gray-400"
            />

            {/* Mic Button */}
            <button
              onClick={onVoice}
              className={`p-2 rounded-full transition cursor-pointer ${isListening ? "bg-red-500 animate-pulse" : "bg-transparent hover:bg-gray-400"
                }`}
              title={isListening ? "Listening..." : "Start voice input"}
            >
              <Mic size={18} className="text-white" />
            </button>

            {/* Send Button */}
            <button
              onClick={() => {
                onSend(input);
                setInput("");
              }}
              className="p-2 bg-white rounded-full hover:bg-gray-300 transition flex items-center justify-center"
              title="Send message"
            >
              <ArrowUp size={18} className="text-black" strokeWidth={3} />
            </button>

          </div>
        </footer>
      </div>
    </div>
  );
}
