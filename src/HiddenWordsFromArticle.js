/* import React, { useState } from "react";
import parse from "html-react-parser";
import GuessWords from "./GuessWords";

function HiddenWordsFromArticle({ title }) {
  const words = title.split(" ");
  const [guesses, setGuesses] = useState([]);

  const [hiddenWords, setHiddenWords] = useState(
    words.map((word) => ({ word, isHidden: true }))
  );

  const toggleWordVisibility = (index) => {
    setHiddenWords((prevState) =>
      prevState.map((wordObj, i) =>
        i === index
          ? {
              ...wordObj,
              isHidden: !wordObj.isHidden,
            }
          : wordObj
      )
    );
  };

  const handleGuess = (guess) => {
    const isMatch = hiddenWords.some(
      (wordObj) => wordObj.word.toLowerCase() === guess.toLowerCase()
    );
    setHiddenWords((prevState) =>
      prevState.map((wordObj) =>
        wordObj.word.toLowerCase() === guess.toLowerCase()
          ? { ...wordObj, isHidden: false }
          : wordObj
      )
    );

    setGuesses((prevState) => [...prevState, { guess, isMatch }]);
  };

  return (
    <>
      <div className="App">
        <div className="article">
          <div className="guess-words">
            <GuessWords
              hiddenWords={hiddenWords}
              toggleWordVisibility={toggleWordVisibility}
              handleGuess={handleGuess}
              guesses={guesses}
            />
          </div>
        </div>
      </div>

      <div className="title-box">
        {hiddenWords.map((hiddenWord, index) => (
          <React.Fragment key={index}>
            {hiddenWord.isHidden ? (
              <h1
                className="box"
                style={{
                  backgroundColor: "#ccc",
                  display: "inline-block",
                  width: hiddenWord.word.length * 18 + "px",
                }}
              >
                <span className="box-content">&nbsp;</span>
                <span className="box-text">{hiddenWord.word.length}</span>
              </h1>
            ) : (
              <h1 className="title" style={{ display: "inline-block" }}>
                {hiddenWord.word}{" "}
              </h1>
            )}
            {index < hiddenWords.length - 1 && <span>&nbsp;</span>}
          </React.Fragment>
        ))}
      </div>
    </>
  );
}

export default HiddenWordsFromArticle;
 */
