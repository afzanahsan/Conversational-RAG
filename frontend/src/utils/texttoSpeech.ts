/// <reference lib="dom" />

export function speak(text: string): void {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    const utterance = new SpeechSynthesisUtterance(text);
    // Optional: configure voice, rate, pitch
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.cancel(); // Cancel any previous speech
    window.speechSynthesis.speak(utterance);
  } else {
    console.warn("Text-to-speech is not supported in this browser.");
  }
}