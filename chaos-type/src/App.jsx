import React, { useState, useEffect } from 'react';
import './App.css'; // Import your CSS file

const TypingGame = () => {
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60);
  const [columns, setColumns] = useState({
    left: '',
    middle: '',
    right: '',
  });

  const getRandomWord = async () => {
    const response = await fetch('https://random-word-api.herokuapp.com/word');
    const data = await response.json();
    return data[0] || '';
  };

  const generateWord = async (column) => {
    const word = await getRandomWord();
    setColumns((prevColumns) => ({ ...prevColumns, [column]: word }));
  };

  const handleWordClick = (column, word) => {
    const userInput = prompt(`Type the word "${word}" to earn a point:`);

    if (userInput && userInput.toLowerCase() === word.toLowerCase()) {
      setScore((prevScore) => prevScore + 1);
      generateWord(column);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (timer <= 0) {
      alert(`Game over! Your final score is ${score}`);
      window.location.reload(); // Reload the page to restart the game
    }
  }, [timer, score]);

  return (
    <div className="typing-game-container">
      <h1 className="game-title">Chaos Keys</h1>
      <div className="score-timer-container">
        <div className="score">Score: {score}</div>
        <div className="timer">Time Left: {timer}s</div>
      </div>
      <div className="columns-container">
        <button className="column" onClick={() => generateWord('left')}>
          {columns.left}
        </button>
        <button className="column" onClick={() => generateWord('middle')}>
          {columns.middle}
        </button>
        <button className="column" onClick={() => generateWord('right')}>
          {columns.right}
        </button>
      </div>
      <div className="words-container">
        <p className="word" onClick={() => handleWordClick('left', columns.left)}>
          {columns.left}
        </p>
        <p className="word" onClick={() => handleWordClick('middle', columns.middle)}>
          {columns.middle}
        </p>
        <p className="word" onClick={() => handleWordClick('right', columns.right)}>
          {columns.right}
        </p>
      </div>
    </div>
  );
};

export default TypingGame;
