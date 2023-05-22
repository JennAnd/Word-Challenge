import React, { useEffect } from "react";
import "./index.css";
import { notHiddenWords } from "./VisibleWords";

// component is responsible for rendering the input field for guesses and displaying the list of previous guesses,
// filtering and formatting them based on certain conditions

// recieving props when component is used
function GuessWords({
  hiddenWords,
  handleGuess,
  gameOver,
  setGameOver,
  guesses,
  setGuesses,
}) {
  // hook is used to save the guesses array to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("guesses", JSON.stringify(guesses));
  }, [guesses]);

  // function is called when the user submits a guess through a form submission
  // retrieves the guess value from the input field and trims any leading or trailing whitespace
  // checks if the guess is empty or contains invalid characters using a regular expression
  const handleSubmit = (e) => {
    e.preventDefault();
    const guessInput = e.target.guess;
    const guess = guessInput.value.trim();
    const regex = /^[a-öA-Ö0-9]+$/;

    // if the guess is empty or contains invalid characters, it returns and does not proceed further
    if (!guess || !regex.test(guess)) {
      return;
    }

    // calls the handleGuess function provided as a prop, passing the guess as an argument
    // updates the guesses state by adding the current guess and its matching status (isMatch: false) to the array
    // resets the input field and sets the focus back to the input field
    handleGuess(guess);
    setGuesses([...guesses, { guess, isMatch: false }]);
    guessInput.value = "";
    guessInput.focus();

    // if the guess matches the first hidden word in the hiddenWords array (title), it sets the gameOver state to true
    if (guess.toLowerCase() === hiddenWords[0].word.toLowerCase()) {
      setGameOver(true);
    }
  };

  // if the game is over, it removes the saved guesses from local storage
  useEffect(() => {
    if (gameOver) {
      localStorage.removeItem("guesses");
    }
  }, [gameOver]);

  return (
    <div className="words-box-wrapper">
      <div className="words-box">
        {/*  form to enter guess  */}
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

            // duplicate guesses and visible words are filtered out
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
              // if the guess is not a match and is not present in the hiddenWords array, it is rendered as plain text
              return <p key={index}>{guess.guess}</p>;
            }
            // if the guess is a match, it is rendered in bold and the number of matched words is displayed
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
