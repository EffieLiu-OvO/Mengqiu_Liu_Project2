import React, { useState, useEffect } from "react";
import { useGame } from "../context/GameContext";
import { canPlaceShip } from "../utils/shipPlacement"; // 导入您现有的船只放置逻辑
import "../styles/ShipPlacement.css";

const ShipPlacementBoard = () => {
  const { state, dispatch } = useGame();
  const [draggedShip, setDraggedShip] = useState(null);
  const [hoverCell, setHoverCell] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchShip, setTouchShip] = useState(null);

  useEffect(() => {
    if (
      state.shipsToPlace &&
      state.shipsToPlace.length > 0 &&
      !state.selectedShip
    ) {
      dispatch({
        type: "SELECT_SHIP",
        payload: { shipId: state.shipsToPlace[0].id },
      });
    }
  }, [state.shipsToPlace, state.selectedShip, dispatch]);

  const handleDragStart = (e, shipId) => {
    setDraggedShip(shipId);
    dispatch({
      type: "SELECT_SHIP",
      payload: { shipId },
    });

    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", shipId); // 添加数据传输
      const transparentImage = new Image();
      transparentImage.src =
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
      e.dataTransfer.setDragImage(transparentImage, 0, 0);
    }
  };

  const handleDragEnd = () => {
    setDraggedShip(null);
    setHoverCell(null);
  };

  const handleDragOver = (e, row, col) => {
    e.preventDefault();
    setHoverCell({ row, col });
  };

  const handleDragLeave = () => {
    setHoverCell(null);
  };

  const handleDrop = (e, row, col) => {
    e.preventDefault();
    e.stopPropagation();

    // 尝试从事件中获取船只ID
    const shipId = e.dataTransfer.getData("text/plain") || state.selectedShip;

    if (!shipId) return;

    const helper = getPlacementHelper(row, col, shipId);
    if (!helper || !helper.isValid) return;

    dispatch({
      type: "PLACE_SHIP",
      payload: {
        row,
        col,
        shipId: shipId,
      },
    });

    setDraggedShip(null);
    setHoverCell(null);
  };

  // 处理触摸开始
  const handleTouchStart = (e, shipId) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setTouchShip(shipId);
    dispatch({
      type: "SELECT_SHIP",
      payload: { shipId },
    });
  };

  // 处理触摸移动
  const handleTouchMove = (e) => {
    if (!touchStart || !touchShip) return;

    // 防止页面滚动
    e.preventDefault();

    const touch = e.touches[0];
    // 获取当前触摸位置下的元素
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    // 寻找最近的表格单元格
    const cell = element?.closest("td");

    if (cell) {
      // 获取行列索引
      const row = parseInt(cell.parentElement.getAttribute("data-row"), 10);
      const col = parseInt(cell.getAttribute("data-col"), 10);

      if (!isNaN(row) && !isNaN(col)) {
        setHoverCell({ row, col });
      }
    }
  };

  // 处理触摸结束
  const handleTouchEnd = (e) => {
    if (!touchStart || !touchShip || !hoverCell) {
      setTouchStart(null);
      setTouchShip(null);
      return;
    }

    const helper = getPlacementHelper(hoverCell.row, hoverCell.col, touchShip);
    if (helper && helper.isValid) {
      // 模拟放置操作
      dispatch({
        type: "PLACE_SHIP",
        payload: {
          row: hoverCell.row,
          col: hoverCell.col,
          shipId: touchShip,
        },
      });
    }

    setTouchStart(null);
    setTouchShip(null);
    setHoverCell(null);
  };

  const handleCellClick = (row, col) => {
    if (!state.selectedShip) return;

    const helper = getPlacementHelper(row, col);
    if (!helper || !helper.isValid) return;

    dispatch({
      type: "PLACE_SHIP",
      payload: {
        row,
        col,
        shipId: state.selectedShip,
      },
    });
  };

  const toggleOrientation = () => {
    dispatch({ type: "TOGGLE_ORIENTATION" });
  };

  const selectShip = (shipId) => {
    dispatch({
      type: "SELECT_SHIP",
      payload: { shipId },
    });
  };

  // 使用从utils导入的canPlaceShip函数
  const isValidPlacement = (
    board,
    startRow,
    startCol,
    shipSize,
    orientation
  ) => {
    return canPlaceShip(
      board,
      startRow,
      startCol,
      shipSize,
      orientation === "horizontal"
    );
  };

  const getPlacementHelper = (row, col, specificShipId = null) => {
    const shipId = specificShipId || state.selectedShip;
    if (!shipId) return null;

    const selectedShip = state.shipsToPlace.find((ship) => ship.id === shipId);
    if (!selectedShip) return null;

    const isValid = isValidPlacement(
      state.playerBoard,
      row,
      col,
      selectedShip.size,
      state.shipOrientation
    );

    const cells = [];
    for (let i = 0; i < selectedShip.size; i++) {
      const posRow = state.shipOrientation === "horizontal" ? row : row + i;
      const posCol = state.shipOrientation === "horizontal" ? col + i : col;

      if (posRow < 10 && posCol < 10) {
        cells.push({ row: posRow, col: posCol });
      }
    }

    return { isValid, cells };
  };

  const getHoverPreview = () => {
    if (!hoverCell) return null;

    const shipId = draggedShip || touchShip || state.selectedShip;
    if (!shipId) return null;

    return getPlacementHelper(hoverCell.row, hoverCell.col, shipId);
  };

  const renderShipSelection = () => {
    if (!state.shipsToPlace || state.shipsToPlace.length === 0) {
      return (
        <div className="ship-placement-complete">
          <p>All ships placed! Press "Start Game" to begin.</p>
        </div>
      );
    }

    return (
      <div className="ship-placement-controls">
        <h3>Place Your Ships</h3>
        <div className="orientation-toggle">
          <label>Orientation: </label>
          <button onClick={toggleOrientation}>
            {state.shipOrientation === "horizontal"
              ? "Horizontal ⟷"
              : "Vertical ⟵⟶"}
          </button>
        </div>

        <div className="ships-container">
          {state.shipsToPlace.map((ship) => (
            <div
              key={ship.id}
              className={`ship-item ${
                state.selectedShip === ship.id ? "selected" : ""
              }`}
              onClick={() => selectShip(ship.id)}
              draggable="true"
              onDragStart={(e) => handleDragStart(e, ship.id)}
              onDragEnd={handleDragEnd}
              onTouchStart={(e) => handleTouchStart(e, ship.id)}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <span>
                {ship.id.charAt(0).toUpperCase() + ship.id.slice(1)} (
                {ship.size})
              </span>
              <div
                className="ship-preview"
                style={{
                  flexDirection:
                    state.shipOrientation === "horizontal" ? "row" : "column",
                }}
              >
                {Array(ship.size)
                  .fill()
                  .map((_, i) => (
                    <div key={i} className="ship-cell" />
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="placement-instructions">
          <h4>Instructions:</h4>
          <ul>
            <li>Click or drag ships to place them</li>
            <li>Use the orientation button to rotate ships</li>
            <li>Place all ships to continue</li>
            <li>Ships cannot touch each other (including diagonally)</li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="ship-placement">
      <div className="placement-container">
        <div className="board-container">
          <h2>Your Board</h2>
          <table className="game-board">
            <tbody>
              {state.playerBoard.map((row, rowIndex) => (
                <tr key={rowIndex} data-row={rowIndex}>
                  {row.map((cell, colIndex) => {
                    const helper =
                      hoverCell &&
                      hoverCell.row === rowIndex &&
                      hoverCell.col === colIndex
                        ? getHoverPreview()
                        : getPlacementHelper(rowIndex, colIndex);

                    const isPreview =
                      helper &&
                      helper.cells.some(
                        (pos) => pos.row === rowIndex && pos.col === colIndex
                      );

                    const previewStyle = isPreview
                      ? {
                          backgroundColor: helper.isValid
                            ? "rgba(0, 255, 0, 0.3)"
                            : "rgba(255, 0, 0, 0.3)",
                          cursor: helper.isValid ? "pointer" : "not-allowed",
                        }
                      : {};

                    let cellClass = "";
                    if (cell?.hasShip) {
                      cellClass = "ship";
                    }

                    return (
                      <td
                        key={`${rowIndex}-${colIndex}`}
                        className={cellClass}
                        data-col={colIndex}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                        onDragOver={(e) =>
                          handleDragOver(e, rowIndex, colIndex)
                        }
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                        style={previewStyle}
                      >
                        {cell?.hasShip ? "■" : ""}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="ship-selection">{renderShipSelection()}</div>
      </div>
    </div>
  );
};

export default ShipPlacementBoard;
