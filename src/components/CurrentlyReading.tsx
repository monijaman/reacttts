export const CurrentlyReading = ({
  currentWordRange,
  currentSentenceIdx,
  sentences,
}: {
  currentWordRange: [number, number] | undefined;
  currentSentenceIdx: number;
  sentences: string[];
}) => {
  // Extracting current word from current word range if currentWordRange is defined and has exactly two elements
  const currentWord =
    currentWordRange && currentWordRange.length === 2
      ? sentences[currentSentenceIdx]?.substring(
          currentWordRange[0],
          currentWordRange[1]
        )
      : undefined;

  // Extracting current sentence from sentences array
  const currentSentence = sentences[currentSentenceIdx];

  return (
    <div data-testid="currently-reading">
      {/* Container tag with all sentences */}
      <div>
        {/* Mapping through sentences to display them */}
        {sentences.map((sentence, index) => (
          <p
            key={index}
            data-testid={`sentence-${index}`}
            dangerouslySetInnerHTML={{ __html: sentence }} // Render HTML content
          ></p>
        ))}
      </div>

      {/* Display current word if it's defined */}
      {currentWord && (
  <p>
    <span
      data-testid="current-word"
      dangerouslySetInnerHTML={{ __html: currentWord }}
    />
  </p>
)}

    </div>
  );
};
