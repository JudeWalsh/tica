import React from "react";
import Diplomat from "./Diplomat";

export const TicaHouseGrid = ({ redReps, blueReps, purpleReps }) => {
  const gridPattern = [
    "XXXXXXXXXXOOOOOOOOOXXXXXXXXXXX",
    "XXXXXXXXOOOOOOOOOOOOOOXXXXXXXX",
    "XXXXXXOOOOOOOOOOOOOOOOOOXXXXXX",
    "XXXXOOOOOOOOOOOOOOOOOOOOOOXXXX",
    "XXXOOOOOOOOOOOOOOOOOOOOOOOOXXX",
    "XXXOOOOOOOOOOOOOOOOOOOOOOOOXXX",
    "XOOOOOOOOOOOOOOOOOOOOOOOOOOOOX",
    "XOOOOOOOOOOOOOOOOOOOOOOOOOOOOX",
    "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOO",
    "OOOOOOOOOOOOOXXXXOOOOOOOOOOOOO",
    "OOOOOOOOOOOXXXXXXXXOOOOOOOOOOO",
    "OOOOOOOOOOOXXXXXXXXOOOOOOOOOOO",
    "OOOOOOOOOOXXXXXXXXXXOOOOOOOOOO",
    "OOOOOOOOOOXXXXXXXXXXOOOOOOOOOO",
    "OOOOOOOOOOXXXXXXXXXXOOOOOOOOOO",
    "OOOOOOOOOOXXXXXXXXXXOOOOOOOOOO",
    "OOOOOOOOOOXXXXXXXXXXOOOOOOOOOO",
    "OOOOOOOOOOXXXXXXXXXXOOOOOOOOOO",
    "OOOOOOOOOOXXXXXXXXXXOOOOOOOOOO",
    "OOOOOOOOOOXXXXXXXXXXOOOOOOOOOO",
  ];

  const getParty = (rowIndex, colIndex) => {
    const flatOCells = [];
    // Flatten the grid by columns to fill horizontally (left to right)
    for (let col = 0; col < 30; col++) {
      for (let row = 0; row < gridPattern.length; row++) {
        if (gridPattern[row][col] === "O") {
          flatOCells.push({ row, col });
        }
      }
    }

    // Determine the flat index for the current cell
    const cellIndex = flatOCells.findIndex(
      ({ row, col }) => row === rowIndex && col === colIndex
    );

    // Assign parties based on the order of cells
    if (cellIndex < blueReps) return "D"; // Blue on the left
    if (cellIndex < blueReps + purpleReps) return "O"; // Purple in the middle
    if (cellIndex < blueReps + purpleReps + redReps) return "R"; // Red on the right
    return null; // No party for this cell
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(30, 1fr)",
        width: "50%",
        height:"100%",
        margin: "0 auto",
      }}
    >
      {gridPattern.flatMap((row, rowIndex) =>
        row.split("").map((cell, colIndex) => {
          const party = getParty(rowIndex, colIndex);

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {cell === "O" && party && <Diplomat party={party} />}
            </div>
          );
        })
      )}
    </div>
  );
};
