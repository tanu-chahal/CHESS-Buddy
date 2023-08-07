import calculateAllowedSquaresForRook from "./rook.js";
import calculateAllowedSquaresForBishop from "./bishop.js";

const calculateAllowedSquaresForQueen = (
  r,
  c,
  piece,
  board,
  turn,
  whiteP,
  blackP
) => {
  const bishop = calculateAllowedSquaresForBishop(
    r,
    c,
    piece,
    board,
    turn,
    whiteP,
    blackP
  );
  const rook = calculateAllowedSquaresForRook(
    r,
    c,
    piece,
    board,
    turn,
    whiteP,
    blackP
  );
  const allowed = [...new Set([...bishop.allowed, ...rook.allowed])];
  const capture = bishop.capture || rook.capture;

  return { allowed, capture };
};

export default calculateAllowedSquaresForQueen;
