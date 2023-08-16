import {
  isPieceWhite,
  isPieceBlack,
  isValidMove,
  findKingPosition,
  dangerousPositions,
} from "../chessUtils.js";

const calculateAllowedSquaresForBishop = (
  r,
  c,
  piece,
  board,
  turn,
  whiteP,
  blackP,
  lastMove, castling
) => {
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
      capture = true;
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

  if (
    (turn === whiteP && isPieceWhite(piece)) ||
    (turn === blackP && isPieceBlack(piece))
  ) {
    const clr = turn === whiteP ? "white" : "black";

    const kingPosition = findKingPosition(board, clr);
    const king = board[kingPosition.row][kingPosition.col];

    for (let i = allowed.length - 1; i >= 0; i--) {
      let tempBoard = board.map((row) => [...row]);
      tempBoard[allowed[i].row][allowed[i].col] = piece;
      tempBoard[r][c] = "";
      const dangerousPositionsArr = dangerousPositions(
        tempBoard,
        king,
        kingPosition.row,
        kingPosition.col,
        turn,
        whiteP,
        blackP,
        lastMove, castling
      );
      if (dangerousPositionsArr.length !== 0) allowed.splice(i, 1);
    }
  }

  return { allowed, capture };
};

export default calculateAllowedSquaresForBishop;
