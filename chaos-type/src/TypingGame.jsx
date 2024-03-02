import React, { useState, useEffect, useRef } from 'react';
import './TypingGame.css'; // Import your CSS file

const TypingGame = () => {
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60);
  const [columns, setColumns] = useState({
    left: '',
    middle: '',
    right: '',
  });
  const [userPosition, setUserPosition] = useState('middle'); // User starts in the middle

  const canvasRef = useRef(null);

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

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowLeft':
        setUserPosition('left');
        break;
      case 'ArrowRight':
        setUserPosition('right');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     setTimer((prevTimer) => prevTimer - 1);
  //   }, 1000);

  //   return () => clearInterval(intervalId);
  // }, []);

  // useEffect(() => {
  //   if (timer <= 0) {
  //     alert(`Game over! Your final score is ${score}`);
  //     window.location.reload(); // Reload the page to restart the game
  //   }
  // }, [timer, score]);

useEffect(() => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');

  // Draw columns and dotted lines
  ctx.clearRect(0, 0, canvas.width, canvas.height);
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

  // Draw words in the left column
  ctx.fillText(columns.left, columnWidth / 2, 50);

  // Draw words in the middle column
  ctx.fillText(columns.middle, 1.5 * columnWidth, 50);

  // Draw words in the right column
  ctx.fillText(columns.right, 2.5 * columnWidth, 50);

  // Draw user character at the bottom of the middle column
  const userX = 1.5 * columnWidth;
  const userY = canvas.height - 30;
  ctx.fillStyle = 'red';
  ctx.fillRect(userX - 15, userY - 15, 30, 30);

  // Check for collision with words and update score accordingly
  // (You need to implement this logic based on the actual position of the words)

}, [columns, userPosition]);

  return (
    <div className="typing-game-container">
      <h1 className="game-title">Chaos Keys</h1>
      <div className="score-timer-container">
        <div className="score">Score: {score}</div>
        <div className="timer">Time Left: {timer}s</div>
      </div>
      <canvas ref={canvasRef} width={600} height={600} className="game-canvas"></canvas>
    </div>
  );
};

export default TypingGame;
