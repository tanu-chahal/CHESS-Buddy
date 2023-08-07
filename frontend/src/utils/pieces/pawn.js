import {
  isPieceWhite,
  isPieceBlack,
  isValidMove,
  findKingPosition,
  dangerousPositions,
} from "../chessUtils.js";

const calculateAllowedSquaresForPawn = (
  r,
  c,
  piece,
  board,
  turn,
  whiteP,
  blackP
) => {
  const color = isPieceWhite(piece) ? "white" : "black";
  const direction = color === "white" ? -1 : 1;

  let allowed = [];
  let capture = false;

  if (isValidMove(r + direction, c) && !board[r + direction][c]) {
    allowed.push({ row: r + direction, col: c });
  }

  if ((color === "white" && r === 6) || (color === "black" && r === 1)) {
    if (
      isValidMove(r + direction * 2, c) &&
      !board[r + direction * 2][c] &&
      !board[r + direction][c]
    ) {
      allowed.push({ row: r + direction * 2, col: c });
    }
  }

  if (
    isValidMove(r + direction, c - 1) &&
    isPieceOpponent(board[r + direction][c - 1], color)
  ) {
    allowed.push({ row: r + direction, col: c - 1 });
    capture = true;
  }
  if (
    isValidMove(r + direction, c + 1) &&
    isPieceOpponent(board[r + direction][c + 1], color)
  ) {
    allowed.push({ row: r + direction, col: c + 1 });
    capture = true;
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
        blackP
      );
      if (dangerousPositionsArr.length !== 0) allowed.splice(i, 1);
    }
  }

  return { allowed, capture };
};

const isPieceOpponent = (piece, color) => {
  return (
    (color === "white" && isPieceBlack(piece)) ||
    (color === "black" && isPieceWhite(piece))
  );
};

export default calculateAllowedSquaresForPawn;
