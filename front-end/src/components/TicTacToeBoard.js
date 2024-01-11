import React from "react";
import { CircleIcon, XIcon } from "../Icons";

const TicTacToeBoard = ({ playerXMoves, playerOMoves, onClickCell }) => {
  const spaceIsTaken = (row, col) =>
    playerXMoves[row][col] || playerOMoves[row][col];

  return (
    <>
      <h1>Tic-Tac-Toe</h1>
      <table>
        <tbody>
          {[0, 1, 2].map((row) => (
            <tr key={row}>
              {[0, 1, 2].map((column) => (
                <td
                  className={`${
                    spaceIsTaken(row, column) || !onClickCell
                      ? ""
                      : "empty-cell"
                  }`}
                  onClick={() => {
                    if (!spaceIsTaken(row, column) && onClickCell) {
                      onClickCell(row, column);
                    }
                  }}
                  key={`${row}-${column}`}
                >
                  {playerXMoves[row][column] ? (
                    <XIcon sx={{ fontSize: 48, color: "#35C2BF" }} />
                  ) : (
                    ""
                  )}
                  {playerOMoves[row][column] ? (
                    <CircleIcon sx={{ fontSize: 48, color: "#F2B235" }} />
                  ) : (
                    ""
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
export default TicTacToeBoard;
