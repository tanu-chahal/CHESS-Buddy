import { calculateAllowedSquares } from "./allowedSquares.js";

const white = ["♙", "♖", "♘", "♗", "♕", "♔"];
const black = ["♛", "♚", "♝", "♞", "♜", "♟︎"];

export const isPieceWhite = (piece) => {
  return white.some((e) => e === piece);
};
export const isPieceBlack = (piece) => {
  return black.some((e) => e === piece);
};

export const findKingPosition = (board, kingColor) => {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (kingColor === "white" && piece === "♔") {
        return { row, col };
      } else if (kingColor === "black" && piece === "♚") {
        return { row, col };
      }
    }
  }
  return null;
};

export const isValidMove = (row, col) => {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
};

export const dangerousPositions = (tempBoard, king, kingRow, kingCol, turn, whiteP, blackP, lastMove, castling) => {
  const dangerous = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = tempBoard[row][col];
      if (
        (isPieceWhite(king) && isPieceBlack(piece)) ||
        (isPieceBlack(king) && isPieceWhite(piece))
      ) {
        let { allowed} = calculateAllowedSquares(
          piece,
          row,
          col,
          tempBoard,
          turn, whiteP, blackP, lastMove, castling
        );
        for (let i = 0; i < allowed.length; i++) {
          if (allowed[i].row === kingRow && allowed[i].col === kingCol) {
            dangerous.push({
              row: kingRow,
              col: kingCol,
            });
          }
        }
      }
    }
  }
  return dangerous;
};
