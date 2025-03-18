import React from "react";

const Cell = ({ cell, isEnemy, onClick }) => {
  // 确定单元格类名
  let className = "";
  if (cell) {
    if (cell.isHit) {
      className = cell.hasShip ? "hit" : "miss";
    } else if (!isEnemy && cell.hasShip) {
      className = "ship";
    }
  }

  // 获取单元格显示的内容
  const getCellContent = () => {
    if (!cell) return "";

    if (cell.isHit) {
      if (cell.hasShip) {
        return "√"; // 击中船只显示勾勾
      } else {
        return "X"; // 未击中显示叉叉
      }
    } else if (!isEnemy && cell.hasShip) {
      return "■"; // 自己的船只显示方块
    }

    return "";
  };

  // 固定尺寸的内联样式，防止任何大小变化
  const cellStyle = {
    touchAction: "manipulation",
    WebkitTapHighlightColor: "transparent",
    userSelect: "none",
    WebkitUserSelect: "none",
    width: "30px",
    height: "30px",
    minWidth: "30px",
    minHeight: "30px",
    maxWidth: "30px",
    maxHeight: "30px",
    boxSizing: "border-box",
    transform: "none",
    transition: "background-color 0.3s ease",
    // 移除可能导致大小变化的属性
    padding: "0",
    margin: "0",
  };

  return (
    <td
      className={className}
      onClick={onClick}
      style={cellStyle}
      data-content={getCellContent()}
    >
      {getCellContent()}
    </td>
  );
};

export default Cell;
