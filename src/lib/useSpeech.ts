import { useState, useEffect, useRef } from "react";
import {
  PlayingState,
  createSpeechEngine,
  SpeechEngineOptions,
  SpeechEngineState,
} from "./speech";


type SpeechEngine = ReturnType<typeof createSpeechEngine>;

/*
  @description
  Implement a custom useSpeech hook that uses a speech engine defined in 'speech.ts'
  to play the sentences that have been fetched and parsed previously.
  
  This hook should return react friendly controls for playing, and pausing audio as well as provide information about
  the currently read word and sentence
*/
const useSpeech = (sentences: Array<string>) => {
  // State to track current sentence index
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0);
  // State to track current word range being spoken
  const [currentWordRange, setCurrentWordRange] = useState([0, 0]);
  // State to track playback state (playing, paused, ended)
  const [playbackState, setPlaybackState] = useState<PlayingState>("paused");
  // Ref to store the speech engine instance
  const engineRef = useRef<SpeechEngine | null>(null);

  useEffect(() => {
    // Event handler for word boundary
    const onBoundary = (e: SpeechSynthesisEvent) => {
      if (e.name === "word") {
        const { charIndex } = e;
        const text = sentences[currentSentenceIdx];
        const words = text.split(" ");
        let wordStart = 0;
        let wordEnd = 0;

        for (const word of words) {
          wordEnd = wordStart + word.length;
          if (charIndex >= wordStart && charIndex < wordEnd) {
            setCurrentWordRange([wordStart, wordEnd]);
            break;
          }
          wordStart = wordEnd + 1;
        }
      }
    };

    // Event handler for end of speech
    const onEnd = () => {
      setPlaybackState("ended");
      setCurrentWordRange([0, 0]);
      if (currentSentenceIdx < sentences.length - 1) {
        setCurrentSentenceIdx(currentSentenceIdx + 1);
      }
    };

    // Event handler for state update
    const onStateUpdate = (state: PlayingState) => {
      setPlaybackState(state);
    };

    // Options object for speech engine
    const options: SpeechEngineOptions = {
      onBoundary,
      onEnd,
      onStateUpdate,
    };

    // Create speech engine instance
    engineRef.current = createSpeechEngine(options);

    // Cleanup function
    return () => {
      if (engineRef.current) {
        engineRef.current.cancel();
      }
    };
  }, [currentSentenceIdx, sentences]);

  // Function to start playback
  const play = () => {
    if (!engineRef.current) return;

    const sentence = sentences[currentSentenceIdx];
    engineRef.current.load(sentence);
    engineRef.current.play();
  };

  // Function to pause playback
  const pause = () => {
    if (!engineRef.current) return;

    engineRef.current.pause();
  };

  // Function to restart playback from the beginning
  const restart = () => {
    if (!engineRef.current) return;

    setCurrentSentenceIdx(0);
    setCurrentWordRange([0, 0]);
    engineRef.current.cancel();
  };

  // Return state and functions for controlling speech playback
  return {
    currentSentenceIdx,
    currentWordRange,
    playbackState,
    play,
    pause,
  };
};

export { useSpeech };
