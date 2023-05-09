import React from "react";

function GameInstructions({ onClose }) {
  return (
    <div className="popup">
      <p className="instructions-text">
        "Det här ordspelet går ut på att använda formuläret för att gissa på de
        gömda orden i artikeln. Målet är att lista ut artikelns rubrik. Varje
        gissat ord ger en poäng och ju färre poäng du har, desto bättre är din
        prestation."
      </p>
      <button className="instructions-link" onClick={onClose}>
        Close
      </button>
    </div>
  );
}

export default GameInstructions;
