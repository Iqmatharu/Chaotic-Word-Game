// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App


import React, { useState, useEffect } from 'react';

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
    <div>
      <div>Score: {score}</div>
      <div>Time Left: {timer}s</div>
      <div>
        <button onClick={() => generateWord('left')}>{columns.left}</button>
        <button onClick={() => generateWord('middle')}>{columns.middle}</button>
        <button onClick={() => generateWord('right')}>{columns.right}</button>
      </div>
      <div>
        <p onClick={() => handleWordClick('left', columns.left)}>{columns.left}</p>
        <p onClick={() => handleWordClick('middle', columns.middle)}>{columns.middle}</p>
        <p onClick={() => handleWordClick('right', columns.right)}>{columns.right}</p>
      </div>
    </div>
  );
};

export default TypingGame;
