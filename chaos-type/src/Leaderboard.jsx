import React, { useState, useEffect } from 'react';
import './Leaderboard.css'; // Import your CSS file

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  // Mock data, replace this with actual data fetching logic
  const fetchLeaderboardData = () => {
    // Simulating an API call or fetching data from a database
    const mockData = [
      { player: 'John Doe', score: 100 },
      { player: 'Jane Smith', score: 90 },
      { player: 'Bob Johnson', score: 80 },
      // Add more entries as needed
    ];

    setLeaderboardData(mockData);
  };

  useEffect(() => {
    // Fetch leaderboard data when the component mounts
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
