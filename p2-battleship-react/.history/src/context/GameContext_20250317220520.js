import React, { createContext, useContext, useReducer, useEffect } from "react";
import { placeShipsRandomly } from "../utils/shipPlacement";

const GameContext = createContext();

// 获取初始状态，优先从localStorage加载
const getInitialState = () => {
  try {
    const savedState = localStorage.getItem("battleshipGameState");
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error("Error loading from localStorage:", error);
  }

  return {
    playerBoard: Array(10)
      .fill()
      .map(() => Array(10).fill(null)),
    enemyBoard: Array(10)
      .fill()
      .map(() => Array(10).fill(null)),
    playerShips: [],
    enemyShips: [],
    gameStatus: "waiting",
    currentTurn: "player",
    winner: null,
    gameMode: null,
    gameTime: 0,
    isTimerRunning: false,
  };
};

const initialState = getInitialState();

// 保存状态到localStorage
const saveStateToStorage = (state) => {
  try {
    localStorage.setItem("battleshipGameState", JSON.stringify(state));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

// 清除localStorage中的游戏状态
const clearStorage = () => {
  try {
    localStorage.removeItem("battleshipGameState");
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
};

const gameReducer = (state, action) => {
  let newState;

  switch (action.type) {
    case "START_GAME":
      const { gameMode } = action.payload;
      console.log("Starting game with mode:", gameMode);

      const validMode = gameMode === "easy" ? "easy" : "normal";
      const { board: playerBoard, ships: playerShips } = placeShipsRandomly();
      const { board: enemyBoard, ships: enemyShips } = placeShipsRandomly();

      newState = {
        ...state,
        playerBoard,
        enemyBoard,
        playerShips,
        enemyShips,
        gameStatus: "playing",
        currentTurn: "player",
        winner: null,
        gameMode: validMode,
        gameTime: 0,
        isTimerRunning: true,
      };

      // 保存状态到localStorage
      saveStateToStorage(newState);
      return newState;

    case "PLAYER_MOVE":
      const { row, col } = action.payload;
      console.log("Player move at:", row, col, "Current mode:", state.gameMode);

      if (
        state.gameStatus !== "playing" ||
        state.currentTurn !== "player" ||
        state.enemyBoard[row][col]?.isHit
      ) {
        return state;
      }

      const newEnemyBoard = JSON.parse(JSON.stringify(state.enemyBoard));
      const updatedEnemyShips = JSON.parse(JSON.stringify(state.enemyShips));

      let isHit = false;
      let hitShipIndex = -1;

      for (let i = 0; i < updatedEnemyShips.length; i++) {
        for (let position of updatedEnemyShips[i].positions) {
          if (position.row === row && position.col === col) {
            isHit = true;
            hitShipIndex = i;
            break;
          }
        }
        if (isHit) break;
      }

      if (isHit) {
        newEnemyBoard[row][col] = { isHit: true, hasShip: true };

        if (!updatedEnemyShips[hitShipIndex].hits) {
          updatedEnemyShips[hitShipIndex].hits = 0;
        }
        updatedEnemyShips[hitShipIndex].hits += 1;

        console.log(
          `Ship ${hitShipIndex} hit: ${updatedEnemyShips[hitShipIndex].hits}/${updatedEnemyShips[hitShipIndex].positions.length}`
        );
      } else {
        newEnemyBoard[row][col] = { isHit: true, hasShip: false };
      }

      const allEnemyShipsSunk = updatedEnemyShips.every(
        (ship) => ship.hits === ship.positions.length
      );

      console.log("All ships sunk?", allEnemyShipsSunk);
      console.log(
        "Ships status:",
        updatedEnemyShips.map(
          (ship, idx) =>
            `Ship ${idx}: ${ship.hits || 0}/${ship.positions.length}`
        )
      );

      const nextTurn = state.gameMode === "easy" ? "player" : "enemy";
      console.log("Next turn calculated as:", nextTurn);

      newState = {
        ...state,
        enemyBoard: newEnemyBoard,
        enemyShips: updatedEnemyShips,
        currentTurn: allEnemyShipsSunk ? "player" : nextTurn,
        gameStatus: allEnemyShipsSunk ? "gameOver" : "playing",
        winner: allEnemyShipsSunk ? "player" : null,
        isTimerRunning: !allEnemyShipsSunk,
      };

      // 如果游戏结束，清除存储；否则更新存储
      if (allEnemyShipsSunk) {
        clearStorage();
      } else {
        saveStateToStorage(newState);
      }

      return newState;

    case "ENEMY_MOVE":
      console.log("Enemy move triggered");

      if (state.gameStatus !== "playing" || state.currentTurn !== "enemy") {
        console.log(
          "Enemy move aborted: wrong state",
          state.gameStatus,
          state.currentTurn
        );
        return state;
      }

      let randomRow, randomCol;
      const newPlayerBoard = JSON.parse(JSON.stringify(state.playerBoard));
      const updatedPlayerShips = JSON.parse(JSON.stringify(state.playerShips));

      do {
        randomRow = Math.floor(Math.random() * 10);
        randomCol = Math.floor(Math.random() * 10);
      } while (newPlayerBoard[randomRow][randomCol]?.isHit);

      console.log("Enemy attacks:", randomRow, randomCol);

      let playerIsHit = false;
      let hitPlayerShipIndex = -1;

      for (let i = 0; i < updatedPlayerShips.length; i++) {
        for (let position of updatedPlayerShips[i].positions) {
          if (position.row === randomRow && position.col === randomCol) {
            playerIsHit = true;
            hitPlayerShipIndex = i;
            break;
          }
        }
        if (playerIsHit) break;
      }

      if (playerIsHit) {
        newPlayerBoard[randomRow][randomCol] = {
          ...newPlayerBoard[randomRow][randomCol],
          isHit: true,
        };

        if (!updatedPlayerShips[hitPlayerShipIndex].hits) {
          updatedPlayerShips[hitPlayerShipIndex].hits = 0;
        }
        updatedPlayerShips[hitPlayerShipIndex].hits += 1;

        console.log(
          `Player ship ${hitPlayerShipIndex} hit: ${updatedPlayerShips[hitPlayerShipIndex].hits}/${updatedPlayerShips[hitPlayerShipIndex].positions.length}`
        );
      } else {
        newPlayerBoard[randomRow][randomCol] = {
          ...newPlayerBoard[randomRow][randomCol],
          isHit: true,
        };
      }

      const allPlayerShipsSunk = updatedPlayerShips.every(
        (ship) => ship.hits === ship.positions.length
      );

      console.log("All player ships sunk?", allPlayerShipsSunk);
      console.log(
        "Player ships status:",
        updatedPlayerShips.map(
          (ship, idx) =>
            `Ship ${idx}: ${ship.hits || 0}/${ship.positions.length}`
        )
      );

      newState = {
        ...state,
        playerBoard: newPlayerBoard,
        playerShips: updatedPlayerShips,
        currentTurn: "player",
        gameStatus: allPlayerShipsSunk ? "gameOver" : "playing",
        winner: allPlayerShipsSunk ? "enemy" : null,
        isTimerRunning: !allPlayerShipsSunk,
      };

      // 如果游戏结束，清除存储；否则更新存储
      if (allPlayerShipsSunk) {
        clearStorage();
      } else {
        saveStateToStorage(newState);
      }

      return newState;

    case "UPDATE_TIMER":
      newState = {
        ...state,
        gameTime: state.gameTime + 1,
      };

      // 更新存储中的时间
      saveStateToStorage(newState);
      return newState;

    case "RESET_GAME":
      // 清除localStorage中的游戏状态
      clearStorage();
      return getInitialState();

    default:
      return state;
  }
};

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    let timer;
    if (state.isTimerRunning) {
      timer = setInterval(() => {
        dispatch({ type: "UPDATE_TIMER" });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [state.isTimerRunning]);

  useEffect(() => {
    console.log(
      "AI turn effect triggered, currentTurn:",
      state.currentTurn,
      "gameStatus:",
      state.gameStatus
    );

    if (state.currentTurn === "enemy" && state.gameStatus === "playing") {
      console.log("Setting timeout for enemy move");
      const delay = setTimeout(() => {
        dispatch({ type: "ENEMY_MOVE" });
      }, 1000);

      return () => clearTimeout(delay);
    }
  }, [state.currentTurn, state.gameStatus, dispatch]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
