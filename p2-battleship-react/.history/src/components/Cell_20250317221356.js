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

  // 单元格内容
  let content = "";
  if (cell) {
    if (cell.isHit) {
      content = cell.hasShip ? "X" : "•";
    } else if (!isEnemy && cell.hasShip) {
      content = "■";
    }
  }

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
      // 添加data属性以便JavaScript可以获取
      data-content={content}
    >
      {content}
    </td>
  );
};

export default Cell;
