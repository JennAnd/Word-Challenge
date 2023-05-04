import React, { useState, useRef } from "react";

//tar emot fyra props från GuessedWords component
function GuessWords({
  hiddenWords,
  toggleWordVisibility,
  handleGuess,
  guesses,
}) {
  //hämtar ut värdet från gissningen från inputen, kallar på funktionen handleGuess
  const handleSubmit = (e) => {
    e.preventDefault();
    const guess = e.target.guess.value;
    handleGuess(guess);
    e.target.reset();
  };

  /*  //kallar på handleSubmit när formet är skickat */
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
      {/*    //array där gissningarna hamnar för att hanteras */}
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
