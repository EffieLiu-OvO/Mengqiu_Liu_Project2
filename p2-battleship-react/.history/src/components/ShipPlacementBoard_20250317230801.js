import React, { useEffect } from "react";
import { useGame } from "../context/GameContext";
import "../styles/ShipPlacement.css";

const ShipPlacementBoard = () => {
  const { state, dispatch } = useGame();

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

  const canPlaceShip = (board, row, col, size, horizontal) => {
    if (horizontal) {
      if (col + size > 10) return false;
    } else {
      if (row + size > 10) return false;
    }

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        for (let k = 0; k < size; k++) {
          const checkRow = horizontal ? row + i : row + k + i;
          const checkCol = horizontal ? col + k + j : col + j;

          if (
            checkRow >= 0 &&
            checkRow < 10 &&
            checkCol >= 0 &&
            checkCol < 10
          ) {
            if (board[checkRow][checkCol]?.hasShip) {
              return false;
            }
          }
        }
      }
    }

    return true;
  };

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
            <li>Click on a ship to select it</li>
            <li>Click on the board to place the selected ship</li>
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
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => {
                    const helper = getPlacementHelper(rowIndex, colIndex);

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
                        onClick={() => handleCellClick(rowIndex, colIndex)}
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
