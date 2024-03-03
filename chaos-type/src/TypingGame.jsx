import React, { useState, useEffect, useRef } from 'react';
import './TypingGame.css'; // Import your CSS file

const TypingGame = () => {
  const [score, setScore] = useState(0);
  const [columns, setColumns] = useState({
    left: [],
    middle: [],
    right: [],
  });
  const [userPosition, setUserPosition] = useState('middle'); // User starts in the middle
  const [userInput, setUserInput] = useState('');

  const canvasRef = useRef(null);

  const getRandomWord = async () => {
    const response = await fetch('https://random-word-api.herokuapp.com/word');
    const data = await response.json();
    return data[0] || '';
  };

  const generateWord = async (column) => {
    const word = await getRandomWord();

    const verticalSpacing = 40;

    setColumns((prevColumns) => ({
      ...prevColumns,
      [column]: [
        { id: Date.now(), word: word, y: 30 },
        ...prevColumns[column].map((item) => ({ ...item, y: item.y + verticalSpacing })),
      ],
    }));
  };

  const handleWordClick = (column, word) => {
    const userInput = prompt(`Type the word "${word}" to earn a point:`);

    if (userInput && userInput.toLowerCase() === word.toLowerCase()) {
      setScore((prevScore) => prevScore + 1);
      const updatedColumn = columns[column].filter((item) => item.word !== word);
      setColumns((prevColumns) => ({ ...prevColumns, [column]: updatedColumn }));
    }
  };

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowLeft':
        setUserPosition((prevPosition) => (prevPosition === 'middle' ? 'left' : 'middle'));
        break;
      case 'ArrowRight':
        setUserPosition((prevPosition) => (prevPosition === 'middle' ? 'right' : 'middle'));
        break;
      default:
        break;
    }
  };

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
    if (event.key === 'Enter') {
      const inputWord = userInput.trim().toLowerCase();
      let wordFound = false;

      const updatedColumns = { ...columns };
      Object.keys(updatedColumns).forEach((column) => {
        updatedColumns[column] = updatedColumns[column].filter((item) => {
          if (item.word.toLowerCase() === inputWord) {
            wordFound = true;
            setScore((prevScore) => prevScore + 1);
            return false; // Remove the word from the column
          }
          return true; // Keep other words in the column
        });
      });

      if (wordFound) {
        setColumns(updatedColumns);
      }

      setUserInput('');
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const generateWordsForColumns = async () => {
      const leftWord = await getRandomWord();
      const middleWord = await getRandomWord();
      const rightWord = await getRandomWord();

      setColumns({
        left: [{ id: Date.now(), word: leftWord, y: 30 }],
        middle: [{ id: Date.now(), word: middleWord, y: 30 }],
        right: [{ id: Date.now(), word: rightWord, y: 30 }],
      });
    };

    generateWordsForColumns();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      generateWord('left');
      generateWord('middle');
      generateWord('right');
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'black';
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 2;

    const columnWidth = canvas.width / 3;

    ctx.beginPath();
    ctx.moveTo(columnWidth, 0);
    ctx.lineTo(columnWidth, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(2 * columnWidth, 0);
    ctx.lineTo(2 * columnWidth, canvas.height);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.lineWidth = 1;

    const wordCenterXLeft = columnWidth / 2;
    const wordCenterXMiddle = 1.5 * columnWidth;
    const wordCenterXRight = 2.5 * columnWidth;
    const wordY = 30;

    ctx.font = '20px Arial';

    columns.left.forEach(({ id, word, y }) => {
      const textWidth = ctx.measureText(word).width;
      ctx.fillText(word, wordCenterXLeft - textWidth / 2, y);
    });

    columns.middle.forEach(({ id, word, y }) => {
      const textWidth = ctx.measureText(word).width;
      ctx.fillText(word, wordCenterXMiddle - textWidth / 2, y);
    });

    columns.right.forEach(({ id, word, y }) => {
      const textWidth = ctx.measureText(word).width;
      ctx.fillText(word, wordCenterXRight - textWidth / 2, y);
    });

    const userX =
      userPosition === 'left' ? columnWidth / 2 : userPosition === 'middle' ? 1.5 * columnWidth : 2.5 * columnWidth;
    const userY = canvas.height - 30;
    ctx.fillStyle = 'red';
    ctx.fillRect(userX - 15, userY - 15, 30, 30);

    const updatedColumns = { ...columns };
    Object.keys(updatedColumns).forEach((column) => {
      updatedColumns[column] = updatedColumns[column].filter((item) => item.y < userY - 30);
    });
    setColumns(updatedColumns);
  }, [columns, userPosition]);

  return (
    <div className="typing-game-container">
      <h1 className="game-title">Chaos Keys</h1>
      <div className="score-timer-container">
        <div className="score">Score: {score}</div>
      </div>
      <canvas ref={canvasRef} width={600} height={600} className="game-canvas"></canvas>
      <input
        type="text"
        value={userInput}
        onChange={handleInputChange}
        onKeyDown={handleInputChange}
        placeholder="Type here..."
        className="user-input"
      />
    </div>
  );
};

export default TypingGame;
