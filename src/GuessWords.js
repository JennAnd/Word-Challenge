import React, { useState } from "react";

function GuessWords() {
  const [guesses, setGuesses] = useState([]);

  function handleGuess(event) {
    event.preventDefault();
    const guess = event.target.elements.guess.value.trim();
    if (guess) {
      setGuesses([...guesses, guess]);
      event.target.reset();
    }
  }

  return (
    <div className="words-box">
      <div className="input-row">
        <form onSubmit={handleGuess}>
          <label htmlFor="guess">Ditt ord:</label>
          <input type="text" id="guess" name="guess" />
          <button className="submit-guess" type="submit">
            Gissa
          </button>
        </form>
      </div>
      <div className="guessed-words-list">
        {guesses.map((guess, index) => (
          <p key={index}>{guess}</p>
        ))}
      </div>
    </div>
  );
}

export default GuessWords;
