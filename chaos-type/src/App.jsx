// App.js

import './App.css';
import TypingGame from './TypingGame';
import Leaderboard from './Leaderboard';

const App = () => {
  return (
    <div className="app-container">
      <p className="game-title">Chaos Keys</p>
      <div className="content-container">
        <Leaderboard />
        <TypingGame />
      </div>
    </div>
  );
};

export default App;