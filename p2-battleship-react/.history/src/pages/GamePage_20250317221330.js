import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GameBoard from "../components/GameBoard";
import GameControls from "../components/GameControls";
import { useGame } from "../context/GameContext";
import "../styles/Game.css";

const GamePage = () => {
  const { mode } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useGame();

  // 检查游戏模式是否有效，否则重定向到主页
  useEffect(() => {
    if (mode !== "normal" && mode !== "easy") {
      navigate("/");
      return;
    }

    // 如果游戏尚未开始，则根据URL参数启动游戏
    if (state.gameStatus === "waiting") {
      dispatch({
        type: "START_GAME",
        payload: { gameMode: mode },
      });
    }
  }, [mode, navigate, dispatch, state.gameStatus]);

  // 处理玩家点击敌方棋盘的单元格
  const handleCellClick = (row, col) => {
    if (state.currentTurn === "player" && state.gameStatus === "playing") {
      dispatch({
        type: "PLAYER_MOVE",
        payload: { row, col },
      });
    }
  };

  return (
    <main>
      <h1>
        Battleship Game - {mode === "normal" ? "Normal Mode" : "Free Play Mode"}
      </h1>

      <div className="game-container">
        {/* Enemy Board - Always show */}
        <GameBoard
          board={state.enemyBoard}
          isEnemy={true}
          onCellClick={handleCellClick}
        />

        {/* Player Board - Only show in normal mode */}
        {mode === "normal" && (
          <GameBoard
            board={state.playerBoard}
            isEnemy={false}
            onCellClick={() => {}} // 玩家棋盘不可点击
          />
        )}
      </div>

      <GameControls />
    </main>
  );
};

export default GamePage;
