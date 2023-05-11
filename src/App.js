import React, { useState, useEffect } from "react";
import GuessWords from "./GuessWords";
import { notHiddenWords } from "./VisibleWords";
import GameInstructions from "./GameInstructions";
import { url } from "./UrlArticles";

function App() {
  const [title, setTitle] = useState("");
  const [extract, setExtract] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [hiddenWords, setHiddenWords] = useState([]);
  const [count, setCount] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);

  /*   const resetGame = () => {
    setCount(0);
    setHiddenWord({ word: "", showCongratulations: false });
    const newUrl = getRandomUrl();
    setTitle("");
    setExtract("");
    setUrl(newUrl);
  }; */

  const handleShowInstructions = () => {
    setShowInstructions(true);
  };

  const handleCloseInstructions = () => {
    setShowInstructions(false);
  };

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
    const normalizedGuess = guess.toLowerCase();
    const alreadyGuessed = guesses.some(
      (guessedWord) => guessedWord.guess.toLowerCase() === normalizedGuess
    );
    if (notHiddenWords.includes(normalizedGuess) || alreadyGuessed) {
      return;
    }
    setCount((prevCount) => prevCount + 1);
    const isMatch = hiddenWords.some(
      (wordObj) => wordObj.word.toLowerCase() === normalizedGuess
    );

    setHiddenWords((prevState) =>
      prevState.map((wordObj) =>
        wordObj.word.toLowerCase() === normalizedGuess
          ? { ...wordObj, isHidden: false }
          : wordObj
      )
    );

    setGuesses((prevState) => [...prevState, { guess, isMatch }]);

    if (isMatch && normalizedGuess === title.toLowerCase()) {
      setHiddenWords((prevState) =>
        prevState.map((wordObj) => ({ ...wordObj, isHidden: false }))
      );

      const congratsIndex = hiddenWords.findIndex(
        (wordObj) => wordObj.word.toLowerCase() === normalizedGuess
      );
      setHiddenWords((prevState) =>
        prevState.map((wordObj, index) =>
          index === congratsIndex
            ? { ...wordObj, showCongratulations: true }
            : wordObj
        )
      );
    } else if (isMatch) {
      const congratsIndex = hiddenWords.findIndex(
        (wordObj) => wordObj.word.toLowerCase() === normalizedGuess
      );
      setHiddenWords((prevState) =>
        prevState.map((wordObj, index) =>
          index === congratsIndex
            ? { ...wordObj, showCongratulations: true }
            : wordObj
        )
      );
    }
  };

  /* useEffect(() => {
    const getRandomUrl = () => {
      const randomIndex = Math.floor(Math.random() * url.length);
      return url[randomIndex];
    };

    const getTitleAndExtract = (json) => {
      const { pages } = json.query;
      const page = pages[Object.keys(pages)[0]];
      return { title: page.title, extract: page.extract };
    };

    const fetchData = async () => {
      try {
        const randomUrl = getRandomUrl();
        const resp = await fetch(randomUrl);
        const json = await resp.json();
        const { title, extract } = getTitleAndExtract(json);
        setTitle(title);
        setExtract(extract);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []); */
  const getRandomUrl = () => {
    const randomIndex = Math.floor(Math.random() * url.length);
    return url[randomIndex];
  };

  const getTitleAndExtract = (json) => {
    const { pages } = json.query;
    const page = pages[Object.keys(pages)[0]];
    return { title: page.title, extract: page.extract };
  };

  const fetchData = async (randomUrl) => {
    try {
      const resp = await fetch(randomUrl);
      const json = await resp.json();
      const { title, extract } = getTitleAndExtract(json);
      setTitle(title);
      setExtract(extract);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePlayAgain = () => {
    const randomUrl = getRandomUrl();
    fetchData(randomUrl);
  };
  const randomUrl = () => {
    fetchData(); // call the fetchData function to fetch a new random URL and update the state variables
    window.location.reload(); // refresh the page
  };

  useEffect(() => {
    const randomUrl = getRandomUrl();
    fetchData(randomUrl);
  }, []);

  useEffect(() => {
    const titleWords = title.split(" ");
    const extractWords = extract
      .replace(/<\/?[^>]+(>|$)/g, "")
      .replace(/([.,!?])/g, "$1 ")
      .split(/[\s]|[-–—]|[?!\u2026]+|(?<!\p{L})|(?!\p{L})/gu)
      .filter((word) => word.length > 0);

    setHiddenWords(
      [...titleWords, ...extractWords].flatMap((word) => {
        if (notHiddenWords.includes(word)) {
          return { word, isHidden: false };
        } else if (notHiddenWords.includes(word.toLowerCase())) {
          return { word, isHidden: false };
        } else {
          return { word, isHidden: true };
        }
      })
    );
  }, [title, extract]);

  return (
    <>
      <div className="App">
        <div className="article">
          <header className="header">
            <button
              className="instructions-link"
              onClick={handleShowInstructions}
            >
              Spelinstruktioner
            </button>
          </header>
          <div className="guess-words">
            <GuessWords
              hiddenWords={hiddenWords}
              toggleWordVisibility={toggleWordVisibility}
              handleGuess={handleGuess}
              guesses={guesses}
              count={count}
            />
          </div>
          <div className="article-box">
            {hiddenWords.map((hiddenWord, index) => (
              <React.Fragment key={index}>
                {hiddenWord.isHidden ? (
                  <div
                    className="box"
                    style={{
                      backgroundColor: "#ccc",
                      display: "inline-block",
                      width: hiddenWord.word.length * 16 + "px",
                    }}
                  >
                    <span className="box-content">&nbsp;</span>
                    <span className="box-text">{hiddenWord.word.length}</span>
                  </div>
                ) : (
                  <div
                    className="title"
                    style={{
                      display: "inline-block",
                    }}
                  >
                    {hiddenWord.word.split(" ").map((word, index) => (
                      <React.Fragment key={index}>
                        {(word === title || hiddenWord.word === title) &&
                        hiddenWord.showCongratulations ? (
                          <h1 className="title-word">{word}</h1>
                        ) : (
                          <p>{word} </p>
                        )}
                      </React.Fragment>
                    ))}

                    {hiddenWord.showCongratulations &&
                      hiddenWord.word === title && (
                        <h2 className="winning-message">
                          Grattis! Du fick {count} poäng
                          <button
                            className="reset-game-button"
                            onClick={randomUrl}
                          >
                            Spela igen?
                          </button>
                          {/*  //resetta guessed-list närman trycker på knappen plus att sätta inputen not disabled */}
                          {/*     //sätt en loading här när knappen klickas på, allmänt innan en ny artikel kommer, även i början i fetchen eller useffecten  */}
                          {/*    //fixa även så att man inte kan reloada sidan innan spelet är slut för att få en ny artikel */}
                        </h2>
                      )}

                    {showInstructions && (
                      <GameInstructions onClose={handleCloseInstructions} />
                    )}
                  </div>
                )}
                {index < hiddenWords.length - 1 && <span>&nbsp;</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
