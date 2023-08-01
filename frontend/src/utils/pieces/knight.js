import { isPieceWhite, isPieceBlack, isValidMove } from "../chessUtils.js";
let capture = false;

const calculateAllowedSquaresForKnight = (r, c, piece, board) => {
    let allowed = [];

    const checkSquare = (row, col) => {
      if (!isValidMove(row, col)) {
        return;
      }
      const target = board[row][col];
      if (
        (isPieceWhite(piece) && isPieceWhite(target)) ||
        (isPieceBlack(piece) && isPieceBlack(target))
      ) {
        return;
      }
      allowed.push({ row, col });
      if (
        (isPieceWhite(piece) && isPieceBlack(target)) ||
        (isPieceBlack(piece) && isPieceWhite(target))
      ) {
        capture =true;
      }
    };

    checkSquare(r + 2, c - 1);
    checkSquare(r + 2, c + 1);
    checkSquare(r - 2, c - 1);
    checkSquare(r - 2, c + 1);
    checkSquare(r - 1, c + 2);
    checkSquare(r + 1, c + 2);
    checkSquare(r - 1, c - 2);
    checkSquare(r + 1, c - 2);
    return {allowed, capture};
  };

  export default calculateAllowedSquaresForKnight 