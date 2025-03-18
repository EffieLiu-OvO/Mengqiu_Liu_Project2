import React from "react";
import "../styles/Scores.css";

const ScoresPage = () => {
  return (
    <main>
      <h1>High Scores</h1>
      <section className="scores-section">
        <h2>Leaderboard</h2>
        <div className="table-container">
          <table className="scores-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Username</th>
                <th>Wins</th>
                <th>Losses</th>
                <th>Win Rate</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="rank">1</td>
                <td>Player1</td>
                <td>10</td>
                <td>3</td>
                <td>77%</td>
              </tr>
              <tr>
                <td className="rank">2</td>
                <td>Player2</td>
                <td>8</td>
                <td>5</td>
                <td>62%</td>
              </tr>
              <tr>
                <td className="rank">3</td>
                <td>Player3</td>
                <td>6</td>
                <td>7</td>
                <td>46%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};

export default ScoresPage;
