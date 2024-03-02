import './App.css';
import TypingGame from './TypingGame';
import Leaderboard from './Leaderboard';

const App = () => {
  return (
  <div className="app-container">
    <Leaderboard />
    <TypingGame />
  </div>
  );
};

export default App;
