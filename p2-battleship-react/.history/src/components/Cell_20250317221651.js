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

  // 使用内联样式增强移动端交互
  const cellStyle = {
    touchAction: "manipulation",
    WebkitTapHighlightColor: "transparent",
    userSelect: "none",
    WebkitUserSelect: "none",
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
