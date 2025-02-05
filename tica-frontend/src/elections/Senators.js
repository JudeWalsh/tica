import React from "react";
import Diplomat from "./Diplomat";

export const TicaSenatorGrid = ({ redSenators, blueSenators, purpleSenators }) => {
  const gridPattern = [
    "XXXOOOOOOOOOXXX",
    "XXOOOOOOOOOOOXX",
    "XOOOOOOOOOOOOOX",
    "OOOOOOOOOOOOOOO",
    "OOOOOOXXXOOOOOO",
    "OOOOOXXXXXOOOOO",
    "OOOOOXXXXXOOOOO",
    "OOOOOXXXXXOOOOO",
    "OOOOOXXXXXOOOOO",
  ];

  const getParty = (rowIndex, colIndex) => {
    const flatOCells = [];
    // Flatten the grid by columns to fill horizontally (left to right)
    for (let col = 0; col < 15; col++) {
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
    if (cellIndex < blueSenators) return "D"; // Blue on the left
    if (cellIndex < blueSenators + purpleSenators) return "O"; // Purple in the middle
    if (cellIndex < blueSenators + purpleSenators + redSenators) return "R"; // Red on the right
    return null; // No party for this cell
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(15, 1fr)",
        width: "50%",
        height: "70%",
        margin: "0 auto",
      }}
    >
      {gridPattern.flatMap((row, rowIndex) => {
        if (!row) return []; // Handle undefined rows
        return row.split("").map((cell, colIndex) => {
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
        });
      })}
    </div>
  );
};
