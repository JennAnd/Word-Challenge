import React, { useState } from "react";
import parse from "html-react-parser";
import GuessWords from "./GuessWords";

//tar emot title som prop
//titeln är en string som splittas till en array och sätts i variabel words
//useState hooken används och skapar state variabler
function HiddenTitle({ title }) {
  const words = title.split(" ");
  const [guesses, setGuesses] = useState([]);
  //array av objekt, ordet och att den är gömd
  const [hiddenWords, setHiddenWords] = useState(
    words.map((word) => ({ word, isHidden: true }))
  );
  //togglar isHidden
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
  /* handles en users gissningar av det gömda ordet, kollar om de matchar  */
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
    //uppdaterar guesses state variabeln om det är en match
    setGuesses((prevState) => [...prevState, { guess, isMatch }]);
  };

  /*  importerar GuessWords komponenten och tar emot props. */
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

      {/*  mappar igenom hiddenWords arrayen, om gömd får den styling, syns om ordet är rätt gissat */}
      <div className="title-box">
        {hiddenWords.map((hiddenWord, index) => (
          //React.Fragment påverkar ej layouten när extra element läggs till
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
                <span className="winning-message">Congratulations!</span>
              </h1>
            )}
            {index < hiddenWords.length - 1 && <span>&nbsp;</span>}
          </React.Fragment>
        ))}
      </div>
    </>
  );
}

export default HiddenTitle;
