import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GameBoard from "../components/GameBoard";
import GameControls from "../components/GameControls";
import ShipPlacementBoard from "../components/ShipPlacementBoard";
import { useGame } from "../context/GameContext";
import "../styles/Game.css";

const GamePage = () => {
  const { mode } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const gameContainerRef = useRef(null);

  useEffect(() => {
    if (mode !== "normal" && mode !== "easy" && mode !== "placement") {
      navigate("/");
      return;
    }

    if (mode === "placement" && state.gameStatus === "waiting") {
      dispatch({ type: "START_PLACEMENT_PHASE" });
      return;
    }

    if (state.gameStatus === "waiting" && mode !== "placement") {
      dispatch({
        type: "START_GAME",
        payload: { gameMode: mode },
      });
    }
  }, [mode, navigate, dispatch, state.gameStatus]);

  useEffect(() => {
    if (state.gameStatus === "placement" || state.gameStatus === "ready") {
      return;
    }

    const timer = setTimeout(() => {
      const cells = document.querySelectorAll(".game-board td");

      cells.forEach((cell) => {
        cell.removeEventListener("touchstart", handleCellTouch);
        cell.removeEventListener("touchend", handleCellTouch);

        cell.addEventListener("touchstart", handleCellTouch, {
          passive: false,
        });
        cell.addEventListener("touchend", handleCellTouch, { passive: false });
      });

      document.addEventListener(
        "dblclick",
        (e) => {
          e.preventDefault();
        },
        { passive: false }
      );

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
    }, 500);

    return () => {
      clearTimeout(timer);
      const cells = document.querySelectorAll(".game-board td");
      cells.forEach((cell) => {
        cell.removeEventListener("touchstart", handleCellTouch);
        cell.removeEventListener("touchend", handleCellTouch);
      });
    };
  }, [state.enemyBoard, state.playerBoard, state.gameStatus]);

  const handleCellTouch = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "touchend") {
      const cellElement = e.target.closest("td");
      if (cellElement) {
        const rowElement = cellElement.parentElement;
        const rowIndex = Array.from(rowElement.parentElement.children).indexOf(
          rowElement
        );
        const colIndex = Array.from(rowElement.children).indexOf(cellElement);

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

  const handleCellClick = (row, col) => {
    if (state.currentTurn === "player" && state.gameStatus === "playing") {
      dispatch({
        type: "PLAYER_MOVE",
        payload: { row, col },
      });
    }
  };

  const handleStartGameWithPlacedShips = () => {
    dispatch({
      type: "START_GAME_WITH_PLACED_SHIPS",
      payload: { gameMode: "normal" },
    });
    navigate("/game/normal");
  };

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

  const renderContent = () => {
    if (
      mode === "placement" ||
      state.gameStatus === "placement" ||
      state.gameStatus === "ready"
    ) {
      return (
        <>
          <h1>Battleship Game - Place Your Ships</h1>
          <ShipPlacementBoard />
          {state.gameStatus === "ready" && (
            <div className="placement-actions">
              <button
                className="start-game-btn"
                onClick={handleStartGameWithPlacedShips}
              >
                Start Game
              </button>
              <button
                className="cancel-btn"
                onClick={() => {
                  dispatch({ type: "RESET_GAME" });
                  navigate("/");
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </>
      );
    }

    return (
      <>
        <h1>
          Battleship Game -{" "}
          {mode === "normal" ? "Normal Mode" : "Free Play Mode"}
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

          {mode === "normal" && (
            <div className="board-section" style={boardSectionStyle}>
              <GameBoard
                board={state.playerBoard}
                isEnemy={false}
                onCellClick={() => {}}
              />
            </div>
          )}
        </div>

        <GameControls />
      </>
    );
  };

  return <main>{renderContent()}</main>;
};

export default GamePage;
