// 定义船只
const shipTypes = [
  { size: 5, count: 1 }, // 一艘5格长的船
  { size: 4, count: 1 }, // 一艘4格长的船
  { size: 3, count: 2 }, // 两艘3格长的船
  { size: 2, count: 1 }, // 一艘2格长的船
];

// 检查船只是否可以放在指定位置
const canPlaceShip = (board, row, col, size, horizontal) => {
  // 检查是否超出边界
  if (horizontal) {
    if (col + size > 10) return false;
  } else {
    if (row + size > 10) return false;
  }

  // 检查是否与其他船只重叠或相邻
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      for (let k = 0; k < size; k++) {
        const checkRow = horizontal ? row + i : row + k + i;
        const checkCol = horizontal ? col + k + j : col + j;

        // 检查是否在范围内
        if (checkRow >= 0 && checkRow < 10 && checkCol >= 0 && checkCol < 10) {
          // 检查该位置是否已经有船
          if (board[checkRow][checkCol]?.hasShip) {
            return false;
          }
        }
      }
    }
  }

  return true;
};

// 在棋盘上放置船只
const placeShip = (board, row, col, size, horizontal) => {
  const positions = [];

  for (let i = 0; i < size; i++) {
    const shipRow = horizontal ? row : row + i;
    const shipCol = horizontal ? col + i : col;

    board[shipRow][shipCol] = { hasShip: true, isHit: false };
    positions.push({ row: shipRow, col: shipCol });
  }

  return {
    positions,
    size,
    horizontal,
  };
};

// 随机放置所有船只
export const placeShipsRandomly = () => {
  const board = Array(10)
    .fill()
    .map(() => Array(10).fill(null));
  const ships = [];

  // 为每种船只放置指定数量
  for (const shipType of shipTypes) {
    for (let i = 0; i < shipType.count; i++) {
      let placed = false;

      // 尝试多次放置船只
      while (!placed) {
        const row = Math.floor(Math.random() * 10);
        const col = Math.floor(Math.random() * 10);
        const horizontal = Math.random() > 0.5;

        if (canPlaceShip(board, row, col, shipType.size, horizontal)) {
          const ship = placeShip(board, row, col, shipType.size, horizontal);
          ships.push(ship);
          placed = true;
        }
      }
    }
  }

  return { board, ships };
};
