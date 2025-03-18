import React from "react";

const Cell = ({ cell, isEnemy, onClick }) => {
  // 决定单元格的类名
  const getClassName = () => {
    if (!cell) return "";

    if (cell.isHit) {
      if (cell.hasShip) {
        return "hit"; // 击中船只
      } else {
        return "miss"; // 未击中
      }
    } else if (cell.hasShip && !isEnemy) {
      return "ship"; // 玩家的船（敌人的船不显示）
    }

    return "";
  };

  // 决定单元格的符号
  const getCellContent = () => {
    if (!cell) return "";

    if (cell.isHit) {
      if (cell.hasShip) {
        return "✓"; // 击中船只显示对勾
      } else {
        return "X"; // 未击中显示X
      }
    } else if (cell.hasShip && !isEnemy) {
      return "•"; // 玩家的船显示圆点
    }

    return "";
  };

  return (
    <td
      className={getClassName()}
      onClick={onClick}
      style={{ cursor: isEnemy ? "pointer" : "default" }}
    >
      {getCellContent()}
    </td>
  );
};

export default Cell;
