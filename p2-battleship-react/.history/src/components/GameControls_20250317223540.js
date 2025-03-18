import React from "react";
import { useGame } from "../context/GameContext";

const GameControls = () => {
  const { state, dispatch } = useGame();

  // 格式化时间（秒转为分:秒格式）
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  // 获取游戏状态信息
  const getGameStatus = () => {
    if (state.gameStatus === "waiting") {
      return "Game not started";
    } else if (state.gameStatus === "gameOver") {
      return `Game over! ${state.winner === "player" ? "You" : "AI"} Won!`;
    } else {
      return `${state.currentTurn === "player" ? "Your" : "AI's"} turn`;
    }
  };

  // 重置游戏
  const handleReset = () => {
    dispatch({ type: "RESET_GAME" });
    if (state.gameMode) {
      dispatch({
        type: "START_GAME",
        payload: { gameMode: state.gameMode },
      });
    }
  };

  return (
    <div className="controls">
      <p className="timer">
        Timer: <span className="time-value">{formatTime(state.gameTime)}</span>
      </p>
      <p className="status">
        Status: <span className="game-status">{getGameStatus()}</span>
      </p>
      <button className="restart-btn" onClick={handleReset}>
        Reset
      </button>
    </div>
  );
};

export default GameControls;
