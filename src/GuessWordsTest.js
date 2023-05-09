import React, { useState, useRef } from "react";
import "./index.css";
import { notHiddenWords } from "./VisibleWords";

function GuessWords({
  hiddenWords,
  toggleWordVisibility,
  handleGuess,
  guesses,
  count,
}) {
  const [gameOver, setGameOver] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const guess = e.target.guess.value;
    handleGuess(guess);
    e.target.reset();
    if (guess.toLowerCase() === hiddenWords[0].word.toLowerCase()) {
      setGameOver(true);
    }
  };

  return (
    <div className="words-box-wrapper">
      <div className="words-box">
        <form onSubmit={handleSubmit}>
          {" "}
          <label htmlFor="guess">Ditt ord:</label>
          <input type="text" id="guess" name="guess" disabled={gameOver} />
          <button className="submit-guess" type="submit" disabled={gameOver}>
            Gissa
          </button>
        </form>
      </div>{" "}
      <div className="guessed-words-list">
        {guesses
          .slice(0)
          .reverse()
          .map((guess, index) => {
            const matchedWords = hiddenWords.filter(
              (wordObj) =>
                wordObj.word.toLowerCase() === guess.guess.toLowerCase()
            );
            const count = matchedWords.length;

            if (notHiddenWords.includes(guess.guess.toLowerCase())) {
              return null;
            }

            if (
              !guess.isMatch &&
              !hiddenWords.some(
                (wordObj) =>
                  wordObj.word.toLowerCase() === guess.guess.toLowerCase()
              )
            ) {
              return <p key={index}>{guess.guess}</p>;
            }

            return (
              <p
                key={index}
                style={{ fontWeight: guess.isMatch ? "bold" : "200" }}
              >
                {guess.guess} ({count})
              </p>
            );
          })}
      </div>
    </div>
  );
}

export default GuessWords;
