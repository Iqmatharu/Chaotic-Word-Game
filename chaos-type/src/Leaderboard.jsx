import React, { useState, useEffect } from 'react';
import './Leaderboard.css'; // Import your CSS file

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  const fetchLeaderboardData = () => {
    const mockData = [
      { player: 'John Doe', score: 100 },
      { player: 'Jane Smith', score: 90 },
      { player: 'Bob Johnson', score: 80 }
      ,
    ];

    setLeaderboardData(mockData);
  };

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  return (
    <div className="boxStyle">
      <h2>Leaderboard</h2>
      <table className="tableStyle">
        <thead>
          <tr>
            <th className="centered">Player</th>
            <th className="rightAligned">Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((entry, index) => (
            <tr key={index}>
              <td className="centered">{entry.player}</td>
              <td className="rightAligned">{entry.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
