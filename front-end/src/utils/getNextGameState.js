import { CATS_GAME, PLAYER_O_WINS, PLAYER_X_WINS, RUNNING } from "../const";

const isHorizontalWin = (moves) => {
  return moves.some((row) => row.every((x) => x === 1));
};
const isVerticalWin = (moves) => {
  return [0, 1, 2].some((columnNum) => moves.every((row) => row[columnNum]));
};
const isDiagonalWin = (moves) => {
  return (
    (moves[0][0] && moves[1][1] && moves[2][2]) ||
    (moves[2][0] && moves[1][1] && moves[0][2])
  );
};
const isCornersWin = (moves) => {
  return (
    (moves[0][0] && moves[2][0] && moves[0][2] && moves[2][2]) ||
    (moves[1][0] && moves[0][1] && moves[1][2] && moves[2][1])
  );
};
const boardIsFull = (xMoves, yMoves) =>
  [0, 1, 2].every((rowNum) => {
    return [0, 1, 2].every(
      (colNum) => xMoves[rowNum][colNum] || yMoves[rowNum][colNum],
    );
  });
export default function getNextGameState(plrXM, plrOM) {
  const playerXWins =
    isHorizontalWin(plrXM) ||
    isVerticalWin(plrXM) ||
    isDiagonalWin(plrXM) ||
    isCornersWin(plrXM);
  const playerOWins =
    isHorizontalWin(plrOM) ||
    isVerticalWin(plrOM) ||
    isDiagonalWin(plrOM) ||
    isCornersWin(plrOM);
  const isCatsGame = boardIsFull(plrXM, plrOM);
  if (playerXWins) return PLAYER_X_WINS;
  if (playerOWins) return PLAYER_O_WINS;
  if (isCatsGame) return CATS_GAME;
  return RUNNING;
}
