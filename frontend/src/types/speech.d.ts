export {};

declare global {
  interface Window {
    webkitSpeechRecognition?: typeof SpeechRecognition;
  }

  // If TypeScript still complains about `SpeechRecognition` not existing:
  var SpeechRecognition: {
    prototype: SpeechRecognition;
    new (): SpeechRecognition;
  };

  var webkitSpeechRecognition: {
    prototype: SpeechRecognition;
    new (): SpeechRecognition;
  };
}
