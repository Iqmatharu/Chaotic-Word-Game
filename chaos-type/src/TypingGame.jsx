import React, { useState, useEffect, useRef } from 'react';
import './TypingGame.css'; // Import your CSS file

const TypingGame = () => {
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60);
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
    setColumns((prevColumns) => ({
      ...prevColumns,
      [column]: [...prevColumns[column], { id: Date.now(), word: word }],
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
        left: [{ id: Date.now(), word: leftWord }],
        middle: [{ id: Date.now(), word: middleWord }],
        right: [{ id: Date.now(), word: rightWord }],
      });
    };

    generateWordsForColumns();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      generateWord('left');
      generateWord('middle');
      generateWord('right');
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Draw border around the canvas
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw columns and dotted lines
    ctx.strokeStyle = 'black';
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 2;

    const columnWidth = canvas.width / 3;

    // Draw left column
    ctx.beginPath();
    ctx.moveTo(columnWidth, 0);
    ctx.lineTo(columnWidth, canvas.height);
    ctx.stroke();

    // Draw right column
    ctx.beginPath();
    ctx.moveTo(2 * columnWidth, 0);
    ctx.lineTo(2 * columnWidth, canvas.height);
    ctx.stroke();

    // Draw words in each column
    ctx.setLineDash([]); // Reset line dash
    ctx.lineWidth = 1;

    // Calculate the center position for the words
    const wordCenterXLeft = columnWidth / 2;
    const wordCenterXMiddle = 1.5 * columnWidth;
    const wordCenterXRight = 2.5 * columnWidth;
    const wordY = 30; // Fixed Y position at the top

    // Draw words at the top of each column with a larger font size and centered
    ctx.font = '20px Arial'; // Adjust the font size as needed

    // Draw words in the left column
    columns.left.forEach(({ id, word }, index) => {
      const textWidth = ctx.measureText(word).width;
      ctx.fillText(word, wordCenterXLeft - textWidth / 2, wordY + index * 30);
    });

    // Draw words in the middle column
    columns.middle.forEach(({ id, word }, index) => {
      const textWidth = ctx.measureText(word).width;
      ctx.fillText(word, wordCenterXMiddle - textWidth / 2, wordY + index * 30);
    });

    // Draw words in the right column
    columns.right.forEach(({ id, word }, index) => {
      const textWidth = ctx.measureText(word).width;
      ctx.fillText(word, wordCenterXRight - textWidth / 2, wordY + index * 30);
    });

    // Draw user character at the bottom of the current column
    const userX = userPosition === 'left' ? columnWidth / 2 : userPosition === 'middle' ? 1.5 * columnWidth : 2.5 * columnWidth;
    const userY = canvas.height - 30;
    ctx.fillStyle = 'red';
    ctx.fillRect(userX - 15, userY - 15, 30, 30);
  }, [columns, userPosition]);

  return (
    <div className="typing-game-container">
      <h1 className="game-title">Chaos Keys</h1>
      <div className="score-timer-container">
        <div className="score">Score: {score}</div>
        <div className="timer">Time Left: {timer}s</div>
      </div>
      <canvas ref={canvasRef} width={600} height={600} className="game-canvas"></canvas>
      <input
        type="text"
        value={userInput}
        onChange={handleInputChange}
        placeholder="Type here..."
        className="user-input"
      />
    </div>
  );
};

export default TypingGame;
