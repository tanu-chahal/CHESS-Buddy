import { isPieceWhite, isPieceBlack, isValidMove } from "../chessUtils.js";

const calculateAllowedSquaresForBishop = (r, c, piece, board) => {
    let allowed = [];
    let capture = false;
    const checkSquare = (row, col) => {
      if (!isValidMove(row, col)) {
        return true;
      }
      const target = board[row][col];
      if (
        (isPieceWhite(piece) && isPieceWhite(target)) ||
        (isPieceBlack(piece) && isPieceBlack(target))
      ) {
        return true;
      }

      allowed.push({ row, col });

      if (
        (isPieceWhite(piece) && isPieceBlack(target)) ||
        (isPieceBlack(piece) && isPieceWhite(target))
      ) {
        capture=true;
        return true;
      }
      return false;
    };
    for (let i = 1; i < 8; i++) {
      if (checkSquare(r + i, c + i)) {
        break;
      }
    }
    for (let i = 1; i < 8; i++) {
      if (checkSquare(r - i, c + i)) {
        break;
      }
    }
    for (let i = 1; i < 8; i++) {
      if (checkSquare(r + i, c - i)) {
        break;
      }
    }
    for (let i = 1; i < 8; i++) {
      if (checkSquare(r - i, c - i)) {
        break;
      }
    }
    return {allowed, capture};
  };

  export default calculateAllowedSquaresForBishop