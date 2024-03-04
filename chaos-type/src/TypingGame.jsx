import React, { useState, useEffect, useRef } from 'react';
import './TypingGame.css';

const TypingGame = () => {
  const [score, setScore] = useState(0);
  const [columns, setColumns] = useState({
    left: [],
    middle: [],
    right: [],
  });
  const [userPosition, setUserPosition] = useState('middle');
  const [userInput, setUserInput] = useState('');
  const [timer, setTimer] = useState(11);
  const [gameOver, setGameOver] = useState(false);
  const [showModal, setShowModal] = useState(false);

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

  const resetGame = () => {
    setColumns({
      left: [],
      middle: [],
      right: [],
    });
    setUserPosition('middle');
    setUserInput('');
    setScore(0);
    setTimer(60);
    setGameOver(false);
    setShowModal(false); // Hide the modal
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
  
      const updatedColumns = Object.fromEntries(
        Object.entries(columns).map(([column, items]) => [
          column,
          items.map((item) => {
            if (item.word.toLowerCase() === inputWord) {
              // Word is correct
              setScore((prevScore) => prevScore + 1);
              wordFound = true;
  
              // Update the item's word to indicate earning a point
              return { ...item, word: '+1 point earned', earned: true };
            }
            return item;
          }),
        ])
      );
  
      setColumns(updatedColumns);
      setUserInput('');
  
      if (wordFound) {
      } else {
        // Word is incorrect, add shake effect to the input box
        const inputElement = document.getElementById('user-input');
        inputElement.classList.add('shake');
  
        // Remove the shake class after the animation ends
        setTimeout(() => {
          inputElement.classList.remove('shake');
        }, 400);
      }
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
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (timer > 0 && !gameOver) {
      const timerId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
  
      return () => clearInterval(timerId);
    } else if (timer === 0 && !gameOver) {
      setGameOver(true);
      setShowModal(true); // Display the modal
    }
  }, [timer, gameOver]);
  

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

    ctx.font = '30px Arial';

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

    const playerSize = 50;
  const userX =
    userPosition === 'left' ? columnWidth / 2 - playerSize / 2 :
    userPosition === 'middle' ? 1.5 * columnWidth - playerSize / 2 :
    2.5 * columnWidth - playerSize / 2;
  const userY = canvas.height - 30 - playerSize / 2;
  ctx.fillStyle = 'red';
  ctx.fillRect(userX, userY, playerSize, playerSize);

  const updatedColumns = { ...columns };
  Object.keys(updatedColumns).forEach((column) => {
    updatedColumns[column] = updatedColumns[column].filter((item) => item.y < userY - 30);
  });

  // Render "+1 point" in green
  updatedColumns.left.forEach(({ id, word, y }) => {
    const textWidth = ctx.measureText(word).width;
    ctx.fillStyle = word === '+1 point earned' ? 'green' : 'red';
    ctx.fillText(word, wordCenterXLeft - textWidth / 2, y);
  });

  updatedColumns.middle.forEach(({ id, word, y }) => {
    const textWidth = ctx.measureText(word).width;
    ctx.fillStyle = word === '+1 point earned' ? 'green' : 'red';
    ctx.fillText(word, wordCenterXMiddle - textWidth / 2, y);
  });

  updatedColumns.right.forEach(({ id, word, y }) => {
    const textWidth = ctx.measureText(word).width;
    ctx.fillStyle = word === '+1 point earned' ? 'green' : 'red';
    ctx.fillText(word, wordCenterXRight - textWidth / 2, y);
  });

  setColumns(updatedColumns);

  }, [columns, userPosition]);

  return (
    <div className="typing-game-container">
      <div className="score-timer-container">
        <div className="score">Score: {score}</div>
        <div className={`timer ${timer <= 10 ? 'occilation' : ''} ${timer <= 10 ? 'red-text' : ''}`}>Time: {timer}s</div>
      </div>
      <input
        id="user-input"
        type="text"
        value={userInput}
        onChange={handleInputChange}
        onKeyDown={handleInputChange}
        placeholder="Choose a word to type..."
        className="user-input"
      />
      <canvas ref={canvasRef} width={1000} height={700} className="game-canvas"></canvas>

      {showModal && (
        <div className="modal">
          <p>Congratulations! Your score is {score}</p>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}
    </div>
  );
};

export default TypingGame;
