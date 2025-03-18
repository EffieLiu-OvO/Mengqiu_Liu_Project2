import React from "react";

const Cell = ({ cell, isEnemy, onClick }) => {
  // 确定单元格的类名
  const getCellClassName = () => {
    if (!cell) return "";

    let className = "";

    if (cell.isHit) {
      className += cell.hasShip ? " hit" : " miss";
    } else if (!isEnemy && cell.hasShip) {
      className += " ship";
    }

    return className.trim();
  };

  // 确定单元格显示的内容
  const getCellContent = () => {
    if (!cell) return "";

    if (cell.isHit) {
      return cell.hasShip ? "X" : "•";
    } else if (!isEnemy && cell.hasShip) {
      return "■";
    }

    return "";
  };

  // 处理触摸事件，防止默认行为并触发onClick
  const handleTouchStart = (e) => {
    // 防止默认行为（如滚动）
    e.preventDefault();
    // 触发单元格点击处理函数
    if (onClick) {
      onClick();
    }
  };

  return (
    <td
      className={getCellClassName()}
      onClick={onClick}
      onTouchStart={handleTouchStart}
    >
      <span>{getCellContent()}</span>
    </td>
  );
};

export default Cell;
