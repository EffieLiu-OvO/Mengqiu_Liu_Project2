import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import ShipPlacementBoard from "../components/ShipPlacementBoard";
import "../styles/ShipPlacement.css"; // 确保导入样式

const ShipPlacementPage = () => {
  const { state, dispatch } = useGame();
  const navigate = useNavigate();

  // 在组件挂载时初始化船只放置阶段
  useEffect(() => {
    // 如果不在放置阶段或等待状态，则启动放置阶段
    if (state.gameStatus !== "placement" && state.gameStatus !== "ready") {
      dispatch({ type: "START_PLACEMENT_PHASE" });
    }
  }, [dispatch, state.gameStatus]);

  // 处理开始游戏
  const handleStartGame = () => {
    dispatch({
      type: "START_GAME_WITH_PLACED_SHIPS",
      payload: { gameMode: "normal" },
    });
    navigate("/game"); // 导航到游戏页面
  };

  // 返回主页
  const handleCancel = () => {
    dispatch({ type: "RESET_GAME" });
    navigate("/");
  };

  return (
    <div className="ship-placement-page">
      <h1>Battleship - Place Your Ships</h1>

      <ShipPlacementBoard />

      <div className="placement-actions">
        {state.gameStatus === "ready" && (
          <button className="start-game-btn" onClick={handleStartGame}>
            Start Game
          </button>
        )}
        <button className="cancel-btn" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ShipPlacementPage;
