import { isPieceWhite, isPieceBlack, isValidMove } from "../chessUtils.js";

 const calculateAllowedSquaresForPawn = (r, c, piece, board) => {
  const color = isPieceWhite(piece) ? "white" : "black";
  const direction = color === "white" ? -1 : 1;

  let allowed = [];
  let capture = false;

  if (isValidMove(r + direction, c) && !board[r + direction][c]) {
    allowed.push({ row: r + direction, col: c });
  }

  if ((color==="white"&& r===6) || (color==="black"&& r===1)) {
    if (isValidMove(r + direction * 2, c) && !board[r + direction * 2][c] && !board[r + direction][c]) {
      allowed.push({ row: r + direction * 2, col: c });
    }
  }  

  if (isValidMove(r + direction, c - 1) && isPieceOpponent(board[r + direction][c - 1], color)) {
    allowed.push({ row: r + direction, col: c - 1 });
    capture=true;
  }
  if (isValidMove(r + direction, c + 1) && isPieceOpponent(board[r + direction][c + 1], color)) {
    allowed.push({ row: r + direction, col: c + 1 });
    capture=true;
  }

  return {allowed, capture};

};

  const isPieceOpponent = (piece, color) => {
    return (color === "white" && isPieceBlack(piece)) || (color === "black" && isPieceWhite(piece));
};

  export default calculateAllowedSquaresForPawn