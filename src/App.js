import React, { useState, useEffect } from "react";
import GuessWords from "./GuessWords";
import "./index.css";

function App() {
  const [title, setTitle] = useState("");
  const [extract, setExtract] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [hiddenWords, setHiddenWords] = useState([]);
  const [usedWords, setUsedWords] = useState([]);
  const [handleGuess, setHandleGuess] = useState([]);

  const url =
    "https://sv.wikipedia.org/w/api.php?action=query&origin=*&prop=extracts&format=json&exintro=&titles=Hajar";

  const getTitleAndExtract = (json) => {
    const { pages } = json.query;
    const page = pages[Object.keys(pages)[0]];
    return { title: page.title, extract: page.extract };
  };
  const getExtract = async () => {
    let resp;
    setLoading(true);
    try {
      resp = await fetch(url);
      const json = await resp.json();
      const { title, extract } = getTitleAndExtract(json);

      const parser = new DOMParser();
      const parsedExtract = parser.parseFromString(extract, "text/html").body
        .innerText;
      const plainTextExtract = parsedExtract.replaceAll("<br>", "\n");

      setTitle(title);
      setExtract(plainTextExtract);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  /*   const handleGuess = (event) => {
    event.preventDefault();
    const guess = event.target.elements.guess.value.toLowerCase();
    if (hiddenWords.includes(guess) && !usedWords.includes(guess)) {
      setHiddenWords(hiddenWords.filter((word) => word !== guess));
      setUsedWords([...usedWords, guess]);
    }
    event.target.reset();
  }; */

  useEffect(() => {
    getExtract();
  }, []);

  if (loading) return "Loading...";
  if (error) return "There was a problem processing your request.";
  return (
    <div className="App">
      <div className="article">
        <h1>{title}</h1>
        <p className="extract">{extract}</p>
      </div>
      <div className="guess-words">
        <GuessWords
          hiddenWords={hiddenWords}
          usedWords={usedWords}
          handleGuess={handleGuess}
        />
      </div>
    </div>
  );
}

export default App;
