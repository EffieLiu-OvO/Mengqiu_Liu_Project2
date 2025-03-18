// 在GameContext.js文件中

// 修改initialState的获取方式，先检查localStorage
const getInitialState = () => {
  const savedState = localStorage.getItem("battleshipGameState");
  if (savedState) {
    return JSON.parse(savedState);
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

// 修改gameReducer函数
const gameReducer = (state, action) => {
  let newState;

  switch (action.type) {
    case "START_GAME":
      // 现有逻辑...
      newState = {
        ...state,
        playerBoard,
        enemyBoard,
        playerShips,
        enemyShips,
        gameStatus: "playing",
        currentTurn: "player",
        winner: null,
        gameMode,
        gameTime: 0,
        isTimerRunning: true,
      };
      // 保存到localStorage
      localStorage.setItem("battleshipGameState", JSON.stringify(newState));
      return newState;

    case "PLAYER_MOVE":
      // 现有逻辑...

      // 在return之前添加
      newState = {
        ...state,
        enemyBoard: newEnemyBoard,
        currentTurn: allEnemyShipsSunk ? "player" : nextTurn,
        gameStatus: allEnemyShipsSunk ? "gameOver" : "playing",
        winner: allEnemyShipsSunk ? "player" : null,
        isTimerRunning: !allEnemyShipsSunk,
      };

      // 如果游戏结束，清除localStorage
      if (allEnemyShipsSunk) {
        localStorage.removeItem("battleshipGameState");
      } else {
        // 否则更新localStorage
        localStorage.setItem("battleshipGameState", JSON.stringify(newState));
      }

      return newState;

    case "ENEMY_MOVE":
      // 现有逻辑...

      // 在return之前添加
      newState = {
        ...state,
        playerBoard: newPlayerBoard,
        currentTurn: "player",
        gameStatus: allPlayerShipsSunk ? "gameOver" : "playing",
        winner: allPlayerShipsSunk ? "enemy" : null,
        isTimerRunning: !allPlayerShipsSunk,
      };

      // 如果游戏结束，清除localStorage
      if (allPlayerShipsSunk) {
        localStorage.removeItem("battleshipGameState");
      } else {
        // 否则更新localStorage
        localStorage.setItem("battleshipGameState", JSON.stringify(newState));
      }

      return newState;

    case "UPDATE_TIMER":
      newState = {
        ...state,
        gameTime: state.gameTime + 1,
      };

      // 更新localStorage
      localStorage.setItem("battleshipGameState", JSON.stringify(newState));
      return newState;

    case "RESET_GAME":
      // 清除localStorage
      localStorage.removeItem("battleshipGameState");
      return getInitialState();

    default:
      return state;
  }
};
