import React, { useState, useRef } from "react";
import "./index.css";

function GuessWords({
  hiddenWords,
  toggleWordVisibility,
  handleGuess,
  guesses,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const guess = e.target.guess.value;
    handleGuess(guess);
    e.target.reset();
  };

  return (
    <div className="words-box">
      <div className="input-row">
        <form onSubmit={handleSubmit}>
          {" "}
          <label htmlFor="guess">Ditt ord:</label>
          <input type="text" id="guess" name="guess" />
          <button className="submit-guess" type="submit">
            Gissa
          </button>
        </form>
      </div>
      <div className="guessed-words-list">
        {guesses
          .slice(0)
          .reverse()
          .map((guess, index) => (
            <p
              key={index}
              style={{ fontWeight: guess.isMatch ? "bold" : "200" }}
            >
              {guess.guess}
            </p>
          ))}
      </div>
    </div>
  );
}

export default GuessWords;
