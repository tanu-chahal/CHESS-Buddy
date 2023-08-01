import { isPieceWhite, isPieceBlack, isValidMove } from "../chessUtils.js";

const calculateAllowedSquaresForRook = (r, c, piece, board) => {
    const allowed = [];

    const checkSquare = (row, col) => {
      if (!isValidMove(row, col)) {
        return true;
      }

      const targetPiece = board[row][col];

      if (isPieceWhite(piece) && isPieceWhite(targetPiece)) {
        return true;
      }

      if (isPieceBlack(piece) && isPieceBlack(targetPiece)) {
        return true;
      }

      allowed.push({ row, col });

      if (isPieceWhite(piece) && isPieceBlack(targetPiece)) {
        setCapture(true);
        return true;
      }

      if (isPieceBlack(piece) && isPieceWhite(targetPiece)) {
        setCapture(true);
        return true;
      }

      return false;
    };

    for (let i = 1; i < 8; i++) {
      if (checkSquare(r + i, c)) break;
    }
    for (let i = 1; i < 8; i++) {
      if (checkSquare(r - i, c)) break;
    }
    for (let j = 1; j < 8; j++) {
      if (checkSquare(r, c + j)) break;
    }
    for (let j = 1; j < 8; j++) {
      if (checkSquare(r, c - j)) break;
    }

    return allowed;
  };

  export default calculateAllowedSquaresForRook