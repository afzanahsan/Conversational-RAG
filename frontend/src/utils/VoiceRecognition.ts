let recognizerInstance: SpeechRecognition | null = null;

export function createSpeechRecognizer(
  onResult: (text: string) => void,
  onEnd?: () => void
): SpeechRecognition | null {
  // SpeechRecognition may not be available in all browsers, so we cast for safety
  const SpeechRecognitionConstructor =
    (window as Window & {
      webkitSpeechRecognition?: typeof SpeechRecognition;
      SpeechRecognition?: typeof SpeechRecognition;
    }).SpeechRecognition ||
    (window as Window & {
      webkitSpeechRecognition?: typeof SpeechRecognition;
    }).webkitSpeechRecognition;

  if (!SpeechRecognitionConstructor) {
    console.warn("Speech Recognition is not supported in this browser.");
    return null;
  }

  const recognizer = new SpeechRecognitionConstructor();
  recognizer.lang = "en-US";
  recognizer.interimResults = false;
  recognizer.continuous = true;
  recognizer.maxAlternatives = 1;

  recognizer.onresult = (event: SpeechRecognitionEvent) => {
    const transcript = Array.from(event.results)
      .map((result) => result[0].transcript)
      .join("")
      .trim();

    if (transcript) {
      onResult(transcript);
    }
  };

  recognizer.onerror = (event: SpeechRecognitionErrorEvent) => {
    console.error("Speech recognition error:", event.error);
  };

  recognizer.onend = () => {
    if (recognizerInstance === recognizer) {
      recognizerInstance = null;
    }
    onEnd?.();
  };

  recognizerInstance = recognizer;
  return recognizer;
}

export function stopSpeechRecognizer(): void {
  recognizerInstance?.stop();
}
