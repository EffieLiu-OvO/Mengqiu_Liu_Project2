import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GameBoard from "../components/GameBoard";
import GameControls from "../components/GameControls";
import { useGame } from "../context/GameContext";
import "../styles/Game.css";

const GamePage = () => {
  const { mode } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const gameContainerRef = useRef(null);

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

  // 直接在组件中添加触摸事件修复
  useEffect(() => {
    // 等待DOM完全加载
    setTimeout(() => {
      // 获取所有单元格
      const cells = document.querySelectorAll(".game-board td");

      // 为每个单元格添加触摸事件处理
      cells.forEach((cell) => {
        // 移除可能存在的旧事件监听器
        cell.removeEventListener("touchstart", handleCellTouch);
        cell.removeEventListener("touchend", handleCellTouch);

        // 添加触摸开始和结束事件处理
        cell.addEventListener("touchstart", handleCellTouch, {
          passive: false,
        });
        cell.addEventListener("touchend", handleCellTouch, { passive: false });
      });

      // 禁用页面上的双击缩放
      document.addEventListener(
        "dblclick",
        (e) => {
          e.preventDefault();
        },
        { passive: false }
      );

      // 添加防止滚动的事件处理
      const gameBoards = document.querySelectorAll(".game-board");
      gameBoards.forEach((board) => {
        board.addEventListener(
          "touchmove",
          (e) => {
            e.preventDefault();
          },
          { passive: false }
        );
      });
    }, 500); // 给DOM渲染一些时间

    // 清理函数
    return () => {
      const cells = document.querySelectorAll(".game-board td");
      cells.forEach((cell) => {
        cell.removeEventListener("touchstart", handleCellTouch);
        cell.removeEventListener("touchend", handleCellTouch);
      });
    };
  }, [state.enemyBoard, state.playerBoard]); // 当棋盘状态变化时重新绑定事件

  // 单元格触摸事件处理函数
  const handleCellTouch = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // 如果是touchend事件，模拟点击
    if (e.type === "touchend") {
      // 获取行列索引
      const cellElement = e.target.closest("td");
      if (cellElement) {
        // 查找行和列
        const rowElement = cellElement.parentElement;
        const rowIndex = Array.from(rowElement.parentElement.children).indexOf(
          rowElement
        );
        const colIndex = Array.from(rowElement.children).indexOf(cellElement);

        // 只有敌人棋盘的单元格才处理点击
        if (
          rowElement
            .closest(".game-board")
            .previousElementSibling.textContent.includes("Enemy")
        ) {
          if (
            state.currentTurn === "player" &&
            state.gameStatus === "playing"
          ) {
            dispatch({
              type: "PLAYER_MOVE",
              payload: { row: rowIndex, col: colIndex },
            });
          }
        }
      }
    }
  };

  // 处理玩家点击敌方棋盘的单元格 (用于鼠标点击)
  const handleCellClick = (row, col) => {
    if (state.currentTurn === "player" && state.gameStatus === "playing") {
      dispatch({
        type: "PLAYER_MOVE",
        payload: { row, col },
      });
    }
  };

  // 添加内联样式确保移动端正确显示
  const containerStyle = {
    display: "flex",
    flexDirection: window.innerWidth > 768 ? "row" : "column",
    gap: "40px",
    alignItems: "center",
    width: "100%",
    overflow: "hidden",
    padding: "0 10px",
  };

  const boardSectionStyle = {
    width: window.innerWidth > 768 ? "48%" : "100%",
    maxWidth: window.innerWidth > 768 ? "48%" : "500px",
    marginBottom: window.innerWidth > 768 ? "0" : "20px",
  };

  return (
    <main>
      <h1>
        Battleship Game - {mode === "normal" ? "Normal Mode" : "Free Play Mode"}
      </h1>

      <div
        className="game-container"
        ref={gameContainerRef}
        style={containerStyle}
      >
        <div className="board-section" style={boardSectionStyle}>
          <GameBoard
            board={state.enemyBoard}
            isEnemy={true}
            onCellClick={handleCellClick}
          />
        </div>

        {/* 只在normal模式下显示玩家棋盘 */}
        {mode === "normal" && (
          <div className="board-section" style={boardSectionStyle}>
            <GameBoard
              board={state.playerBoard}
              isEnemy={false}
              onCellClick={() => {}} // 玩家棋盘不可点击
            />
          </div>
        )}
      </div>

      <GameControls />
    </main>
  );
};

export default GamePage;
