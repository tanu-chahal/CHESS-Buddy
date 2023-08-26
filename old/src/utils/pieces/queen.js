import calculateAllowedSquaresForRook from "./rook.js";
import calculateAllowedSquaresForBishop from "./bishop.js";

const calculateAllowedSquaresForQueen = (
  r,
  c,
  piece,
  board,
  turn,
  whiteP,
  blackP,
  lastMove, castling
) => {
  const bishop = calculateAllowedSquaresForBishop(
    r,
    c,
    piece,
    board,
    turn,
    whiteP,
    blackP,
    lastMove, castling
  );
  const rook = calculateAllowedSquaresForRook(
    r,
    c,
    piece,
    board,
    turn,
    whiteP,
    blackP,
    lastMove, castling
  );
  const allowed = [...new Set([...bishop.allowed, ...rook.allowed])];
  const capture = bishop.capture || rook.capture;

  return { allowed, capture };
};

export default calculateAllowedSquaresForQueen;
