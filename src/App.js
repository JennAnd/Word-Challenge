import React, { useState, useEffect } from "react";
import GuessWords from "./GuessWords";
import { notHiddenWords } from "./VisibleWords";
import GameInstructions from "./GameInstructions";
import { url } from "./UrlArticles";

function App() {
  const [title, setTitle] = useState("");
  const [extract, setExtract] = useState("");
  const [guesses, setGuesses] = useState(() => {
    const storedGuesses = localStorage.getItem("guesses");
    return storedGuesses ? JSON.parse(storedGuesses) : [];
  });
  const [hiddenWords, setHiddenWords] = useState([]);
  const [showInstructions, setShowInstructions] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [count, setCount] = useState(() => {
    const storedCount = localStorage.getItem("count");
    const parsedCount = parseInt(storedCount, 10);
    return isNaN(parsedCount) ? 0 : parsedCount;
  });

  // retrieve count value when component mounts
  useEffect(() => {
    const storedCount = localStorage.getItem("count");
    const parsedCount = parseInt(storedCount, 10);
    if (!isNaN(parsedCount)) {
      setCount(parsedCount);
    }
  }, []);

  // updates count vaule in local storage when count sate changes
  useEffect(() => {
    localStorage.setItem("count", count.toString());
  }, [count]);

  // game instructions
  const handleShowInstructions = () => {
    setShowInstructions(true);
  };
  const handleCloseInstructions = () => {
    setShowInstructions(false);
  };

  // toggles the visibility of word based on its index
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

  // handles a submitted guess, sets to null if its already guessed or from VisibleWords array
  const handleGuess = (guess) => {
    const normalizedGuess = guess.toLowerCase();
    const alreadyGuessed = guesses.some(
      (guessedWord) => guessedWord.guess.toLowerCase() === normalizedGuess
    );

    if (alreadyGuessed) {
      return null;
    }

    if (notHiddenWords.includes(normalizedGuess)) {
      return;
    }

    // increment count state and sets isHidden property to false if word is a match from hiddenWords
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

    // update guesses state by adding current guess and matching status to the array, if it matches a hidden word
    setGuesses((prevState) => [...prevState, { guess, isMatch }]);

    // if the guess matches the article title, isHidden property of all word objects sets to false and showCongratulations sets to true
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
    }
  };

  // function is called when the user clicks on the "Play Again?" or "New Article" button to reset the game
  const handleReset = () => {
    localStorage.removeItem("guesses");
    localStorage.removeItem("randomTitle");
    setGuesses([]);
    setCount(0);
    setGameOver(false);
    const randomUrl = getRandomUrl();
    fetchData(randomUrl);
  };

  // function returns a random url from the urlArticles array that contains titles of Wikipedia articles
  const getRandomUrl = () => {
    const randomIndex = Math.floor(Math.random() * url.length);
    const baseUrl =
      "https://sv.wikipedia.org/w/api.php?action=query&origin=*&prop=extracts&format=json&titles=";

    const randomTitle = url[randomIndex];
    return baseUrl + randomTitle;
  };

  // hook is triggered when component mounts and fetches data for a random article
  useEffect(() => {
    const savedTitle = localStorage.getItem("randomTitle");
    if (savedTitle) {
      const randomUrl = getRandomUrl();
      fetchData(randomUrl);
    } else {
      const randomUrl = getRandomUrl();
      fetchData(randomUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // function extracts the title and extract from the fetched JSON data
  const getTitleAndExtract = (json) => {
    const { pages } = json.query;
    const page = pages[Object.keys(pages)[0]];
    return { title: page.title, extract: page.extract };
  };

  // asynchronous function that fetches data for the specified url
  const fetchData = async (randomUrl) => {
    try {
      const savedTitle = localStorage.getItem("randomTitle");
      if (savedTitle) {
        setTitle(savedTitle);
        const updatedUrl = getUrlFromTitle(savedTitle);
        const resp = await fetch(updatedUrl);
        const json = await resp.json();
        const { extract } = getTitleAndExtract(json);
        setExtract(extract);
      } else {
        const resp = await fetch(randomUrl);
        const json = await resp.json();
        const { title, extract } = getTitleAndExtract(json);
        setTitle(title);
        setExtract(extract);
        localStorage.setItem("randomTitle", title);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // function takes a title and returns the corresponding url for fetching article data
  const getUrlFromTitle = (title) => {
    const encodedTitle = encodeURIComponent(title);
    const baseUrl =
      "https://sv.wikipedia.org/w/api.php?action=query&origin=*&prop=extracts&format=json&titles=";
    return baseUrl + encodedTitle;
  };

  // hook is triggered whenever the title or extract state changes
  // splits the title and extract into individual words and filters out any unwanted characters
  useEffect(() => {
    const titleWords = title.split(" ");
    const extractWords = extract
      .replace(/<\/?[^>]+(>|$)/g, "")
      .replace(/([.,!?])/g, "$1 ")
      .split(/[\s]|[-–—]|[?!\u2026]+|(?<!\p{L})|(?!\p{L})/gu)
      .filter((word) => word.length > 0);

    // generates an array of word objects with their visibility status (isHidden) based on whether they are in the notHiddenWords array
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
              Instruktioner
            </button>
          </header>
          <div className="guess-words">
            {/* provide values for these props */}
            <GuessWords
              hiddenWords={hiddenWords}
              toggleWordVisibility={toggleWordVisibility}
              handleGuess={handleGuess}
              guesses={guesses}
              setGuesses={setGuesses}
              count={count}
              gameOver={gameOver}
              setGameOver={setGameOver}
            />
          </div>
          {/* maps over the hiddenWords array to render each word as a box or visible word, depending on its visibility status */}
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
                  <div className="title" style={{ display: "inline-block" }}>
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
                    {/*  renders congratulations messages, reset buttons, and game instructions based on the game state */}
                    {hiddenWord.showCongratulations &&
                    hiddenWord.word === title ? (
                      <h2 className="winning-message">
                        Grattis! Du fick {count} poäng
                        <button
                          className="reset-game-button"
                          onClick={handleReset}
                        >
                          Spela igen?
                        </button>
                      </h2>
                    ) : hiddenWord.showCongratulations ? null : (
                      hiddenWords.some((word) => word.isHidden === true) && (
                        <button
                          className="end-game-button"
                          onClick={handleReset}
                        >
                          Ny artikel
                        </button>
                      )
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
