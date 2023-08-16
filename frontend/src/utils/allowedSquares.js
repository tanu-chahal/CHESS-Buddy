import calculateAllowedSquaresForPawn from "./pieces/pawn.js";
import calculateAllowedSquaresForRook from "./pieces/rook.js";
import calculateAllowedSquaresForKnight from "./pieces/knight.js";
import calculateAllowedSquaresForBishop from "./pieces/bishop.js";
import calculateAllowedSquaresForQueen from "./pieces/queen.js";
import calculateAllowedSquaresForKing from "./pieces/king.js";

export const calculateAllowedSquares = (piece, r, c, tempBoard, turn, whiteP, blackP, lastMove, castling) => {
    const pieceMap = {
      "♙": calculateAllowedSquaresForPawn,
      "♖": calculateAllowedSquaresForRook,
      "♘": calculateAllowedSquaresForKnight,
      "♗": calculateAllowedSquaresForBishop,
      "♕": calculateAllowedSquaresForQueen,
      "♔": calculateAllowedSquaresForKing,
      "♟︎": calculateAllowedSquaresForPawn,
      "♜": calculateAllowedSquaresForRook,
      "♞": calculateAllowedSquaresForKnight,
      "♝": calculateAllowedSquaresForBishop,
      "♛": calculateAllowedSquaresForQueen,
      "♚": calculateAllowedSquaresForKing,
    };

    const allowedSquaresFn = pieceMap[piece];
    if (allowedSquaresFn) {
      return allowedSquaresFn(r, c, piece, tempBoard, turn, whiteP, blackP, lastMove, castling);
    } else {
      return { allowed: [], capture: false };
    }
  };
