import './App.css';
import { useState, useEffect } from 'react';
import { Controls } from './components/Controls';
import { CurrentlyReading } from './components/CurrentlyReading';
import { useSpeech } from './lib/useSpeech';
import { fetchContent, parseContentIntoSentences } from './lib/content';
function App() {
  const [sentences, setSentences] = useState<Array<string>>([]);
  const { currentSentenceIdx, currentWordRange, playbackState, play, pause } = useSpeech(sentences);


  const fetchData = async () => {
    try {
      const response = await fetchContent();

      const parsedSentences = parseContentIntoSentences(response); // Parse the content into sentences


      setSentences(parsedSentences);
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };
  useEffect(() => {

    fetchData();
  }, []);

  useEffect(() => {
    setSentences(sentences);
  }, [sentences])

  const loadNewContent = () => {
    fetchData();
  }

  // Ensure currentWordRange is always a tuple or undefined
  const currentWordRangeTuple: [number, number] | undefined = Array.isArray(currentWordRange) && currentWordRange.length === 2
    ? [currentWordRange[0], currentWordRange[1]]
    : undefined;

  // Extracting current word from current word range
  const currentWord = currentWordRangeTuple
    ? sentences[currentSentenceIdx]?.substring(currentWordRangeTuple[0], currentWordRangeTuple[1])
    : undefined;

  // Extracting current sentence from sentences array
  const currentSentence = sentences[currentSentenceIdx];

  return (
    <div className="App">
      <h1>Text to speech</h1>
      <div>
        {/* Pass the correct props to the CurrentlyReading component */}
        <CurrentlyReading
          currentWordRange={currentWordRangeTuple}
          currentSentenceIdx={currentSentenceIdx}
          sentences={sentences}
        />
      </div>
      <div>
        <Controls play={play} pause={pause} loadNewContent={loadNewContent} state={playbackState} />
      </div>
    </div>
  );
}

export default App;
