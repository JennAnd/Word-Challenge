import React, { useState, useEffect } from "react";
import "./index.css";
import { notHiddenWords } from "./VisibleWords";

function GuessWords({ hiddenWords, handleGuess }) {
  const [guesses, setGuesses] = useState(() => {
    const storedGuesses = localStorage.getItem("guesses");
    return storedGuesses ? JSON.parse(storedGuesses) : [];
  });
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    localStorage.setItem("guesses", JSON.stringify(guesses));
  }, [guesses]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const guessInput = e.target.guess;
    const guess = guessInput.value.trim();
    const regex = /^[a-öA-Ö0-9]+$/;

    if (!guess || !regex.test(guess)) {
      return;
    }

    handleGuess(guess);
    setGuesses([...guesses, { guess, isMatch: false }]);
    guessInput.value = "";
    guessInput.focus();

    if (guess.toLowerCase() === hiddenWords[0].word.toLowerCase()) {
      setGameOver(true);
    }
  };

  useEffect(() => {
    if (gameOver) {
      localStorage.removeItem("guesses");
    }
  }, [gameOver]);

  return (
    <div className="words-box-wrapper">
      <div className="words-box">
        <form onSubmit={handleSubmit}>
          {" "}
          <label htmlFor="guess">Ditt ord:</label>
          <input
            type="text"
            id="guess"
            name="guess"
            disabled={gameOver}
            autoComplete="off"
          />
          <button className="submit-guess" type="submit" disabled={gameOver}>
            Gissa
          </button>
        </form>
      </div>{" "}
      <div className="guessed-words-list">
        {guesses
          .slice(0)
          .reverse()
          .filter((guess, index, array) => {
            const normalizedGuess = guess.guess.toLowerCase();
            const alreadyGuessed = array
              .slice(0, index)
              .some(
                (guessedWord) =>
                  guessedWord.guess.toLowerCase() === normalizedGuess
              );

            return !alreadyGuessed && !notHiddenWords.includes(normalizedGuess);
          })
          .map((guess, index) => {
            const matchedWords = hiddenWords.filter(
              (wordObj) =>
                wordObj.word.toLowerCase() === guess.guess.toLowerCase()
            );
            const count = matchedWords.length;

            matchedWords.forEach((matchedWord) => {
              guess.isMatch = true;
            });

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
