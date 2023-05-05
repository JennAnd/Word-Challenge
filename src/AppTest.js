import React, { useState, useEffect } from "react";
import parse from "html-react-parser";
import GuessWords from "./GuessWords";

function App() {
  const [title, setTitle] = useState("");
  const [extract, setExtract] = useState("");
  const [guesses, setGuesses] = useState([]);

  const [hiddenWords, setHiddenWords] = useState([]);

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

  useEffect(() => {
    const url =
      "https://sv.wikipedia.org/w/api.php?action=query&origin=*&prop=extracts&format=json&titles=Hajar";

    const getTitleAndExtract = (json) => {
      const { pages } = json.query;
      const page = pages[Object.keys(pages)[0]];
      return { title: page.title, extract: page.extract };
    };

    const fetchData = async () => {
      try {
        const resp = await fetch(url);
        const json = await resp.json();
        const { title, extract } = getTitleAndExtract(json);
        setTitle(title);
        setExtract(extract);
        /*        setExtract(parse(extract)); */
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const words = title.split(" ");
    setHiddenWords(words.map((word) => ({ word, isHidden: true })));
  }, [title]);

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

      <div className="article">
        {/* <div className="extract">{extract}</div> */}
        <div
          className="extract"
          dangerouslySetInnerHTML={{ __html: extract }}
        ></div>
      </div>
    </>
  );
}

export default App;
